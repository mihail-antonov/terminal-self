import { PortfolioProvider } from './contexts/PortfolioContext'
import {SmoothScroll} from './components/ui/SmoothScroll'
import {SocialSidebar} from './components/ui/SocialSidebar'
import {SideNav} from './components/ui/SideNav'
import {Hero} from './components/sections/Hero'
import {About} from './components/sections/About'
import {Experience} from './components/sections/Experience'
import {Projects} from './components/sections/Projects'
import {Contact} from './components/sections/Contact'

export function App() {
  return (
    <PortfolioProvider>
      <SmoothScroll/>
      <SideNav/>
      <SocialSidebar/>
      <main>
        <Hero/>
        <About/>
        <Experience/>
        <Projects/>
        <Contact/>
      </main>
    </PortfolioProvider>
  )
}
