import {useEffect, useRef} from 'preact/hooks'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import {LuArrowDown} from 'react-icons/lu'
import {scramble, SCRAMBLE} from '../../utils/scramble'
import {Octahedron} from '../ui/Octahedron'
import {useDragRotate} from '../../hooks/useDragRotate'

export function Hero() {
  const line1Ref = useRef()
  const name1Ref = useRef()
  const name2Ref = useRef()
  const subRef = useRef()
  const ctaRef = useRef()
  const cubeRef = useRef()
  const cubeIntroRef = useRef()
  const cubeRotateRef = useRef()
  const cubeFloatRef = useRef()
  const cubeDragRef = useRef()

  useDragRotate(cubeRef, cubeDragRef)

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
          else floatTween.pause()
        },
      })
    })
    return () => ctx.revert()
  }, [])

  // Intro animation
  useEffect(() => {
    const randChar = () => SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
    const randStr = (len) => Array.from({length: len}, randChar).join('')

    name1Ref.current.textContent = randStr(6)
    name2Ref.current.textContent = randStr(7)

    let noiseId = setInterval(() => {
      if (name2Ref.current) name2Ref.current.textContent = randStr(7)
    }, 50)
    const stopNoise = () => clearInterval(noiseId)

    const ctx = gsap.context(() => {
      gsap.set(line1Ref.current, {y: '110%'})
      gsap.set([subRef.current, ctaRef.current], {opacity: 0, y: 12})
      gsap.set(cubeRef.current, {opacity: 0, scale: 0.85})
      gsap.set(cubeIntroRef.current, {rotateX: 0, rotateY: 0})

      const tl = gsap.timeline({delay: 0.2, defaults: {ease: 'power3.out'}})
      tl.to(line1Ref.current, {y: '0%', duration: 0.9})
        .add(() => scramble(name1Ref.current, 'Mihail', 800), '<')
        .add(() => {
          stopNoise();
          scramble(name2Ref.current, 'Antonov', 900)
        }, '<0.8')
        .to(subRef.current, {opacity: 1, y: 0, duration: 0.7}, '-=0.4')
        .to(ctaRef.current, {opacity: 1, y: 0, duration: 0.6}, '-=0.4')
        .to(cubeRef.current, {opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)'}, '-=0.9')
        .to(cubeIntroRef.current, {rotateX: 25, rotateY: 30, duration: 1.4, ease: 'power2.out'}, '<')
    })

    return () => {
      stopNoise();
      ctx.revert()
    }
  }, [])


  return (
    <section id="hero"
             className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden py-20 md:py-40">

      <div className="max-w-6xl mx-auto px-5 md:px-22 w-full z-1">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">

          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 text-xs tracking-widest text-green">
                {'< FRONTEND DEVELOPER />'}
              </span>
            </div>

            <h1 className="font-semibold tracking-[-0.03em] mb-6 text-zinc-300 overflow-hidden text-4xl md:text-5xl">
              <span ref={line1Ref} className="block whitespace-nowrap">
                <span ref={name1Ref}>Mihail</span>
                {' '}
                <span ref={name2Ref}>Antonov</span>
                <span className="text-green animate-blink">_</span>
              </span>
            </h1>

            <p
              ref={subRef}
              className="text-base leading-relaxed text-[#898992] max-w-[400px] mb-10 opacity-0"
            >
              I build interfaces that ship.<br/>
              Fast, precise, production-ready.<br/>
              First pixel to the last deploy.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4 items-center opacity-0">
              <a
                href="#projects"
                className="inline-flex items-center justify-between gap-2 text-[12px] tracking-widest uppercase rounded-sm no-underline min-w-60 ps-6 pe-5 py-4 border border-green/30 bg-green/4 text-green font-semibold transition-all duration-200 hover:bg-green/8"
              >
                <span>View my work</span> <LuArrowDown className="text-[14px]"/>
              </a>
            </div>
          </div>

          {/* Right — octahedron */}
          <div className="flex justify-center scale-75 md:scale-100">
            <div ref={cubeRef} className="opacity-0">
              <div className="relative">
                <div aria-hidden="true"
                     className="bg-grid-pattern-subtle absolute inset-[-110px] md:inset-[-180px] pointer-events-none -z-1 opacity-100"/>
                <div aria-hidden="true"
                     className="bg-glow-orange absolute inset-[-110px] md:inset-[-180px] pointer-events-none -z-1 opacity-50"/>
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
      </div>

    </section>
  )
}
