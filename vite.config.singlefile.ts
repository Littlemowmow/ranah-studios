import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Builds ONE fully self-contained index.html — CSS, JS, the hero video, and the
// poster are all inlined (base64) so the result is a single portable file you can
// open, email, or host anywhere. Output goes to dist-single/ (gitignored); the
// committed copy lives at standalone/rana-studios.html.
//   npm run build:single
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-single',
    // Inline every asset regardless of size (the 574KB video becomes a data URI).
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    // Keep it a single chunk so nothing is emitted as a separate file.
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
})
