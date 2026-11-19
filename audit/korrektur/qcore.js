/* Gemeinsamer Kern: welche Elemente sind Text-Einträge, welcher Text gehört dazu.
   Läuft beim Erzeugen (Playwright) und zur Laufzeit im Artefakt identisch. */
var QCORE = (function () {
  var STRONG = 'h1,h2,h3,h4,h5,h6,p,dt,dd,figcaption,blockquote,address,label,legend,summary,td,th,caption,option,button,text';
  var WEAK = 'a,li';
  var SKIP = 'script,style,noscript,template,title,[data-q-skip],[data-q-ui]';
  var BLOCKY = /^(block|flex|grid|list-item|table|table-row|table-cell|flow-root)$/;
  var HAS = /[0-9A-Za-zÀ-ÿ]/;

  function blockOf(t) {
    var P = t.parentElement;
    if (!P) return null;
    if (P.closest(SKIP)) return null;
    if (P.closest('[aria-hidden="true"]')) return null;
    return P.closest(STRONG) || P.closest(WEAK) || P;
  }
  function norm(s) {
    return s.replace(/­/g, '').replace(/[ \t\r\n\f ]+/g, ' ');
  }
  /* Text eines Eintrags: Textknoten, die zu ihm gehören; <br> und Blockgrenzen werden Zeilenumbrüche */
  function textOf(el) {
    var out = '';
    var lastP = null;
    var win = el.ownerDocument.defaultView;
    function walk(n) {
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) {
          if (blockOf(c) === el) {
            var d = norm(c.data);
            if (!d.trim()) { out += d; continue; }
            // zwei Textteile in getrennten Elementen ohne Leerraum dazwischen: eigene Zeilen
            if (out && lastP && lastP !== c.parentElement && /[^\s]$/.test(out) && /^[0-9A-Za-zÀ-ÿ]/.test(d)) out += '\n';
            out += d;
            lastP = c.parentElement;
          }
        } else if (c.nodeType === 1) {
          var tag = c.tagName.toLowerCase();
          if (tag === 'br') { out += '\n'; continue; }
          if (c.matches(SKIP)) continue;
          var blocky = false;
          try { blocky = BLOCKY.test(win.getComputedStyle(c).display); } catch (e) {}
          if (blocky) out += '\n';
          walk(c);
          if (blocky) out += '\n';
        }
      }
    }
    walk(el);
    return out.replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').replace(/ {2,}/g, ' ').trim();
  }
  /* Textknoten eines Eintrags, in Reihenfolge */
  function nodesOf(el) {
    var list = [];
    var w = el.ownerDocument.createTreeWalker(el, 4);
    for (var t = w.nextNode(); t; t = w.nextNode()) if (blockOf(t) === el) list.push(t);
    return list;
  }
  /* alle Text-Einträge unterhalb von root, in Dokumentreihenfolge, ohne Duplikate */
  function items(root) {
    var seen = new Set();
    var res = [];
    var w = (root.ownerDocument || root).createTreeWalker(root, 4);
    for (var t = w.nextNode(); t; t = w.nextNode()) {
      if (!HAS.test(t.data)) continue;
      var b = blockOf(t);
      if (!b || seen.has(b)) continue;
      seen.add(b);
      res.push(b);
    }
    return res;
  }
  /* neuen Text in ein Element schreiben, Struktur (Icons, Spans) so weit wie möglich erhalten */
  function apply(el, text) {
    var doc = el.ownerDocument;
    var nodes = nodesOf(el).filter(function (n) { return HAS.test(n.data) || n.data.trim(); });
    var lines = text.split('\n');
    var origLines = textOf(el).split('\n');
    // gleiche Zeilenzahl und je Zeile genau ein Textknoten: zeilenweise ersetzen
    if (nodes.length && lines.length === origLines.length && nodes.length === origLines.length) {
      nodes.forEach(function (n, i) { n.data = lines[i]; });
      return;
    }
    if (!nodes.length) { el.textContent = text; return; }
    // sonst: alles in den ersten Textknoten, übrige leeren, Zeilen mit <br>
    var first = nodes[0];
    nodes.slice(1).forEach(function (n) { n.data = ''; });
    // vorhandene <br> des Eintrags entfernen
    Array.prototype.slice.call(el.querySelectorAll('br')).forEach(function (br) { if (br.parentElement && br.parentElement.closest(STRONG + ',' + WEAK) === el) br.remove(); });
    var frag = doc.createDocumentFragment();
    lines.forEach(function (l, i) {
      if (i) frag.appendChild(doc.createElement('br'));
      frag.appendChild(doc.createTextNode(l));
    });
    first.parentNode.replaceChild(frag, first);
  }
  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  function domPath(el, stop) {
    var parts = [];
    for (var e = el; e && e !== stop && e.parentElement; e = e.parentElement) {
      var i = 0;
      for (var s = e.previousElementSibling; s; s = s.previousElementSibling) i++;
      parts.unshift(e.tagName.toLowerCase() + i);
    }
    return parts.join('/');
  }
  return { blockOf: blockOf, textOf: textOf, nodesOf: nodesOf, items: items, apply: apply, hash: hash, domPath: domPath, norm: norm };
})();
