// Erzeugt die Vorschau-Fassung der Website für das Korrektur-Artefakt:
// Text-Kennungen (data-qk), eine Bildgröße je Bild, relative Pfade, texte.json
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const K = __dirname;
const RAW = path.join(K, 'raw');
const OUT = path.join(K, 'pub');
const PORT = 4331;
const core = fs.readFileSync(path.join(K, 'qcore.js'), 'utf8');

const PAGES = [
  ['start', '', 'Startseite'],
  ['leistungen-rohbau', 'leistungen/rohbau/', 'Rohbau'],
  ['leistungen-schluesselfertig', 'leistungen/schluesselfertiges-bauen/', 'Schlüsselfertiges Bauen'],
  ['leistungen-umbau', 'leistungen/umbau-sanierung/', 'Umbau & Sanierung'],
  ['referenzen', 'referenzen/', 'Referenzen'],
  ['unternehmen', 'unternehmen/', 'Über uns'],
  ['team', 'unternehmen/team/', 'Team'],
  ['zertifikate', 'unternehmen/zertifikate/', 'Zertifikate'],
  ['karriere', 'karriere/', 'Karriere'],
  ['kontakt', 'kontakt/', 'Kontakt'],
  ['impressum', 'impressum/', 'Impressum'],
  ['datenschutz', 'datenschutz/', 'Datenschutz'],
];

function pickSrc(srcset) {
  const c = srcset.split(',').map((s) => s.trim().split(/\s+/)).map(([u, w]) => [u, parseInt(w) || 0]);
  c.sort((a, b) => a[1] - b[1]);
  const ok = c.filter((x) => x[1] <= 1600);
  return (ok.length ? ok[ok.length - 1] : c[0])[0];
}

(async () => {
  // kleiner Server: /__QB__/ -> raw
  const http = require('http');
  const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.woff': 'font/woff' };
  const srv = http
    .createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]).replace(/^\/__QB__\//, '/');
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(RAW, p);
      if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    })
    .listen(PORT);

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'site'), { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const used = new Set();
  const result = { erzeugt: new Date().toISOString(), seiten: [], global: [] };
  const globalSeen = new Set();

  for (const [id, rel, title] of PAGES) {
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}/__QB__/${rel}`, { waitUntil: 'load' });
    const data = await page.evaluate(({ pid, core }) => {
      const Q = new Function(core + ';return QCORE;')();
      const out = [];
      const glob = [];
      const groupOf = (el) => {
        if (el.closest('header.site-header')) return 'Kopfzeile und Menü';
        if (el.closest('footer.site-footer')) return 'Fußzeile';
        const sec = el.closest('section, header.phero, .phero, aside, form');
        const h = sec && sec.querySelector('h1, h2');
        return h ? Q.textOf(h).replace(/\n/g, ' ') : '';
      };
      const handle = (el, base, group) => {
        const text = Q.textOf(el);
        if (!text) return;
        const isGlobal = !!el.closest('header.site-header, footer.site-footer');
        const tag = el.tagName.toLowerCase();
        let k;
        if (isGlobal) k = 'global~' + Q.hash(text);
        else k = pid + '~' + Q.hash(base + Q.domPath(el, el.ownerDocument.body));
        el.setAttribute('data-qk', k);
        const rec = { k, typ: 'text', tag, text, gruppe: group || groupOf(el) };
        if (el.closest('.visually-hidden, .sr-only')) rec.unsichtbar = true;
        if (el.closest('a[href], button')) rec.link = true;
        (isGlobal ? glob : out).push(rec);
      };
      // sichtbare Seite
      Q.items(document.body).forEach((el) => handle(el, '', null));
      // Projekt-Vorlagen (Seitenfenster der Referenzen)
      document.querySelectorAll('template').forEach((tpl) => {
        const frag = tpl.content;
        const h = frag.querySelector('h2, h3');
        const g = 'Projektdetails: ' + (h ? Q.textOf(h) : tpl.getAttribute('data-project'));
        const wrap = document.createElement('div');
        Q.items(frag).forEach((el) => {
          const text = Q.textOf(el);
          if (!text) return;
          const tag = el.tagName.toLowerCase();
          // feste Beschriftungen (z. B. „Adresse“) nur einmal für alle Projekte
          const shared = tag === 'dt' || tag === 'th';
          const k = shared ? pid + '~lbl-' + Q.hash(text) : pid + '~' + Q.hash('tpl:' + (tpl.getAttribute('data-project') || '') + Q.domPath(el, null));
          if (shared && out.some((o) => o.k === k)) { el.setAttribute('data-qk', k); return; }
          el.setAttribute('data-qk', k);
          out.push({ k, typ: 'text', tag, text, gruppe: shared ? 'Projektdetails: Beschriftungen' : g, fenster: tpl.getAttribute('data-project') || '' });
        });
      });
      // Eingabefelder mit Platzhalter
      document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((el) => {
        const text = el.getAttribute('placeholder').trim();
        if (!text) return;
        const k = pid + '~' + Q.hash('ph:' + Q.domPath(el, document.body));
        el.setAttribute('data-qk', k);
        out.push({ k, typ: 'platzhalter', tag: el.tagName.toLowerCase(), text, gruppe: groupOf(el) });
      });
      // Bilder und Videos
      document.querySelectorAll('img, video').forEach((el) => {
        if (el.closest('header.site-header, footer.site-footer')) return;
        const r = el.getBoundingClientRect();
        if (r.width < 60 && r.height < 60 && el.tagName === 'IMG') return;
        const k = pid + '~bild-' + Q.hash(Q.domPath(el, document.body));
        el.setAttribute('data-qk', k);
        out.push({ k, typ: el.tagName === 'VIDEO' ? 'video' : 'bild', tag: el.tagName.toLowerCase(), text: el.getAttribute('alt') || '', gruppe: groupOf(el) });
      });
      // Reihenfolge wie im Dokument
      const order = new Map();
      let i = 0;
      document.querySelectorAll('[data-qk]').forEach((e) => { if (!order.has(e.getAttribute('data-qk'))) order.set(e.getAttribute('data-qk'), i++); });
      out.forEach((o, j) => (o.n = order.has(o.k) ? order.get(o.k) : 100000 + j));
      out.sort((a, b) => a.n - b.n);
      out.forEach((o) => delete o.n);
      // Duplikate entfernen (gleiches Element mehrfach)
      const seen = new Set();
      const uniq = out.filter((o) => (seen.has(o.k) ? false : (seen.add(o.k), true)));
      let last = 'Allgemein';
      uniq.forEach((o) => { if (o.gruppe) last = o.gruppe; else o.gruppe = last; });
      return { items: uniq, global: glob, html: '<!DOCTYPE html>\n' + document.documentElement.outerHTML };
    }, { pid: id, core });
    await page.close();

    // Bilder: eine Größe, Pfade
    let html = data.html;
    html = html.replace(/<img\b[^>]*>/g, (tag) => {
      const m = tag.match(/\ssrcset="([^"]+)"/);
      if (!m) return tag;
      const src = pickSrc(m[1].replace(/&amp;/g, '&'));
      return tag.replace(/\ssrcset="[^"]+"/, '').replace(/\ssizes="[^"]+"/, '').replace(/\ssrc="[^"]+"/, ` src="${src}"`);
    });
    // Bildgröße auch für Thumbnails merken
    const thumbs = {};
    html.replace(/<(img|video)\b[^>]*data-qk="([^"]+)"[^>]*>/g, (tag, t, k) => {
      const s = (tag.match(/\s(?:src|poster)="([^"]+)"/) || [])[1];
      if (s) thumbs[k] = s.replace('/__QB__/', '');
      return tag;
    });
    data.items.forEach((it) => { if (thumbs[it.k]) it.bild = thumbs[it.k]; });
    // alle referenzierten Dateien sammeln
    html.replace(/\/__QB__\/([^"'\s)>?#]+)/g, (_, f) => (used.add(decodeURIComponent(f)), ''));
    html = html.replace(/\/__QB__\//g, '{{QB}}');
    const dir = path.join(OUT, 'site', rel);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);

    data.global.forEach((g) => { if (!globalSeen.has(g.k)) { globalSeen.add(g.k); result.global.push(g); } });
    result.seiten.push({ id, pfad: rel, titel: title, eintraege: data.items });
    console.log(id, data.items.length, 'Einträge');
  }
  await browser.close();
  srv.close();

  // CSS: Pfade relativ, Schriften und Bilder darin mitnehmen
  for (const f of fs.readdirSync(path.join(RAW, '_astro'))) {
    const font = /\.woff2?$/.test(f);
    if (font && !/-latin(-ext)?-/.test(f)) continue;
    if (f.endsWith('.css') || f.endsWith('.js') || font) used.add('_astro/' + f);
  }
  for (const f of used) {
    if (/^(downloads|og)\//.test(f)) continue;
    const src = path.join(RAW, f);
    if (!fs.existsSync(src) || fs.statSync(src).isDirectory()) continue;
    const dst = path.join(OUT, 'site', f);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    if (f.endsWith('.css')) {
      let css = fs.readFileSync(src, 'utf8');
      css = css.replace(/\/__QB__\/_astro\//g, './').replace(/\/__QB__\//g, '../');
      fs.writeFileSync(dst, css);
    } else fs.copyFileSync(src, dst);
  }
  fs.writeFileSync(path.join(OUT, 'texte.json'), JSON.stringify(result));
  const files = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : files.push(path.join(d, e.name))));
  walk(path.join(OUT, 'site'));
  const size = files.reduce((s, f) => s + fs.statSync(f).size, 0);
  console.log('global', result.global.length, '| Dateien', files.length, '| MB', (size / 1e6).toFixed(1));
})();
