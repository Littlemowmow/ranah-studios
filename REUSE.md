# Reusable modules in this repo

This repo is the Ranah Studios site, but several pieces are **concept-agnostic** and built
to be lifted into a new project. Here's the map of what's portable and where it lives.

| Module | Folder / file | What you reuse it for |
|---|---|---|
| **ElevenLabs voice agent** | [`elevenlabs-agent/`](./elevenlabs-agent/) | The whole agentic setup: prompt patterns, live Cal.com booking flow, data-collection schema, voice settings, and a `setup.mjs` to apply it to any new agent. **This is the "agentic knowledge" you can pull for a different concept.** |
| **Standalone pricing one-pager** | [`public/pricing.html`](./public/pricing.html) | A self-contained, branded pricing sheet (one HTML file, no build). Copy, restyle, re-host. |
| **Booking calendar + slot engine** | [`src/booking/`](./src/booking/) | A no-backend calendar UI + slot engine (`slots.ts`, `bookingConfig.ts`), lead-capture form, `.ics` export, and an optional Cal.com embed (`src/components/CalEmbed.tsx`). |
| **Design tokens** | [`tailwind.config.js`](./tailwind.config.js) + [`src/index.css`](./src/index.css) | The dark + gold palette, fonts (Newsreader / Geist / IBM Plex Mono), and the `.btn-bubble` / reveal / legibility utilities. |
| **Social share card** | [`public/og-image.png`](./public/og-image.png) | The 1200x630 OG card pattern (built from an HTML template rendered to PNG). |

## Why the rest of the app isn't "in folders"

The site is a **Vite app**, which requires `index.html` at the root and source under `src/`,
with static assets in `public/`. Moving those into arbitrary folders breaks the build and the
Vercel deploy. So the *portable* pieces are separated and documented (above), while the app
keeps the structure Vite needs.

If you want a true **monorepo** (e.g. `apps/site` + `packages/voice-agent` + `packages/booking`
+ `packages/design-tokens`), that's a larger restructure with workspace + build-config changes.
It's doable on `main`, just say the word and it'll be set up as a separate, reviewed change.

## Pulling the voice agent into a new concept (TL;DR)

```bash
cp -r elevenlabs-agent ../my-new-project/
# edit system-prompt.md (persona) and config.json (voice, data fields, event id)
export ELEVENLABS_API_KEY=sk_...   AGENT_ID=agent_...
node ../my-new-project/elevenlabs-agent/setup.mjs
```

See [`elevenlabs-agent/README.md`](./elevenlabs-agent/README.md) for the full guide.
