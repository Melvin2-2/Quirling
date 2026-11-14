#!/usr/bin/env python3
"""Erzeugt audit/report.html (eigenständig, Bilder eingebettet) und audit/massnahmen.md."""
import base64, collections, html, io, json, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda *p: os.path.join(ROOT, *p)
data = json.load(open(J('skripte', 'befunde.json')))
SEITEN = data['seiten']
B = data['befunde']
INV = json.load(open(J('daten', 'inventar.json')))
e = html.escape

FARBE = {'kritisch': '#d0021b', 'wichtig': '#f08c00', 'Feinschliff': '#e6c300', 'gut': '#2f9e44'}
RANG = {'kritisch': 0, 'wichtig': 1, 'Feinschliff': 2, 'gut': 3}
AUFW = {'S': 1, 'M': 2, 'L': 3}

KAT = {
 'A': ('Erster Eindruck und USP', 3, 'Claim „Was wir zusagen, steht.“ ist eigenständig, die Unterzeile nennt Leistung und Ort, aber klein. Werte „Persönlich · Verbindlich · Sorgfältig“ sind austauschbar.', 'START-01, START-04'),
 'B': ('Klarheit und Aufmerksamkeit', 4, 'Blickfolge Claim → Knöpfe → Bild stimmt. Schräge Bildkanten führen gut. Tote Zone: Film-Abschnitt mobil.', 'START-05'),
 'C': ('Typografie', 3, '47 Schriftgrößen (Desktop), 40 (Mobil). Fließtext 18–19 px gut, Zeilenlänge meist 55–75 Zeichen, Rechtstexte ~92. Eigenständige Kombination aus schmaler Versal-Display, Plex Sans und Mono.', 'TYPO-01, TYPO-02, START-06'),
 'D': ('Überschriften', 3, 'Genau eine H1 je Seite, Ebenen sauber. Mehrere Überschriften doppelt (Startseite / Über uns), Umbrüche „Datenschutzerk|lärung“, „Schlüssel-fertiges“. Footer-H2 auf jeder Seite.', 'DS-02, SF-02, UEBER-02, HEAD-01'),
 'E': ('Seitenlänge und Lesefluss', 3, 'Leistungsseiten gut getaktet (Text, Bild, Liste, dunkle Fläche, Kacheln). Startseite mobil 9.228 px mit dreifacher Leistungsnennung.', 'START-03, START-05'),
 'F': ('Inhaltstiefe', 3, 'Leistungen konkret beschrieben. Es fehlen Projektgrößen, Kapazität, Antwortzeit, Gehalt und Arbeitszeit.', 'LEIST-01, KARR-01, KONTAKT-02'),
 'G': ('Textqualität', 4, 'Kurz, aktiv, bodenständig, kaum Floskeln. Ausreißer: „Kennste uns schon?“ (du an Kunden), „eingespielt“ dreifach.', 'START-02, TEXT-01'),
 'H': ('Gesamtaufbau und Seitenmanagement', 4, '5 Hauptpunkte, alle Ziele in ≤ 2 Klicks. Es fehlen Projekt-Einzelseiten.', 'NAV-01, REF-01'),
 'I': ('Calls to Action', 4, '„Projekt anfragen“ und Telefon immer im Kopf, Telefon und E-Mail antippbar, eigener Bewerber-Aufruf. Bürozeiten fehlen.', 'START-07, KONTAKT-02'),
 'J': ('Durchgängige Linie', 4, 'Farben, Rautenmotiv, Knöpfe und Bildstil konsistent. Ausreißer: Du-Ansprache auf der Startseite, uneinheitliche Größen.', 'START-02, TYPO-01'),
 'K': ('Zielgruppenansprache', 3, 'Gewerbe: gut über Rohbau und Referenzen. Privat: Schlüsselfertig mit 2 alten Referenzen, kein Hinweis zum Ablauf nach der Anfrage. Bewerber: eigener Weg, aber hohe Hürde.', 'SF-01, KONTAKT-03, KARR-02'),
 'L': ('SEO', 2, 'Kein robots.txt, keine sitemap.xml, keine Weiterleitungen alter URLs, kein og:image, Titel ohne „Hamburg“, Projekte ohne eigene URL. Beschreibungen der Leistungsseiten 184–210 Zeichen (werden abgeschnitten).', 'SEO-01…04, REF-01'),
 'M': ('Vertrauen und Belege', 3, 'Echte Fotos, 37 Referenzen, Team mit Namen. Nachweise ca. 2017 und nur auf einer Unterseite, Eckdaten lückenhaft, keine Kundenstimmen.', 'ZERT-01, REF-02, TEAM-01, VERTRAUEN-01'),
 'N': ('Mobile Nutzung', 4, 'Kein seitliches Scrollen, Menü funktioniert, Fließtext ≥ 16 px. Footer-Links 20 px, Filter 30 px hoch, Text auf Fotos im Seitenkopf.', 'MOBIL-01, REF-04, LEIST-03'),
 'O': ('Ladezeit und Technik', 3, 'Desktop 98–100. Mobil Start 78 (LCP 5,6 s, 4,1 MB), Referenzen 82 (LCP 4,5 s). CLS ≤ 0,045. Keine Konsolenfehler, 0 tote Links, 404 korrekt.', 'PERF-01, REF-03, TECH-01'),
 'P': ('Barrierefreiheit', 4, 'Lighthouse 92–96. Skip-Link, Fokusrahmen, Labels, Alt-Texte vorhanden. Kontrast der grauen Zeitleiste 1,6–1,7:1.', 'UEBER-01, A11Y-01'),
 'Q': ('Local SEO und Auffindbarkeit', 2, 'NAP auf allen Seiten gleich und gleich zur alten Seite. Strukturierte Daten nur Basis, keine Öffnungszeiten, kein JobPosting, Einsatzgebiet unkonkret, keine Karte. Google-Profil nicht geprüft.', 'LOCAL-01, LOCAL-02'),
 'R': ('Karriere-Bereich', 3, 'Eigene Seite mit echten Vorteilen und ausführlicher Stelle. Keine Zahlen zu Lohn und Zeit, Bewerbung nur mit vollständigen Unterlagen.', 'KARR-01, KARR-02, KARR-03'),
 'S': ('Kontakt und Formulare', 2, '6 Eingabefelder mit Labels, Pflichtangaben, Rechenfrage und unsichtbarer Spamschutz. Versand fällt auf mailto zurück, keine echte Bestätigung. Nicht real abgesendet.', 'KONTAKT-01'),
 'T': ('Recht und Datenschutz', 2, 'Impressum und Datenschutz von jeder Seite verlinkt, keine Cookies, keine externen Einbindungen. Aber sichtbare Platzhalter (USt-IdNr., Datenschutz-Hinweis, Datum). Rechtlich prüfen lassen.', 'RECHT-01, RECHT-02, TECH-02'),
 'U': ('Bildsprache', 4, 'Echte Baustellen- und Teamfotos, einheitlich mit Knickkanten und Blau-Ton. Einzelne Seitenkopf-Fotos mobil unruhig hinter Text.', 'UEBER-03, LEIST-03'),
 'V': ('Usability-Heuristiken', 4, 'Verstöße: Systemstatus (kein Absende-Feedback, S), Konsistenz (Sie/du, G), Fehlervermeidung (Platzhalter sichtbar, T). Sonst keine Verstöße gefunden.', 'KONTAKT-01, START-02, RECHT-01'),
 'W': ('— nicht definiert —', None, 'Im Auftrag ist „A bis W“ genannt, definiert sind A bis V. W wurde deshalb nicht bewertet.', '—'),
}
noten = [v[1] for v in KAT.values() if v[1]]
GESAMT = sum(noten) / len(noten)

# ---------- Bilder ----------
def img64(path, width=None, q=62):
    im = Image.open(path).convert('RGB')
    if width and im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=q, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()

# ---------- Sortierung ----------
massn = [b for b in B if b['schwere'] != 'gut']
massn.sort(key=lambda b: (RANG[b['schwere']], -b['wirkung'], AUFW[b['aufwand']]))
def prio(b):
    if b['schwere'] == 'kritisch' or (b['wirkung'] >= 4 and b['aufwand'] != 'L'): return 'P1'
    if b['wirkung'] >= 3: return 'P2'
    return 'P3'
def quick(b): return b['wirkung'] >= 3 and b['aufwand'] == 'S'

def chip(b, link=True):
    t = f'<span class="chip" style="--c:{FARBE[b["schwere"]]}">{e(b["id"])}</span>'
    return f'<a href="#{b["id"]}">{t}</a>' if link else t

def befund_tabelle(liste):
    out = []
    for b in liste:
        out.append(f'''<article class="bf" id="{b['id']}" style="--c:{FARBE[b['schwere']]}">
<header><span class="pin">{e(b['id'])}</span><span class="tag">{e(b['schwere'])}</span><span class="tag k">Kat. {b['kat']} · {e(KAT[b['kat']][0])}</span><span class="tag">Aufwand {b['aufwand']}</span>{'<span class="tag qw">Quick Win</span>' if quick(b) and b['schwere']!='gut' else ''}</header>
<dl><dt>Was</dt><dd>{e(b['was'])}</dd><dt>Warum</dt><dd>{e(b['warum'])}</dd><dt>Vorschlag</dt><dd>{e(b['vorschlag'])}</dd><dt>Dateien</dt><dd><code>{e(b['dateien'])}</code></dd></dl></article>''')
    return '\n'.join(out)

# ---------- Abschnitte ----------
S = []
S.append(f'''<section id="fazit"><h2>1 · Kurzfazit</h2>
<div class="fazit-top"><div class="note-big">{str(round(GESAMT,1)).replace('.',',')}<small> / 5</small></div>
<p class="urteil"><b>Gestalterisch stark und eigenständig, inhaltlich bodenständig. Technisch noch nicht startklar:</b> Formular, Rechtstexte und Suchmaschinen-Grundlagen müssen vor dem Umzug auf quirling.de fertig sein.</p></div>
<div class="cols3">
<div><h3>3 größte Stärken</h3><ol>
<li>Eigenständiges Design mit echten Baustellenfotos, Rautenmotiv und klarer Farbwelt. Hebt sich deutlich von den Wettbewerbern ab.</li>
<li>Konkrete Leistungsseiten (Rohbau, Schlüsselfertig, Umbau) mit je 8 Einzelleistungen und echten Vorteilen statt Floskeln.</li>
<li>Schlanke Technik: keine Cookies, kein Tracking, Schriften lokal, Desktop-Lighthouse 98–100, 0 tote Links, sichtbarer Fokus.</li></ol></div>
<div><h3>5 wichtigste Probleme</h3><ol>
<li>Das Formular verschickt nichts, es öffnet nur das Mailprogramm ({chip(next(b for b in B if b['id']=='KONTAKT-01'))}).</li>
<li>Sichtbare Platzhalter in Impressum und Datenschutz ({chip(next(b for b in B if b['id']=='RECHT-01'))} {chip(next(b for b in B if b['id']=='RECHT-02'))}).</li>
<li>Keine sitemap.xml, kein robots.txt, keine Weiterleitungen der 57 alten URLs ({chip(next(b for b in B if b['id']=='SEO-01'))} {chip(next(b for b in B if b['id']=='SEO-02'))}).</li>
<li>Titel, H1 und strukturierte Daten nennen „Hamburg“ und die Leistung zu selten ({chip(next(b for b in B if b['id']=='SEO-03'))} {chip(next(b for b in B if b['id']=='LOCAL-01'))}).</li>
<li>Dünne Belege: Nachweise von ca. 2017, Projektgrößen fehlen, 2 alte Schlüsselfertig-Referenzen ({chip(next(b for b in B if b['id']=='ZERT-01'))} {chip(next(b for b in B if b['id']=='LEIST-01'))}).</li></ol></div>
<div><h3>5 Maßnahmen mit größtem Effekt</h3><ol>
<li>Formulardienst anbinden und Bestätigung anzeigen.</li>
<li>Rechtstexte fertigstellen, Platzhalter entfernen, rechtlich prüfen lassen.</li>
<li>Sitemap, robots.txt und Weiterleitungstabelle alt → neu vor dem Domainumzug.</li>
<li>Titel nach „Leistung in Hamburg“, Unterzeile im Hero stärken, LocalBusiness- und JobPosting-Daten.</li>
<li>Karriere: Lohn und Arbeitszeit nennen, Kurzbewerbung per Anruf oder Rückruf.</li></ol></div></div>
<p class="legende"><span class="chip" style="--c:#d0021b">kritisch</span><span class="chip" style="--c:#f08c00">wichtig</span><span class="chip" style="--c:#e6c300">Feinschliff</span><span class="chip" style="--c:#2f9e44">gut gelöst, so lassen</span> · {len(B)} Befunde, davon {sum(b['schwere']=='kritisch' for b in B)} kritisch, {sum(b['schwere']=='wichtig' for b in B)} wichtig, {sum(b['schwere']=='Feinschliff' for b in B)} Feinschliff, {sum(b['schwere']=='gut' for b in B)} gut.</p>
</section>''')

# Scorecard
rows = []
for k, (name, n, beleg, ids) in KAT.items():
    if n:
        c = ['#d0021b', '#d0021b', '#f08c00', '#e6c300', '#2f9e44', '#2f9e44'][n]
        bar = f'<div class="bar"><span style="width:{n*20}%;background:{c}"></span></div><b>{n}</b>'
    else:
        bar = '<i>nicht bewertet</i>'
    rows.append(f'<tr><td class="kk">{k}</td><td><b>{e(name)}</b></td><td class="sc">{bar}</td><td>{e(beleg)}</td><td class="ids">{e(ids)}</td></tr>')
S.append(f'''<section id="scorecard"><h2>2 · Scorecard</h2><p class="hint">1 = schlecht, 5 = sehr gut. Durchschnitt A–V: <b>{str(round(GESAMT,1)).replace('.',',')}</b>. Vorschläge stehen in den genannten Befunden.</p>
<table class="t"><thead><tr><th></th><th>Kategorie</th><th>Note</th><th>Begründung mit Beleg</th><th>Befunde / Vorschlag</th></tr></thead><tbody>{''.join(rows)}</tbody></table></section>''')

# Matrix
cells = collections.defaultdict(list)
for b in massn:
    w = 'hoch' if b['wirkung'] >= 4 else 'mittel' if b['wirkung'] == 3 else 'gering'
    cells[(w, b['aufwand'])].append(b)
grid = ['<div class="mx"><div class="mx-y">Wirkung ↑</div><div></div><div class="mx-h">Aufwand S</div><div class="mx-h">Aufwand M</div><div class="mx-h">Aufwand L</div>']
for w in ['hoch', 'mittel', 'gering']:
    grid.append(f'<div class="mx-r">{w}</div>')
    for a in 'SML':
        qw = ' qwc' if a == 'S' and w in ('hoch', 'mittel') else ''
        grid.append(f'<div class="mx-c{qw}">' + ''.join(chip(b) for b in cells[(w, a)]) + '</div>')
grid.append('</div>')
S.append(f'''<section id="matrix"><h2>3 · Prioritätenmatrix</h2><p class="hint">Alle {len(massn)} Maßnahmen nach Wirkung und Aufwand. <b>Grün hinterlegt = Quick Wins</b> (Wirkung mittel/hoch, Aufwand S). Farbe der Marke = Schweregrad. Klick führt zum Befund.</p>{''.join(grid)}</section>''')

# Seiten
SEITEN_JSON = json.load(open(J('skripte', 'seiten.json')))
page_html = []
for pid, name in SEITEN.items():
    liste = [b for b in B if b['seite'] == pid]
    if not liste: continue
    liste.sort(key=lambda b: RANG[b['schwere']])
    bilder = ''
    if pid != 'global':
        url = next((s['url'] for s in SEITEN_JSON if s['id'] == pid), '')
        figs = []
        for key, lab, w in [('d', 'Desktop 1440 px', 1000), ('m', 'Mobil 390 px', 390)]:
            p = J('screenshots', 'markiert', f'{pid}-{key}.jpg')
            if not os.path.exists(p):
                raw = J('screenshots', 'roh', f'{pid}-{1440 if key=="d" else 390}-voll.jpg')
                p = raw if os.path.exists(raw) else None
                lab += ' (ohne Markierung)'
            if p:
                figs.append(f'<figure class="shot {key}"><figcaption>{lab} · <a href="{os.path.relpath(p, ROOT)}">Originalgröße</a></figcaption><div class="scroll"><img loading="lazy" src="{img64(p, w)}" alt="{e(name)}, {lab}, mit markierten Befunden"></div></figure>')
        bilder = f'<p class="hint">URL: <code>{e(url)}</code> · Bilder sind scrollbar.</p><div class="shots">{"".join(figs)}</div>'
    page_html.append(f'<section class="page" id="seite-{pid}"><h3>{e(name)} <small>{len(liste)} Befunde</small></h3>{bilder}<div class="bfs">{befund_tabelle(liste)}</div></section>')
nav_pages = ' · '.join(f'<a href="#seite-{p}">{e(n)}</a>' for p, n in SEITEN.items() if any(b['seite'] == p for b in B))
S.append(f'<section id="seiten"><h2>4 · Befunde je Seite</h2><p class="hint">{nav_pages}</p>{"".join(page_html)}</section>')

# Typografie
sz = collections.Counter(); szm = collections.Counter(); bsp = {}
for k, v in INV.items():
    for t in v['typo']:
        s = round(float(t['size'][:-2]), 1)
        (sz if 'desktop' in k else szm)[s] += t['n']
        bsp.setdefault(s, f"{t['fam']} {t['weight']}: „{t['beispiel'][:34]}“")
SOLL = [(12.8, 'Label / Mono klein', '0.8rem'), (14, 'Meta, Bildunterschrift', '0.875rem'), (16, 'Fließtext mobil, Formular', '1rem'), (19, 'Fließtext Desktop', '1.1875rem'), (22, 'Einleitung / Lead', '1.375rem'), (28, 'H3', '1.75rem'), (40, 'H2 klein / H2 mobil', '2.5rem'), (60, 'H2', '3.75rem'), (96, 'Display / H1', 'clamp(3rem, 7vw, 6rem)')]
def ziel(s): return min(SOLL, key=lambda x: abs(x[0] - s))[0]
ist_rows = ''.join(f'<tr><td>{s:g} px</td><td>{sz.get(s,0)}</td><td>{szm.get(s,0)}</td><td>{ziel(s):g} px</td><td class="ex">{e(bsp.get(s,""))}</td></tr>' for s in sorted(set(sz) | set(szm)))
soll_rows = ''.join(f'<tr><td><b>{s:g} px</b></td><td>{e(r)}</td><td><code>{c}</code></td><td>{sum(n for x, n in sz.items() if ziel(x)==s)}</td></tr>' for s, r, c in SOLL)
col = collections.Counter(); bg = collections.Counter(); pad = collections.Counter(); padm = collections.Counter()
for k, v in INV.items():
    if 'desktop' not in k:
        for s in v['sections']: padm[s['pt']] += 1
        continue
    for c, n in v['colors'].items(): col[c] += n
    for c, n in v['bg'].items(): bg[c] += n
    for s in v['sections']: pad[s['pt']] += 1
sw = lambda c, n: f'<div class="sw"><span style="background:{c}"></span><code>{e(c)}</code><small>{n}×</small></div>'
S.append(f'''<section id="system"><h2>5 · Seitenübergreifend: Typografie, Farben, Abstände, Navigation</h2>
<h3>Typografie Ist gegen Soll</h3>
<p class="hint">Gemessen aus dem gerenderten DOM aller 13 Seiten (Anzahl Textknoten). Ist: <b>{len(sz)} Größen Desktop, {len(szm)} Mobil</b>. Soll: 9 Stufen. Spalte „Soll“ zeigt die nächstliegende Stufe.</p>
<div class="cols2"><div><h4>Soll-Skala (Vorschlag)</h4><table class="t"><thead><tr><th>Größe</th><th>Rolle</th><th>CSS</th><th>Ist-Knoten</th></tr></thead><tbody>{soll_rows}</tbody></table>
<p class="hint">Zeilenhöhe: Fließtext 1,55–1,6; Überschriften 0,95–1,05. Zeilenlänge max. 70 Zeichen (<code>max-width: 38em</code>), Rechtstexte zurzeit ~92 Zeichen.</p></div>
<div><h4>Ist (alle gemessenen Größen)</h4><div class="scroll sm"><table class="t"><thead><tr><th>Größe</th><th>Desktop</th><th>Mobil</th><th>Soll</th><th>Beispiel</th></tr></thead><tbody>{ist_rows}</tbody></table></div></div></div>
<h3>Farben</h3><p class="hint">Textfarben (Desktop, Häufigkeit). Klare Palette aus Navy, Blau und Weiß-Transparenzen. Rot #d0021b nur bei Platzhaltern (Todo). Problem: Grau der Zeitleiste auf Über uns (#b9bdd3 / #c3c8de auf #f6f7fb = 1,7:1 / 1,6:1), Vorschlag #7d83a6.</p>
<div class="sws">{''.join(sw(c, n) for c, n in col.most_common(14))}</div>
<p class="hint">Hintergründe der Abschnitte:</p><div class="sws">{''.join(sw(c, n) for c, n in bg.most_common(8))}</div>
<h3>Abstände</h3><p class="hint">Innenabstand oben der Hauptabschnitte. Desktop: {', '.join(f'{k} ({n}×)' for k, n in pad.most_common(9))}. Mobil: {', '.join(f'{k} ({n}×)' for k, n in padm.most_common(6))}. Bewertung: weitgehend auf einem 8-px-Raster (64/96/128/144), Ausreißer 73,6 / 100,8 / 158,4 px. Vorschlag: 3 Stufen <code>--sp-s 64px · --sp-m 96px · --sp-l 136px</code>, mobil 48 / 72 / 96 px.</p>
<h3>Navigation Ist gegen Vorschlag</h3>
<div class="cols2"><div><h4>Ist</h4><ul class="tree"><li>Startseite<ul><li>Leistungen ▾ (Anker #leistungen)<ul><li>Rohbau &amp; Stahlbetonbau</li><li>Schlüsselfertiges Bauen</li><li>Umbau &amp; Sanierung</li></ul></li><li>Referenzen <i>(Projekte nur als ?p=…)</i></li><li>Unternehmen ▾<ul><li>Über uns</li><li>Team</li><li>Zertifikate &amp; Downloads</li></ul></li><li>Karriere</li><li>Kontakt</li><li class="mu">Footer: Impressum, Datenschutz</li></ul></li></ul></div>
<div><h4>Vorschlag</h4><ul class="tree"><li>Startseite<ul><li>Leistungen ▾ <i>(unverändert)</i><ul><li>Rohbau &amp; Stahlbetonbau</li><li>Schlüsselfertiges Bauen</li><li>Umbau &amp; Sanierung</li></ul></li><li>Referenzen<ul><li class="neu">/referenzen/&lt;projekt&gt;/ × 37 (neu, REF-01)</li></ul></li><li>Unternehmen ▾<ul><li>Über uns</li><li>Team</li><li>Zertifikate &amp; Downloads <i>(zusätzlich im Footer, VERTRAUEN-01)</i></li></ul></li><li>Karriere<ul><li class="neu">Kurzbewerbung / Rückruf (KARR-02)</li></ul></li><li>Kontakt</li><li class="mu">Footer: Impressum, Datenschutz, Nachweise</li><li class="neu">technisch: sitemap.xml, robots.txt, Weiterleitungen (SEO-01/02)</li></ul></li></ul></div></div>
</section>''')

# Texte
TEXTE = [
 ('Startseite, Hero-Unterzeile', 'HomePage.astro:121', 'Rohbau, schlüsselfertiges Bauen und Umbau in Hamburg. Seit 1992.', 'Rohbau in Beton und Stahlbeton, schlüsselfertige Häuser und Umbauten in Hamburg. Familienbetrieb seit 1992, für Bauträger, Planer und private Bauherren.'),
 ('Startseite, Knopf', 'HomePage.astro:139', 'Kennste uns schon?', 'Lernen Sie uns kennen'),
 ('Startseite, Werte', 'HomePage.astro:255', 'Persönlich · Verbindlich · Sorgfältig', 'Eigene Poliere · Eigene Schalung · Kollegen seit über 30 Jahren'),
 ('Startseite, „Was wir bauen.“', 'HomePage.astro:156–159', 'Vom ersten Spatenstich bis zur Schlüsselübergabe: Wir übernehmen den Rohbau in Beton und Stahlbeton, bauen auf Wunsch schlüsselfertig und bringen Bestandsgebäude wieder in Form. Immer mit eigener Mannschaft und einem festen Ansprechpartner.', 'Drei Leistungen, ein Ansprechpartner: Rohbau in Beton und Stahlbeton, schlüsselfertige Häuser und Umbauten im Bestand. Ausgeführt von unserer eigenen Mannschaft. (Liste darunter entfällt, START-03)'),
 ('Team, Seitenkopf', 'unternehmen/team/index.astro:25', 'Ein eingespieltes Team aus jungen und erfahrenen Kollegen. Im Büro und auf der Baustelle.', 'Rund zehn Leute, viele seit Jahrzehnten dabei. Hier sehen Sie, wer Ihr Projekt im Büro und auf der Baustelle betreut.'),
 ('Über uns, Seitenkopf', 'unternehmen/index.astro:21', 'Das Handwerk liegt bei uns in der Familie. Heute bauen wir in Hamburg und Umgebung, mit einem eingespielten Team aus jungen und erfahrenen Kollegen.', 'Schon der Vater des Gründers stand auf dem Gerüst. Seit 1992 bauen wir als eigener Betrieb in Hamburg und Umgebung.'),
 ('Karriere, Stellen-Kurztext', 'karriere/index.astro:29', 'Schalen, bewehren, betonieren: Rohbau mit einem festen, eingespielten Team.', 'Schalen, bewehren, betonieren: Rohbau mit festem Team und eigenem Polier. Ab [XX] € pro Stunde.'),
 ('Kontakt, Seitenkopf', 'kontakt/index.astro:18', 'Wir sind montags bis freitags für Sie erreichbar. Ob erste Idee oder fertige Planung, wir freuen uns auf Ihr Vorhaben.', 'Montag bis Freitag, [7–16] Uhr. Ob erste Idee oder fertige Planung: Schicken Sie uns Ihr Vorhaben, wir antworten innerhalb von [2] Werktagen.'),
 ('Kontakt, Notiz unter Telefon', 'kontakt/index.astro:34', 'Montags bis freitags erreichbar', 'Mo–Fr, [7–16] Uhr'),
 ('Umbau, Vorteil „Erfahrung mit Altbau“', 'leistungen-seiten.ts:121', 'Stadtvillen und historische Gebäude, auch unter Denkmalschutz: Wir wissen, worauf es bei alter Bausubstanz ankommt.', 'Stadtvillen und historische Gebäude: Wir wissen, worauf es bei alter Bausubstanz ankommt. (Denkmalschutz nur mit Referenz nennen)'),
]
UEB = [
 ('Startseite H1', 'Was wir zusagen, steht.', 'bleibt (Claim stark); Ort und Leistung in die Unterzeile, siehe Mockup'),
 ('Über uns H2', 'Bauen liegt in der Familie. (doppelt zur Startseite)', '„Vom Gerüst zum eigenen Betrieb.“ · „Unsere Geschichte.“ · „Drei Jahrzehnte Hamburg.“'),
 ('Über uns H2', 'Eine Basis, auf die Sie bauen können.', '„Unser Weg seit 1992.“ · „Was uns trägt.“ · „Vom Tegelweg zur Tilsiter Straße.“'),
 ('Schlüsselfertig H1', 'Schlüssel-fertiges Bauen (Trennstrich)', '„Schlüsselfertig bauen.“ · „Ihr Haus, schlüsselfertig.“'),
 ('Datenschutz H1', 'DATENSCHUTZERK / LÄRUNG', '„Datenschutz­erklärung“ mit weicher Trennung · „Datenschutz.“'),
 ('Referenzen', 'keine inhaltliche H2', 'Unsichtbare H2 „Alle Projekte“ über dem Raster oder sichtbar „37 Projekte seit 1992.“'),
 ('Zertifikate H2', 'Zum Download.', '„Aktuelle Nachweise.“ · „Für Ihre Vergabeunterlagen.“'),
 ('Kontakt H2', 'Telefon und E-Mail', '„Direkt erreichbar.“ · „Rufen Sie an.“'),
]
CTA = [
 ('Startseite Intro', 'Kennste uns schon?', 'Lernen Sie uns kennen →'),
 ('Kontakt Formular', 'Nachricht senden (öffnet Mailprogramm)', 'Anfrage senden (mit echtem Versand und Bestätigung)'),
 ('Karriere', 'Jetzt bewerben (E-Mail mit Unterlagen)', 'Zusätzlich: „Ruf einfach an“ und „Rückruf anfordern“'),
 ('Projektkacheln Leistungsseiten', 'nur Titel, Klick öffnet Referenzen mit ?p=', '„Projekt ansehen →“ auf eigene Projektseite (nach REF-01)'),
]
S.append(f'''<section id="texte"><h2>6 · Texte vorher / nachher</h2>
<h3>Die 10 schwächsten Textstellen</h3><table class="t vn"><thead><tr><th>Stelle</th><th>Vorher</th><th>Nachher</th></tr></thead><tbody>{''.join(f'<tr><td><b>{e(a)}</b><br><code>{e(f)}</code></td><td class="vor">{e(v)}</td><td class="nach">{e(n)}</td></tr>' for a, f, v, n in TEXTE)}</tbody></table>
<p class="hint">Eckige Klammern = Angabe fehlt, bitte liefern. „Gute Leute suchen wir immer.“ bleibt wie besprochen.</p>
<h3>Überschriften</h3><table class="t"><thead><tr><th>Stelle</th><th>Ist</th><th>Alternativen</th></tr></thead><tbody>{''.join(f'<tr><td>{e(a)}</td><td class="vor">{e(v)}</td><td class="nach">{e(n)}</td></tr>' for a, v, n in UEB)}</tbody></table>
<h3>Calls to Action</h3><table class="t"><thead><tr><th>Stelle</th><th>Ist</th><th>Vorschlag</th></tr></thead><tbody>{''.join(f'<tr><td>{e(a)}</td><td class="vor">{e(v)}</td><td class="nach">{e(n)}</td></tr>' for a, v, n in CTA)}</tbody></table>
<h3>Mockups</h3><div class="cols2">''' + ''.join(f'<figure class="mock"><figcaption>{cap} · <a href="mockups/{f}.html">HTML öffnen</a></figcaption><img loading="lazy" src="{img64(J("mockups", f + ".png"), 900)}" alt="Mockup {cap}"></figure>' for f, cap in [('start-hero', 'Startseite: Hero mit Unterzeile und Belegen (START-01/04)'), ('karriere-kurzbewerbung', 'Karriere: Eckdaten und Kurzbewerbung (KARR-01/02)')] if os.path.exists(J('mockups', f + '.png'))) + '</div></section>')

# SEO-Tabelle
KW = {'start': 'Bauunternehmen Hamburg', 'rohbau': 'Rohbau Hamburg, Stahlbetonbau Hamburg', 'schluesselfertig': 'schlüsselfertig bauen Hamburg', 'umbau': 'Umbau Sanierung Hamburg, Altbau', 'referenzen': 'Referenzen Bauunternehmen Hamburg', 'ueberuns': 'Familienbetrieb Bauunternehmen Hamburg', 'team': 'Ansprechpartner Quirling', 'zertifikate': 'Freistellungsbescheinigung Quirling', 'karriere': 'Betonbauer Job Hamburg', 'kontakt': 'Quirling Kontakt Wandsbek', 'impressum': '—', 'datenschutz': '—', '404': '—'}
VOR = {'start': ('ok', 'Title gut. H1 ohne Suchwort, Unterzeile stärken (START-01).'),
 'rohbau': ('verbessern', 'Title „Rohbau & Stahlbetonbau in Hamburg | Quirling Bauunternehmen“; Description auf ≤ 155 Zeichen kürzen.'),
 'schluesselfertig': ('verbessern', 'Title „Schlüsselfertig bauen in Hamburg | Quirling Bauunternehmen“; Description ≤ 155 Zeichen.'),
 'umbau': ('verbessern', 'Title „Umbau & Sanierung in Hamburg | Quirling Bauunternehmen“; Description (210 Zeichen) ≤ 155.'),
 'referenzen': ('verbessern', 'Title „Referenzen: Rohbau & Umbau in Hamburg | Quirling“; Projektseiten (REF-01); 38 von 39 Bildern ohne Alt-Text (Kacheln dekorativ, Titel als Text vorhanden – auf Projektseiten Alt-Texte setzen).'),
 'ueberuns': ('ok', 'Title „Über uns: Familienbetrieb seit 1992 | Quirling Bauunternehmen Hamburg“.'),
 'team': ('verbessern', 'Title „Team & Ansprechpartner | Quirling Bauunternehmen Hamburg“.'),
 'zertifikate': ('ok', 'Datum je Dokument ergänzen (ZERT-01).'),
 'karriere': ('verbessern', 'Title „Jobs: Beton- und Stahlbetonbauer in Hamburg | Quirling“; JobPosting (LOCAL-01).'),
 'kontakt': ('ok', 'Title „Kontakt & Anfahrt | Quirling Bauunternehmen Hamburg-Wandsbek“; Öffnungszeiten.'),
 'impressum': ('ok', '—'), 'datenschutz': ('ok', '—'), '404': ('ok', 'noindex ist für 404 nicht nötig, Status 404 korrekt.')}
seo_rows = []
for s in SEITEN_JSON:
    v = INV[f"{s['id']}|desktop"]
    h1 = next((h['text'] for h in v['heads'] if h['tag'] == 'H1'), '—').replace('­', '')
    d = v['description'] or ''
    st, vo = VOR[s['id']]
    seo_rows.append(f'<tr><td><b>{e(s["name"])}</b></td><td>{e(v["title"])}<br><small>{len(v["title"])} Z.</small></td><td>{e(d)}<br><small class="{"bad" if len(d)>160 or len(d)<70 else ""}">{len(d)} Z.</small></td><td>{e(h1)}</td><td>{e(KW[s["id"]])}</td><td><span class="st {st}">{st}</span></td><td>{e(vo)}</td></tr>')
S.append(f'''<section id="seo"><h2>7 · SEO je Seite</h2><p class="hint">Seitenübergreifend fehlen: sitemap.xml, robots.txt, og:image, Weiterleitungen (SEO-01/02/04). Canonical zeigt bis zum Livegang auf die Testadresse. Lighthouse SEO überall 100 (prüft nur Grundlagen).</p>
<div class="scroll wide"><table class="t seo"><thead><tr><th>Seite</th><th>Title</th><th>Description</th><th>H1</th><th>Ziel-Keyword</th><th>Status</th><th>Vorschlag</th></tr></thead><tbody>{''.join(seo_rows)}</tbody></table></div>
<h3>Messwerte Lighthouse (lokal, Lab, ohne Kompression)</h3>''')
lh_rows = []
for pid in ['start', 'rohbau', 'referenzen', 'ueberuns', 'team', 'karriere', 'kontakt', 'impressum']:
    r = []
    for f in ['mobile', 'desktop']:
        d = json.load(open(J('daten', 'lighthouse', f'{pid}-{f}.json')))
        c = d['categories']; a = d['audits']
        r.append((round(c['performance']['score']*100), round(c['accessibility']['score']*100), a['largest-contentful-paint']['displayValue'], a['cumulative-layout-shift']['displayValue'], a['total-blocking-time']['displayValue'], round(a['total-byte-weight']['numericValue']/1024)))
    m, dk = r
    cls = lambda x: 'good' if x >= 90 else 'mid' if x >= 50 else 'bad'
    lh_rows.append(f'<tr><td>{SEITEN[pid]}</td><td class="{cls(m[0])}">{m[0]}</td><td class="{cls(dk[0])}">{dk[0]}</td><td>{m[1]}</td><td>{m[2]}</td><td>{dk[2]}</td><td>{m[3]}</td><td>{m[4]}</td><td>{m[5]:,} KB</td></tr>'.replace(',', '.'))
S[-1] += f'<table class="t"><thead><tr><th>Vorlage</th><th>Perf. mobil</th><th>Perf. Desktop</th><th>Barrierefr.</th><th>LCP mobil</th><th>LCP Desktop</th><th>CLS</th><th>TBT mobil</th><th>Gewicht mobil</th></tr></thead><tbody>{"".join(lh_rows)}</tbody></table><p class="hint">Best Practices und SEO überall 100. Zielwerte Google: LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms (INP nur im Feld messbar, nicht geprüft). axe-core: einzige echte Verletzung <code>aria-prohibited-attr</code> an der Klapptafel (Startseite); Kontrast-Meldungen sind Text auf Bild/Navy-Flächen und wurden von Hand nachgerechnet.</p></section>'

# Wettbewerb
WB = [
 ('quirling-alt', 'Quirling, alte Website (quirling.de)', 'H1 „Quirling GmbH Bauunternehmen – Hamburg“ (Suchwort drin). 37 Projektseiten, 11 Nachweise, Gedenkseite Dieter Quirling. Cookie-Banner, WordPress, Bewerbung nur per Post.', 'Neue Seite: deutlich moderner, schneller, kein Cookie-Banner. Übernehmen: Ort in der H1-Zone, Projekt-URLs.'),
 ('otto-wulff', 'Otto Wulff (otto-wulff.de)', 'Großer Hamburger Baukonzern. H1 „Lebenswerte. Lebensräume.“, Mega-Menü, Cookie-Modal vor dem Inhalt.', 'Besser: Breite, viele Projekte. Schlechter: austauschbarer Claim, Cookie-Sperre. Quirling hebt sich ab durch Nähe, Namen, eigene Poliere.'),
 ('markgraf', 'Markgraf Bau (markgraf-bau.de)', 'H1 „Ihr Partner für Hoch- & Tiefbau“, Navigation nach Leistungen, Laufband „Seit 1932“.', 'Besser: Leistung sofort in der H1. Schlechter: Floskel „Ihr Partner“. Quirling: eigenständigeres Design, konkretere Leistungstexte.'),
]
wb_rows = ''.join(f'<tr><td><b>{e(n)}</b><div class="wbimg"><img loading="lazy" src="{img64(J("screenshots","wettbewerb",f"{k}-1440.jpg"), 520, 60)}" alt="{e(n)} Desktop"><img loading="lazy" src="{img64(J("screenshots","wettbewerb",f"{k}-390.jpg"), 160, 60)}" alt="{e(n)} Mobil"></div></td><td>{e(a)}</td><td>{e(b)}</td></tr>' for k, n, a, b in WB if os.path.exists(J('screenshots', 'wettbewerb', f'{k}-1440.jpg')))
S.append(f'''<section id="wettbewerb"><h2>8 · Wettbewerbsvergleich</h2><p class="hint">Gefordert waren 3–5 Hamburger Bauunternehmen. Die Netzwerkfreigabe dieser Umgebung erlaubt nur quirling.de, otto-wulff.de und markgraf-bau.de. Weitere Firmen konnten <b>nicht geprüft</b> werden; bitte URLs nennen und den Zugriff freigeben (siehe offene Fragen).</p>
<table class="t wb"><thead><tr><th>Website</th><th>Beobachtung</th><th>Vergleich / Abheben</th></tr></thead><tbody>{wb_rows}</tbody></table>
<p class="hint"><b>Wo Quirling sich abheben kann:</b> Familie mit Namen und Gesichtern, eigene Poliere und eigene Schalung, kurze Wege, klare Leistungsseiten. Genau das sollte in Hero, Titeln und Werten stehen statt „Persönlich · Verbindlich · Sorgfältig“.</p></section>''')

# Katalog
kat_rows = ''.join(f'<tr><td>{i}</td><td><b>{prio(b)}</b></td><td>{chip(b)}</td><td>{e(b["schwere"])}</td><td>{b["kat"]}</td><td>{e(b["vorschlag"])}</td><td>{b["aufwand"]}</td><td>{"✓" if quick(b) else ""}</td></tr>' for i, b in enumerate(massn, 1))
S.append(f'<section id="katalog"><h2>9 · Maßnahmenkatalog</h2><p class="hint">Sortiert nach Schweregrad, dann Wirkung, dann Aufwand. P1 = vor dem Livegang, P2 = in den ersten Wochen, P3 = Feinschliff. Bitte IDs auswählen.</p><table class="t"><thead><tr><th>#</th><th>Prio</th><th>ID</th><th>Schwere</th><th>Kat.</th><th>Maßnahme</th><th>Aufwand</th><th>Quick Win</th></tr></thead><tbody>{kat_rows}</tbody></table></section>')

# Offen
S.append('''<section id="offen"><h2>10 · Nicht geprüft / offene Fragen</h2><div class="cols2"><div><h3>Nicht geprüft</h3><ul>
<li><b>Live-URL</b> (melvin2-2.github.io) ist aus dieser Umgebung gesperrt. Geprüft wurde der identische Build lokal (<code>astro preview</code>). Ladezeiten live können abweichen (Kompression, CDN).</li>
<li><b>INP</b> und echte Nutzerdaten (Core Web Vitals im Feld): nur nach Livegang über PageSpeed Insights / Search Console.</li>
<li><b>Formularversand</b> nicht real ausgelöst (wie vereinbart). Geprüft: Felder, Labels, Pflichtangaben, Fallback-Code.</li>
<li><b>Google-Unternehmensprofil</b>: NAP-Abgleich nicht möglich (Google gesperrt). NAP der neuen und alten Website sind identisch.</li>
<li><b>Wettbewerber</b> außer Otto Wulff und Markgraf: Zugriff gesperrt.</li>
<li><b>Rechtliche Vollständigkeit</b> von Impressum und Datenschutz: nur technisch geprüft, <b>rechtlich prüfen lassen</b>.</li>
<li>Screenreader-Test mit echtem Gerät (VoiceOver/NVDA): nicht durchgeführt, nur axe-core und Tastatur.</li>
<li>Kategorie <b>W</b>: im Auftrag genannt, aber nicht definiert.</li></ul></div>
<div><h3>Fragen an dich</h3><ol>
<li>Bürozeiten und typische Antwortzeit auf Anfragen?</li>
<li>Typische Projektgrößen (Wohneinheiten, m², Geschosse) und wie viele Baustellen parallel?</li>
<li>Aktuelle Nachweise (Freistellungsbescheinigung, SOKA-BAU, BG Bau …) mit Datum? Präqualifikation, Innung, Verbandsmitgliedschaft?</li>
<li>Fertigstellungsjahre der 3 Projekte ohne Datum? Projekte nach 2019? Dürfen Auftraggeber genannt werden?</li>
<li>Neuere schlüsselfertige Projekte als 1997 / 2002?</li>
<li>Gibt es ein Denkmalschutz-Projekt als Beleg für die Umbau-Seite?</li>
<li>Name(n) und Freigabe für Polier(e) auf der Team-Seite? Durchwahlen der Ansprechpartner?</li>
<li>Stundenlohn oder Spanne, Wochenstunden, Urlaub für die Stelle? Bildet ihr aus (Azubis)?</li>
<li>Gibt es Kundenstimmen mit Freigabe?</li>
<li>Ist „Keine Schnittstellen zu weiteren Firmen“ (Rohbau) genau so zutreffend?</li>
<li>Welcher Formulardienst ist gewünscht? Und: Umzug auf ein Hosting mit echten 301-Weiterleitungen denkbar?</li>
<li>Welche 1–3 weiteren Wettbewerber soll ich vergleichen (URLs)?</li></ol></div></div></section>''')

TOC = ''.join(f'<a href="#{i}">{t}</a>' for i, t in [('fazit', 'Kurzfazit'), ('scorecard', 'Scorecard'), ('matrix', 'Matrix'), ('seiten', 'Seiten'), ('system', 'Typo · Farben · Nav'), ('texte', 'Texte'), ('seo', 'SEO'), ('wettbewerb', 'Wettbewerb'), ('katalog', 'Maßnahmen'), ('offen', 'Offen')])
CSS = '''
:root{--ink:#16193a;--mut:#5b6188;--line:#dfe2ef;--bg:#f6f7fb;--card:#fff;--blue:#3948a4}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
header.top{background:#121735;color:#fff;padding:28px 32px 18px}header.top h1{margin:0;font-size:30px;letter-spacing:-.01em}header.top p{margin:4px 0 0;color:#c9d0f5}
nav.toc{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid var(--line);display:flex;gap:4px;flex-wrap:wrap;padding:8px 24px}nav.toc a{padding:6px 10px;border-radius:6px;color:var(--blue);text-decoration:none;font-weight:600;font-size:14px}nav.toc a:hover{background:#e6e9f6}
main{max-width:1320px;margin:0 auto;padding:8px 24px 80px}section{margin:40px 0}h2{font-size:26px;border-bottom:3px solid var(--blue);padding-bottom:6px}h3{font-size:20px;margin:28px 0 10px}h4{margin:8px 0}
.hint{color:var(--mut);font-size:15px}code{font:13px/1.4 ui-monospace,Menlo,Consolas,monospace;background:#eef0f8;padding:1px 4px;border-radius:3px;word-break:break-word}
.fazit-top{display:flex;gap:24px;align-items:center;background:#fff;border:1px solid var(--line);padding:20px;border-radius:10px}.note-big{white-space:nowrap;font-size:64px;font-weight:800;color:var(--blue);line-height:1}.note-big small{font-size:22px;color:var(--mut)}.urteil{font-size:19px;margin:0}
.cols3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:20px}.cols3>div,.cols2>div{background:#fff;border:1px solid var(--line);border-radius:10px;padding:4px 20px 12px}.cols2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:900px){.cols3,.cols2{grid-template-columns:1fr}}
.cols3 li{margin:6px 0}
.chip{display:inline-block;background:var(--c);color:#fff;font:700 12px/1 system-ui;padding:5px 8px;border-radius:12px;margin:2px;white-space:nowrap}a .chip:hover{outline:2px solid var(--ink)}
.chip[style*="e6c300"]{color:#2a2a00}.legende{margin-top:16px}
table.t{width:100%;border-collapse:collapse;background:#fff;font-size:14.5px}table.t th,table.t td{border:1px solid var(--line);padding:8px 10px;vertical-align:top;text-align:left}table.t th{background:#eef0f8;font-size:13px}
.kk{font-weight:800;font-size:18px;color:var(--blue);text-align:center}.sc{white-space:nowrap;width:170px}.bar{display:inline-block;width:110px;height:12px;background:#eceef6;border-radius:6px;vertical-align:middle;margin-right:8px;overflow:hidden}.bar span{display:block;height:100%}.ids{font-size:13px;color:var(--mut);width:150px}
.mx{display:grid;grid-template-columns:28px 80px repeat(3,1fr);gap:6px}.mx-y{grid-row:1/5;writing-mode:vertical-rl;transform:rotate(180deg);text-align:center;color:var(--mut);font-weight:700}.mx-h,.mx-r{font-weight:700;color:var(--mut);align-self:center}.mx-c{background:#fff;border:1px solid var(--line);border-radius:8px;min-height:90px;padding:8px}.mx-c.qwc{background:#e3f6e7;border-color:#2f9e44}
.page{background:#fff;border:1px solid var(--line);border-radius:10px;padding:4px 20px 20px;margin:24px 0}.page h3 small{color:var(--mut);font-weight:400;font-size:14px}
.shots{display:grid;grid-template-columns:1fr 410px;gap:16px}@media(max-width:1000px){.shots{grid-template-columns:1fr}}
.shot{margin:0}.shot figcaption{font-size:13px;color:var(--mut);margin-bottom:4px}.scroll{max-height:720px;overflow:auto;border:1px solid var(--line);border-radius:6px;background:#eee}.scroll img{display:block;width:100%}.shot.m .scroll img{width:390px}
.scroll.sm{max-height:520px}.scroll.wide{max-height:none}
.bfs{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:12px;margin-top:16px}
.bf{border:1px solid var(--line);border-left:6px solid var(--c);border-radius:8px;padding:10px 14px;background:#fff;scroll-margin-top:60px}.bf:target{box-shadow:0 0 0 3px var(--c)}
.bf header{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:6px}.pin{background:var(--c);color:#fff;font-weight:800;font-size:13px;padding:4px 9px;border-radius:12px}.bf[style*="e6c300"] .pin{color:#2a2a00}
.tag{font-size:12px;background:#eef0f8;padding:3px 7px;border-radius:4px}.tag.qw{background:#2f9e44;color:#fff}
.bf dl{display:grid;grid-template-columns:78px 1fr;gap:4px 10px;margin:0;font-size:14.5px}.bf dt{font-weight:700;color:var(--mut)}.bf dd{margin:0}
.ex{font-size:12.5px;color:var(--mut)}.sws{display:flex;flex-wrap:wrap;gap:8px}.sw{display:flex;align-items:center;gap:6px;background:#fff;border:1px solid var(--line);padding:6px 8px;border-radius:6px}.sw span{width:26px;height:26px;border-radius:4px;border:1px solid #ccd}.sw small{color:var(--mut)}
.tree,.tree ul{list-style:none;padding-left:18px;margin:4px 0}.tree li{position:relative;padding:3px 0 3px 12px;border-left:1px solid #c4c9df}.tree li.neu{color:#2f9e44;font-weight:600}.tree li.mu{color:var(--mut)}
.vn td{width:auto}.vor{background:#fff4f2}.nach{background:#f0faf2}
.seo td{font-size:13.5px}.seo small.bad{color:#d0021b;font-weight:700}.st{padding:2px 6px;border-radius:4px;font-size:12px;font-weight:700}.st.ok{background:#e3f6e7;color:#1f6e30}.st.verbessern{background:#fff1d6;color:#8a5200}
td.good{background:#e3f6e7;font-weight:700}td.mid{background:#fff1d6;font-weight:700}td.bad{background:#fde2e2;font-weight:700}
.wbimg{display:flex;gap:8px;align-items:flex-start;margin-top:8px}.wbimg img{border:1px solid var(--line);max-height:420px;object-fit:cover;object-position:top}.wb td{width:30%}
.mock{margin:0;background:#fff;border:1px solid var(--line);border-radius:10px;padding:10px}.mock img{width:100%;display:block;border:1px solid var(--line)}.mock figcaption{font-size:14px;margin-bottom:6px}
@media print{nav.toc{display:none}.scroll{max-height:none}}
'''
html_out = f'''<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Website-Audit Quirling</title><style>{CSS}</style></head><body>
<header class="top"><h1>Website-Audit Quirling GmbH Bauunternehmen</h1><p>Stand 14.11.2026 · geprüft: lokaler Build des Branches claude/ecstatic-clarke-jrzy4h (13 Seiten, 1440 / 768 / 390 px) · UX/UI, Text, Local SEO, Technik</p></header>
<nav class="toc">{TOC}</nav><main>{''.join(S)}</main></body></html>'''
open(J('report.html'), 'w').write(html_out)

# massnahmen.md
md = ['# Maßnahmen Website-Audit Quirling', '', f'Gesamtnote {str(round(GESAMT,1)).replace(".",",")} / 5 · {len(massn)} Maßnahmen · sortiert nach Priorität. Details und Screenshots: `audit/report.html`.', '', 'P1 = vor dem Livegang · P2 = erste Wochen · P3 = Feinschliff · QW = Quick Win', '']
for p in ['P1', 'P2', 'P3']:
    md.append(f'## {p}'); md.append('')
    for b in [x for x in massn if prio(x) == p]:
        md.append(f"- [ ] **{b['id']}** ({b['schwere']}, Kat. {b['kat']}, Aufwand {b['aufwand']}{', QW' if quick(b) else ''}): {b['vorschlag']}  \n  Dateien: `{b['dateien']}`")
    md.append('')
md.append('## So lassen (gut gelöst)'); md.append('')
for b in [x for x in B if x['schwere'] == 'gut']:
    md.append(f"- {b['id']}: {b['was']}")
open(J('massnahmen.md'), 'w').write('\n'.join(md) + '\n')
print('ok', os.path.getsize(J('report.html')) // 1024, 'KB', len(massn), 'Maßnahmen', f'{GESAMT:.2f}')
