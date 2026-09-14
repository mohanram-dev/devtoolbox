// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  // The blog (WordPress) owns the domain root; everything from this build lives under /tools/.
  build: { assets: 'tools/_astro' },
  integrations: [react(), sitemap({ filter: (page) => page.includes('/tools/') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
