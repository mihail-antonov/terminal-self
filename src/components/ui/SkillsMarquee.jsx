import { useRef, useEffect } from 'preact/hooks'
import gsap from 'gsap'

const SKILLS = [
  'React', 'Next.js', 'Shopify', 'Liquid', 'SCSS', 'TailwindCSS',
  'Node.js', 'TypeScript', 'GSAP', 'Threedium SDK', 'Vite', 'Git',
]

const items = [...SKILLS, ...SKILLS]

const BORDER = 'linear-gradient(to right, transparent, rgba(255,107,0,0.08) 15%, rgba(255,107,0,0.08) 85%, transparent)'
const FADE   = 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'

export function SkillsMarquee() {
  const trackRef = useRef()

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    let half       = 0
    let x          = 0
    let velocity   = 0
    let lastTouchY = 0
    let tickFn     = null

    const onWheel      = e => { velocity = e.deltaY }
    const onTouchStart = e => { lastTouchY = e.touches[0].clientY }
    const onTouchMove  = e => {
      velocity   = (lastTouchY - e.touches[0].clientY) * 3
      lastTouchY = e.touches[0].clientY
    }

    window.addEventListener('wheel',      onWheel,      { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove',  onTouchMove,  { passive: true })

    const init = () => {
      half = el.scrollWidth / 2
      if (!half) { requestAnimationFrame(init); return }

      tickFn = () => {
        velocity *= 0.92
        if (Math.abs(velocity) < 0.05) { velocity = 0; return }
        x = ((x + velocity * 0.5) % half + half) % half
        gsap.set(el, { x: -x })
      }
      gsap.ticker.add(tickFn)
    }

    requestAnimationFrame(init)

    return () => {
      if (tickFn) gsap.ticker.remove(tickFn)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-5 py-5">
      <div className="h-px w-full mb-4" style={{ background: BORDER }} />

      <div
        className="overflow-hidden"
        style={{ WebkitMaskImage: FADE, maskImage: FADE }}
      >
        <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
          {items.map((skill, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-5 text-[11px] tracking-[0.2em] uppercase text-green/50">
              {skill}
              <span className="text-green/15">·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="h-px w-full mt-4" style={{ background: BORDER }} />
    </div>
  )
}
