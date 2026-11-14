// axe-core, Typografie-/Farb-/Abstandsinventar, Überschriften, SEO-Daten, Links, Tap-Flächen je Seite.
// Aufruf: node audit/skripte/inventar.cjs <pfad-zu-axe.min.js>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:4321/Quirling';
const PAGES = require('./seiten.json');
const AXE = fs.readFileSync(process.argv[2], 'utf8');
const OUT = path.join(__dirname, '..', 'daten');

(async () => {
  const b = await chromium.launch();
  const result = {};
  for (const [w, label] of [[1440, 'desktop'], [390, 'mobil']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, isMobile: w === 390, hasTouch: w === 390 });
    for (const pg of PAGES) {
      const p = await ctx.newPage();
      await p.goto(BASE + pg.url, { waitUntil: 'networkidle' });
      const H = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += 450) {
        await p.evaluate((y) => window.scrollTo(0, y), y);
        await p.waitForTimeout(40);
      }
      await p.waitForTimeout(5000);
      await p.evaluate(() => window.scrollTo(0, 0));
      const data = await p.evaluate(() => {
        const vis = (el) => {
          const s = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 && r.width > 0 && r.height > 0;
        };
        // Textelemente mit eigenem Text
        const typo = {};
        const colors = {};
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = walker.nextNode())) {
          const t = n.textContent.trim();
          if (!t) continue;
          const el = n.parentElement;
          if (!el || !vis(el) || el.closest('script,style,svg')) continue;
          const s = getComputedStyle(el);
          const fam = s.fontFamily.split(',')[0].replace(/["']/g, '');
          const key = `${fam}|${s.fontSize}|${s.fontWeight}|${s.lineHeight}|${s.fontStretch}|${s.textTransform}`;
          typo[key] = typo[key] || { fam, size: s.fontSize, weight: s.fontWeight, lh: s.lineHeight, stretch: s.fontStretch, tt: s.textTransform, n: 0, beispiel: t.slice(0, 50), tags: {} };
          typo[key].n++;
          typo[key].tags[el.tagName] = (typo[key].tags[el.tagName] || 0) + 1;
          colors[s.color] = (colors[s.color] || 0) + 1;
        }
        // Fließtext: p-Elemente – Zeichen pro Zeile grob aus Breite / Zeichenbreite
        const paras = [...document.querySelectorAll('main p')].filter(vis).map((el) => {
          const s = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          const fs = parseFloat(s.fontSize);
          const cpl = Math.round(r.width / (fs * 0.5));
          return { size: s.fontSize, lh: s.lineHeight, breite: Math.round(r.width), zeichen: cpl, text: el.textContent.trim().slice(0, 60) };
        });
        const bg = {};
        document.querySelectorAll('section, header, footer, aside, main > *').forEach((el) => {
          const c = getComputedStyle(el).backgroundColor;
          if (c && c !== 'rgba(0, 0, 0, 0)') bg[c] = (bg[c] || 0) + 1;
        });
        const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
          tag: h.tagName,
          text: h.textContent.replace(/\s+/g, ' ').trim(),
          sichtbar: vis(h),
        }));
        // Abstände: padding-top/bottom der Sections
        const sections = [...document.querySelectorAll('main > section, main > aside, main > div')].map((s) => {
          const c = getComputedStyle(s);
          return { cls: s.className.split(' ').filter((x) => !x.startsWith('astro-'))[0] || s.tagName, pt: c.paddingTop, pb: c.paddingBottom, h: Math.round(s.getBoundingClientRect().height) };
        });
        // Tap-Flächen
        const taps = [...document.querySelectorAll('a, button, summary, input, select, textarea, [role=button]')]
          .filter(vis)
          .map((el) => {
            const r = el.getBoundingClientRect();
            return { text: (el.textContent || el.getAttribute('aria-label') || el.getAttribute('name') || '').replace(/\s+/g, ' ').trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), href: el.getAttribute('href') };
          });
        const imgs = [...document.querySelectorAll('img')].map((i) => ({ src: (i.currentSrc || i.src).split('/').pop(), alt: i.getAttribute('alt'), loading: i.getAttribute('loading'), w: i.naturalWidth, dw: Math.round(i.getBoundingClientRect().width) }));
        const meta = (sel, a = 'content') => document.querySelector(sel)?.getAttribute(a) ?? null;
        const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent.slice(0, 300));
        const links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
        return {
          title: document.title,
          description: meta('meta[name=description]'),
          canonical: meta('link[rel=canonical]', 'href'),
          robots: meta('meta[name=robots]'),
          og: { title: meta('meta[property="og:title"]'), image: meta('meta[property="og:image"]'), desc: meta('meta[property="og:description"]') },
          lang: document.documentElement.lang,
          ld,
          heads,
          typo: Object.values(typo),
          colors,
          bg,
          paras,
          sections,
          taps,
          imgs,
          links,
          tel: [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href')),
          mail: [...document.querySelectorAll('a[href^="mailto:"]')].length,
        };
      });
      // axe
      await p.addScriptTag({ content: AXE });
      const axe = await p.evaluate(async () => {
        const r = await window.axe.run(document, { resultTypes: ['violations'] });
        return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 6).map((n) => ({ target: n.target.join(' '), summary: (n.failureSummary || '').slice(0, 220) })), count: v.nodes.length }));
      });
      // Tastatur: erste 12 Tab-Stopps mit sichtbarem Fokus?
      let focus = [];
      if (label === 'desktop') {
        await p.evaluate(() => document.activeElement && document.activeElement.blur());
        for (let i = 0; i < 12; i++) {
          await p.keyboard.press('Tab');
          focus.push(
            await p.evaluate(() => {
              const el = document.activeElement;
              if (!el || el === document.body) return null;
              const s = getComputedStyle(el);
              const ring = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
              return { text: (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 30), ring, outline: `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`, shadow: s.boxShadow !== 'none' };
            }),
          );
        }
      }
      result[`${pg.id}|${label}`] = { ...data, axe, focus };
      await p.close();
    }
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'inventar.json'), JSON.stringify(result, null, 1));
  await b.close();
})();
