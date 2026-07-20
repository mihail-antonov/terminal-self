import {parseTech} from '../../hooks/usePB'
import {LuArrowUpRight, LuGithub} from 'react-icons/lu'

export function ProjectCard({name, description, tech, repository, website}) {
  return (
    <li
      className="list-none rounded-xl border border-zinc-800/80 bg-[#111113] shadow-[0_0_60px_rgba(255,107,0,0.07)] will-change-transform">
      <div className="h-full flex flex-col p-5">
        <h4 className="text-zinc-200 font-medium text-lg tracking-tight mb-3">{name}</h4>
        <p className="text-sm leading-relaxed flex-1 text-[#898992]">{description}</p>

        <div className="my-5 border-t border-zinc-800/80"/>

        <p className="text-[10px] tracking-[0.2em] uppercase mb-2.5 text-[rgba(255,107,0,0.4)]">Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {parseTech(tech).map(t => (
            <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-orange-500/[7%] text-orange-500 border border-orange-500/15">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 mb-4 -mx-5 border-t border-zinc-800/80"/>

        <div className="flex items-center justify-between">
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[12px] no-underline text-orange-500 hover:opacity-70 transition-opacity duration-200"
            >
              Live <LuArrowUpRight className="text-[14px]"/>
            </a>
          ) : <span/>}
          {repository ? (
            <a
              href={repository}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[12px] no-underline transition-colors duration-200 text-orange-500/45 hover:text-orange-500"
            >
              Code <LuGithub className="text-[13px]"/>
            </a>
          ) : <span/>}
        </div>
      </div>
    </li>
  )
}

export function SkeletonCard() {
  return (
    <li className="list-none rounded-xl border border-zinc-800/80 bg-[#111113] animate-pulse">
      <div className="h-full flex flex-col p-5">
        <div className="h-5 w-3/4 rounded bg-white/10 mb-3"/>
        <div className="space-y-2 flex-1 mb-5">
          <div className="h-3 w-full rounded bg-white/[6%]"/>
          <div className="h-3 w-5/6 rounded bg-white/[6%]"/>
          <div className="h-3 w-4/6 rounded bg-white/[6%]"/>
        </div>
        <div className="border-t border-zinc-800/80 mb-4"/>
        <div className="h-2 w-10 rounded bg-white/[6%] mb-2.5"/>
        <div className="flex gap-1.5 mb-5">
          <div className="h-5 w-14 rounded bg-white/10"/>
          <div className="h-5 w-14 rounded bg-white/10"/>
          <div className="h-5 w-10 rounded bg-white/10"/>
        </div>
        <div className="-mx-5 border-t border-zinc-800/80 mb-4"/>
        <div className="flex justify-between">
          <div className="h-4 w-10 rounded bg-white/10"/>
          <div className="h-4 w-10 rounded bg-white/10"/>
        </div>
      </div>
    </li>
  )
}
