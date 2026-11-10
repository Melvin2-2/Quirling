/**
 * Zentrale Firmendaten. Alles, was hier `todo` heißt oder mit TODO markiert ist,
 * wird auf der Website als roter Platzhalter angezeigt (siehe TODO.md).
 */
export const GRUENDUNGSJAHR = 1992;
export const JAHRE_ERFAHRUNG = new Date().getFullYear() - GRUENDUNGSJAHR;

export const firma = {
  name: 'Quirling GmbH',
  langname: 'Quirling GmbH Bauunternehmen',
  slogan: 'Was wir zusagen, steht.',
  mitarbeiter: 10,
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
  buerozeiten: 'Mo–Fr XX:XX–XX:XX Uhr',
} as const;

export type NavItem = { label: string; href: string; text?: string; children?: NavItem[] };

export const leistungen = [
  {
    slug: 'rohbau',
    nr: '01',
    title: 'Rohbau & Stahlbetonbau',
    kurz: 'Unser Schwerpunkt: Rohbauten in Beton- und Stahlbetonbauweise, vom Fundament bis zur letzten Decke.',
    picto: 'rohbau',
    stichworte: ['Ortbeton', 'Schalungsbau', 'Tiefgaragen'],
  },
  {
    slug: 'schluesselfertiges-bauen',
    nr: '02',
    title: 'Schlüssel\u00adfertiges Bauen',
    kurz: 'Ein Ansprechpartner für das ganze Gebäude: Wir koordinieren alle Gewerke bis zur Übergabe.',
    picto: 'schluessel',
    stichworte: ['Ein Ansprechpartner', 'Alle Gewerke', 'Übergabe'],
  },
  {
    slug: 'umbau-sanierung',
    nr: '03',
    title: 'Umbau & Sanierung',
    kurz: 'Erweiterungen, Umbauten und Sanierungen im Bestand, auch bei Stadtvillen und historischen Gebäuden.',
    picto: 'umbau',
    stichworte: ['Stadtvillen', 'Erweiterungen', 'Bestand'],
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
      { label: 'Team', href: '/unternehmen/team/', text: 'Die Menschen hinter Quirling, im Büro und auf der Baustelle.' },
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

/** Nachweise für Auftraggeber, nach Themen gruppiert (Zertifikate-Seite) */
export const downloadGruppen = [
  {
    titel: 'Steuern',
    text: 'Bescheinigungen des Finanzamts, unter anderem zum Steuerabzug bei Bauleistungen.',
    dokumente: [
      { title: 'Freistellungsbescheinigung zum Steuerabzug', file: 'freistellungsbescheinigung-zum-steuerabzug-fhh.pdf', size: '52 KB' },
      { title: 'Bescheinigung in Steuersachen', file: 'bescheinigung-in-steuersachen-finanzamt.pdf', size: '420 KB' },
      { title: 'Bescheinigung steuerpflichtiger Unternehmer', file: 'bescheinigung-steuerpflichtiger-unternehmer.pdf', size: '425 KB' },
    ],
  },
  {
    titel: 'Sozialkassen',
    text: 'Nachweise der Berufsgenossenschaft und der Sozialkasse der Bauwirtschaft.',
    dokumente: [
      { title: 'Unbedenklichkeitsbescheinigung BG Bau', file: 'unbedenktlichkeitsbescheinigung-bg-bau.pdf', size: '48 KB' },
      { title: 'Bestätigung SOKA-BAU', file: 'bestaetigung-soka-bau.pdf', size: '36 KB' },
    ],
  },
  {
    titel: 'Unternehmen',
    text: 'Handelsregister und Versicherungsschutz der Quirling GmbH.',
    dokumente: [
      { title: 'Registernachweis Amtsgericht Hamburg', file: 'amtsgericht-hamburg-registernachweis.pdf', size: '53 KB' },
      { title: 'Versicherungsnachweis', file: 'versicherungsnachweis.pdf', size: '45 KB' },
    ],
  },
] as const;

export const downloads: { title: string; file: string; size: string }[] = downloadGruppen.flatMap((g) => [...g.dokumente]);

/** alle Nachweise in einer Datei (wird mit scripts/zip-downloads.py erzeugt) */
export const downloadsZip = { file: 'quirling-nachweise.zip', size: '1 MB' };

export const kategorien = ['Wohnungsbau', 'Bürogebäude', 'Industriebau', 'Häuser', 'Umbau'] as const;
