import {usePortfolio} from '../../contexts/PortfolioContext'
import {DynIcon} from './DynIcon'
import {toHref, isExternal} from '../../utils/links'

export function SocialSidebar() {

  const {contacts: links} = usePortfolio()

  return (
    <aside className="hidden lg:flex fixed bottom-0 flex-col items-center gap-5 z-50 left-sidebar">
      {links.map(({name, icon, website}) => {
        const href = toHref(website)
        const external = isExternal(href)
        return (
          <a
            key={name}
            href={href}
            target={external ? '_blank' : '_self'}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={name}
            className="text-[18px] no-underline transition-colors duration-200 text-green/35 hover:text-green"
          >
            <DynIcon name={icon}/>
          </a>
        )
      })}
      <div className="w-px h-16 mt-1 bg-[rgba(255,107,0,0.15)]"/>
    </aside>
  )
}