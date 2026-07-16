import { useRef } from 'preact/hooks'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const entries = [
  {
    institution: 'Self-Taught',
    credential: 'Frontend Development',
    from: '2018',
    to: 'Present',
    note: 'The Complete Web Developer Bootcamp + 6 years of shipping real products.',
  },
  {
    institution: 'University',
    credential: 'Bachelor of Computer Science',
    from: '2016',
    to: '2020',
    note: 'Algorithms, data structures, software engineering fundamentals.',
  },
]

export function Education() {
  const headingRef = useRef()

  useScrollAnimation(headingRef, { y: 0, duration: 0.7 })

  return (
    <section id="education" className="py-32 md:py-40">
      <div className="max-w-6xl mx-auto px-5">

        <p className="text-[11px] tracking-widest uppercase mb-2" style={{ color: '#ff6b00' }}>
          <span style={{ color: '#ff6b00' }}>05.</span> Education
        </p>
        <h2
          ref={headingRef}
          className="text-white font-semibold tracking-tight mb-16"
          style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
        >
          Background
        </h2>

        <div className="flex flex-col gap-0">
          {entries.map(({ institution, credential, from, to, note }, i) => {
            const ref = useRef()
            useScrollAnimation(ref, { y: 0, duration: 0.6, delay: i * 0.1 })
            return (
              <div
                key={institution}
                ref={ref}
                className="py-8 border-t"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                  <h3 className="text-white font-semibold text-lg">{institution}</h3>
                  <span className="text-zinc-500 text-[13px]">/</span>
                  <span className="text-zinc-500 text-[13px]">{credential}</span>
                  <span className="text-[12px] text-zinc-500 ml-auto">{from} → {to}</span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-[540px]">{note}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
