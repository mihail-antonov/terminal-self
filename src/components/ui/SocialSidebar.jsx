import { usePB } from '../../hooks/usePB'

export function SocialSidebar() {
  const { data: links } = usePB('contacts')

  return (
    <aside className="hidden lg:flex fixed bottom-0 left-8 flex-col items-center gap-5 z-50">
      {links.map(({ name, icon, website }) => {
        const external = !website.startsWith('mailto:')
        return (
          <a
            key={name}
            href={website}
            target={external ? '_blank' : '_self'}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={name}
            className="text-[18px] no-underline transition-colors duration-200 text-green/35 hover:text-green"
          >
            <i className={`bi ${icon}`} />
          </a>
        )
      })}
      <div className="w-px h-16 mt-1 bg-[rgba(255,107,0,0.15)]" />
    </aside>
  )
}
