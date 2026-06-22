// Live ElevenLabs voice-agent widget — the "talk to our AI" demo of what Ranah Studios builds.
// Injected into the DOM (custom element + script) so TypeScript doesn't choke on <elevenlabs-convai>.
// NOTE: the widget self-positions (bottom-right by default); placement is set in the ElevenLabs
// dashboard (Agent → Widget), not via page CSS. WhatsApp lives bottom-right too — see App notes.
import { useEffect } from 'react'

const AGENT_ID = 'agent_0901kvpjy6vbfem9hts4ntq5pkw6' // Ranah Studios — Site Demo (voice: Roger)

export default function VoiceAgentWidget() {
  useEffect(() => {
    if (!document.querySelector('script[data-convai-embed]')) {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
      s.async = true
      s.setAttribute('data-convai-embed', '')
      document.body.appendChild(s)
    }
    if (!document.getElementById('ranah-voice-agent')) {
      const el = document.createElement('elevenlabs-convai')
      el.id = 'ranah-voice-agent'
      el.setAttribute('agent-id', AGENT_ID)
      // Start as a small collapsed launcher, not the large expanded "Need help?"
      // card, which dominated the screen on mobile. Tap to open the call.
      el.setAttribute('variant', 'compact')
      el.setAttribute('default-expanded', 'false')
      document.body.appendChild(el)
    }
  }, [])
  return null
}
