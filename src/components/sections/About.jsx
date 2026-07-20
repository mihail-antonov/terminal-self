import {useRef, useEffect} from 'preact/hooks'
import gsap from 'gsap'
import {useScrollAnimation} from '../../hooks/useScrollAnimation'
import {DecoCube} from '../ui/DecoCube'
import {LuCloudDownload} from 'react-icons/lu'
import {usePortfolio} from '../../contexts/PortfolioContext'
import {DOTS, buildTerminalLines} from '../../data/aboutData'
import pb from '../../utils/pb'

function TerminalLine({line}) {
  if (line.prompt) return (
    <div className="term-line term-prompt flex flex-wrap items-center gap-2 mb-1">
      <span className="text-[#898992] select-none"><span className="text-green">mihail</span>@portfolio:~$</span>
      <span className="text-zinc-200 whitespace-break-spaces" data-type-text={line.text} />
    </div>
  )
  if (line.highlight) return (
    <div className="term-line whitespace-pre">
      <span className="text-[#898992]">{'    status:   '}</span>
      <span className="text-[#898992] font-semibold" data-type-text={` ${line.statusVal}`} />
    </div>
  )
  if (line.key) return (
    <div className="term-line wrap-break-word pl-[15ch] indent-[-15ch]">
      <span className="text-[#898992] whitespace-pre">{'    '}{line.key}:{' '.repeat(Math.max(1, 10 - line.key.length))}</span>
      <span className="text-fg" data-type-text={line.val} />
    </div>
  )
  if (!line.text) return (
    <div className="term-line whitespace-pre min-h-[1.9em] text-[#898992]"> </div>
  )
  return (
    <div className={`term-line whitespace-pre min-h-[1.9em] ${line.dim ? 'text-[#898992]/55' : 'text-[#898992]'}`}>
      <span data-type-text={line.text} />
    </div>
  )
}

export function About() {
  const {profile} = usePortfolio()
  const terminalLines = buildTerminalLines(profile)

  const sectionRef = useRef()
  const bioRef = useRef()
  const terminalWrapRef = useRef()
  const terminalBodyRef = useRef()

  useScrollAnimation(bioRef, {y: 0, duration: 0.6})

  // Type characters as user scrolls; structural parts (prompts, keys) stay visible
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cursorEl = terminalBodyRef.current.querySelector('.term-cursor')
      const lines = Array.from(terminalBodyRef.current.querySelectorAll('.term-line:not(.term-cursor)')).map(lineEl => {
        const typeEl = lineEl.querySelector('[data-type-text]')
        const isPrompt = lineEl.classList.contains('term-prompt')
        return { lineEl, typeEl, text: typeEl?.dataset.typeText ?? '', isPrompt }
      })

      if (cursorEl) {
        gsap.set(cursorEl, { opacity: 0 })
        cursorEl.style.transition = 'opacity 0.3s ease'
      }
      lines.forEach(({ lineEl, typeEl, isPrompt }) => {
        if (typeEl) typeEl.textContent = ''
        if (isPrompt && typeEl) typeEl.style.opacity = '0'
        if (!isPrompt && typeEl) gsap.set(lineEl, { opacity: 0 })
      })

      const totalUnits = lines.reduce((sum, l) => sum + (l.text.length || 1), 0)

      gsap.to({}, {
        scrollTrigger: {
          trigger: terminalBodyRef.current,
          start: 'top 90%',
          end: 'center center+=10%',
          scrub: 1,
          onUpdate(self) {
            let remaining = Math.round(self.progress * totalUnits)
            for (const { lineEl, typeEl, text, isPrompt } of lines) {
              if (remaining <= 0) {
                if (typeEl) typeEl.textContent = ''
                if (isPrompt && typeEl) typeEl.style.opacity = '0'
                if (!isPrompt && typeEl) lineEl.style.opacity = '0'
              } else {
                if (typeEl) typeEl.textContent = text.slice(0, Math.min(remaining, text.length))
                if (isPrompt && typeEl) typeEl.style.opacity = Math.min(remaining / 5, 1)
                if (!isPrompt && typeEl) lineEl.style.opacity = Math.min(remaining / 5, 1)
              }
              remaining -= text.length || 1
            }
            // Cursor appears only after all content has typed
            if (cursorEl) cursorEl.style.opacity = remaining >= 0 ? '1' : '0'
          },
        },
      })
    })
    return () => ctx.revert()
  }, [profile])

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
    <section id="about" ref={sectionRef}
             className="flex flex-col items-center justify-center min-h-svh relative py-32 md:py-40 overflow-hidden">
      <DecoCube
        size={60}
        borderOpacity={0.12}
        trigger="#about"
        yTravel={100}
        initialRotate="rotateX(20deg) rotateY(50deg)"
        className="absolute top-[6%] right-[3%] pointer-events-none"
      />
      <DecoCube
        size={36}
        borderOpacity={0.08}
        trigger="#about"
        yTravel={70}
        initialRotate="rotateX(35deg) rotateY(15deg)"
        className="absolute bottom-[15%] right-[10%] pointer-events-none"
      />
      <DecoCube
        size={28}
        borderOpacity={0.1}
        trigger="#about"
        yTravel={55}
        initialRotate="rotateX(45deg) rotateY(65deg)"
        className="absolute top-[30%] left-[1%] pointer-events-none"
      />
      <DecoCube
        size={48}
        borderOpacity={0.07}
        trigger="#about"
        yTravel={85}
        initialRotate="rotateX(15deg) rotateY(40deg)"
        className="absolute bottom-[8%] left-[5%] pointer-events-none"
      />
      <DecoCube
        size={22}
        borderOpacity={0.09}
        trigger="#about"
        yTravel={45}
        initialRotate="rotateX(50deg) rotateY(25deg)"
        className="absolute top-[55%] right-[5%] pointer-events-none"
      />

      <div className="w-full max-w-6xl mx-auto px-5 md:px-22">

        {/* Bio + Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 md:gap-20 lg:gap-32">

          {/* Terminal with parallax */}
          <div>
            <div className="relative">
              <div aria-hidden="true"
                   className="bg-grid-pattern-subtle absolute -bottom-10 md:-bottom-20 -top-10 md:-top-35 -left-7.5 md:-left-37.5 -right-7.5 md:-right-12.5 pointer-events-none z-0"/>
              <div aria-hidden="true" className="bg-glow-orange absolute -inset-24 pointer-events-none z-0"/>
              <div ref={terminalWrapRef}
                   className="relative z-1 rounded-xl overflow-hidden bg-[#111113] border border-zinc-800/75 shadow-[0_0_60px_rgba(255,107,0,0.07)] will-change-transform">
                {/* Title bar */}
                <div
                  className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/75 select-none bg-[#111113]"
                >
                  {DOTS.map((c, i) => (
                    <span key={i} className="w-3 h-3 rounded-full shrink-0" style={{background: c}}/>
                  ))}
                  <span className="text-[12px] ml-3 text-[#898992]">
                    <span className="text-green">mihail</span>@portfolio: ~/
                    <span className="text-zinc-300">01-about</span>
                  </span>
                </div>

                {/* Body */}
                <div ref={terminalBodyRef} className="p-5 text-[12.5px] leading-[1.9] font-[inherit]">
                  {terminalLines.map((line, i) => <TerminalLine key={i} line={line}/>)}

                  {/* Blinking cursor */}
                  <div className="term-line term-cursor flex items-center gap-2 mt-1">
                    <span className="text-[#898992] select-none">
                      <span className="text-green">mihail</span>@portfolio:~$
                    </span>
                    <span className="inline-block w-2.25 h-3.5 align-middle bg-green animate-blink"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div ref={bioRef} className="flex flex-col md:-mt-10">
            <h2 className="text-2xl text-zinc-300 font-semibold tracking-tight mb-6">
              <span className="text-green">01_</span> About
            </h2>

            <p className="text-sm leading-[2.1] mb-5 text-[#898992]">
              Building interfaces people actually use — the kind where design and engineering overlap and neither makes excuses for the other.
            </p>

            <p className="text-sm leading-[2.1] mb-5 text-[#898992]">
              I specialise in <span className="text-green">React</span>, <span className="text-green">Next.js</span>,
              and <span className="text-green">Shopify</span> — from custom storefronts with Liquid and SCSS to full
              product UIs with <span className="text-zinc-300 font-medium">Tailwind</span> and <span
              className="text-zinc-300 font-medium">Node</span>. I also bring 3D configurators to life in the browser
              with the <span className="text-zinc-300 font-medium">Threedium SDK</span>. I care about the gap between
              a good interface and one people actually remember.
            </p>

            <p className="text-sm leading-[2.1] mb-10 text-[#898992]">
              Outside of the desk, I'm usually on the tennis court, deep in a game, or going down a hardware rabbit hole I didn't need to start at 11pm.
            </p>

            {profile?.cv && (
              <a
                href={pb.files.getURL(profile, profile.cv)}
                download
                className="self-start inline-flex items-center justify-between gap-2 text-[12px] tracking-widest uppercase rounded-sm no-underline min-w-60 ps-6 pe-5 py-4 border border-green/30 bg-green/4 text-green font-semibold transition-all duration-200 hover:bg-green/8"
              >
                <span>Download CV</span> <LuCloudDownload className="text-[16px]"/>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
