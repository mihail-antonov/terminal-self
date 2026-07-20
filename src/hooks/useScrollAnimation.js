import {useEffect} from 'preact/hooks'
import gsap from 'gsap'

export function useScrollAnimation(ref, {y = 30, duration = 0.8, delay = 0, stagger = false, scrub = false} = {}) {
  useEffect(() => {
    if (!ref.current) return

    const target = stagger ? ref.current.children : ref.current

    const ctx = gsap.context(() => {
      gsap.from(target, {
        opacity: 0,
        y,
        ease: 'power2.out',
        ...(scrub ? {} : {duration, delay, stagger: stagger ? 0.12 : 0}),
        scrollTrigger: scrub
          ? { trigger: ref.current, start: 'top 90%', end: 'top 40%', scrub: 1 }
          : { trigger: ref.current, start: 'top 88%', toggleActions: 'play none none none' },
      })
    })

    return () => ctx.revert()
  }, [])
}
