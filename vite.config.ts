import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built assets resolve under a GitHub Pages subpath
  // (https://<user>.github.io/ranah-studios/) as well as at a root domain.
  base: './',
  plugins: [react()],
  // Dev-only: proxy the live booking engine (products/booking-engine/app on :4321)
  // so the #test-booking widget calls /api/* same-origin (no CORS). Start the engine
  // with `npm start` in that folder, then run this site with `npm run dev`.
  server: {
    proxy: {
      '/api': 'http://localhost:4321',
    },
  },
})
