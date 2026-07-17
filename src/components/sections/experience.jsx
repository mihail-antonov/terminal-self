import { useRef, useEffect } from 'preact/hooks'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { parseTech } from '../../hooks/usePB'
import { usePortfolio } from '../../utils/PortfolioContext'
import { DecoCube } from '../ui/DecoCube'
import { LuArrowUpRight } from 'react-icons/lu'
import { DynIcon } from '../ui/DynIcon'

gsap.registerPlugin(ScrollTrigger)

function JobEntry({ icon, name, link, description, tech, from, to, isLast, isPresent }) {
  const ref     = useRef()
  const dateRef = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        x: -12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1,
        },
      })
      gsap.from(dateRef.current, {
        opacity: 0,
        x: -8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="relative flex gap-6 md:gap-10">
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center shrink-0">
        <div className="relative w-3 h-3 mt-[3px] shrink-0">
          {isPresent && <span className="absolute inset-0 rounded-full bg-green/30 animate-pulse-ring" />}
          <span className={`absolute inset-[2px] rounded-full bg-green ${isPresent ? 'shadow-[0_0_10px_rgba(255,107,0,1)]' : 'shadow-[0_0_4px_rgba(255,107,0,0.4)] opacity-40'}`} />
        </div>
        <div className="timeline-line w-px flex-1 mt-2 bg-gradient-to-b from-zinc-700/60 to-transparent" />
      </div>

      {/* Content */}
      <div className={`flex flex-col md:flex-row flex-nowrap flex-1 min-w-0 gap-4 md:gap-16 items-start ${isLast ? 'pb-0' : 'pb-12'}`}>
        {/* Date */}
        <span ref={dateRef} className="text-xs leading-5 tracking-widest mb-2 block text-[#898992] min-w-50">
          {from} — {to}
        </span>

        <div className="flex flex-col">
          {/* Company + role */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
            {icon && <DynIcon name={icon} className="text-green text-sm" />}
            {link ? (
              <h3 className="text-zinc-300 font-semibold text-lg leading-5 m-0">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-zinc-300 no-underline hover:text-green transition-colors duration-200"
                >
                  {name}
                  <LuArrowUpRight className="text-[15px] mb-0.5 opacity-50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </h3>
            ) : (
              <h3 className="text-zinc-300 font-semibold text-lg leading-5">{name}</h3>
            )}
          </div>

          <ul className="text-sm leading-5 text-[#898992] mb-5 max-w-140 space-y-2 list-none p-0">
            {description.split('\n').filter(Boolean).map((line, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="shrink-0 mt-[5px] inline-block w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_5px_rgba(255,107,0,0.9)]" />
                <span className="block">{line.trim()}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {parseTech(tech).map(t => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded bg-green/[7%] text-green border border-green/15"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonEntry({ isLast }) {
  return (
    <div className="relative flex gap-6 md:gap-10 animate-pulse">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-3 h-3 mt-[3px] rounded-full bg-white/10" />
        {!isLast && <div className="w-px flex-1 mt-2 bg-border" />}
      </div>
      <div className="pb-12 flex-1 min-w-0">
        <div className="h-2 w-24 rounded bg-white/10 mb-3" />
        <div className="h-5 w-40 rounded bg-white/10 mb-3" />
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full rounded bg-white/[6%]" />
          <div className="h-3 w-5/6 rounded bg-white/[6%]" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-14 rounded bg-white/10" />
          <div className="h-5 w-14 rounded bg-white/10" />
        </div>
      </div>
    </div>
  )
}

export function Experience() {
  const { experience: jobs, loadingExperience: loading } = usePortfolio()
  const listRef = useRef()

  useEffect(() => {
    if (loading || !jobs.length) return
    const ctx = gsap.context(() => {
      const lines = listRef.current.querySelectorAll('.timeline-line')
      if (!lines.length) return
      gsap.set(lines, { scaleY: 0, transformOrigin: 'top center' })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 1,
        },
      })
      tl.to(lines, { scaleY: 1, ease: 'none', duration: 1, stagger: 1 })
    }, listRef)
    return () => ctx.revert()
  }, [jobs, loading])

  return (
    <section id="experience" className="flex flex-col justify-center min-h-svh relative py-20 md:py-40">
      <DecoCube
        size={64}
        borderOpacity={0.13}
        trigger="#experience"
        yTravel={110}
        initialRotate="rotateX(15deg) rotateY(38deg)"
        style={{ position: 'absolute', top: '8%', right: '4%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={38}
        borderOpacity={0.08}
        trigger="#experience"
        yTravel={70}
        initialRotate="rotateX(30deg) rotateY(60deg)"
        style={{ position: 'absolute', bottom: '18%', right: '14%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={28}
        borderOpacity={0.1}
        trigger="#experience"
        yTravel={55}
        initialRotate="rotateX(40deg) rotateY(20deg)"
        style={{ position: 'absolute', top: '35%', left: '2%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={50}
        borderOpacity={0.07}
        trigger="#experience"
        yTravel={90}
        initialRotate="rotateX(10deg) rotateY(70deg)"
        style={{ position: 'absolute', top: '60%', right: '6%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={22}
        borderOpacity={0.09}
        trigger="#experience"
        yTravel={45}
        initialRotate="rotateX(50deg) rotateY(15deg)"
        style={{ position: 'absolute', bottom: '5%', left: '8%', pointerEvents: 'none' }}
      />
      <div className="w-full max-w-6xl mx-auto px-5 md:px-22">
        <h2 className="text-2xl text-zinc-300 font-semibold tracking-tight mb-6">
          <span className="text-green">02_</span> Experience
        </h2>

        <p className="text-[#898992] text-sm leading-relaxed max-w-110 mb-8 md:mb-16">
          The places I've worked, the teams I've shipped with, and the problems I've helped solve along the way.
        </p>

        <div ref={listRef}>
          {loading
            ? [1, 2, 3].map((i, idx, arr) => (
                <SkeletonEntry key={i} isLast={idx === arr.length - 1} />
              ))
            : jobs.map((job, i) => (
                <JobEntry key={job.id} {...job} isLast={i === jobs.length - 1} isPresent={i === 0} />
              ))
          }
        </div>
      </div>
    </section>
  )
}
