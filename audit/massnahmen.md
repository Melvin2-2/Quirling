# Maßnahmen Website-Audit Quirling

Gesamtnote 3,2 / 5 · 41 Maßnahmen · sortiert nach Priorität. Details und Screenshots: `audit/report.html`.

P1 = vor dem Livegang · P2 = erste Wochen · P3 = Feinschliff · QW = Quick Win

## P1

- [ ] **KONTAKT-01** (kritisch, Kat. S, Aufwand S, QW): Formulardienst anbinden (z. B. Web3Forms oder Formspree, Ziel info@quirling.de), Variable PUBLIC_FORM_ENDPOINT setzen, nach dem Absenden eine Bestätigung „Danke, wir melden uns innerhalb von [X] Werktagen“ anzeigen. Dienst in der Datenschutzerklärung nennen.  
  Dateien: `src/pages/kontakt/index.astro:10, :528; TODO.md`
- [ ] **RECHT-01** (kritisch, Kat. T, Aufwand S, QW): Text fertigstellen (Formulardienst, Stand-Datum), Hinweisbox entfernen und rechtlich prüfen lassen.  
  Dateien: `src/pages/datenschutz/index.astro:8–12, :56, :89`
- [ ] **SEO-01** (kritisch, Kat. L, Aufwand S, QW): @astrojs/sitemap einbinden und public/robots.txt mit Verweis auf die Sitemap anlegen.  
  Dateien: `astro.config.mjs; public/`
- [ ] **SEO-02** (kritisch, Kat. L, Aufwand M): Weiterleitungstabelle alt → neu anlegen (Liste in audit/daten/alt-urls.txt). Auf GitHub Pages nur per Meta-Refresh möglich (Redirect.astro ist vorhanden); besser ein Hosting mit echten 301-Weiterleitungen (z. B. Netlify oder Cloudflare Pages).  
  Dateien: `src/layouts/Redirect.astro; audit/daten/alt-urls.txt`
- [ ] **RECHT-02** (kritisch, Kat. T, Aufwand S, QW): Echte USt-IdNr. eintragen (src/data/site.ts → platzhalter.ustId). Impressum rechtlich prüfen lassen.  
  Dateien: `src/data/site.ts:30; src/pages/impressum/index.astro:36`
- [ ] **SEO-03** (wichtig, Kat. L, Aufwand S, QW): Titel nach Muster „<Leistung> in Hamburg | Quirling Bauunternehmen“, z. B. „Rohbau & Stahlbetonbau in Hamburg | Quirling Bauunternehmen“, „Referenzen: Rohbau und Umbau in Hamburg | Quirling“.  
  Dateien: `src/layouts/Base.astro:31; src/data/leistungen-seiten.ts`
- [ ] **START-01** (wichtig, Kat. A, Aufwand S, QW): Claim als große Zeile behalten, darunter eine stärkere Unterzeile: „Rohbau in Beton und Stahlbeton, schlüsselfertige Häuser und Umbauten in Hamburg. Familienbetrieb seit 1992, für Bauträger, Planer und private Bauherren.“ Technisch: Claim als H1 lassen und die Unterzeile auf 20–22 px vergrößern (siehe Mockup).  
  Dateien: `src/components/HomePage.astro:120–121`
- [ ] **LEIST-01** (wichtig, Kat. F, Aufwand S, QW): Ein Satz mit belastbaren Zahlen, z. B. „Typisch für uns: Mehrfamilienhäuser bis [X] Wohneinheiten mit Tiefgarage, [Y] Baustellen parallel.“ Zahlen bitte liefern.  
  Dateien: `src/data/leistungen-seiten.ts`
- [ ] **KARR-01** (wichtig, Kat. R, Aufwand S, QW): Je Stelle: Stundenlohn oder Spanne, Wochenstunden, Urlaubstage, Tarifbindung (falls vorhanden). Eigene Kachel „Ausbildung“, wenn ihr ausbildet. JobPosting-Daten ergänzen.  
  Dateien: `src/pages/karriere/index.astro:25–100 (Stellendaten), :149 (.jobs)`
- [ ] **KARR-02** (wichtig, Kat. R, Aufwand S, QW): Zusätzlich: „Ruf einfach an: 040 / 33 46 34 19 0“ als Knopf und eine Kurzbewerbung (Name, Telefon, Beruf). Die Unterlagen kommen dann im zweiten Schritt.  
  Dateien: `src/pages/karriere/index.astro:69, :88 („So bewirbst du dich“), :143 (.steps)`
- [ ] **LOCAL-01** (wichtig, Kat. Q, Aufwand M): LocalBusiness/GeneralContractor ergänzen (openingHours, geo, logo, image, areaServed als Liste: Hamburg, Norderstedt, Buchholz i. d. N., Bad Oldesloe – die Orte aus den Referenzen), BreadcrumbList aus den sichtbaren Brotkrumen, JobPosting auf der Karriereseite.  
  Dateien: `src/layouts/Base.astro:34–50; src/components/PageHero.astro; src/pages/karriere/index.astro`

## P2

- [ ] **REF-01** (wichtig, Kat. L, Aufwand L): Statische Projektseiten /referenzen/<projekt>/ mit eigenem Title, Description und Bildern erzeugen. Das Seitenfenster bleibt als schnelle Ansicht und verlinkt auf die Projektseite.  
  Dateien: `src/pages/referenzen/index.astro; src/content/projekte/`
- [ ] **SEO-04** (wichtig, Kat. L, Aufwand S, QW): Standard-Vorschaubild (1200 × 630 px, Baustelle mit Logo) in Base.astro setzen, je Leistungsseite eigenes Bild. SITE_URL=https://quirling.de und BASE_PATH=/ beim Livegang setzen.  
  Dateien: `src/layouts/Base.astro:69; astro.config.mjs`
- [ ] **LOCAL-02** (wichtig, Kat. Q, Aufwand S, QW): Auf jeder Leistungsseite ein Satz zum Einsatzgebiet mit den Orten aus den Referenzen: „Wir bauen in ganz Hamburg und im Umland, zum Beispiel in Harburg, Norderstedt, Buchholz i. d. N. und Bad Oldesloe.“ Kontaktseite: statisches Kartenbild mit Link zu Google Maps, ohne eingebettetes iframe.  
  Dateien: `src/data/leistungen-seiten.ts; src/pages/kontakt/index.astro`
- [ ] **START-03** (wichtig, Kat. F, Aufwand S, QW): Liste unter „Was wir bauen.“ streichen. Der Absatz leitet direkt zu den drei Bändern über.  
  Dateien: `src/components/HomePage.astro:152–172`
- [ ] **START-04** (wichtig, Kat. A, Aufwand S, QW): Werte durch Belege ersetzen: „Eigene Poliere · Eigene Schalung · Kollegen seit über 30 Jahren“.  
  Dateien: `src/components/HomePage.astro:255`
- [ ] **LEIST-03** (wichtig, Kat. N, Aufwand S, QW): Mobil die dunkle Fläche hinter dem Text auf ca. 85 % Deckkraft erhöhen oder das Bild mobil unter den Text setzen.  
  Dateien: `src/components/PageHero.astro (.phero-slab, Mobil-Regel)`
- [ ] **REF-03** (wichtig, Kat. O, Aufwand S, QW): sizes auf „(min-width: 1100px) 30vw, 50vw“ ändern.  
  Dateien: `src/pages/referenzen/index.astro:80`
- [ ] **ZERT-01** (wichtig, Kat. M, Aufwand S, QW): Aktuelle PDFs einstellen, je Dokument „Stand: MM/JJJJ“ anzeigen; Präqualifikation und Mitgliedschaften (Innung, Bauindustrieverband) ergänzen, falls vorhanden.  
  Dateien: `public/downloads/; src/data/site.ts:89–112`
- [ ] **KONTAKT-02** (wichtig, Kat. I, Aufwand S, QW): „Montag bis Freitag, [7–16] Uhr. Auf Anfragen antworten wir innerhalb von [2] Werktagen.“ Zeiten bitte liefern.  
  Dateien: `src/pages/kontakt/index.astro:18, :34`
- [ ] **MOBIL-01** (wichtig, Kat. N, Aufwand S, QW): Mobil Zeilenabstand bzw. Padding der Footer-Links auf 44 px Tap-Höhe; Telefon und E-Mail als große Knöpfe.  
  Dateien: `src/components/Footer.astro`
- [ ] **VERTRAUEN-01** (wichtig, Kat. M, Aufwand S, QW): Footer und Leistungsseiten: Zeile „Freistellungsbescheinigung, SOKA-BAU, BG Bau: alle Nachweise aktuell zum Download“ mit Link. Kundenstimmen nur mit Freigabe echter Auftraggeber (Frage an dich).  
  Dateien: `src/components/Footer.astro; src/components/LeistungSeite.astro`
- [ ] **SF-01** (wichtig, Kat. M, Aufwand M): Neuere schlüsselfertige Projekte ergänzen (Frage an dich) oder das Jahr in der Kachel weglassen.  
  Dateien: `src/content/projekte/*.json (bereich)`
- [ ] **REF-02** (wichtig, Kat. M, Aufwand M): Einheitlicher Steckbrief je Projekt: Ort, Jahr, Leistung, Größenordnung (WE, m², Geschosse), Auftraggeber (sofern freigegeben). Projekte ab 2020 ergänzen (Frage an dich).  
  Dateien: `src/content/projekte/*.json; TODO.md`
- [ ] **TEAM-01** (wichtig, Kat. M, Aufwand M): Je Ansprechpartner Telefon und E-Mail als Knopf. Ergänzen: Polier(e) mit Foto und Satz „Leitet Ihre Baustelle“. Namen und Freigabe bitte liefern.  
  Dateien: `src/pages/unternehmen/team/index.astro:15–19`
- [ ] **TYPO-01** (wichtig, Kat. C, Aufwand M): Feste Skala mit 9 Stufen als CSS-Variablen (siehe Typo-Tabelle), Komponenten darauf umstellen.  
  Dateien: `src/styles/global.css; Komponenten`
- [ ] **PERF-01** (wichtig, Kat. O, Aufwand M): Film-Video erst per JavaScript starten, wenn der Abschnitt nah ist (das autoplay-Attribut hebt preload="none" auf); Hero-Poster (297 KB JPG) als WebP/AVIF; kritisches CSS einbetten. Danach live mit PageSpeed Insights nachmessen.  
  Dateien: `src/components/HomePage.astro:112, :287`

## P3

- [ ] **UEBER-01** (wichtig, Kat. P, Aufwand S): Grau auf #7d83a6 (3,5:1) anheben. Bei reduzierter Bewegung ist der Text bereits voll eingefärbt.  
  Dateien: `src/components/Werdegang.astro (.wg-ry, .wg-w)`
- [ ] **DS-02** (wichtig, Kat. D, Aufwand S): Weiche Trennung „Datenschutz&shy;erklärung“ einsetzen.  
  Dateien: `src/pages/datenschutz/index.astro:7`
- [ ] **START-02** (Feinschliff, Kat. G, Aufwand S): „Lernen Sie uns kennen“, „Wer hinter Quirling steckt“ oder „Mehr über uns“.  
  Dateien: `src/components/HomePage.astro:139`
- [ ] **START-05** (Feinschliff, Kat. E, Aufwand S): Film-Abschnitt mobil auf 100 % Bildschirmhöhe kürzen oder dort nur das Video ohne Scroll-Animation zeigen.  
  Dateien: `src/components/HomePage.astro:284, CSS .film`
- [ ] **START-06** (Feinschliff, Kat. N, Aufwand S): Mindestens 16 px.  
  Dateien: `src/components/HomePage.astro (.fg p, Mobil-Regel)`
- [ ] **SF-02** (Feinschliff, Kat. D, Aufwand S): H1 „Schlüsselfertig / bauen.“ oder Schriftgröße für lange Titel automatisch reduzieren.  
  Dateien: `src/data/leistungen-seiten.ts:59`
- [ ] **REF-04** (Feinschliff, Kat. N, Aufwand S): Mindesthöhe 44 px.  
  Dateien: `src/pages/referenzen/index.astro (.ftab)`
- [ ] **TEXT-01** (Feinschliff, Kat. G, Aufwand S): Je Seite konkret: Team „Rund zehn Leute, viele seit Jahrzehnten dabei.“; Über uns „Aus dem Gerüst des Vaters wurde 1992 ein eigener Betrieb.“  
  Dateien: `src/pages/unternehmen/index.astro:21; src/pages/unternehmen/team/index.astro:25; src/pages/karriere/index.astro:105`
- [ ] **UMBAU-01** (Feinschliff, Kat. M, Aufwand S): Denkmal-Projekt in den Referenzen benennen oder Satz kürzen: „Stadtvillen und historische Gebäude: Wir wissen, worauf es bei alter Bausubstanz ankommt.“  
  Dateien: `src/data/leistungen-seiten.ts:121`
- [ ] **KONTAKT-03** (Feinschliff, Kat. K, Aufwand S): Drei kurze Zeilen über dem Formular: „1. Sie schildern Ihr Vorhaben, gern mit Plänen. 2. Wir melden uns innerhalb von [X] Werktagen. 3. Termin vor Ort und Angebot.“  
  Dateien: `src/pages/kontakt/index.astro:60–64`
- [ ] **UEBER-02** (Feinschliff, Kat. D, Aufwand S): Über uns: „Vom Gerüst zum eigenen Betrieb.“ / „Unsere Geschichte.“ / „Drei Jahrzehnte Hamburg.“  
  Dateien: `src/components/Werdegang.astro:28`
- [ ] **TYPO-02** (Feinschliff, Kat. C, Aufwand S): Kleinste Größe 12,8 px (0,8 rem). Ungenutzte Pakete entfernen, Variable korrigieren.  
  Dateien: `package.json; src/styles/global.css:35`
- [ ] **TECH-01** (Feinschliff, Kat. O, Aufwand S): apple-touch-icon.png (180 px) und favicon-32.png ergänzen.  
  Dateien: `src/layouts/Base.astro:62; public/`
- [ ] **HEAD-01** (Feinschliff, Kat. D, Aufwand S): Als p mit Klasse oder als H2 nur einmal „Navigation“ (visuell unsichtbar) auszeichnen.  
  Dateien: `src/components/Footer.astro:30, :42, :55`

## So lassen (gut gelöst)

- START-07: Seitenkopf mit zwei klaren Knöpfen „Projekt anfragen“ und „Referenzen ansehen“, Telefon im Kopf ständig erreichbar.
- START-08: Karriere-Band „Bock auf Beton? Komm ins Team.“ direkt vor dem Footer: eigener, klar getrennter Aufruf für Bewerber.
- LEIST-02: Klare Gliederung: Aussage, drei Vorteile, acht Leistungen mit je einem Satz, „Eigene Leute. Eigenes Gerät.“, Referenzen, Anfrage.
- UEBER-03: Bauzeichnung mit Kran: eigenständig, zeigt die Kennzahlen als Gebäude, passt zur Marke.
- KARR-03: Konkrete Vorteile (Bezahlung, Firmenwagen, Baustellenausstattung, Team seit Jahrzehnten) und ausführliche Stellenanzeige mit Stichpunkten.
- TECH-02: Keine Cookies, kein Tracking, Schriften und Videos lokal, Karten nur als Link.
- A11Y-01: „Zum Inhalt springen“-Link, sichtbarer Fokusrahmen (2 px Blau) bei allen geprüften Tab-Stopps, Formularfelder mit Labels, genau eine H1 je Seite ohne übersprungene Ebenen.
- NOTFOUND-01: Fehlerseite „Hier wird noch gebaut.“ mit Wegen zu Startseite, Referenzen und Kontakt; liefert echten Status 404.
- NAV-01: Fünf Hauptpunkte (Leistungen, Referenzen, Unternehmen, Karriere, Kontakt), Telefon und „Projekt anfragen“ immer im Kopf. Jedes Ziel ist in höchstens 2 Klicks erreichbar.
