import { useEffect, useRef } from 'preact/hooks'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*<>[]0123456789'

function scramble(el, final, durationMs = 900) {
  const steps = 20
  let step = 0
  const id = setInterval(() => {
    step++
    const progress = step / steps
    el.textContent = final
      .split('')
      .map((char, i) => (i / final.length < progress)
        ? char
        : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
      )
      .join('')
    if (step >= steps) {
      clearInterval(id)
      el.textContent = final
    }
  }, durationMs / steps)
  return () => clearInterval(id)
}


function Octahedron({ introRef, rotateRef, dragRef }) {
  const R       = 115
  const apothem = R / Math.sqrt(3)
  const edge    = R * Math.sqrt(2)
  const triH    = edge * (Math.sqrt(3) / 2)
  const D       = (4 / 3) * triH

  const tiltDeg = Math.asin(1 / Math.sqrt(3)) * (180 / Math.PI)
  const yAngles = [45, -45, 135, -135]

  const facePos = {
    position: 'absolute',
    width: edge,
    height: D,
    left: `calc(50% - ${edge / 2}px)`,
    top: `calc(50% - ${D / 2}px)`,
    transformOrigin: '50% 50%',
  }

  const upPts = `${edge / 2},0 ${edge},${triH} 0,${triH}`
  const dnPts = `0,${triH / 3} ${edge},${triH / 3} ${edge / 2},${D}`

  const faces = yAngles.flatMap((yA, i) => [
    {
      key: `t${i}`,
      transform: `rotateY(${yA}deg) rotateX(${tiltDeg}deg) translateZ(${apothem}px)`,
      pts: upPts,
      stroke: 'rgba(255,107,0,0.22)',
    },
    {
      key: `b${i}`,
      transform: `rotateY(${yA}deg) rotateX(${-tiltDeg}deg) translateZ(${apothem}px)`,
      pts: dnPts,
      stroke: 'rgba(255,107,0,0.18)',
    },
  ])

  return (
    <div className="mx-auto" style={{ perspective: '900px', width: R * 2, height: R * 2 }}>
      <div
        ref={introRef}
        className="relative"
        style={{ transformStyle: 'preserve-3d', width: R * 2, height: R * 2 }}
      >
        <div
          ref={rotateRef}
          className="absolute w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            ref={dragRef}
            className="absolute w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {faces.map(({ key, transform, pts, stroke }) => (
              <div key={key} style={{ ...facePos, transform }}>
                <svg width={edge} height={D} viewBox={`0 0 ${edge} ${D}`} className="block">
                  <polygon points={pts} fill="rgba(17,17,19,0.8)" stroke={stroke} strokeWidth="1" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const line1Ref      = useRef()
  const name1Ref      = useRef()
  const name2Ref      = useRef()
  const subRef        = useRef()
  const ctaRef        = useRef()
  const cubeRef       = useRef()
  const cubeIntroRef  = useRef()
  const cubeRotateRef = useRef()
  const cubeFloatRef  = useRef()
  const cubeDragRef   = useRef()

  // Scroll parallax + float
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(cubeRotateRef.current, {
        rotateY: '+=160',
        rotateX: '-=20',
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      const floatTween = gsap.to(cubeFloatRef.current, {
        y: -18,
        duration: 2.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.8,
        paused: true,
      })

      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top bottom',
        end: 'bottom top',
        onToggle: self => {
          if (self.isActive) floatTween.resume()
          else               floatTween.pause()
        },
      })
    })
    return () => ctx.revert()
  }, [])

  // Drag to rotate with inertia
  useEffect(() => {
    const el = cubeRef.current
    if (!el) return

    let isDragging = false
    let lastX = 0, lastY = 0
    let rotX = 0, rotY = 0
    let velX = 0, velY = 0
    let rafId = null

    const cancelInertia = () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
    }

    const tick = () => {
      velX *= 0.93
      velY *= 0.93
      rotY += velX
      rotX += velY
      gsap.set(cubeDragRef.current, { rotateX: rotX, rotateY: rotY })
      if (Math.abs(velX) > 0.05 || Math.abs(velY) > 0.05) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = null
      }
    }

    const onDown = (e) => {
      isDragging = true
      lastX = e.clientX
      lastY = e.clientY
      velX = 0
      velY = 0
      cancelInertia()
      el.style.cursor = 'grabbing'
    }

    const onMove = (e) => {
      if (!isDragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      velX = dx * 0.45
      velY = -dy * 0.45
      rotY += velX
      rotX += velY
      gsap.set(cubeDragRef.current, { rotateX: rotX, rotateY: rotY })
    }

    const onUp = () => {
      if (!isDragging) return
      isDragging = false
      el.style.cursor = 'grab'
      rafId = requestAnimationFrame(tick)
    }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.style.cursor = 'grab'
    el.style.userSelect = 'none'
    el.style.touchAction = 'none'

    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      cancelInertia()
    }
  }, [])

  // Intro animation
  useEffect(() => {
    const randChar = () => SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
    const randStr  = (len) => Array.from({ length: len }, randChar).join('')

    name1Ref.current.textContent = randStr(6)
    name2Ref.current.textContent = randStr(7)

    let noiseId = setInterval(() => {
      if (name2Ref.current) name2Ref.current.textContent = randStr(7)
    }, 50)
    const stopNoise = () => clearInterval(noiseId)

    const ctx = gsap.context(() => {
      gsap.set(line1Ref.current, { y: '110%' })
      gsap.set([subRef.current, ctaRef.current], { opacity: 0, y: 12 })
      gsap.set(cubeRef.current, { opacity: 0, scale: 0.85 })
      gsap.set(cubeIntroRef.current, { rotateX: 0, rotateY: 0 })

      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } })
      tl.to(line1Ref.current, { y: '0%', duration: 0.9 })
        .add(() => scramble(name1Ref.current, 'Mihail', 800), '<')
        .add(() => { stopNoise(); scramble(name2Ref.current, 'Antonov', 900) }, '<0.8')
        .to(subRef.current,  { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .to(ctaRef.current,  { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to(cubeRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' }, '-=0.9')
        .to(cubeIntroRef.current, { rotateX: 25, rotateY: 30, duration: 1.4, ease: 'power2.out' }, '<')
    })

    return () => { stopNoise(); ctx.revert() }
  }, [])


  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden py-20 md:py-40">

      <div className="max-w-6xl mx-auto px-5 md:px-22 w-full z-1">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">

          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 text-xs tracking-widest text-green">
                {'< FRONTEND DEVELOPER />'}
              </span>
            </div>

            <h1 className="font-semibold tracking-[-0.03em] mb-6 text-white overflow-hidden text-4xl md:text-5xl">
              <span ref={line1Ref} className="block whitespace-nowrap">
                <span ref={name1Ref}>Mihail</span>
                {' '}
                <span ref={name2Ref}>Antonov</span>
                <span className="text-green" style={{ animation: 'blink 1.1s steps(1) infinite' }}>_</span>
              </span>
            </h1>

            <p
              ref={subRef}
              className="text-base leading-relaxed text-zinc-500 max-w-[400px] mb-10 opacity-0"
            >
              This is my slice of the internet. I build fast, precise web
              interfaces — 6 years deep, from first pixel to production.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4 items-center opacity-0">
              <a
                href="#projects"
                className="inline-flex items-center justify-between gap-2 text-[12px] tracking-widest uppercase no-underline min-w-60 ps-6 pe-5 py-4 border border-green/30 bg-green/4 text-green font-semibold transition-all duration-200 hover:bg-green/8"
              >
                <span>View my work</span> <i className="bi bi-arrow-right text-[14px]" />
              </a>
            </div>
          </div>

          {/* Right — octahedron */}
          <div ref={cubeRef} className="flex justify-center opacity-0">
            <div className="relative">
              <div aria-hidden="true" className="bg-grid-pattern-subtle absolute inset-[-180px] pointer-events-none -z-1 opacity-75" />
              <div aria-hidden="true" className="bg-glow-orange absolute inset-[-180px] pointer-events-none -z-1 opacity-40" />
              <div ref={cubeFloatRef}>
                <Octahedron
                  introRef={cubeIntroRef}
                  rotateRef={cubeRotateRef}
                  dragRef={cubeDragRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-1"
        style={{ animation: 'mouse-bounce 1.8s ease-in-out infinite' }}
        aria-hidden="true"
      >
        <span
          className="text-[10px] uppercase text-zinc-500/60 select-none [writing-mode:vertical-rl] tracking-[0.25em]"
        >
          scroll
        </span>
        <i className="bi bi-mouse text-[24px] text-[rgba(255,107,0,0.4)]" />
      </div>
    </section>
  )
}
