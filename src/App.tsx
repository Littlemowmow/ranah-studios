import Hero from './components/Hero'
import TwoOfferSplit from './components/TwoOfferSplit'
import ServicesList from './components/ServicesList'
import VoiceBand from './components/VoiceBand'
import ProcessBand from './components/ProcessBand'
import FAQ from './components/FAQ'
import Booking from './components/Booking'
import QuoteForm from './components/QuoteForm'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen w-full bg-ink-base font-body text-cream antialiased">
      <Hero />
      <TwoOfferSplit />
      <ServicesList />
      <VoiceBand />
      <ProcessBand />
      <FAQ />
      <Booking />
      <QuoteForm />
      <Footer />
    </div>
  )
}

export default App
