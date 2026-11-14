// Markierte Screenshots: nummerierte Pins und farbige Rahmen je Befund, Desktop 1440 und Mobil 390.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:4321/Quirling';
const SEITEN = require('./seiten.json');
const { befunde } = require('./befunde.json');
const OUT = path.join(__dirname, '..', 'screenshots', 'markiert');
fs.mkdirSync(OUT, { recursive: true });
const FARBE = { kritisch: '#d0021b', wichtig: '#f08c00', Feinschliff: '#e6c300', gut: '#2f9e44' };

(async () => {
  const b = await chromium.launch();
  const fehlend = [];
  for (const [w, key] of [[1440, 'd'], [390, 'm']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, isMobile: w === 390, hasTouch: w === 390 });
    for (const pg of SEITEN) {
      const liste = befunde.filter((f) => f.seite === pg.id && f[key]);
      if (!liste.length) continue;
      const p = await ctx.newPage();
      await p.goto(BASE + pg.url, { waitUntil: 'networkidle' });
      const H = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += 450) {
        await p.evaluate((y) => window.scrollTo(0, y), y);
        await p.waitForTimeout(40);
      }
      await p.waitForTimeout(6000);
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(600);
      const marks = liste.map((f) => ({ id: f.id, sel: f[key], farbe: FARBE[f.schwere] }));
      const miss = await p.evaluate((marks) => {
        const missing = [];
        const layer = document.createElement('div');
        layer.style.cssText = `position:absolute;left:0;top:0;width:${document.documentElement.clientWidth}px;height:${document.documentElement.scrollHeight}px;overflow:hidden;z-index:2147483647;pointer-events:none`;
        document.body.appendChild(layer);
        marks.forEach((m, i) => {
          const el = document.querySelector(m.sel);
          if (!el) return missing.push(m.sel);
          const r = el.getBoundingClientRect();
          const vw = document.documentElement.clientWidth;
          const x = Math.max(4, r.left + scrollX), y = r.top + scrollY;
          const rw = Math.min(r.width, vw - x - 4);
          const box = document.createElement('div');
          box.style.cssText = `position:absolute;left:${x - 4}px;top:${y - 4}px;width:${rw + 8}px;height:${r.height + 8}px;border:4px solid ${m.farbe};box-sizing:border-box;border-radius:4px;box-shadow:0 0 0 2px #fff`;
          const pin = document.createElement('div');
          pin.textContent = m.id;
          pin.style.cssText = `position:absolute;left:${Math.max(4, x - 4)}px;top:${Math.max(4, y - 30)}px;background:${m.farbe};color:#fff;font:700 15px/1 Arial,sans-serif;padding:6px 9px;border-radius:14px;box-shadow:0 0 0 2px #fff;white-space:nowrap`;
          layer.append(box, pin);
        });
        return missing;
      }, marks);
      miss.forEach((s) => fehlend.push(`${pg.id}/${key}: ${s}`));
      await p.screenshot({ path: path.join(OUT, `${pg.id}-${key}.jpg`), type: 'jpeg', quality: 68, fullPage: true });
      await p.close();
    }
    await ctx.close();
  }
  console.log('nicht gefunden:', fehlend);
  await b.close();
})();
