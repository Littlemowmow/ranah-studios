import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built assets resolve under a GitHub Pages subpath
  // (https://<user>.github.io/ranah-studios/) as well as at a root domain.
  base: './',
  plugins: [react()],
})
