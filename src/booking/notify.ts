// Best-effort owner notification, shared by the chat (Remi) and calendar flows.
// Until a Web3Forms key is set the booking still saves locally + downloads an
// .ics; only the owner email is skipped.
import { bookingConfig } from './bookingConfig'
import type { Booking } from './slots'

export async function notifyOwner(b: Booking): Promise<void> {
  const key = bookingConfig.web3FormsAccessKey
  if (!key || key === 'YOUR_ACCESS_KEY_HERE') return
  const start = new Date(b.startISO)
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `New booking — ${b.serviceLabel} with ${b.name}`,
        from_name: `${bookingConfig.studioName} booking`,
        name: b.name,
        email: b.email,
        service: b.serviceLabel,
        when: `${start.toLocaleString()} (${bookingConfig.timezoneLabel})`,
        message: b.message || '-',
      }),
    })
  } catch {
    /* best effort — the local save + .ics are the source of truth */
  }
}
