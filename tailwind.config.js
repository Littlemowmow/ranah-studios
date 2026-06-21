/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Newsreader'", 'Georgia', 'serif'],
        body: ["'Geist'", 'system-ui', 'sans-serif'],
        mono: ["'IBM Plex Mono'", 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // ── Dark Cinematic — Monochrome dark + cream + glass ─────────────
        'ink-base': '#0B0B0C', // page background — near-black, slightly warm
        navy: {
          DEFAULT: '#04222F', // deep cinematic navy — hero zone base behind video
          deep: '#03161E', // darker navy tier
        },
        panel: {
          DEFAULT: '#141416', // raised dark card surface
          soft: '#1B1B1E', // slightly lifted panel (hover / nested)
        },
        cream: '#F2ECE0', // warm off-white — display / headings
        fg: '#FFFFFF', // plain white text
        // ── Gold — the single luxury accent, rationed (one moment per card) ──
        gold: {
          DEFAULT: '#C9A24B', // primary accent — strokes, markers, underline
          soft: '#E4CB86', // lighter — text/numerals on dark
          deep: '#9A7B33', // darker tier — shadows / pressed
        },
        muted: {
          DEFAULT: '#9A9A9F', // body text on dark
          soft: '#6E6E74', // dimmer tertiary text
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.08)', // hairline borders
          strong: 'rgba(255,255,255,0.14)', // stronger borders (form fields)
        },
      },
    },
  },
  plugins: [],
}
