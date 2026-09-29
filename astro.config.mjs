import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { basePath, siteOrigin } from './site.config.mjs';

export default defineConfig({
  site: siteOrigin,
  base: basePath,
  output: 'static',
  integrations: [sitemap()],
});
