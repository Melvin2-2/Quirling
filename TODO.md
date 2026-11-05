# ToDo-Liste – Website Quirling

Alles, was auf der Website **rot gestrichelt** markiert ist, steht auch hier. Platzhalter liegen zentral in
`src/data/site.ts` (Objekt `platzhalter`) bzw. direkt an der genannten Stelle.

## Pflicht vor dem Livegang

- [ ] **USt-IdNr.** im Impressum eintragen → `src/data/site.ts` → `platzhalter.ustId`
- [ ] **Datenschutzerklärung** rechtlich prüfen lassen (Vorlage, z. B. mit eRecht24 abgleichen) → `src/pages/datenschutz/index.astro`
  - [ ] Hinweisbox oben entfernen
  - [ ] Anbieter des Formulardienstes eintragen (siehe unten)
  - [ ] „Stand: [Monat Jahr]“ setzen
- [ ] **Bildnachweis** (Fotograf/Quelle) im Impressum → `src/pages/impressum/index.astro`
- [ ] **Kontaktformular** an einen Formulardienst anbinden (GitHub Pages kann selbst keine E-Mails versenden):
  1. Kostenloses Formular bei z. B. Formspree oder Web3Forms anlegen (Ziel: info@quirling.de)
  2. In GitHub unter *Settings → Secrets and variables → Actions → Variables* die Variable
     `PUBLIC_FORM_ENDPOINT` mit der Formular-URL anlegen
  3. Bis dahin öffnet das Formular das E-Mail-Programm des Besuchers mit vorbereiteter Nachricht.

## Inhalte ergänzen

- [ ] **Bürozeiten** (Kontaktseite) → `platzhalter.buerozeiten`
- [ ] **Offene Stellen** (Karriere) → `src/pages/karriere/index.astro` → Liste `stellen`
- [ ] **Zeitstrahl prüfen** (Über uns) – rot markierte Stationen bitte bestätigen/korrigieren → `src/pages/unternehmen/index.astro`
  - 1992: „Thomas Quirling gründet das Bauunternehmen“
  - 1997: Tegelweg 51 a „viele Jahre auch unsere Firmenadresse“
  - 2019: Bergedorf (Kaufhaus & Hotel am Serrahn) und Betriebsgebäude Tilsiter Straße 174 „heute unser Firmensitz“
- [ ] **Leistungsumfang** auf den drei Leistungsseiten fachlich prüfen (z. B. Mauerwerksarbeiten, Bewehrung) → `src/data/leistungen-inhalt.ts`
- [ ] **Slogan** „Qualität, die steht.“ freigeben (ersetzt „Gebaut wird immer … bei uns mit Qualität“) → `src/data/site.ts` → `firma.slogan`

## Medien

- [ ] **Originalbilder** in hoher Auflösung liefern – aktuell werden die Bilder der alten Website (max. ca. 1440–2000 px) verwendet.
  Projektbilder: `src/assets/projects/<projekt>/01.jpg …` (01 = Titelbild)
- [x] **Firmenfilm** eingebunden (SER_Timelapse_Export): Startvideo = Drohnenflug 4:16–4:26, Film-Raute = Ausschnitt ab 3:20,
  „Film ansehen“ spielt den kompletten Film (720p) direkt von der Website – ohne YouTube.
- [ ] **Zertifikate** sind die PDFs der alten Website (Stand ca. 2017) → bei Bedarf aktuelle Versionen in `public/downloads/` austauschen
- [ ] Logo liegt als Vektor vor (aus `Logo_mit_Adressblock.pdf`). Falls es Original-Logodateien gibt (AI/EPS/SVG), gern nachliefern.

## Veröffentlichung

- [ ] Branch nach `main` mergen (der Workflow veröffentlicht bei jedem Push auf `main`)
- [ ] In GitHub: *Settings → Pages → Build and deployment → Source:* **GitHub Actions** wählen
- [ ] Optional: eigene Domain `www.quirling.de` → in *Settings → Pages → Custom domain* eintragen, beim Domain-Anbieter einen
  CNAME auf `melvin2-2.github.io` setzen und die Variablen `SITE_URL=https://www.quirling.de` und `BASE_PATH=/` anlegen.
  Alte WordPress-URLs (`/project/…`, `/unternehmen/unser-team/` …) ändern sich dabei.
