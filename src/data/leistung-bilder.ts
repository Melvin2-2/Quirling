/**
 * Bilder der Leistungen an einer Stelle, damit Startseite und Leistungsseiten dieselben zeigen.
 *   start: Bild auf der Startseite und der Leistungsübersicht
 *   hero / text: Seitenkopf und Bild neben dem Einleitungstext der Detailseite
 */
import type { ImageMetadata } from 'astro';
import { getEntry } from 'astro:content';
import rohbauWandsbek from '~/assets/site/rohbau-wandsbek.jpg';
import baustelleBewehrung from '~/assets/site/baustelle-bewehrung.jpg';

type Quelle = ImageMetadata | string; // Foto oder Projekt-ID (erstes Bild des Projekts)
const bilder: Record<string, { start: Quelle; hero: Quelle; text: Quelle }> = {
  rohbau: { start: rohbauWandsbek, hero: rohbauWandsbek, text: baustelleBewehrung },
  'schluesselfertiges-bauen': { start: 'steinwegel', hero: 'steinwegel', text: 'tegelweg' },
  'umbau-sanierung': { start: 'bellevue-59', hero: 'kinderwelt', text: 'oberstrasse' },
};

const aufloesen = async (q: Quelle) => (typeof q === 'string' ? (await getEntry('projekte', q))!.data.bilder[0]! : q);

export const leistungBild = async (slug: string, art: 'start' | 'hero' | 'text') => aufloesen(bilder[slug]![art]);
