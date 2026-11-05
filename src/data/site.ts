/**
 * Zentrale Firmendaten. Alles, was hier `todo` heißt oder mit TODO markiert ist,
 * wird auf der Website als roter Platzhalter angezeigt (siehe TODO.md).
 */
export const GRUENDUNGSJAHR = 1992;
export const JAHRE_ERFAHRUNG = new Date().getFullYear() - GRUENDUNGSJAHR;

export const firma = {
  name: 'Quirling GmbH',
  langname: 'Quirling GmbH Bauunternehmen',
  slogan: ['Gebaut wird immer …', 'bei uns mit Qualität.'],
  strasse: 'Tilsiter Straße 174',
  plz: '22047',
  ort: 'Hamburg',
  telefon: '040 / 33 46 34 19 0',
  telefonHref: 'tel:+4940334634190',
  email: 'info@quirling.de',
  geschaeftsfuehrer: 'Thomas Quirling',
  registergericht: 'Amtsgericht Hamburg',
  hrb: 'HRB 49651',
  einsatzgebiet: 'Hamburg und Umgebung, weitere Regionen auf Anfrage.',
  projekteAnzahl: 150,
  mapsUrl:
    'https://www.openstreetmap.org/search?query=Tilsiter%20Stra%C3%9Fe%20174%2C%2022047%20Hamburg',
} as const;

/** Werte, die noch fehlen – erscheinen rot auf der Seite */
export const platzhalter = {
  ustId: 'DE XXX XXX XXX',
  mitarbeiter: 'XX',
  buerozeiten: 'Mo–Fr XX:XX–XX:XX Uhr',
} as const;

/** YouTube-Video mit Drohnenaufnahmen (von der bisherigen Startseite) */
export const youtubeId = 'Qis47M1qz_E';

export type NavItem = { label: string; href: string; text?: string; children?: NavItem[] };

export const leistungen = [
  {
    slug: 'rohbau',
    nr: '01',
    title: 'Rohbau & Stahlbetonbau',
    kurz: 'Unser Schwerpunkt: Rohbauten in Beton- und Stahlbetonbauweise – vom Fundament bis zur letzten Decke.',
  },
  {
    slug: 'schluesselfertiges-bauen',
    nr: '02',
    title: 'Schlüsselfertiges Bauen',
    kurz: 'Ein Ansprechpartner für das ganze Gebäude: Wir koordinieren alle Gewerke bis zur Übergabe.',
  },
  {
    slug: 'umbau-sanierung',
    nr: '03',
    title: 'Umbau & Sanierung',
    kurz: 'Erweiterungen, Umbauten und Sanierungen im Bestand – auch bei Stadtvillen und historischen Gebäuden.',
  },
] as const;

export const nav: NavItem[] = [
  {
    label: 'Leistungen',
    href: '/leistungen/',
    children: leistungen.map((l) => ({ label: l.title, href: `/leistungen/${l.slug}/`, text: l.kurz })),
  },
  { label: 'Referenzen', href: '/referenzen/' },
  {
    label: 'Unternehmen',
    href: '/unternehmen/',
    children: [
      { label: 'Über uns', href: '/unternehmen/', text: 'Seit 1992 in Hamburg: Geschichte, Werte und Arbeitsweise.' },
      { label: 'Team', href: '/unternehmen/team/', text: 'Die Menschen hinter Quirling – im Büro und auf der Baustelle.' },
      {
        label: 'Zertifikate & Downloads',
        href: '/unternehmen/zertifikate/',
        text: 'Bescheinigungen und Nachweise zum Herunterladen.',
      },
    ],
  },
  { label: 'Karriere', href: '/karriere/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

export const downloads = [
  { title: 'Freistellungsbescheinigung zum Steuerabzug FHH', file: 'freistellungsbescheinigung-zum-steuerabzug-fhh.pdf', size: '52 KB' },
  { title: 'Unbedenklichkeitsbescheinigung BG Bau', file: 'unbedenktlichkeitsbescheinigung-bg-bau.pdf', size: '48 KB' },
  { title: 'Bestätigung SOKA-BAU', file: 'bestaetigung-soka-bau.pdf', size: '36 KB' },
  { title: 'Amtsgericht Hamburg – Registernachweis', file: 'amtsgericht-hamburg-registernachweis.pdf', size: '53 KB' },
  { title: 'Versicherungsnachweis', file: 'versicherungsnachweis.pdf', size: '45 KB' },
  { title: 'Bescheinigung steuerpflichtiger Unternehmer', file: 'bescheinigung-steuerpflichtiger-unternehmer.pdf', size: '425 KB' },
  { title: 'Bescheinigung in Steuersachen (Finanzamt)', file: 'bescheinigung-in-steuersachen-finanzamt.pdf', size: '420 KB' },
] as const;

export const kategorien = ['Wohnungsbau', 'Bürogebäude', 'Industriebau', 'Häuser', 'Umbau'] as const;
