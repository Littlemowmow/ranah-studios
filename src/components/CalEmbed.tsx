import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { bookingConfig } from '../booking/bookingConfig'

// Live Cal.com embed pointed at the studio's real booking link, so the calendar
// shows actual availability from Cal.com (synced to Google Calendar) and books
// straight into it. Themed to the site's dark + gold palette.
export default function CalEmbed() {
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const cal = await getCalApi()
      if (cancelled) return
      cal('ui', {
        theme: 'dark',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#c9a24b' },
          dark: { 'cal-brand': '#c9a24b' },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mt-10 overflow-hidden rounded-[18px] border border-line bg-panel">
      <Cal
        calLink={bookingConfig.calLink}
        style={{ width: '100%', height: '700px', overflow: 'auto' }}
        config={{ layout: 'month_view', theme: 'dark' }}
      />
    </div>
  )
}
