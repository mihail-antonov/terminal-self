import {lazy, Suspense} from 'preact/compat'
import { PortfolioProvider } from './contexts/PortfolioContext'
import {SmoothScroll} from './components/ui/SmoothScroll'
import {SocialSidebar} from './components/ui/SocialSidebar'
import {SideNav} from './components/ui/SideNav'
import {Hero} from './components/sections/Hero'
import {About} from './components/sections/About'

const Experience = lazy(() => import('./components/sections/Experience').then(m => ({default: m.Experience})))
const Projects = lazy(() => import('./components/sections/Projects').then(m => ({default: m.Projects})))
const Contact = lazy(() => import('./components/sections/Contact').then(m => ({default: m.Contact})))

export function App() {
  return (
    <PortfolioProvider>
      <SmoothScroll/>
      <SideNav/>
      <SocialSidebar/>
      <main>
        <Hero/>
        <About/>
        <Suspense>
          <Experience/>
          <Projects/>
          <Contact/>
        </Suspense>
      </main>
    </PortfolioProvider>
  )
}
