import { useRef, useEffect } from 'preact/hooks'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { DecoCube } from '../ui/DecoCube'

gsap.registerPlugin(ScrollTrigger)

const DOTS = ['#3f3f46', '#3f3f46', '#ff6b00']

const terminalLines = [
  { prompt: true,  text: 'node mihail.js --verbose' },
  { text: '' },
  { text: '  Initializing...         ✓', dim: true },
  { text: '  Loading skills...       ✓', dim: true },
  { text: '  Brewing coffee...       ✓', dim: true },
  { text: '  Checking ego...         LOW (good sign)', dim: true },
  { text: '' },
  { text: '  Output: {' },
  { key: 'name',     val: '"Mihail Antonov"' },
  { key: 'role',     val: '"Frontend Developer"' },
  { key: 'exp',      val: '6,' },
  { key: 'location', val: '"Remote"' },
  { highlight: true },
  { key: 'stack',    val: '["React", "Next.js", "Shopify"],' },
  { text: '  }' },
  { text: '' },
]

export function About() {
  const sectionRef      = useRef()
  const bioRef          = useRef()
  const terminalWrapRef = useRef()
  const terminalBodyRef = useRef()

  useScrollAnimation(bioRef, { y: 0, duration: 0.6 })

  // Typewriter — reveal lines one by one when terminal enters view
  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = terminalBodyRef.current.querySelectorAll('.term-line')
      gsap.set(lines, { opacity: 0 })
      gsap.to(lines, {
        opacity: 1,
        duration: 0.1,
        stagger: 0.08,
        scrollTrigger: {
          trigger: terminalBodyRef.current,
          start: 'top 85%',
          end: 'center center',
          scrub: 1,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  // Parallax on terminal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(terminalWrapRef.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="flex flex-col items-center justify-center min-h-svh relative py-32 md:py-40 overflow-hidden">
      <DecoCube
        size={60}
        borderOpacity={0.12}
        trigger="#about"
        yTravel={100}
        initialRotate="rotateX(20deg) rotateY(50deg)"
        style={{ position: 'absolute', top: '6%', right: '3%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={36}
        borderOpacity={0.08}
        trigger="#about"
        yTravel={70}
        initialRotate="rotateX(35deg) rotateY(15deg)"
        style={{ position: 'absolute', bottom: '15%', right: '10%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={28}
        borderOpacity={0.1}
        trigger="#about"
        yTravel={55}
        initialRotate="rotateX(45deg) rotateY(65deg)"
        style={{ position: 'absolute', top: '30%', left: '1%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={48}
        borderOpacity={0.07}
        trigger="#about"
        yTravel={85}
        initialRotate="rotateX(15deg) rotateY(40deg)"
        style={{ position: 'absolute', bottom: '8%', left: '5%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={22}
        borderOpacity={0.09}
        trigger="#about"
        yTravel={45}
        initialRotate="rotateX(50deg) rotateY(25deg)"
        style={{ position: 'absolute', top: '55%', right: '5%', pointerEvents: 'none' }}
      />

      <div className="w-full max-w-6xl mx-auto px-5 md:px-22">

        {/* Bio + Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 md:gap-20 lg:gap-32">


          {/* Terminal with parallax */}
          <div>
            <div className="relative">
              <div aria-hidden="true" className="bg-grid-pattern-subtle absolute -bottom-[40px] md:-bottom-[80px] -top-[40px] md:-top-[140px] -left-[30px] md:-left-[150px] -right-[30px] md:-right-[50px] pointer-events-none z-0" />
              <div aria-hidden="true" className="bg-glow-orange absolute -inset-24 pointer-events-none z-0" />
            <div ref={terminalWrapRef} className="relative z-1 rounded-xl overflow-hidden bg-[#111113] border border-zinc-800/75 shadow-[0_0_60px_rgba(255,107,0,0.07)] will-change-transform">
              {/* Title bar */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/75 select-none bg-[#111113]"
              >
                {DOTS.map((c, i) => (
                  <span key={i} className="w-3 h-3 rounded-full shrink-0" style={{ background: c }} />
                ))}
                <span className="text-[12px] ml-3 text-zinc-500">
                  <span className="text-green">mihail</span>@portfolio: ~/
                  <span className="text-zinc-300">01-about</span>
                </span>
              </div>

              {/* Body */}
              <div ref={terminalBodyRef} className="p-5 text-[12.5px] leading-[1.9] font-[inherit]">
                {terminalLines.map((line, i) => {
                  if (line.prompt) {
                    return (
                      <div key={i} className="term-line flex items-center gap-2 mb-1">
                        <span className="text-zinc-500 select-none">
                          <span className="text-green">mihail</span>@portfolio:~$
                        </span>
                        <span className="text-zinc-200">{line.text}</span>
                      </div>
                    )
                  }
                  if (line.highlight) {
                    return (
                      <div key={i} className="term-line whitespace-pre">
                        <span className="text-zinc-500">{'    status:   '}</span>
                        <span className="text-zinc-500 font-semibold"> "NOT AVAILABLE"</span>
                        <span className="text-zinc-500">,</span>
                      </div>
                    )
                  }
                  if (line.key) {
                    return (
                      <div key={i} className="term-line whitespace-pre">
                        <span className="text-zinc-500">{'    '}{line.key}:{' '.repeat(Math.max(1, 10 - line.key.length))}</span>
                        <span className="text-fg">{line.val}</span>
                      </div>
                    )
                  }
                  return (
                    <div
                      key={i}
                      className={`term-line whitespace-pre min-h-[1.9em] ${line.dim ? 'text-zinc-500/55' : 'text-zinc-500'}`}
                    >
                      {line.text || ' '}
                    </div>
                  )
                })}

                {/* Blinking cursor */}
                <div className="term-line flex items-center gap-2 mt-1">
                  <span className="text-zinc-500 select-none">
                    <span className="text-green">mihail</span>@portfolio:~$
                  </span>
                  <span
                    className="inline-block w-[9px] h-[14px] align-middle bg-green"
                    style={{ animation: 'blink 1.1s steps(1) infinite' }}
                  />
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Bio */}
          <div ref={bioRef} className="flex flex-col">
            <h3 className="text-2xl text-white font-semibold tracking-tight mb-6">
              <span className="text-green">01_</span> About
            </h3>

            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              6 years building interfaces people actually use.
            </p>

            <p className="text-sm leading-[2.1] mb-5 text-zinc-500">
              I specialise in <span className="text-green">React</span>, <span className="text-green">Next.js</span>, and <span className="text-green">Shopify</span> — from custom storefronts with Liquid and SCSS to full product UIs with <span className="text-white font-medium">TailwindCSS</span> and <span className="text-white font-medium">Node</span>. I care about the details: the kind of work where design and engineering meet.
            </p>
            <p className="text-sm leading-[2.1] mb-10 text-zinc-500">
              I also work with the <span className="text-white font-medium">Threedium SDK</span> to bring 3D model configurators to life in the browser. Currently <span className="text-white font-medium">not available</span> for new roles — but always up for a good conversation.
            </p>

            <a
              href="/resume.pdf"
              download
              className="self-start inline-flex items-center justify-between gap-2 text-[12px] tracking-widest uppercase no-underline min-w-60 ps-6 pe-5 py-4 border border-green/30 bg-green/4 text-green font-semibold transition-all duration-200 hover:bg-green/8"
            >
              <span>Download CV</span> <i className="bi bi-download text-[14px]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
