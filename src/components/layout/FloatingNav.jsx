import { useState, useEffect } from 'preact/hooks'

const sections = [
  { label: 'About',      href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Contact',    href: '#contact' },
]

export function FloatingNav() {
  const [visible, setVisible]   = useState(false)
  const [active, setActive]     = useState('')

  // Show after scrolling past the hero
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  // Track active section
  useEffect(() => {
    const ids = sections.map(s => s.href.slice(1))
    const els = ids.map(id => document.getElementById(id)).filter(Boolean)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { threshold: 0.3 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <nav
        className="flex items-center gap-1 px-3 py-2 rounded-full border border-white/[8%] bg-[rgba(10,14,20,0.88)] backdrop-blur-lg"
      >
        {sections.map(({ label, href }, i) => {
          const isActive = active === href.slice(1)
          return (
            <>
              {i > 0 && (
                <span key={`sep-${i}`} className="text-zinc-300/10 text-[10px] select-none px-0.5">·</span>
              )}
              <a
                key={href}
                href={href}
                className={[
                  'text-[11px] tracking-widest uppercase no-underline px-3 py-1.5 rounded-full transition-all duration-200',
                  isActive
                    ? 'text-green bg-green/10'
                    : 'text-[#898992] hover:text-zinc-300',
                ].join(' ')}
              >
                {label}
              </a>
            </>
          )
        })}
      </nav>
    </div>
  )
}
