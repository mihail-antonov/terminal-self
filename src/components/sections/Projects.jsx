import {useRef, useEffect} from 'preact/hooks'
import gsap from 'gsap'
import {usePortfolio} from '../../contexts/PortfolioContext'
import {DecoCube} from '../ui/DecoCube'
import {ProjectCard, SkeletonCard} from '../ui/ProjectCard'

export function Projects() {
  const listRef = useRef()

  const {projects, loadingProjects: loading} = usePortfolio()

  useEffect(() => {
    if (loading || !listRef.current?.children.length) return

    const ctx = gsap.context(() => {
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
        className="absolute top-[5%] right-[2%] pointer-events-none"
      />
      <DecoCube
        size={42}
        borderOpacity={0.07}
        trigger="#projects"
        yTravel={80}
        initialRotate="rotateX(10deg) rotateY(55deg)"
        className="absolute bottom-[10%] left-[1%] pointer-events-none"
      />
      <DecoCube
        size={32}
        borderOpacity={0.1}
        trigger="#projects"
        yTravel={60}
        initialRotate="rotateX(35deg) rotateY(65deg)"
        className="absolute top-[42%] right-[1%] pointer-events-none"
      />
      <DecoCube
        size={54}
        borderOpacity={0.07}
        trigger="#projects"
        yTravel={100}
        initialRotate="rotateX(20deg) rotateY(40deg)"
        className="absolute top-[20%] left-0 pointer-events-none"
      />
      <DecoCube
        size={24}
        borderOpacity={0.09}
        trigger="#projects"
        yTravel={50}
        initialRotate="rotateX(45deg) rotateY(10deg)"
        className="absolute bottom-[25%] right-[8%] pointer-events-none"
      />
      <div className="max-w-6xl mx-auto px-5 md:px-22">
        <h3 className="text-2xl text-zinc-300 font-semibold tracking-tight mb-6">
          <span className="text-green">03_</span> Projects
        </h3>

        <p className="text-[#898992] text-sm leading-relaxed mb-8 md:mb-16">
          Every project starts with a problem worth solving.<br/>
          These are the ones that stuck.
        </p>

        <ul ref={listRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-4 lg:gap-12 p-0">
          {loading
            ? [1, 2, 3].map(i => <SkeletonCard key={i}/>)
            : projects.map(p => <ProjectCard key={p.id} {...p} />)
          }
        </ul>
      </div>
    </section>
  )
}
