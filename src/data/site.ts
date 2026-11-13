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
} as const;

export type NavItem = { label: string; href: string; text?: string; children?: NavItem[] };

export const leistungen = [
  {
    slug: 'rohbau',
    nr: '01',
    title: 'Rohbau & Stahlbetonbau',
    /** kurzer Text im Menü */
    menu: 'Beton und Stahlbeton, vom Fundament bis zur Decke.',
    kurz: 'Unser Schwerpunkt: Rohbauten in Beton- und Stahlbetonbauweise, vom Fundament bis zur letzten Decke.',
    picto: 'rohbau',
    stichworte: ['Ortbeton', 'Schalungsbau', 'Tiefgaragen'],
  },
  {
    slug: 'schluesselfertiges-bauen',
    nr: '02',
    title: 'Schlüssel\u00adfertiges Bauen',
    /** kurzer Text im Menü */
    menu: 'Ein Ansprechpartner bis zur Übergabe.',
    kurz: 'Ein Ansprechpartner für das ganze Gebäude: Wir koordinieren alle Gewerke bis zur Übergabe.',
    picto: 'schluessel',
    stichworte: ['Ein Ansprechpartner', 'Alle Gewerke', 'Übergabe'],
  },
  {
    slug: 'umbau-sanierung',
    nr: '03',
    title: 'Umbau & Sanierung',
    /** kurzer Text im Menü */
    menu: 'Umbauen, erweitern und sanieren im Bestand.',
    kurz: 'Erweiterungen, Umbauten und Sanierungen im Bestand, auch bei Stadtvillen und historischen Gebäuden.',
    picto: 'umbau',
    stichworte: ['Stadtvillen', 'Erweiterungen', 'Bestand'],
  },
] as const;

export const nav: NavItem[] = [
  {
    label: 'Leistungen',
    // keine eigene Übersichtsseite: führt zum Abschnitt „Was wir bauen“ auf der Startseite
    href: '/#leistungen',
    children: leistungen.map((l) => ({ label: l.title, href: `/leistungen/${l.slug}/`, text: l.menu })),
  },
  { label: 'Referenzen', href: '/referenzen/' },
  {
    label: 'Unternehmen',
    href: '/unternehmen/',
    children: [
      { label: 'Über uns', href: '/unternehmen/', text: 'Familienbetrieb in Hamburg seit 1992.' },
      { label: 'Team', href: '/unternehmen/team/', text: 'Die Menschen im Büro und auf der Baustelle.' },
      { label: 'Zertifikate & Downloads', href: '/unternehmen/zertifikate/', text: 'Alle Nachweise zum Herunterladen.' },
    ],
  },
  { label: 'Karriere', href: '/karriere/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

/** Nachweise für Auftraggeber, nach Themen gruppiert (Zertifikate-Seite) */
export const downloadGruppen = [
  {
    titel: 'Steuern',
    dokumente: [
      { title: 'Freistellungsbescheinigung zum Steuerabzug', file: 'freistellungsbescheinigung-zum-steuerabzug-fhh.pdf', size: '52 KB' },
      { title: 'Bescheinigung in Steuersachen', file: 'bescheinigung-in-steuersachen-finanzamt.pdf', size: '420 KB' },
      { title: 'Bescheinigung steuerpflichtiger Unternehmer', file: 'bescheinigung-steuerpflichtiger-unternehmer.pdf', size: '425 KB' },
    ],
  },
  {
    titel: 'Sozialkassen',
    dokumente: [
      { title: 'Unbedenklichkeitsbescheinigung BG Bau', file: 'unbedenktlichkeitsbescheinigung-bg-bau.pdf', size: '48 KB' },
      { title: 'Bestätigung SOKA-BAU', file: 'bestaetigung-soka-bau.pdf', size: '36 KB' },
    ],
  },
  {
    titel: 'Unternehmen',
    dokumente: [
      { title: 'Registernachweis Amtsgericht Hamburg', file: 'amtsgericht-hamburg-registernachweis.pdf', size: '53 KB' },
      { title: 'Versicherungsnachweis', file: 'versicherungsnachweis.pdf', size: '45 KB' },
    ],
  },
] as const;

export const downloads: { title: string; file: string; size: string }[] = downloadGruppen.flatMap((g) => [...g.dokumente]);


export const kategorien = ['Wohnungsbau', 'Bürogebäude', 'Industriebau', 'Häuser', 'Umbau'] as const;
