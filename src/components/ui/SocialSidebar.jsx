import { usePortfolio } from '../../utils/PortfolioContext'
import { DynIcon } from './DynIcon'

export function SocialSidebar() {
  const { contacts: links } = usePortfolio()

  return (
    <aside className="hidden lg:flex fixed bottom-0 flex-col items-center gap-5 z-50" style={{ left: 'max(1.5rem, calc((100vw - 90rem) / 2))' }}>
      {links.map(({ name, icon, website }) => {
        const href = website.includes('@') && !website.startsWith('mailto:') ? `mailto:${website}` : website
        const external = !href.startsWith('mailto:')
        return (
          <a
            key={name}
            href={href}
            target={external ? '_blank' : '_self'}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={name}
            className="text-[18px] no-underline transition-colors duration-200 text-green/35 hover:text-green"
          >
            <DynIcon name={icon} />
          </a>
        )
      })}
      <div className="w-px h-16 mt-1 bg-[rgba(255,107,0,0.15)]" />
    </aside>
  )
}
