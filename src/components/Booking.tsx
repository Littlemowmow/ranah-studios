import CalEmbed from './CalEmbed'

export default function Booking() {
  return (
    <section id="book" className="bg-ink-base py-28 sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-3xl px-6">
        <div className="text-center">
          <h2
            className="mx-auto max-w-xl font-display font-normal text-cream"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
            }}
          >
            Book your <em className="not-italic text-fg">demo</em>.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
            Pick a time and we'll come prepared with something real for your
            business. A free 30-minute demo, booked in seconds.
          </p>
        </div>

        <CalEmbed />
      </div>
    </section>
  )
}
