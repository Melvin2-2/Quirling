# Umsetzung Audit, Stand Runde 1

Lokaler Arbeitsstand: Branch `umsetzung/audit-runde-1` (nicht gepusht, nicht live).
Sicherung als Patch-Serie: `audit/umsetzung/runde1.mbox` (je Maßnahme ein Commit, ID in der Nachricht).

## Umgesetzt (Freigabe aus der Abnahme)
START-06, SF-02, REF-04, UEBER-02, TEXT-01, DS-02, SEO-01, REF-03, PERF-01, TECH-01

## Messung (Lighthouse lokal, vorher → nachher, mobil)
| Seite | Leistung | LCP | Daten |
|---|---|---|---|
| Startseite | 70 → 85 | 6,9 s → 4,3 s | 4,3 → 2,2 MB |
| Referenzen | 69 → 89 | 5,9 s → 3,7 s | 3,3 → 1,5 MB |
| Über uns | 81 → 94 | 4,0 s → 3,0 s | 0,6 → 0,4 MB |
| Team | 78 → 96 | 4,5 s → 2,7 s | 0,7 → 0,5 MB |

axe-core (13 Seiten, Desktop + Mobil): unverändert, keine neuen Verstöße.
Rohdaten: `audit/daten/runde1/`.

## Wartet
- RECHT-01, RECHT-02: Texte vom Kunden („kommt“)
- Runde 2 zur Abnahme: LOCAL-02 (Karte), LEIST-03 (Varianten A/B/C), SEO-03, SEO-04, KONTAKT-01 (Weg wählen)
  Entwurf als Patch: `audit/entwurf/runde2.mbox`
- Veröffentlichung nur nach ausdrücklicher Freigabe.
