/**
 * Inhalte der drei Leistungsseiten (Vorlage: src/components/LeistungSeite.astro).
 * Grundlage: Angaben der Geschäftsführung und die Referenzprojekte.
 */
import type { LeistungDaten } from '~/components/LeistungSeite.astro';

export const rohbau: LeistungDaten = {
  slug: 'rohbau',
  title: 'Rohbau & Stahlbetonbau',
  description:
    'Rohbau in Beton und Stahlbeton in der Metropolregion Hamburg: Gründungen, Tiefgaragen, Wände, Stützen und Decken in Ortbeton. Mit eigenen Polieren, eigener Schalung und eigenem Bauhof.',
  hero: {
    title: 'Rohbau &',
    light: 'Stahlbetonbau',
    intro: 'Der Rohbau ist unser Handwerk. Seit 1992 schalen, bewehren und betonieren wir in der Metropolregion Hamburg. Solide, sauber und termingerecht.',
    alt: 'Rohbau eines mehrgeschossigen Gebäudes im Gerüst',
    pos: '50% 35%',
  },
  introTitel: ['Massiv gebaut.', 'Von Grund auf.'],
  lead: 'Rohbau ist seit 1992 unser Kern: Wohnanlagen, Mehrfamilienhäuser mit Tiefgarage, Büro- und Lagergebäude in Beton und Stahlbeton. Für Bauträger, Projektentwickler und private Bauherren.',
  usp: [
    { t: 'Der ganze Rohbau aus einer Hand', d: 'Gründung, Tragwerk und Mauerwerk liegen bei uns. Keine Schnittstellen zu weiteren Firmen, ein Ansprechpartner für alles.' },
    { t: 'Termine, die halten', d: 'Wir planen den Ablauf realistisch und sagen früh, wenn etwas klemmt. Darauf können sich Bauherr und Folgegewerke verlassen.' },
    { t: 'Ein Partner für Ihre Planer', d: 'Mit Architekten und Tragwerksplanern klären wir Details, bevor sie auf der Baustelle zum Problem werden.' },
  ],
  umfangTitel: ['Was wir', 'für Sie bauen.'],
  umfang: [
    { t: 'Gründung und Bodenplatten', d: 'Streifen- und Einzelfundamente, Bodenplatten und Gründungen nach Statik.' },
    { t: 'Tiefgaragen und Keller', d: 'Untergeschosse und Tiefgaragen, auf Wunsch als Weiße Wanne in WU-Beton.' },
    { t: 'Wände, Stützen, Decken', d: 'Tragwerk in Ortbeton, geschalt mit unserer eigenen Systemschalung.' },
    { t: 'Sichtbeton', d: 'Betonflächen, die sichtbar bleiben, mit sauberer Schalung und klaren Kanten.' },
    { t: 'Bewehrung', d: 'Bewehrung nach Plan, sorgfältig verlegt, bevor betoniert wird.' },
    { t: 'Halbfertigteile', d: 'Elementdecken und Doppelwände, wo sie Bauzeit sparen.' },
    { t: 'Mauerwerk', d: 'Tragende und nichttragende Wände im Zusammenspiel mit dem Betonbau.' },
    { t: 'Grundleitungen und Erdarbeiten', d: 'Grundleitungen unter der Bodenplatte und kleinere Erdarbeiten.' },
  ],
  eigenTitel: ['Eigene Leute.', 'Eigenes Gerät.'],
  eigen: [
    { t: 'Eigene Poliere', d: 'Auf jeder Baustelle führt ein Polier aus unserem Team. Sie haben einen festen Ansprechpartner, der Ihr Projekt kennt.' },
    { t: 'Eigene Systemschalung', d: 'Wir schalen mit eigenem Material. Das macht uns unabhängig und hält den Zeitplan stabil.' },
    { t: 'Eigener Bauhof', d: 'Lager, Werkstatt und Fuhrpark: Material und Gerät sind da, wenn die Baustelle sie braucht.' },
  ],
  eigenAlt: 'Systemschalung mit Quirling-Logo auf einer Baustelle',
  refsLabel: 'Alle Rohbau-Referenzen',
  cta: ['Sie planen einen Rohbau', 'in der Metropolregion Hamburg?'],
  ctaBtn: 'Rohbau anfragen',
};

export const schluesselfertig: LeistungDaten = {
  slug: 'schluesselfertiges-bauen',
  title: 'Schlüsselfertiges Bauen',
  description:
    'Schlüsselfertig bauen in der Metropolregion Hamburg: Ein- und Doppelhäuser sowie Mehrfamilienhäuser, mit Partner-Architekten, festen Partnerfirmen, Festpreis und festem Übergabetermin.',
  hero: {
    title: 'Schlüssel­fertiges',
    light: 'Bauen',
    intro: 'Auf Wunsch übernehmen wir Ihr Bauvorhaben komplett. Vom Entwurf bis zur Schlüsselübergabe, mit einem festen Ansprechpartner an Ihrer Seite.',
    alt: 'Schlüsselfertig gebaute Doppelhäuser am Steinwegel',
  },
  introTitel: ['Ihr Haus.', 'Schlüsselfertig.'],
  lead: 'Vom ersten Entwurf bis zum Einzug: Wir bauen Ein- und Doppelhäuser für private Bauherren sowie Mehrfamilienhäuser schlüsselfertig. Den Rohbau führen wir selbst aus, alles Weitere koordinieren wir.',
  usp: [
    { t: 'Ein Ansprechpartner für alles', d: 'Sie sprechen mit einer Person, die Ihr Haus von der Planung bis zur Übergabe begleitet.' },
    { t: 'Festpreis und fester Termin', d: 'Preis und Übergabetermin stehen im Vertrag. So können Sie sicher planen und finanzieren.' },
    { t: 'Rohbau in eigener Hand', d: 'Das Fundament Ihres Hauses bauen wir mit eigener Mannschaft. Darauf baut alles Weitere auf.' },
  ],
  umfangTitel: ['Alles aus', 'einer Hand.'],
  umfang: [
    { t: 'Planung', d: 'Entwurf und Genehmigungsplanung mit unseren Partner-Architekten.' },
    { t: 'Rohbau', d: 'Fundamente, Wände und Decken in eigener Ausführung.' },
    { t: 'Dach, Fenster und Fassade', d: 'Ausgeführt von festen Partnerfirmen, abgestimmt auf den Rohbau.' },
    { t: 'Haustechnik', d: 'Elektro, Sanitär und Heizung von eingespielten Fachbetrieben.' },
    { t: 'Innenausbau', d: 'Estrich, Putz, Trockenbau und Böden bis zur Fertigstellung.' },
    { t: 'Koordination aller Gewerke', d: 'Wir stimmen Termine und Abläufe ab, damit ein Gewerk ins nächste greift.' },
    { t: 'Termin- und Qualitätskontrolle', d: 'Wir prüfen die Arbeiten laufend auf der Baustelle und halten Sie auf dem Stand.' },
    { t: 'Abnahme und Übergabe', d: 'Gemeinsame Abnahme, dann bekommen Sie die Schlüssel.' },
  ],
  eigenTitel: ['Feste Partner.', 'Fester Preis.'],
  eigen: [
    { t: 'Partner-Architekten', d: 'Für die Planung arbeiten wir mit Architekturbüros zusammen, die unsere Bauweise kennen.' },
    { t: 'Eingespielte Fachbetriebe', d: 'Im Ausbau setzen wir auf feste Partnerfirmen. Man kennt sich, die Abläufe sitzen.' },
    { t: 'Festpreis und Übergabetermin', d: 'Was im Vertrag steht, gilt: der Preis und der Tag, an dem Sie einziehen.' },
  ],
  eigenAlt: 'Schlüsselfertig gebautes Doppelhaus am Tegelweg',
  refsLabel: 'Alle schlüsselfertigen Referenzen',
  cta: ['Sie planen ein Haus', 'in der Metropolregion Hamburg?'],
  ctaBtn: 'Neubau anfragen',
};

export const umbau: LeistungDaten = {
  slug: 'umbau-sanierung',
  title: 'Umbau & Sanierung',
  description:
    'Umbau, Erweiterung und Sanierung im Bestand in der Metropolregion Hamburg: Stadtvillen, Stadthäuser und historische Gebäude. Abfangungen, Unterfangungen, Anbauten, Aufstockungen, Beton- und Mauerwerkssanierung.',
  hero: {
    title: 'Umbau &',
    light: 'Sanierung',
    intro: 'Bauen im Bestand verlangt Erfahrung und Fingerspitzengefühl. Wir bauen um, erweitern und sanieren, von der Stadtvilla bis zum historischen Gebäude.',
    alt: 'Umbau und Erweiterung des Alsterpalais',
  },
  introTitel: ['Mit Respekt', 'vor dem Bestand.'],
  lead: 'Stadtvillen, Stadthäuser, historische Gebäude und Mehrfamilienhäuser: Wir bauen um, erweitern und sanieren im Bestand. Mit dem Wissen aus dem Rohbau und dem Blick für das, was schon da ist.',
  usp: [
    { t: 'Erst verstehen, dann bauen', d: 'Wir schauen genau hin, bevor wir eingreifen. So gibt es später weniger Überraschungen.' },
    { t: 'Tragwerk im Griff', d: 'Abfangen, unterfangen, Öffnungen schaffen: Eingriffe ins Tragwerk gehören zu unserem Handwerk.' },
    { t: 'Eng abgestimmt', d: 'Mit Eigentümern, Architekten und Nachbarn halten wir kurze Wege und informieren laufend.' },
  ],
  umfangTitel: ['Was wir', 'im Bestand leisten.'],
  umfang: [
    { t: 'Umbauten', d: 'Grundrisse ändern, Räume neu ordnen, Nutzungen anpassen.' },
    { t: 'Anbauten und Erweiterungen', d: 'Neue Gebäudeteile, die sich sauber an den Bestand anschließen.' },
    { t: 'Aufstockungen', d: 'Zusätzliche Geschosse auf bestehenden Gebäuden.' },
    { t: 'Rückbau und Durchbrüche', d: 'Wände öffnen und Bauteile zurückbauen, kontrolliert und sauber.' },
    { t: 'Abfangungen', d: 'Tragende Wände und Decken sicher abfangen, wenn neue Öffnungen entstehen.' },
    { t: 'Unterfangungen', d: 'Bestehende Fundamente unterfangen, etwa für neue Keller oder Anbauten.' },
    { t: 'Betonsanierung', d: 'Schäden an Beton und Bewehrung fachgerecht instand setzen.' },
    { t: 'Mauerwerkssanierung', d: 'Risse und Schäden im Mauerwerk dauerhaft beheben.' },
  ],
  eigenTitel: ['Altbau kennen.', 'Sauber arbeiten.'],
  eigen: [
    { t: 'Erfahrung mit Altbau', d: 'Stadtvillen und historische Gebäude, auch unter Denkmalschutz: Wir wissen, worauf es bei alter Bausubstanz ankommt.' },
    { t: 'Schutz des Bestands', d: 'Was erhalten bleibt, schützen wir sorgfältig, vom Treppenhaus bis zur Fassade.' },
    { t: 'Rücksicht auf Nachbarn', d: 'Eine aufgeräumte Baustelle und klare Absprachen halten Lärm und Ärger gering.' },
  ],
  eigenAlt: 'Umgebaute Stadtvilla in der Oberstraße',
  refsLabel: 'Alle Umbau-Referenzen',
  cta: ['Sie planen einen Umbau', 'in der Metropolregion Hamburg?'],
  ctaBtn: 'Umbau anfragen',
};
