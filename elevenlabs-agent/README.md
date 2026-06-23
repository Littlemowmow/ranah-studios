# ElevenLabs Voice Agent — portable, reusable setup

This folder is a **concept-agnostic export of the ElevenLabs Conversational AI agent**
that powers the "talk to our AI" demo on the site.

The agent itself lives on ElevenLabs' servers. This folder version-controls its
configuration so you can (a) track it in git and (b) **clone the whole agentic
pattern to a brand-new concept** by editing two files and running one script.

## What's here

| File | What it is |
|---|---|
| `system-prompt.md` | The raw system prompt: tone, what it pitches, the no-pricing rule, and the live booking flow. **Edit this for a new concept.** |
| `config.json` | Voice/TTS settings, the first message, the data-collection schema (the clean record captured on every call), and the Cal.com event id. |
| `cal-com-booking.md` | How the live Cal.com booking is wired (which tools, event id, attendee + notes). |
| `setup.mjs` | Pushes `system-prompt.md` + `config.json` onto an ElevenLabs agent via the API. Run it to apply edits, or to configure a brand-new agent. |

## Reuse for a different concept (the whole point)

1. In ElevenLabs, create a new agent and copy its `agent_...` id.
2. If it should book appointments: under the new agent's **Tools**, add the **Cal.com**
   integration, connect the account, and note the new numeric `eventTypeId`.
3. Copy this folder into the new project. Edit `system-prompt.md` (the persona + offer)
   and `config.json` (voice, data fields, `calcom.event_type_id`).
4. Apply it:
   ```bash
   export ELEVENLABS_API_KEY=sk_...     # never commit this
   export AGENT_ID=agent_...
   node setup.mjs
   ```
5. Attach the Cal.com tool_ids in the dashboard (they're per-agent), then test with a
   simulated call (`node setup.mjs --simulate`).

## The reusable patterns (the "agentic knowledge")

Swap the persona and the calendar, keep these patterns:

- **No-pricing guardrail** — a hard prompt rule so the agent never quotes a number and
  always routes pricing to a call.
- **Live booking flow** — collect a full lead record in natural conversation, then call a
  calendar tool for *real* availability and a booking tool to schedule, pushing the extra
  details into the booking notes.
- **Data collection** — a structured schema that extracts a clean record (name, email,
  phone, city, reason, etc.) from every call, stored per-conversation.
- **Natural voice** — model + stability/style settings tuned for a human feel.

> Keys are read from `ELEVENLABS_API_KEY` at runtime. Nothing secret is committed here.
