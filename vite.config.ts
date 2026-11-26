import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  plugins: [
    react(),
    VitePWA({
      // El usuario decide cuándo actualizar (ver components/common/UpdatePrompt.tsx)
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'icons/apple-touch-icon.png', 'offline.html'],
      manifest: {
        name: 'Gastify - Control de gastos',
        short_name: 'Gastify',
        description:
          'Registra ingresos y egresos, consulta tu balance y visualiza estadísticas, incluso sin conexión.',
        lang: 'es',
        theme_color: '#16a34a',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App shell + assets estáticos precacheados
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Fallback SPA: navegaciones sin red -> index.html (shell); si falla, offline.html
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // API de tipos de cambio: datos frescos si hay red, caché si no
            urlPattern: /^https:\/\/open\.er-api\.com\/v6\/latest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'gastify-exchange-rates',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        // Cambiar a true para probar el service worker en `npm run dev`
        enabled: false,
      },
    }),
  ],
});
