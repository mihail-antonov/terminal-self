import {useRef, useEffect, useCallback} from 'preact/hooks'
import {useScrollAnimation} from '../../hooks/useScrollAnimation'
import {usePortfolio} from '../../contexts/PortfolioContext'
import {useTerminal} from '../../hooks/useTerminal'
import {toHref, isExternal, linkLabel} from '../../utils/links'
import {DynIcon} from '../ui/DynIcon'
import pkg from '../../../package.json'

function HireCard() {
  return (
    <div>
      <div className="min-h-[1.9em]"/>
      {[
        '  Running compatibility check...',
        '',
        '  [✓] Interesting project         REQUIRED',
        '  [✓] Remote-friendly team        REQUIRED',
        '  [✓] Reasonable humans           REQUIRED',
        '  [?] Ping pong table             NICE TO HAVE',
        '',
        '  Status: READY TO TALK',
        '',
      ].map((line, i) => (
        <div key={i} className="text-[#898992] min-h-[1.9em]">{line || ' '}</div>
      ))}
      <div className="text-[#898992]">
        {'  Drop me a line: '}
        <a
          href="mailto:hello@mihail-antonov.dev"
          onClick={e => e.stopPropagation()}
          className="text-green no-underline border-b border-green/30 hover:border-green transition-[border-color] duration-150"
        >
          hello@mihail-antonov.dev
        </a>
      </div>
      <div className="text-[#898992] min-h-[1.9em]">{'  Response time: < 24h (coffee permitting)'}</div>
      <div className="min-h-[1.9em]"/>
    </div>
  )
}

function Prompt({cmd}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[#898992] select-none whitespace-nowrap">
        <span className="text-green">mihail</span>@portfolio:~$
      </span>
      <span className="text-fg">{cmd}</span>
    </div>
  )
}

function ContactCard({links}) {
  return (
    <div className="mt-[0.3em] mb-[0.3em]">
      <div className="text-[#898992] mb-[0.8em]">
        {"  Let's build something great together."}
      </div>
      {links.map(({icon, name, website}) => {
        const href = toHref(website)
        const external = isExternal(href)
        return (
          <div key={name} className="flex items-center gap-3 mb-1">
            <span className="text-[#898992] min-w-3 flex items-center gap-1.5">
              {'  '}
              {icon && <DynIcon name={icon}/>}
            </span>
            <a
              href={href}
              target={external ? '_blank' : '_self'}
              rel={external ? 'noopener noreferrer' : undefined}
              onClick={e => e.stopPropagation()}
              className="text-green no-underline border-b border-green/30 transition-[border-color] duration-150 hover:border-green"
            >
              {linkLabel(href)}
            </a>
          </div>
        )
      })}
    </div>
  )
}

function TerminalEntry({entry, contactLinks}) {
  if (entry.type === 'command') return <Prompt cmd={entry.text}/>
  if (entry.type === 'contact-card') return <ContactCard links={contactLinks}/>
  if (entry.type === 'hire-card') return <HireCard/>

  if (entry.type === 'link') {
    const external = isExternal(entry.href)
    return (
      <div>
        <div className="min-h-[1.9em]"/>
        <div className="text-[#898992]">
          {'  '}{entry.name}:{' '}
          <a
            href={entry.href}
            target={external ? '_blank' : '_self'}
            rel={external ? 'noopener noreferrer' : undefined}
            onClick={e => e.stopPropagation()}
            className="text-green no-underline border-b border-green/30 hover:border-green transition-[border-color] duration-150"
          >
            {entry.label}
          </a>
        </div>
        <div className="min-h-[1.9em]"/>
      </div>
    )
  }

  if (entry.type === 'output') {
    return (
      <div>
        {entry.lines.map((line, j) => (
          <div key={j} className="text-[#898992] min-h-[1.9em]">{line || ' '}</div>
        ))}
      </div>
    )
  }

  return null
}

export function Contact() {
  const {contacts: contactLinks, experience, projects} = usePortfolio()
  const {history, input, setInput, handleSubmit, handleKeyDown} = useTerminal({
    contacts: contactLinks,
    projects,
    experience,
  })

  const terminalRef = useRef()
  const terminalCardRef = useRef()
  const inputRef = useRef()
  const sectionRef = useRef()

  useScrollAnimation(sectionRef, {y: 0, duration: 0.7})
  useScrollAnimation(terminalCardRef, {y: 40, scrub: true})

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const focusInput = () => inputRef.current?.focus({preventScroll: true})

  const handleInputFocus = useCallback(() => {
    setTimeout(() => {
      terminalCardRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'})
    }, 350)
  }, [])

  return (
    <section id="contact" ref={sectionRef}
             className="flex flex-col items-center justify-center py-20 md:py-40 overflow-hidden min-h-svh">
      <div className="max-w-3xl mx-auto px-5 w-full">

        <h3 className="text-2xl text-zinc-300 font-semibold tracking-tight mb-6">
          <span className="text-green">04_</span> Contact
        </h3>

        <p className="text-[#898992] text-sm leading-relaxed max-w-105 mb-8 md:mb-16">
          Not available right now, but always up for a good conversation. Drop a line — I read everything.
        </p>

        <div className="relative">
          <div aria-hidden="true"
               className="bg-grid-pattern-subtle absolute -bottom-[40px] md:-bottom-[120px] -top-[40px] -left-[30px] md:-left-[130px] -right-[30px] md:-right-[200px] pointer-events-none z-0"/>
          <div aria-hidden="true" className="bg-glow-orange absolute -inset-24 pointer-events-none z-0"/>

          <div
            ref={terminalCardRef}
            className="relative z-1 rounded-xl overflow-hidden cursor-text border border-zinc-800/75 shadow-[0_0_60px_rgba(255,107,0,0.07)] bg-[#111113]"
            onClick={focusInput}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/75 bg-[#111113] select-none">
              <span className="w-3 h-3 rounded-full shrink-0 bg-[#3f3f46]"/>
              <span className="w-3 h-3 rounded-full shrink-0 bg-[#3f3f46]"/>
              <span className="w-3 h-3 rounded-full shrink-0 bg-green"/>
              <span className="text-[12px] ml-3 text-[#898992]">
                <span className="text-green">mihail</span>@portfolio: ~
              </span>
              <span className="text-[11px] text-[#898992]/40 ml-auto tracking-widest">v{pkg.version}</span>
            </div>

            {/* Body */}
            <div
              ref={terminalRef}
              data-lenis-prevent
              className="terminal-body flex flex-col p-5 md:p-6 text-[13px] leading-[1.9] overflow-y-auto h-85 bg-[#111113]"
            >
              {history.map((entry, i) => (
                <TerminalEntry key={i} entry={entry} contactLinks={contactLinks}/>
              ))}

              {/* Active input */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-auto flex-wrap">
                <span className="text-[#898992] select-none whitespace-nowrap">
                  <span className="text-green">mihail</span>@portfolio:~$
                </span>
                <div className="relative flex-1 min-w-0 flex items-center">
                  <span className="text-fg text-[13px] font-[inherit]">{input}</span>
                  <span className="inline-block w-[9px] h-[14px] align-middle bg-green shrink-0 animate-blink"/>
                  <input
                    ref={inputRef}
                    type="text"
                    aria-label="Terminal command input"
                    value={input}
                    onInput={e => setInput(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    autoComplete="off"
                    autoCorrect="off"
                    className="absolute inset-0 opacity-0 w-full bg-transparent border-none outline-none font-[inherit]"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
