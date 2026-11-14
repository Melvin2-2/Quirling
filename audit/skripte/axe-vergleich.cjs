// axe-core vorher (Port 4321) gegen nachher (Port 4323), alle Seiten, Desktop und Mobil.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const AXE = fs.readFileSync(process.argv[2], 'utf8');
const SEITEN = require('./seiten.json');
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const [lab, port] of [['vorher', 4321], ['nachher', 4323]]) {
    for (const [w, dev] of [[1440, 'desktop'], [390, 'mobil']]) {
      const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w === 390 });
      for (const s of SEITEN) {
        const p = await ctx.newPage();
        await p.goto(`http://localhost:${port}/Quirling${s.url}`, { waitUntil: 'networkidle' });
        await p.waitForTimeout(800);
        await p.addScriptTag({ content: AXE });
        const v = await p.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations.map((x) => ({ id: x.id, impact: x.impact, n: x.nodes.length })));
        out[`${s.id}|${dev}|${lab}`] = v; await p.close();
      }
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(__dirname, '..', 'daten', 'runde1', 'axe.json'), JSON.stringify(out, null, 1));
  const sum = {};
  for (const [k, v] of Object.entries(out)) { const lab = k.split('|')[2]; sum[lab] = sum[lab] || {}; v.forEach((x) => (sum[lab][x.id] = (sum[lab][x.id] || 0) + x.n)); }
  console.log(JSON.stringify(sum));
  await b.close();
})();
