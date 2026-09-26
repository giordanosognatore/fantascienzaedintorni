import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://giordanosognatore.github.io',
  base: '/passionefantascienza',
  output: 'static',
  integrations: [sitemap()],
});
