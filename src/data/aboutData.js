import {parseTech} from '../hooks/usePB'

export const DOTS = ['#3f3f46', '#3f3f46', '#ff6b00']

export function buildTerminalLines(profile) {
  const name = profile?.name ?? 'Mihail Antonov'
  const role = profile?.role ?? 'Frontend Developer'
  const exp = profile?.exp ?? 6
  const location = profile?.location ?? 'Remote'
  const available = profile?.available ?? false
  const stack = parseTech(profile?.stack).length ? parseTech(profile?.stack) : ['React', 'Next.js', 'Shopify']
  const statusVal = available ? '"AVAILABLE",' : '"NOT AVAILABLE",'

  return [
    {prompt: true, text: 'node mihail.js --verbose'},
    {text: ''},
    {text: '  Initializing...         ✓', dim: true},
    {text: '  Loading skills...       ✓', dim: true},
    {text: '  Brewing coffee...       ✓', dim: true},
    {text: '  Checking ego...         LOW (good sign)', dim: true},
    {text: ''},
    {text: '  Output: {'},
    {key: 'name', val: `"${name}"`},
    {key: 'role', val: `"${role}"`},
    {key: 'exp', val: `${exp},`},
    {key: 'location', val: `"${location}"`},
    {highlight: true, statusVal},
    {key: 'stack', val: `[${stack.map(s => `"${s}"`).join(', ')}],`},
    {text: '  }'},
    {text: ''},
  ]
}
