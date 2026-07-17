import { useState, useEffect } from 'preact/hooks'

const sections = [
  { num: '01_', label: 'about',      href: '#about' },
  { num: '02_', label: 'experience', href: '#experience' },
  { num: '03_', label: 'projects',   href: '#projects' },
  { num: '04_', label: 'contact',    href: '#contact' },
]

export function SideNav() {
  const [active,  setActive]  = useState('')
  const [visible, setVisible] = useState(false)

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

  useEffect(() => {
    const els = sections.map(s => document.getElementById(s.href.slice(1))).filter(Boolean)
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { threshold: 0.3 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="hidden lg:flex fixed top-32 flex-col gap-4 z-50 transition-all duration-500"
      style={{
        left: 'max(1.5rem, calc((100vw - 90rem) / 2))',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {sections.map(({ num, label, href }) => {
        const isActive = active === href.slice(1)
        return (
          <a
            key={href}
            href={href}
            aria-label={label}
            className={`text-[12px] font-medium tracking-widest no-underline transition-colors duration-200 ${
              isActive ? 'text-green/70' : 'text-[#898992]/55 hover:text-[#898992]'
            }`}
          >
            {num}
          </a>
        )
      })}
    </nav>
  )
}