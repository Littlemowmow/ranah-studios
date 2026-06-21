export default function Footer() {
  return (
    <footer className="bg-ink-base">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6 py-20 text-center sm:px-8 sm:py-24">
        <a href="#top" aria-label="Ranah Studios">
          <img
            src="/ranah-logo.png"
            alt="Ranah Studios"
            className="h-16 w-auto opacity-95 sm:h-20"
          />
        </a>
        <p className="font-mono text-xs tracking-[0.06em] text-muted">
          &copy; 2026 Ranah Studios
        </p>
      </div>
    </footer>
  )
}
