import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import TwoOfferSplit from './components/TwoOfferSplit'
import ServicesList from './components/ServicesList'
import VoiceBand from './components/VoiceBand'
import ProcessBand from './components/ProcessBand'
import FAQ from './components/FAQ'
import Booking from './components/Booking'
import Footer from './components/Footer'
import LiveBooking from './components/LiveBooking'
import WhatsAppButton from './components/WhatsAppButton'

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
      <TwoOfferSplit />
      <ServicesList />
      <VoiceBand />
      <ProcessBand />
      <FAQ />
      <Booking />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
