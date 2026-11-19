# Korrektur-Artefakt

Artefakt: https://claude.ai/artifact/A48BqW3xoYJKmxLWq3vhmT

Neu erzeugen (nach Änderungen an der Website):

1. `BASE_PATH=/__QB__ npx astro build --outDir <arbeitsordner>/raw`
2. Dateien dieses Ordners nach `<arbeitsordner>` kopieren, dann `node annotate.cjs` und `node make.cjs`
3. `<arbeitsordner>/pub/index.html` mit den Dateien aus `pub/` (site/**, texte.json) auf dieselbe Artefakt-URL veröffentlichen, veraltete Dateien mit `null` entfernen (höchstens 511 Dateien je Version).

Datenbank des Artefakts: `texte/{kennung}` (Status je Text), `verlauf`, `anregungen`, `freigabe/{seite}` (nur Inhaber).
