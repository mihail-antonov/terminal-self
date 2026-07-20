import {useState, useCallback} from 'preact/hooks'
import {DEV_JOKES, RESPONSES, INITIAL_HISTORY, UNKNOWN_QUIPS} from '../data/terminalData'
import {linkLabel} from '../utils/links'

function buildOutput(lines) {
  return {type: 'output', lines: ['', ...lines, '']}
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function resolveCommand(cmd, {contacts, projects, experience}) {
  if (cmd === 'cat contact.txt' || cmd === 'contact' || cmd === 'contacts') {
    return {type: 'contact-card'}
  }

  if (cmd === 'hire') {
    return {type: 'hire-card'}
  }

  if (cmd === 'github') {
    const gh = contacts?.find(l => l.name?.toLowerCase() === 'github')
    return gh
      ? {type: 'link', name: 'Github', href: gh.website, label: linkLabel(gh.website)}
      : buildOutput(['  github: link not found.'])
  }

  if (cmd === 'linkedin') {
    const li = contacts?.find(l => l.name?.toLowerCase() === 'linkedin')
    return li
      ? {type: 'link', name: 'LinkedIn', href: li.website, label: linkLabel(li.website)}
      : buildOutput(['  linkedin: link not found.'])
  }

  if (cmd === 'email' || cmd === 'mail') {
    return {type: 'link', name: 'Email', href: 'mailto:hello@mihail-antonov.dev', label: 'hello@mihail-antonov.dev'}
  }

  if (cmd === 'projects') {
    if (!projects?.length) return buildOutput(['  No projects found.'])
    const lines = projects.flatMap((p, i) => [
      `  ${String(i + 1).padStart(2, '0')}.  ${p.name}`,
      ...(p.description ? [`       ${p.description.slice(0, 60)}${p.description.length > 60 ? '…' : ''}`] : []),
      '',
    ])
    return buildOutput(lines)
  }

  if (cmd === 'experience') {
    if (!experience?.length) return buildOutput(['  No experience found.'])
    const lines = experience.flatMap(j => [`  ${j.name}`, `  ${j.from} — ${j.to}`, ''])
    return buildOutput(lines)
  }

  if (cmd === 'about') {
    return buildOutput([
      '  Mihail Antonov — Frontend Developer',
      '',
      '  6 years building interfaces people actually use.',
      '  React, Next.js, Shopify — from storefronts to',
      '  full product UIs. Also 3D configurators via',
      '  the Threedium SDK.',
      '',
      '  Not available for new roles right now,',
      '  but always up for a good conversation.',
      '',
      '  Type "hire" to make an offer.',
    ])
  }

  if (cmd === 'joke') {
    const [line1, line2] = pickRandom(DEV_JOKES)
    return buildOutput([`  ${line1}`, `  ${line2}`])
  }

  if (cmd === 'cat resume.pdf') {
    window.open('/resume.pdf', '_blank')
    return buildOutput(['  Binary file. Opening...', '  /public/resume.pdf'])
  }

  if (RESPONSES[cmd]) {
    return buildOutput(RESPONSES[cmd])
  }

  return buildOutput([pickRandom(UNKNOWN_QUIPS(cmd))])
}

export function useTerminal({contacts, projects, experience}) {
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)

  const run = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return

    if (cmd === 'clear') {
      setHistory(INITIAL_HISTORY)
      setCmdHistory(prev => [cmd, ...prev])
      setHistIdx(-1)
      return
    }

    const result = resolveCommand(cmd, {contacts, projects, experience})
    setHistory(prev => [...prev, {type: 'command', text: cmd}, result])
    setCmdHistory(prev => [cmd, ...prev])
    setHistIdx(-1)
  }, [contacts, projects, experience])

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

  return {history, input, setInput, handleSubmit, handleKeyDown}
}
