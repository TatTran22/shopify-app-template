import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
  // @ts-ignore
  root: dirname(fileURLToPath(import.meta.url)),
  plugins: [
    laravel({
      input: 'resources/js/app.tsx',
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/resources/js',
      'ziggy-js': 'vendor/tightenco/ziggy',
    },
  },
})
