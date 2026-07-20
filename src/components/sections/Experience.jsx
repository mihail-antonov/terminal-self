import {useRef, useEffect} from 'preact/hooks'
import gsap from 'gsap'
import {usePortfolio} from '../../contexts/PortfolioContext'
import {DecoCube} from '../ui/DecoCube'
import {JobEntry, SkeletonEntry} from '../ui/JobEntry'

export function Experience() {

  const {experience: jobs, loadingExperience: loading} = usePortfolio()
  const listRef = useRef()

  useEffect(() => {
    if (loading || !jobs.length) return
    const ctx = gsap.context(() => {
      const lines = listRef.current.querySelectorAll('.timeline-line')
      if (!lines.length) return
      gsap.set(lines, {scaleY: 0, transformOrigin: 'top center'})
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 1,
        },
      })
      tl.to(lines, {scaleY: 1, ease: 'none', duration: 1, stagger: 1})
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
        className="absolute top-[8%] right-[4%] pointer-events-none"
      />
      <DecoCube
        size={38}
        borderOpacity={0.08}
        trigger="#experience"
        yTravel={70}
        initialRotate="rotateX(30deg) rotateY(60deg)"
        className="absolute bottom-[18%] right-[14%] pointer-events-none"
      />
      <DecoCube
        size={28}
        borderOpacity={0.1}
        trigger="#experience"
        yTravel={55}
        initialRotate="rotateX(40deg) rotateY(20deg)"
        className="absolute top-[35%] left-[2%] pointer-events-none"
      />
      <DecoCube
        size={50}
        borderOpacity={0.07}
        trigger="#experience"
        yTravel={90}
        initialRotate="rotateX(10deg) rotateY(70deg)"
        className="absolute top-[60%] right-[6%] pointer-events-none"
      />
      <DecoCube
        size={22}
        borderOpacity={0.09}
        trigger="#experience"
        yTravel={45}
        initialRotate="rotateX(50deg) rotateY(15deg)"
        className="absolute bottom-[5%] left-[8%] pointer-events-none"
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
              <SkeletonEntry key={i} isLast={idx === arr.length - 1}/>
            ))
            : jobs.map((job, i) => (
              <JobEntry key={job.id} {...job} isLast={i === jobs.length - 1} isPresent={i === 0}/>
            ))
          }
        </div>
      </div>
    </section>
  )
}
