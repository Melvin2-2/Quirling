// Vorher/Nachher-Ausschnitte: alt = aktueller Stand (Port 4321), neu = Entwurf (Port 4322).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'entwurf', 'bilder');
const PUNKTE = require('./vergleich-punkte.json');
const ALT = 'http://localhost:4321/Quirling', NEU = 'http://localhost:4322/Quirling';
const nur = process.argv[2];

async function shot(b, base, v, file, seite) {
  const mob = v.vp === 'm';
  const ctx = await b.newContext({ viewport: { width: mob ? 390 : 1440, height: mob ? 844 : 900 }, isMobile: mob, hasTouch: mob, deviceScaleFactor: mob ? 2 : 1 });
  const p = await ctx.newPage();
  await p.goto(base + (v.url_neu && seite === 'neu' ? v.url_neu : v.url), { waitUntil: 'networkidle' });
  if (!v.fold && !v.noscroll) {
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 450) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(30); }
    await p.waitForTimeout(2500);
  } else await p.waitForTimeout(1500);
  if (v.prep && v.prep[seite]) await p.evaluate(`(${v.prep[seite]})()`);
  if (v.fold) {
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
    await p.screenshot({ path: file, type: 'jpeg', quality: 72 });
  } else {
    const el = p.locator(v.sel).first();
    await el.evaluate((e) => e.scrollIntoView({ block: 'start' }));
    await p.waitForTimeout(v.wait ?? 1800);
    if (!v.header) await p.addStyleTag({ content: '.site-header{visibility:hidden!important}' });
    const bb = await el.boundingBox();
    const sy = await p.evaluate(() => scrollY);
    const pad = v.pad ?? 24;
    const W = mob ? 390 : 1440;
    const clip = { x: 0, y: Math.max(0, bb.y + sy - pad), width: W, height: Math.min(bb.height + pad * 2, v.maxH ?? 1400) };
    if (v.x) { clip.x = Math.max(0, bb.x - pad); clip.width = Math.min(W - clip.x, bb.width + pad * 2); }
    await p.screenshot({ path: file, type: 'jpeg', quality: 72, clip, fullPage: true });
  }
  await ctx.close();
}

(async () => {
  const b = await chromium.launch();
  const log = [];
  for (const pt of PUNKTE) {
    if (nur && pt.id !== nur) continue;
    for (const [i, v] of pt.views.entries()) {
      for (const [seite, base] of [['alt', ALT], ['neu', NEU]]) {
        const f = path.join(OUT, `${pt.id}-${i + 1}-${seite}.jpg`);
        try { await shot(b, base, v, f, seite); log.push(`${pt.id}-${i + 1}-${seite} ok`); }
        catch (e) { log.push(`${pt.id}-${i + 1}-${seite} FEHLER ${e.message.split('\n')[0]}`); }
      }
    }
  }
  console.log(log.filter((l) => l.includes('FEHLER')).join('\n') || 'alle ok', log.length);
  await b.close();
})();
