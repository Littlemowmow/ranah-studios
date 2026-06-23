// Apply system-prompt.md + config.json onto an ElevenLabs Conversational AI agent.
//
//   export ELEVENLABS_API_KEY=sk_...      (never commit this)
//   export AGENT_ID=agent_...
//   node setup.mjs                        # push prompt + voice + data collection
//   node setup.mjs --simulate             # run a simulated booking call to verify
//
// Cal.com tools are per-agent (created when you attach the Cal.com integration in the
// ElevenLabs dashboard), so this script does not set tool_ids. Attach them in the
// dashboard; the prompt references them by name (calcom_get_available_slots, etc.).

import { readFileSync } from 'node:fs'

const KEY = process.env.ELEVENLABS_API_KEY
const AGENT = process.env.AGENT_ID
if (!KEY || !AGENT) {
  console.error('Set ELEVENLABS_API_KEY and AGENT_ID env vars.')
  process.exit(1)
}
const H = { 'xi-api-key': KEY, 'Content-Type': 'application/json' }
const cfg = JSON.parse(readFileSync(new URL('./config.json', import.meta.url)))
const prompt = readFileSync(new URL('./system-prompt.md', import.meta.url), 'utf8').trim()

async function apply() {
  const body = {
    conversation_config: {
      agent: { first_message: cfg.first_message, prompt: { prompt } },
      tts: cfg.tts,
    },
    platform_settings: { data_collection: cfg.data_collection },
  }
  const r = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${AGENT}`, {
    method: 'PATCH', headers: H, body: JSON.stringify(body),
  })
  console.log('PATCH agent ->', r.status, r.ok ? 'OK' : await r.text())
  if (r.ok) {
    console.log('Applied prompt, voice, and', Object.keys(cfg.data_collection).length, 'data-collection fields.')
    console.log('Reminder: attach the Cal.com tools to this agent in the dashboard (Tools -> Cal.com).')
  }
}

async function simulate() {
  const body = {
    simulation_specification: {
      simulated_user_config: {
        first_message: 'hi, i want to book a 30 minute demo',
        language: 'en',
        prompt: { prompt: 'You are a serious local-business lead ready to book. Cooperatively give a name, business, email, phone, and city when asked, and pick the first time offered.' },
      },
    },
  }
  const r = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${AGENT}/simulate-conversation`, {
    method: 'POST', headers: H, body: JSON.stringify(body),
  })
  const j = await r.json()
  for (const t of (j.simulated_conversation || [])) {
    const role = t.role || t.source
    if (t.message) console.log(`[${role}] ${t.message.slice(0, 160)}`)
    ;(t.tool_calls || []).forEach((tc) => console.log(`   -> tool: ${tc.tool_name || tc.name}`))
  }
}

if (process.argv.includes('--simulate')) await simulate()
else await apply()
