import { useState, useRef, useEffect, useCallback } from 'preact/hooks'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { usePB } from '../../hooks/usePB'

const DEV_JOKES = [
  ['Q: Why do developers prefer dark mode?', 'A: Because light attracts bugs.'],
  ['Q: How many programmers to change a lightbulb?', "A: None. That's a hardware problem."],
  ["Q: Why did the developer quit his job?", "A: He didn't get arrays."],
  ['A SQL query walks into a bar,', 'walks up to two tables and asks... "Can I join you?"'],
  ["Q: What's a computer's favorite snack?", 'A: Microchips.'],
  ['There are only 10 kinds of people in the world:', "those who understand binary and those who don't."],
  ["Why don't programmers like nature?", 'It has too many bugs.'],
  ['// TODO: add a joke here', '// (I forgot)'],
]

function linkText(url) {
  return url.replace(/^mailto:/, '').replace(/^https?:\/\//, '')
}

const RESPONSES = {
  help: [
    '  Available commands:',
    '',
    '  contact          —  show contact info',
    '  github           —  show GitHub link',
    '  open github      —  open GitHub in browser',
    '  linkedin         —  show LinkedIn link',
    '  open linkedin    —  open LinkedIn in browser',
    '  email            —  show email address',
    '  send mail        —  open mail client',
    '  hire             —  make me an offer',
    '  joke             —  get a developer joke',
    '  ping             —  check if I\'m online',
    '  whoami           —  discover your true identity',
    '  ls               —  list available links',
    '  clear            —  clear the terminal',
  ],
  ls: [
    '  drwxr-xr-x  email/',
    '  drwxr-xr-x  github/',
    '  drwxr-xr-x  linkedin/',
    '  -rw-r--r--  contact.txt',
    '  -rw-r--r--  resume.pdf',
    '',
    '  Tip: type "contact" to open all links.',
  ],
  ping: [
    '  PING mihail-antonov.dev',
    '  64 bytes: icmp_seq=1 time=1ms',
    '  64 bytes: icmp_seq=2 time=2ms',
    '  64 bytes: icmp_seq=3 time=1ms',
    '',
    '  3 packets: 0% packet loss.',
    '  Online. Probably drinking coffee.',
  ],
  whoami: [
    '  Querying identity database...',
    '',
    '  User:   Unknown Visitor',
    '  Role:   Potential collaborator',
    '  Trust:  Pending',
    '',
    '  Run "hire" to apply for elevated trust.',
  ],
  'sudo hire me': [
    '  [sudo] password for visitor: ···',
    '  Authentication failure.',
    '  You are not in the sudoers file.',
    '  This incident will be reported.',
    '',
    '  (jk — email me: hello@mihail-antonov.dev)',
  ],
  'sudo make me a sandwich': ['  Make it yourself.', '', '  ...Just kidding.', '  🥪'],
  'rm -rf /': ["  rm: cannot remove '/': Permission denied", '', "  Nice try. I see you.", "  (This is why we can't have nice things)"],
  'npm install': ['  Installing packages...', '', '  ████████████████████ 100%', '', '  added 847 packages in 0ms', '  found 0 vulnerabilities', '', '  Today was a good day.'],
  'git blame': ['  Scanning commit history...', '', '  ff6b00a  Mihail Antonov  "it was me"', '  ff6b00b  Mihail Antonov  "still me"', '', "  It's always the one who wrote the code."],
  'git push --force': ['  ⚠ DANGEROUS OPERATION DETECTED', '', '  This is a portfolio. Nothing to force-push.', '', '  But seriously: never do this on main. 🙏'],
  ':q':  ['  This is not vim.', '', '  But I respect the muscle memory.'],
  ':wq': ['  This is not vim.', '', '  Nothing to save. But respect.'],
  ':q!': ['  Still not vim.', "  But I admire your commitment."],
  exit:  ['  Logout', '', '  Come back soon. This terminal gets lonely.'],
  hello: ["  Hello! Type 'help' to see what I can do."],
  hi:    ["  Hi there! Type 'help' to get started."],
  hey:   ["  Hey! Type 'help' to see available commands."],
  coffee: ['  ☕ Brewing...', '', "  Done. You're welcome.", '  (I also run on this stuff)'],
}

const INITIAL_HISTORY = [
  { type: 'command', text: 'cat contact.txt' },
  { type: 'contact-card' },
  { type: 'output', lines: ['', "  Type 'help' for available commands. Or just type anything.", ''] },
]

function HireCard() {
  return (
    <div>
      <div className="min-h-[1.9em]" />
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
        <div key={i} className="text-zinc-500 min-h-[1.9em]">{line || ' '}</div>
      ))}
      <div className="text-zinc-500">
        {'  Drop me a line: '}
        <a
          href="mailto:hello@mihail-antonov.dev"
          onClick={e => e.stopPropagation()}
          className="text-green no-underline border-b border-green/30 hover:border-green transition-[border-color] duration-150"
        >
          hello@mihail-antonov.dev
        </a>
      </div>
      <div className="text-zinc-500 min-h-[1.9em]">{'  Response time: < 24h (coffee permitting)'}</div>
      <div className="min-h-[1.9em]" />
    </div>
  )
}

function Prompt({ cmd }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-zinc-500 select-none whitespace-nowrap">
        <span className="text-green">mihail</span>@portfolio:~$
      </span>
      <span className="text-fg">{cmd}</span>
    </div>
  )
}

function ContactCard({ links }) {
  return (
    <div className="mt-[0.3em] mb-[0.3em]">
      <div className="text-zinc-500 mb-[0.8em]">
        {"  Let's build something great together."}
      </div>
      {links.map(({ icon, name, website }) => {
        const external = !website.startsWith('mailto:')
        return (
          <div key={name} className="flex items-center gap-3 mb-1">
            <span className="text-[#4a5568] min-w-3 flex items-center gap-1.5">
              {'  '}
              {icon && <i className={`bi ${icon}`} />}
            </span>
            <a
              href={website}
              target={external ? '_blank' : '_self'}
              rel={external ? 'noopener noreferrer' : undefined}
              onClick={e => e.stopPropagation()}
              className="text-green no-underline border-b border-green/30 transition-[border-color] duration-150 hover:border-green"
            >
              {linkText(website)}
            </a>
          </div>
        )
      })}
    </div>
  )
}

export function Contact() {

  const { data: contactLinks } = usePB('contacts')

  const [history, setHistory]       = useState(INITIAL_HISTORY)
  const [input, setInput]           = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [histIdx, setHistIdx]       = useState(-1)

  const terminalRef = useRef()
  const inputRef    = useRef()
  const sectionRef  = useRef()

  useScrollAnimation(sectionRef, { y: 0, duration: 0.7 })

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const focusInput = () => inputRef.current?.focus({ preventScroll: true })

  const run = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return

    if (cmd === 'clear') {
      setHistory(INITIAL_HISTORY)
      setCmdHistory(prev => [cmd, ...prev])
      setHistIdx(-1)
      return
    }

    const newEntries = [{ type: 'command', text: cmd }]

    if (cmd === 'cat contact.txt' || cmd === 'contact' || cmd === 'contacts') {
      newEntries.push({ type: 'contact-card' })
    } else if (cmd === 'hire') {
      newEntries.push({ type: 'hire-card' })
    } else if (cmd === 'github') {
      const gh = contactLinks?.find(l => l.name?.toLowerCase() === 'github')
      newEntries.push(gh
        ? { type: 'link', name: 'Github', href: gh.website, label: linkText(gh.website) }
        : { type: 'output', lines: ['', '  github: link not found.', ''] }
      )
    } else if (cmd === 'open github') {
      const gh = contactLinks?.find(l => l.name?.toLowerCase() === 'github')
      if (gh) {
        newEntries.push({ type: 'output', lines: ['', '  Opening GitHub...', `  ${linkText(gh.website)}`, ''] })
        window.open(gh.website, '_blank')
      } else {
        newEntries.push({ type: 'output', lines: ['', '  github: link not found.', ''] })
      }
    } else if (cmd === 'linkedin') {
      const li = contactLinks?.find(l => l.name?.toLowerCase() === 'linkedin')
      newEntries.push(li
        ? { type: 'link', name: 'LinkedIn', href: li.website, label: linkText(li.website) }
        : { type: 'output', lines: ['', '  linkedin: link not found.', ''] }
      )
    } else if (cmd === 'open linkedin') {
      const li = contactLinks?.find(l => l.name?.toLowerCase() === 'linkedin')
      if (li) {
        newEntries.push({ type: 'output', lines: ['', '  Opening LinkedIn...', `  ${linkText(li.website)}`, ''] })
        window.open(li.website, '_blank')
      } else {
        newEntries.push({ type: 'output', lines: ['', '  linkedin: link not found.', ''] })
      }
    } else if (cmd === 'email' || cmd === 'mail') {
      newEntries.push({ type: 'link', name: 'Email', href: 'mailto:hello@mihail-antonov.dev', label: 'hello@mihail-antonov.dev' })
    } else if (cmd === 'send mail' || cmd === 'send email') {
      newEntries.push({ type: 'output', lines: ['', '  Opening mail client...', '  hello@mihail-antonov.dev', ''] })
      window.location.href = 'mailto:hello@mihail-antonov.dev'
    } else if (cmd === 'joke') {
      const j = DEV_JOKES[Math.floor(Math.random() * DEV_JOKES.length)]
      newEntries.push({ type: 'output', lines: ['', ...j.map(l => `  ${l}`), ''] })
    } else if (cmd === 'cat resume.pdf') {
      newEntries.push({ type: 'output', lines: ['', '  Binary file. Opening...', '  /public/resume.pdf', ''] })
      window.open('/resume.pdf', '_blank')
    } else if (RESPONSES[cmd]) {
      newEntries.push({ type: 'output', lines: ['', ...RESPONSES[cmd], ''] })
    } else {
      const quips = [
        `  bash: ${cmd}: command not found`,
        `  "${cmd}"? That's not in my PATH. Try 'help'.`,
        `  I once tried to run "${cmd}" too. Didn't end well.`,
        `  Error 418: I'm a teapot. Also, "${cmd}" is unknown.`,
        "  I have no idea what that means. Try 'help'.",
      ]
      newEntries.push({ type: 'output', lines: ['', quips[Math.floor(Math.random() * quips.length)], ''] })
    }

    setHistory(prev => [...prev, ...newEntries])
    setCmdHistory(prev => [cmd, ...prev])
    setHistIdx(-1)
  }, [contactLinks])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    run(input)
    setInput('')
  }, [input, run])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistIdx(prev => {
        const next = Math.min(prev + 1, cmdHistory.length - 1)
        setInput(cmdHistory[next] ?? '')
        return next
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistIdx(prev => {
        const next = Math.max(prev - 1, -1)
        setInput(next === -1 ? '' : cmdHistory[next] ?? '')
        return next
      })
    }
  }, [cmdHistory])

  return (
    <section id="contact" ref={sectionRef} className="flex flex-col items-center justify-center py-20 md:py-40 overflow-hidden min-h-svh">
      <div className="max-w-3xl mx-auto px-5 w-full">

        <h3 className="text-2xl text-white font-semibold tracking-tight mb-6">
          <span className="text-green">04_</span> Contact
        </h3>

        <p className="text-zinc-500 text-sm leading-relaxed max-w-105 mb-8 md:mb-16">
          Not available right now, but always up for a good conversation. Drop a line — I read everything.
        </p>

        {/* Terminal + grid wrapper */}
        <div className="relative">

          <div aria-hidden="true" className="bg-grid-pattern-subtle absolute -bottom-[40px] md:-bottom-[120px] -top-[40px] -left-[30px] md:-left-[130px] -right-[30px] md:-right-[200px] pointer-events-none z-0" />
          <div aria-hidden="true" className="bg-glow-orange absolute -inset-24 pointer-events-none z-0" />

          {/* Terminal */}
          <div
            className="relative z-1 rounded-xl overflow-hidden cursor-text border border-zinc-800/75 shadow-[0_0_60px_rgba(255,107,0,0.07)] bg-[#111113]"
            onClick={focusInput}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/75 bg-[#111113] select-none">
              <span className="w-3 h-3 rounded-full shrink-0 bg-[#3f3f46]" />
              <span className="w-3 h-3 rounded-full shrink-0 bg-[#3f3f46]" />
              <span className="w-3 h-3 rounded-full shrink-0 bg-green" />
              <span className="text-[12px] ml-3 text-zinc-500">
                <span className="text-green">mihail</span>@portfolio: ~
              </span>
            </div>

            {/* Body */}
            <div
              ref={terminalRef}
              data-lenis-prevent
              className="terminal-body flex flex-col p-5 md:p-6 text-[13px] leading-[1.9] overflow-y-auto h-85 bg-[#111113]"
            >
              {history.map((entry, i) => {
                if (entry.type === 'command') {
                  return <Prompt key={i} cmd={entry.text} />
                }
                if (entry.type === 'contact-card') {
                  return <ContactCard key={i} links={contactLinks} />
                }
                if (entry.type === 'hire-card') {
                  return <HireCard key={i} />
                }
                if (entry.type === 'link') {
                  const external = !entry.href.startsWith('mailto:')
                  return (
                    <div key={i}>
                      <div className="min-h-[1.9em]" />
                      <div className="text-zinc-500">
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
                      <div className="min-h-[1.9em]" />
                    </div>
                  )
                }
                if (entry.type === 'output') {
                  return (
                    <div key={i}>
                      {entry.lines.map((line, j) => (
                        <div key={j} className="text-zinc-500 min-h-[1.9em]">
                          {line || ' '}
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              })}

              {/* Active input */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-auto flex-wrap">
                <span className="text-zinc-500 select-none whitespace-nowrap">
                  <span className="text-green">mihail</span>@portfolio:~$
                </span>
                <div className="relative flex-1 min-w-0 flex items-center">
                  <span className="text-fg text-[13px] font-[inherit]">{input}</span>
                  <span
                    className="inline-block w-[9px] h-[14px] align-middle bg-green shrink-0"
                    style={{ animation: 'blink 1.1s steps(1) infinite' }}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onInput={e => setInput(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
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
