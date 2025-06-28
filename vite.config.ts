import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const base = mode === 'production' ? '/sudoku/' : '/';

  return {
    base,
    build: {
      chunkSizeWarningLimit: 1000,
    },
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['assets/icon.png', 'assets/luckiest-guy.ttf'],
        devOptions: {
          enabled: true
        },
        manifest: {
          name: 'Sudoku',
          short_name: 'Sudoku',
          description: 'A simple Sudoku game',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          scope: base,
          start_url: base,
          icons: [
            {
              src: 'assets/icon.png',
              sizes: '48x48',
              type: 'image/png',
            },
            {
              src: 'assets/icon.png',
              sizes: '72x72',
              type: 'image/png',
            },
            {
              src: 'assets/icon.png',
              sizes: '96x96',
              type: 'image/png',
            },
            {
              src: 'assets/icon.png',
              sizes: '144x144',
              type: 'image/png',
            },
            {
              src: 'assets/icon.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'assets/icon.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'assets/icon.png',
              sizes: '180x180',
              type: 'image/png',
            },
            {
              src: 'assets/icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
  }
});
