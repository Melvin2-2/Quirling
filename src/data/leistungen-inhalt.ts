/**
 * Inhalte der Leistungsseiten.
 * Grundlage: Texte der bisherigen Website + Angaben aus den Referenzprojekten.
 * Die Listen „Leistungsumfang“ bitte fachlich prüfen (siehe TODO.md).
 * Bilder: Projekt-ID aus src/content/projekte oder ein Foto aus src/assets (siehe leistung-bilder.ts).
 */
export type LeistungInhalt = {
  slug: 'rohbau' | 'schluesselfertiges-bauen' | 'umbau-sanierung';
  title: string;
  /** Text im Seitenkopf und auf der Übersicht */
  intro: string;
  /** Überschrift über dem Einleitungstext: fett / leicht */
  introTitel: [string, string];
  absaetze: string[];
  /** Überschrift über dem Leistungsumfang: fett / leicht */
  umfangTitel: [string, string];
  umfang: string[];
  gebaeude: string[];
};

export const leistungenInhalt: LeistungInhalt[] = [
  {
    slug: 'rohbau',
    title: 'Rohbau & Stahlbetonbau',
    intro:
      'Der Rohbau ist unser Handwerk. Seit 1992 schalen, bewehren und betonieren wir in Hamburg und Umgebung. Solide, sauber und termingerecht.',
    introTitel: ['Massiv gebaut.', 'Von Grund auf.'],
    absaetze: [
      'Ob Wohnanlage mit Tiefgarage, Büro- und Geschäftshaus oder mehrgeschossiges Lagergebäude: Wir erstellen Rohbauten in Beton- und Stahlbetonbauweise mit unserem eigenen, eingespielten Team. Vom Fundament bis zur letzten Decke.',
      'Für Bauherren, Architekten und Tragwerksplaner sind wir ein verlässlicher Partner auf der Baustelle. Wir sprechen Dinge früh an, halten Absprachen ein und finden auch bei kniffligen Details gemeinsam eine gute Lösung.',
    ],
    umfangTitel: ['Was wir', 'für Sie bauen.'],
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
    title: 'Schlüsselfertiges Bauen',
    intro:
      'Auf Wunsch übernehmen wir Ihr Bauvorhaben komplett. Vom Rohbau bis zur Schlüsselübergabe, mit einem festen Ansprechpartner an Ihrer Seite.',
    introTitel: ['Ihr Haus.', 'Schlüsselfertig.'],
    absaetze: [
      'Bei einem schlüsselfertigen Bauvorhaben haben Sie mit uns einen Ansprechpartner für das ganze Gebäude. Den Rohbau führen wir selbst aus, die weiteren Gewerke koordinieren wir und halten Sie dabei laufend auf dem Stand.',
      'So sind unter anderem Doppelhäuser am Tegelweg und am Steinwegel entstanden. Termine, Qualität und Kosten behalten wir für Sie im Blick, damit Sie sich auf das Wesentliche freuen können: den Einzug.',
    ],
    umfangTitel: ['Alles aus', 'einer Hand.'],
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
    title: 'Umbau & Sanierung',
    intro:
      'Bauen im Bestand verlangt Erfahrung und Fingerspitzengefühl. Wir bauen um, erweitern und sanieren, von der Stadtvilla bis zum historischen Gebäude.',
    introTitel: ['Mit Respekt', 'vor dem Bestand.'],
    absaetze: [
      'Stadtvillen an der Bellevue, in der Oberstraße und in der Abteistraße, ein Stadthaus in der Gustav-Freytag-Straße oder das Alsterpalais in Alsterdorf: Bei Umbauten zählt jedes Detail. Wir schauen genau hin, bevor wir loslegen, und arbeiten sauber und sorgfältig bis zum Schluss.',
      'Gerade im Bestand ist die enge Abstimmung mit Eigentümern, Architekten und Nachbarn wichtig. Wir bleiben flexibel, halten Sie auf dem Laufenden und sorgen dafür, dass aus dem Bestand wieder ein Gebäude wird, auf das Sie bauen können.',
    ],
    umfangTitel: ['Was wir', 'im Bestand leisten.'],
    umfang: ['Umbauten und Erweiterungen', 'Sanierung im Bestand', 'Umbau von Stadtvillen und Altbauten', 'Reparaturen am Rohbau'],
    gebaeude: ['Stadtvillen', 'Stadthäuser', 'Historische Gebäude', 'Mehrfamilienhäuser'],
  },
];
