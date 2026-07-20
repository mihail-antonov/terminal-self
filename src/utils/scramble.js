export const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*<>[]0123456789'

export function scramble(el, final, durationMs = 900) {
  const steps = 20
  let step = 0
  const id = setInterval(() => {
    step++
    const progress = step / steps
    el.textContent = final
      .split('')
      .map((char, i) => (i / final.length < progress)
        ? char
        : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
      )
      .join('')
    if (step >= steps) {
      clearInterval(id)
      el.textContent = final
    }
  }, durationMs / steps)
  return () => clearInterval(id)
}
