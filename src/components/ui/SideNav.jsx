import {useState, useEffect} from 'preact/hooks'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const sections = [
  {num: '01_', label: 'about', href: '#about'},
  {num: '02_', label: 'experience', href: '#experience'},
  {num: '03_', label: 'projects', href: '#projects'},
  {num: '04_', label: 'contact', href: '#contact'},
]

export function SideNav() {
  const [active, setActive] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      {threshold: 0.1}
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const triggers = []
    const pending = new Set(sections.map(s => s.href.slice(1)))

    const setupSection = (id) => {
      const el = document.getElementById(id)
      if (!el) return
      triggers.push(ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      }))
      pending.delete(id)
      if (pending.size === 0) observer.disconnect()
    }

    pending.forEach(id => setupSection(id))

    const observer = new MutationObserver(() => {
      pending.forEach(id => setupSection(id))
    })

    if (pending.size > 0) {
      observer.observe(document.body, {childList: true, subtree: true})
    }

    return () => {
      observer.disconnect()
      triggers.forEach(t => t.kill())
    }
  }, [])

  return (
    <nav
      className={`hidden md:flex fixed top-32 flex-col gap-4 z-50 left-sidebar -translate-x-[4px] transition-all duration-500 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {sections.map(({num, label, href}) => {
        const isActive = active === href.slice(1)
        return (
          <a
            key={href}
            href={href}
            aria-label={label}
            className={`text-[12px] font-medium tracking-widest no-underline transition-colors duration-200 ${isActive ? 'text-orange-500' : 'text-[#898992]/55 hover:text-[#898992]'}`}
          >
            {num}
          </a>
        )
      })}
    </nav>
  )
}
