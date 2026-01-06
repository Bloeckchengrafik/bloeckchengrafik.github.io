import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import svelte from "@astrojs/svelte";

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://bloeckchengrafik.de',
  integrations: [mdx(), sitemap(), svelte()],

  vite: {
    plugins: [tailwindcss()]
  }
});