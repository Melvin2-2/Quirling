// @ts-check
import process from 'node:process';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages: Projektseite unter https://<user>.github.io/<repo>/
// Für eine eigene Domain (z. B. quirling.de) SITE_URL=https://www.quirling.de und BASE_PATH=/ setzen.
const site = process.env.SITE_URL ?? 'https://melvin2-2.github.io';
const base = process.env.BASE_PATH ?? '/Quirling';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  image: {
    responsiveStyles: false,
  },
  devToolbar: { enabled: false },
  // Sitemap ohne Weiterleitungs- und Fehlerseiten
  integrations: [sitemap({ filter: (page) => !/\/leistungen\/$|\/404\/?$/.test(page) })],
});
