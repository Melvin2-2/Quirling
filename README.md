# Quirling GmbH Bauunternehmen – Website

Neue Website der Quirling GmbH, gebaut mit [Astro](https://astro.build). Inhalte und Bilder stammen in der ersten Version
von der bisherigen WordPress-Seite quirling.de.

**Offene Punkte:** siehe [TODO.md](TODO.md) (auf der Seite rot markiert).

## Lokal starten

```bash
npm install
npm run dev        # Entwicklungsserver: http://localhost:4321/Quirling/
npm run build      # statische Seite nach dist/
npm run preview    # gebaute Seite ansehen
```

## Aufbau

| Bereich | Datei/Ordner |
| --- | --- |
| Firmendaten, Navigation, Platzhalter, Downloads | `src/data/site.ts` |
| Texte der Leistungsseiten | `src/data/leistungen-inhalt.ts` |
| Referenzprojekte (eine JSON-Datei pro Projekt) | `src/content/projekte/` |
| Projektbilder (`01.jpg` = Titelbild) | `src/assets/projects/<projekt>/` |
| Team- und Seitenbilder | `src/assets/team/`, `src/assets/site/` |
| Hero-Video, PDFs | `public/video/`, `public/downloads/` |
| Seiten | `src/pages/` |
| Designsystem (Farben, Schriften) | `src/styles/global.css` |
| Scroll-Animationen | `src/scripts/motion.ts` |

### Neues Referenzprojekt anlegen

1. Bilder nach `src/assets/projects/mein-projekt/01.jpg, 02.jpg …` kopieren
2. `src/content/projekte/mein-projekt.json` anlegen (Vorlage: eine bestehende Datei kopieren)
3. `"highlight": 1–6` setzen, wenn das Projekt auf der Startseite erscheinen soll

## Seitenstruktur

- Start
- Leistungen → Rohbau & Stahlbetonbau · Schlüsselfertiges Bauen · Umbau & Sanierung
- Referenzen (Filter nach Gebäudetyp) → 37 Projektseiten
- Unternehmen → Über uns (mit Zeitstrahl) · Team · Zertifikate & Downloads
- Karriere
- Kontakt
- Impressum · Datenschutz

## Design

- Farben aus dem Logo: Blau `#3948A4`, Grau `#868484`, dazu Navy `#121735` und warmes Off-White
- Schriften (lokal eingebunden, DSGVO-konform):
  **Archivo** (Überschriften, breiter Schnitt) · **Source Sans 3** (Fließtext) · **Tenor Sans** (Slogan – nah an der Hausschrift Optima)
- Die Raute aus dem Logo wird als grafisches Motiv wiederverwendet
- Animationen: GSAP + ScrollTrigger, Smooth Scrolling mit Lenis; bei „Bewegung reduzieren“ im Betriebssystem werden sie abgeschaltet

## Veröffentlichung

GitHub Actions baut die Seite bei jedem Push auf `main` und veröffentlicht sie auf GitHub Pages
(`.github/workflows/deploy.yml`). Einmalig in den Repository-Einstellungen unter *Pages* die Quelle **GitHub Actions** wählen.
