// Startseiten der Vergleichs-Websites (nur in der Netzwerkfreigabe erreichbare Hosts)
const { chromium } = require('playwright');
const path = require('path');
const SITES = [
  ['quirling-alt', 'https://quirling.de/'],
  ['otto-wulff', 'https://www.otto-wulff.de/'],
  ['markgraf', 'https://www.markgraf-bau.de/'],
];
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const b = await chromium.launch({ proxy });
  for (const [id, u] of SITES) {
    for (const w of [1440, 390]) {
      const ctx = await b.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, ignoreHTTPSErrors: true, isMobile: w === 390 });
      const p = await ctx.newPage();
      try {
        await p.goto(u, { waitUntil: 'load', timeout: 45000 });
        await p.waitForTimeout(3500);
        await p.screenshot({ path: path.join(__dirname, '..', 'screenshots', 'wettbewerb', `${id}-${w}.jpg`), type: 'jpeg', quality: 70 });
        const info = await p.evaluate(() => ({ title: document.title, h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().replace(/\s+/g, ' ')).slice(0, 2), nav: [...document.querySelectorAll('nav a')].map((a) => a.textContent.trim()).filter(Boolean).slice(0, 14) }));
        console.log(id, w, JSON.stringify(info));
      } catch (e) {
        console.log(id, w, 'FEHLER', e.message.split('\n')[0]);
      }
      await ctx.close();
    }
  }
  await b.close();
})();
