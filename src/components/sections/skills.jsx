import { useRef } from 'preact/hooks'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const categories = [
  {
    title: 'Languages',
    items: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3 / SCSS'],
  },
  {
    title: 'Frameworks & Libraries',
    items: ['React', 'Preact', 'Next.js', 'Vue.js', 'GSAP', 'Framer Motion'],
  },
  {
    title: 'Tooling',
    items: ['Vite', 'Webpack', 'Tailwind CSS', 'Storybook', 'Vitest', 'Git'],
  },
  {
    title: 'Backend / APIs',
    items: ['Node.js', 'REST API', 'GraphQL', 'PocketBase', 'Supabase'],
  },
  {
    title: 'Design',
    items: ['Figma', 'Accessibility (WCAG)', 'Design Systems', 'Responsive Design'],
  },
  {
    title: 'Practices',
    items: ['Web Performance', 'Core Web Vitals', 'CI/CD', 'Agile / Scrum'],
  },
]

export function Skills() {
  const headingRef = useRef()
  const gridRef    = useRef()

  useScrollAnimation(headingRef, { y: 0, duration: 0.7 })
  useScrollAnimation(gridRef,    { y: 0, duration: 0.6, delay: 0.08 })

  return (
    <section id="skills" className="py-32 md:py-40">
      <div className="max-w-6xl mx-auto px-5">

        <p className="text-[11px] tracking-widest uppercase mb-2" style={{ color: '#ff6b00' }}>
          <span style={{ color: '#ff6b00' }}>04.</span> Skills
        </p>
        <h2
          ref={headingRef}
          className="text-zinc-300 font-semibold tracking-tight mb-16"
          style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
        >
          What I work with
        </h2>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(({ title, items }) => (
            <div
              key={title}
              className="rounded-xl p-6"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(15,21,32,0.4)' }}
            >
              <p
                className="text-[11px] tracking-widest uppercase mb-5 font-medium"
                style={{ color: '#ff6b00' }}
              >
                {title}
              </p>
              <ul className="flex flex-col gap-2 p-0">
                {items.map(item => (
                  <li key={item} className="list-none flex items-center gap-2 text-[13px] text-[#898992]">
                    <span style={{ color: 'rgba(255,107,0,0.5)' }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
