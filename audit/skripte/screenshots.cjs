// Rohe Screenshots aller Seiten: volle Seite und sichtbarer Bereich in 1440 / 768 / 390 px.
// Aufruf: node audit/skripte/screenshots.cjs  (Vorschau muss auf Port 4321 laufen)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:4321/Quirling';
const PAGES = require('./seiten.json');
const OUT = path.join(__dirname, '..', 'screenshots', 'roh');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch();
  const log = [];
  for (const w of [1440, 768, 390]) {
    const ctx = await b.newContext({
      viewport: { width: w, height: w === 390 ? 844 : w === 768 ? 1024 : 900 },
      deviceScaleFactor: 1,
      isMobile: w === 390,
      hasTouch: w !== 1440,
      reducedMotion: 'no-preference',
    });
    for (const pg of PAGES) {
      const p = await ctx.newPage();
      const errs = [];
      p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
      p.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text()));
      const res = await p.goto(BASE + pg.url, { waitUntil: 'networkidle' });
      await p.waitForTimeout(800);
      await p.screenshot({ path: path.join(OUT, `${pg.id}-${w}-fold.jpg`), type: 'jpeg', quality: 72 });
      // einmal durchscrollen, damit eingeblendete Inhalte und Animationen ihren Endzustand haben
      const H = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += Math.round(w * 0.5)) {
        await p.evaluate((y) => window.scrollTo(0, y), y);
        await p.waitForTimeout(60);
      }
      await p.waitForTimeout(6000);
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(700);
      await p.screenshot({ path: path.join(OUT, `${pg.id}-${w}-voll.jpg`), type: 'jpeg', quality: 66, fullPage: true });
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      log.push({ seite: pg.id, breite: w, status: res && res.status(), hoehe: H, ueberlauf: ov, fehler: errs });
      await p.close();
    }
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, '..', 'daten', 'screenshots-log.json'), JSON.stringify(log, null, 2));
  await b.close();
})();
