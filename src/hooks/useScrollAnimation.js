import { useEffect } from 'preact/hooks'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimation(ref, { y = 30, duration = 0.8, delay = 0, stagger = false } = {}) {
  useEffect(() => {
    if (!ref.current) return

    const target = stagger ? ref.current.children : ref.current

    const ctx = gsap.context(() => {
      gsap.from(target, {
        opacity: 0,
        y,
        duration,
        delay,
        ease: 'power2.out',
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    })

    return () => ctx.revert()
  }, [])
}
