import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projekte = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projekte' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Kurzbeschreibung der erbrachten Leistung */
      leistung: z.string(),
      /** Gebäudetyp (Filter auf der Referenzseite) */
      kategorien: z.array(z.enum(['Wohnungsbau', 'Bürogebäude', 'Industriebau', 'Häuser', 'Umbau'])),
      /** Leistungsbereich -> Verknüpfung mit den Leistungsseiten */
      bereich: z.enum(['rohbau', 'schluesselfertiges-bauen', 'umbau-sanierung']),
      jahr: z.number().nullable().optional(),
      fakten: z.array(z.object({ label: z.string(), value: z.string() })),
      bilder: z.array(image()).min(1),
      /** Reihenfolge auf der Startseite (1 = zuerst). Ohne Wert: nicht auf der Startseite. */
      highlight: z.number().optional(),
    }),
});

export const collections = { projekte };
