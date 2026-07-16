import { useRef, useEffect } from 'preact/hooks'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { usePB, parseTech } from '../../hooks/usePB'
import { DecoCube } from '../ui/DecoCube'

gsap.registerPlugin(ScrollTrigger)

function IconArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProjectCard({ name, description, tech, repository, website }) {

  return (
    <li className="list-none rounded-xl border border-zinc-800/80 bg-[#111113] shadow-[0_0_60px_rgba(255,107,0,0.07)] will-change-transform">
      <div className="h-full flex flex-col p-5">
        {/* Title */}
        <h3 className="text-white font-semibold text-xl tracking-tight mb-3">{name}</h3>

        {/* Description */}
        <p className="text-sm leading-relaxed flex-1 text-zinc-500">{description}</p>

        {/* Divider */}
        <div className="my-5 border-t border-zinc-800/80" />

        {/* Stack */}
        <p className="text-[10px] tracking-[0.2em] uppercase mb-2.5 text-[rgba(255,107,0,0.4)]">Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {parseTech(tech).map(t => (
            <span
              key={t}
              className="text-[11px] px-2 py-0.5 rounded bg-green/[7%] text-green border border-green/15"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-5 mb-4 -mx-5 border-t border-zinc-800/80" />

        {/* Footer links */}
        <div className="flex items-center justify-between">
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[12px] no-underline text-green hover:opacity-70 transition-opacity duration-200"
            >
              Live <IconArrow />
            </a>
          ) : <span />}
          {repository ? (
            <a
              href={repository}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[12px] no-underline transition-colors duration-200 text-[rgba(255,107,0,0.45)]"
              onMouseEnter={e => { e.currentTarget.style.color = '#ff6b00' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,107,0,0.45)' }}
            >
              Code <i className="bi bi-github text-[13px]" />
            </a>
          ) : <span />}
        </div>
      </div>
    </li>
  )
}


function SkeletonCard() {
  return (
    <li className="list-none">
      <div className="h-full flex flex-col p-6 rounded-xl border border-white/[7%] bg-[rgba(15,21,32,0.5)] animate-pulse">
        <div className="flex items-center justify-between mb-5">
          <div className="h-2 w-6 rounded bg-white/10" />
          <div className="h-4 w-14 rounded-full bg-white/10" />
        </div>
        <div className="h-5 w-3/4 rounded bg-white/10 mb-3" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-full rounded bg-white/[6%]" />
          <div className="h-3 w-5/6 rounded bg-white/[6%]" />
          <div className="h-3 w-4/6 rounded bg-white/[6%]" />
        </div>
        <div className="my-5 border-t border-border" />
        <div className="flex gap-2">
          <div className="h-5 w-14 rounded bg-white/10" />
          <div className="h-5 w-14 rounded bg-white/10" />
          <div className="h-5 w-14 rounded bg-white/10" />
        </div>
      </div>
    </li>
  )
}

export function Projects() {
  const listRef    = useRef()
  const headingRef = useRef()

  const { data: projects, loading } = usePB('projects')

  useEffect(() => {
    if (loading || !listRef.current?.children.length) return

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 24,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 90%',
          end: 'top 55%',
          scrub: 1,
        },
      })

      gsap.from(listRef.current.children, {
        opacity: 0,
        y: 32,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 90%',
          end: 'top 30%',
          scrub: 1,
        },
      })
    })

    return () => ctx.revert()
  }, [loading])

  return (
    <section id="projects" className="relative py-20 md:py-40">
      <DecoCube
        size={72}
        borderOpacity={0.11}
        trigger="#projects"
        yTravel={120}
        initialRotate="rotateX(25deg) rotateY(20deg)"
        style={{ position: 'absolute', top: '5%', right: '2%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={42}
        borderOpacity={0.07}
        trigger="#projects"
        yTravel={80}
        initialRotate="rotateX(10deg) rotateY(55deg)"
        style={{ position: 'absolute', bottom: '10%', left: '1%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={32}
        borderOpacity={0.1}
        trigger="#projects"
        yTravel={60}
        initialRotate="rotateX(35deg) rotateY(65deg)"
        style={{ position: 'absolute', top: '42%', right: '1%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={54}
        borderOpacity={0.07}
        trigger="#projects"
        yTravel={100}
        initialRotate="rotateX(20deg) rotateY(40deg)"
        style={{ position: 'absolute', top: '20%', left: '0%', pointerEvents: 'none' }}
      />
      <DecoCube
        size={24}
        borderOpacity={0.09}
        trigger="#projects"
        yTravel={50}
        initialRotate="rotateX(45deg) rotateY(10deg)"
        style={{ position: 'absolute', bottom: '25%', right: '8%', pointerEvents: 'none' }}
      />
      <div className="max-w-6xl mx-auto px-5 md:px-22">
        <h3 className="text-2xl text-white font-semibold tracking-tight mb-6">
          <span className="text-green">03_</span> Projects
        </h3>

        <p className="text-zinc-500 text-sm leading-relaxed max-w-105 mb-8 md:mb-16">
          Storefronts, product UIs, and a few experiments. The work I'm proud enough to show.
        </p>

        <ul ref={listRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-4 lg:gap-12 p-0">
          {loading
            ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
            : projects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  {...p}
                />
              ))
          }
        </ul>
      </div>
    </section>
  )
}
