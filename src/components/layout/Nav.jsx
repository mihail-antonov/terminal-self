import { useState, useEffect } from 'preact/hooks'

const links = [
  { label: 'About',      href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Contact',    href: '#contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,14,20,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
        <a
          href="#hero"
          className="text-[12px] tracking-widest text-white no-underline hover:text-white transition-colors duration-200"
        >
          mihail@portfolio: <span className="text-green">~</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }, i) => (
            <a
              key={href}
              href={href}
              className="text-[11px] tracking-widest uppercase text-zinc-500 no-underline hover:text-white transition-colors duration-200"
            >
              <span className="text-green">{String(i + 1).padStart(2, '0')}.</span>{' '}
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex text-[11px] tracking-widest uppercase no-underline px-4 py-2 transition-all duration-200 text-green border border-[rgba(255,107,0,0.5)]"
          onMouseEnter={e => {
            e.currentTarget.style.background = '#ff6b00'
            e.currentTarget.style.color = '#0A0E14'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#ff6b00'
          }}
        >
          Hire Me
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-zinc-500"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className="text-green text-[20px]">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-5 pb-6 flex flex-col gap-5 bg-[rgba(10,14,20,0.97)] border-t border-[rgba(255,255,255,0.06)]"
        >
          {links.map(({ label, href }, i) => (
            <a
              key={href}
              href={href}
              className="text-[12px] tracking-widest uppercase text-zinc-500 no-underline hover:text-white transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              <span className="text-green">{String(i + 1).padStart(2, '0')}.</span>{' '}
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-[11px] tracking-widest uppercase no-underline px-4 py-2 text-center text-green border border-[rgba(255,107,0,0.5)]"
            onClick={() => setOpen(false)}
          >
            Hire Me
          </a>
        </div>
      )}
    </header>
  )
}
