/**
 * Inhalte der Leistungsseiten.
 * Grundlage: Texte der bisherigen Website + Angaben aus den Referenzprojekten.
 * Die Listen „Leistungsumfang“ bitte fachlich prüfen (siehe TODO.md).
 */
export type LeistungInhalt = {
  slug: 'rohbau' | 'schluesselfertiges-bauen' | 'umbau-sanierung';
  eyebrow: string;
  title: string;
  intro: string;
  heroProjekt: string;
  bildProjekt: string;
  absaetze: string[];
  umfang: string[];
  gebaeude: string[];
};

export const leistungenInhalt: LeistungInhalt[] = [
  {
    slug: 'rohbau',
    eyebrow: 'Leistung 01',
    title: 'Rohbau & Stahlbetonbau',
    intro:
      'Die Erstellung von Rohbauten ist unser Schwerpunkt, speziell im Beton- und Stahlbetonbau mit Schalungsbau. Hier liegt seit 1992 unser Handwerk.',
    heroProjekt: 'grosse-johannisstrasse',
    bildProjekt: 'beim-alten-schuetzenhof',
    absaetze: [
      'Seit über drei Jahrzehnten beschäftigen wir uns überwiegend mit Rohbauarbeiten. Wir haben in Hamburg und Umgebung Rohbauten für Mehrfamilienhäuser und Wohnanlagen mit Tiefgaragen, für Büro- und Geschäftshäuser, für mehrgeschossige Lagergebäude sowie für Ein-, Doppel- und Reihenhäuser erstellt.',
      'Wir setzen auf partnerschaftliche Beziehungen und stehen im ständigen Kontakt mit Bauherren, Architekten und Tragwerksplanern. Die Arbeiten werden bei uns bis zum Schluss sorgfältig ausgeführt. Auch bei komplizierteren Bauten finden wir gemeinsam eine Lösung.',
    ],
    umfang: [
      'Fundamente, Bodenplatten und Gründungen',
      'Tiefgaragen und Untergeschosse',
      'Wände, Stützen und Decken in Ortbeton',
      'Schalungsbau',
      'Bewehrungsarbeiten',
      'Mauerwerksarbeiten',
    ],
    gebaeude: ['Wohnungsbau', 'Büro- und Geschäftshäuser', 'Industrie- und Lagergebäude', 'Ein-, Doppel- und Reihenhäuser'],
  },
  {
    slug: 'schluesselfertiges-bauen',
    eyebrow: 'Leistung 02',
    title: 'Schlüsselfertiges Bauen',
    intro:
      'Auf Wunsch erstellen wir Ihr Gebäude schlüsselfertig. Vom Rohbau bis zur Übergabe, mit einem festen Ansprechpartner.',
    heroProjekt: 'steinwegel',
    bildProjekt: 'tegelweg',
    absaetze: [
      'Bei einem schlüsselfertigen Bauvorhaben haben Sie mit uns einen Ansprechpartner für das ganze Gebäude. Den Rohbau führen wir selbst aus, die weiteren Gewerke koordinieren wir und halten Sie als Bauherren laufend auf dem Stand.',
      'So sind unter anderem Doppelhäuser am Tegelweg und am Steinwegel sowie ein Betriebsgebäude in der Tilsiter Straße in Hamburg entstanden. Kommunikation wird dabei großgeschrieben: Wir stehen im ständigen Kontakt mit unseren Auftraggebern.',
    ],
    umfang: [
      'Rohbau in eigener Ausführung',
      'Koordination aller beteiligten Gewerke',
      'Termin- und Qualitätskontrolle',
      'Ein fester Ansprechpartner für Bauherren',
      'Abnahme und Übergabe',
    ],
    gebaeude: ['Ein- und Doppelhäuser', 'Betriebs- und Gewerbegebäude'],
  },
  {
    slug: 'umbau-sanierung',
    eyebrow: 'Leistung 03',
    title: 'Umbau & Sanierung',
    intro:
      'Mit unserem engagierten Team führen wir vielseitige Umbau- und Sanierungsmaßnahmen aus, von der Stadtvilla bis zum historischen Gebäude.',
    heroProjekt: 'kinderwelt',
    bildProjekt: 'oberstrasse',
    absaetze: [
      'Bauen im Bestand verlangt Erfahrung und Sorgfalt. Wir haben Stadtvillen an der Bellevue, in der Oberstraße und in der Abteistraße umgebaut, ein Stadthaus in der Gustav-Freytag-Straße erweitert und das Alsterpalais in Alsterdorf umgebaut und erweitert.',
      'Gerade bei Umbauten zählt die enge Abstimmung mit Eigentümern, Architekten und Nachbarn. Wir arbeiten flexibel, sauber und bis zum Schluss sorgfältig. So wird aus dem Bestand wieder ein Gebäude, auf das Sie bauen können.',
    ],
    umfang: [
      'Umbauten und Erweiterungen',
      'Sanierung im Bestand',
      'Umbau von Stadtvillen und Altbauten',
      'Reparaturen am Rohbau',
    ],
    gebaeude: ['Stadtvillen', 'Stadthäuser', 'Historische Gebäude', 'Mehrfamilienhäuser'],
  },
];
