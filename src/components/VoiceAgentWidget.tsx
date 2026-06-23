// Live ElevenLabs voice-agent widget — the "talk to our AI" demo of what Ranah Studios builds.
// Injected into the DOM (custom element + script) so TypeScript doesn't choke on <elevenlabs-convai>.
// NOTE: the widget self-positions (bottom-right by default); placement is set in the ElevenLabs
// dashboard (Agent → Widget), not via page CSS. WhatsApp lives bottom-right too — see App notes.
import { useEffect } from 'react'

const AGENT_ID = 'agent_0901kvpjy6vbfem9hts4ntq5pkw6' // Ranah Studios — Site Demo (voice: Roger)

// Opens the ElevenLabs widget by clicking its launcher inside the shadow DOM
// (the embed exposes no imperative open() API or global). Wired to the
// "Hear how it works" link so visitors can start a live call with the agent.
export function openVoiceAgent() {
  const el = document.getElementById('ranah-voice-agent') as HTMLElement | null
  if (!el) return
  const root = (el as HTMLElement & { shadowRoot: ShadowRoot | null }).shadowRoot
  if (root) {
    const clickables = Array.from(root.querySelectorAll<HTMLElement>('button, [role="button"], a'))
    const pick =
      clickables.find((c) =>
        /call|start|open|talk|hear|chat|need help/i.test(
          c.getAttribute('aria-label') || c.textContent || '',
        ),
      ) || clickables[0]
    if (pick) {
      pick.click()
      return
    }
  }
  el.click()
}

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
      // Rest collapsed: a small launcher (orb + expand chevron), not the large
      // expanded "Need help?" card. Tap (or "Hear how it works") to open it.
      el.setAttribute('default-expanded', 'false')
      el.setAttribute('show-avatar-when-collapsed', 'true')
      document.body.appendChild(el)
    }
  }, [])
  return null
}
