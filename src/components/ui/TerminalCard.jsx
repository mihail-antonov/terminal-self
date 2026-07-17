import { useEffect, useRef } from 'preact/hooks'
import gsap from 'gsap'

const info = [
  { label: 'name',     value: 'Mihail Antonov' },
  { label: 'role',     value: 'Frontend Developer' },
  { label: 'exp',      value: '6 years' },
  { label: 'status',   value: 'OPEN TO WORK', highlight: true },
  { label: 'location', value: 'Remote' },
]

const skills = [
  { name: 'React / Preact', pct: 93 },
  { name: 'TypeScript',     pct: 87 },
  { name: 'GSAP / Motion',  pct: 91 },
  { name: 'CSS / Design',   pct: 89 },
  { name: 'Node.js',        pct: 72 },
]

const dots = ['#ff5f57', '#febc2e', '#28c840']

export function TerminalCard() {
  const ref = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items  = ref.current.querySelectorAll('.t')
      const bars   = ref.current.querySelectorAll('.bar')
      const cursor = ref.current.querySelector('.cursor')

      gsap.set(items, { opacity: 0 })
      gsap.set(bars,  { width: '0%' })

      const tl = gsap.timeline({ delay: 0.5 })
      items.forEach((el, i) => tl.to(el, { opacity: 1, duration: 0.05 }, i * 0.06))
      bars.forEach(bar => tl.to(bar, { width: bar.dataset.w, duration: 0.55, ease: 'power2.out' }, '>-0.35'))

      gsap.to(cursor, { opacity: 0, duration: 0.55, ease: 'steps(1)', yoyo: true, repeat: -1, delay: 0.5 })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="w-full overflow-hidden rounded-xl" style={{ border: '1px solid rgba(127,238,160,0.12)', background: 'rgba(10,14,20,0.9)' }}>

      {/* Titlebar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
      >
        {dots.map(c => (
          <span key={c} className="w-3 h-3 rounded-full shrink-0" style={{ background: c }} />
        ))}
        <span className="text-[11px] text-[#898992] mx-auto tracking-wide">~/mihail-antonov — bash</span>
      </div>

      {/* Body */}
      <div className="p-6 md:p-7 text-[13px] leading-[2]" style={{ color: '#e2e8f0' }}>

        {/* whoami block */}
        <p className="t text-green font-medium mb-1">$ whoami</p>
        <div className="t mb-4" style={{ height: '1px', background: 'rgba(127,238,160,0.15)' }} />

        <div className="mb-6 flex flex-col gap-[3px]">
          {info.map(({ label, value, highlight }) => (
            <div key={label} className="t flex items-center">
              <span className="text-[#898992] shrink-0" style={{ minWidth: '84px', marginRight: '12px' }}>{label}</span>
              <span className={highlight ? 'text-green font-medium' : 'text-fg'}>
                {highlight ? `[${value}]` : value}
                {highlight && (
                  <span
                    className="inline-block w-[7px] h-[7px] rounded-full ml-2 align-middle"
                    style={{ background: '#7feea0', boxShadow: '0 0 6px #7feea0' }}
                  />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* skills block */}
        <p className="t text-green font-medium mb-1">$ top --skills</p>
        <div className="t mb-4" style={{ height: '1px', background: 'rgba(127,238,160,0.15)' }} />

        <div className="flex flex-col gap-4 mb-6">
          {skills.map(({ name, pct }) => (
            <div key={name} className="t">
              <div className="flex justify-between mb-2">
                <span className="text-[#898992] text-[12px]">{name}</span>
                <span className="text-green text-[12px]">{pct}%</span>
              </div>
              <div
                className="relative overflow-hidden rounded-full"
                style={{ height: '3px', background: 'rgba(255,255,255,0.07)' }}
              >
                <div
                  className="bar absolute inset-y-0 left-0 rounded-full"
                  data-w={pct + '%'}
                  style={{ background: 'linear-gradient(90deg, #7feea0, #38bdf8)' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Prompt */}
        <span className="t text-green font-medium">$ </span>
        <span
          className="cursor inline-block w-[9px] h-[15px] align-middle ml-px"
          style={{ background: '#7feea0', boxShadow: '0 0 6px #7feea0' }}
        />
      </div>
    </div>
  )
}
