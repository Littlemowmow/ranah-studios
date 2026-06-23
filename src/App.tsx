import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import TwoOfferSplit from './components/TwoOfferSplit'
import ServicesList from './components/ServicesList'
import ProcessBand from './components/ProcessBand'
import Results from './components/Results'
import FAQ from './components/FAQ'
import Booking from './components/Booking'
import Footer from './components/Footer'
import LiveBooking from './components/LiveBooking'
import WhatsAppButton from './components/WhatsAppButton'
import VoiceAgentWidget from './components/VoiceAgentWidget'
import { Analytics } from '@vercel/analytics/react'

function App() {
  // Live Cal.com booking widget, gated behind #test-booking so the public site is
  // untouched. Open http://localhost:5173/#test-booking to test against the engine.
  const [testBooking, setTestBooking] = useState(
    typeof window !== 'undefined' && window.location.hash === '#test-booking',
  )
  useEffect(() => {
    const onHash = () => setTestBooking(window.location.hash === '#test-booking')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (testBooking) return <LiveBooking />

  return (
    <div className="min-h-screen w-full bg-ink-base font-body text-cream antialiased">
      <Hero />
      <TrustStrip />
      <TwoOfferSplit />
      <ServicesList />
      <Booking />
      <ProcessBand />
      <Results />
      <FAQ />
      <Footer />
      <WhatsAppButton />
      <VoiceAgentWidget />
      <Analytics />
    </div>
  )
}

export default App
