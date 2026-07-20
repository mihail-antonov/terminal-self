import {useRef, useEffect} from 'preact/hooks'
import gsap from 'gsap'
import {parseTech} from '../../hooks/usePB'
import {DynIcon} from './DynIcon'
import {LuArrowUpRight} from 'react-icons/lu'

export function JobEntry({icon, name, link, description, tech, from, to, isLast, isPresent}) {
  const ref = useRef()
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
          start: 'top 100%',
          end: 'top 90%',
          scrub: 1,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="group relative flex gap-6 md:gap-10">
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="absolute inset-0 z-10"
        />
      )}
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center shrink-0">
        <div className="relative w-3 h-3 mt-[3px] shrink-0">
          {isPresent && <span className="absolute inset-0 rounded-full bg-orange-500/30 animate-pulse-ring"/>}
          <span
            className={`absolute inset-[2px] rounded-full ${isPresent ? 'bg-orange-500 shadow-[0_0_10px_rgba(255,107,0,1)]' : 'bg-[rgba(255,107,0,0.22)]'}`}/>
        </div>
        <div className="timeline-line w-px flex-1 -mt-0.5 -mb-1" style={{background: 'linear-gradient(to bottom, transparent, rgba(255,107,0,0.22) 60px, rgba(255,107,0,0.22) calc(100% - 60px), transparent)'}}/>
      </div>

      {/* Content */}
      <div
        className={`flex flex-col md:flex-row flex-nowrap flex-1 min-w-0 gap-4 md:gap-16 items-start ${isLast ? 'pb-0' : 'pb-12'}`}>
        <span ref={dateRef} className="text-xs leading-5 tracking-widest mb-2 block text-[#898992] min-w-50">
          {from} — {to}
        </span>

        <div className="flex flex-col grow">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
            {icon && <DynIcon name={icon} className="text-orange-500 text-sm"/>}
            <h3 className={`inline-flex items-center gap-1.5 font-medium text-lg leading-5 text-zinc-200 ${link ? 'transition-colors duration-200 group-hover:text-orange-500' : ''}`}>
              {name}
              {link && <LuArrowUpRight className="text-[15px] mb-0.5 opacity-50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>}
            </h3>
          </div>

          <ul className="text-sm leading-5 text-[#898992] mb-5 max-w-140 space-y-2 list-none p-0">
            {description.split('\n').filter(Boolean).map((line, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span
                  className="shrink-0 mt-[5px] inline-block w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(255,107,0,0.9)]"/>
                <span className="block">{line.trim()}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {parseTech(tech).map(t => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-orange-500/[7%] text-orange-500 border border-orange-500/15">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonEntry({isLast}) {
  return (
    <div className="relative flex gap-6 md:gap-10 animate-pulse">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-3 h-3 mt-[3px] rounded-full bg-white/10"/>
        {!isLast && <div className="w-px flex-1 mt-2 bg-zinc-800/60"/>}
      </div>
      <div
        className={`flex flex-col md:flex-row flex-nowrap flex-1 min-w-0 gap-4 md:gap-16 items-start ${isLast ? 'pb-0' : 'pb-12'}`}>
        <div className="h-3 w-36 rounded bg-white/10 min-w-50 mt-1"/>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="h-5 w-44 rounded bg-white/10 mb-4"/>
          <div className="space-y-2 mb-5">
            <div className="h-3 w-full rounded bg-white/[6%]"/>
            <div className="h-3 w-5/6 rounded bg-white/[6%]"/>
            <div className="h-3 w-4/6 rounded bg-white/[6%]"/>
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-14 rounded bg-white/10"/>
            <div className="h-5 w-14 rounded bg-white/10"/>
            <div className="h-5 w-10 rounded bg-white/10"/>
          </div>
        </div>
      </div>
    </div>
  )
}
