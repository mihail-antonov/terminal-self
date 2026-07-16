import { SmoothScroll }     from './components/ui/SmoothScroll'
import { SocialSidebar }   from './components/ui/SocialSidebar'
import { SkillsMarquee }   from './components/ui/SkillsMarquee'
import { Hero }            from './components/sections/hero'
import { About }           from './components/sections/about'
import { Experience }     from './components/sections/experience'
import { Projects }       from './components/sections/projects'
import { Contact }        from './components/sections/contact'

export function App() {
  return (
    <>
      <SmoothScroll />
      <SocialSidebar />
      <main>
        <Hero />
        <About />
        {/* <SkillsMarquee /> */}
<Experience />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
