import { useEffect } from 'preact/hooks'

// 4×4 row-major matrix multiply
function mm(a, b) {
  const r = new Array(16).fill(0)
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      for (let k = 0; k < 4; k++)
        r[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j]
  return r
}

function rxM(a) {
  const c = Math.cos(a), s = Math.sin(a)
  return [1, 0, 0, 0,  0, c, -s, 0,  0, s, c, 0,  0, 0, 0, 1]
}

function ryM(a) {
  const c = Math.cos(a), s = Math.sin(a)
  return [c, 0, s, 0,  0, 1, 0, 0,  -s, 0, c, 0,  0, 0, 0, 1]
}

// Row-major → CSS matrix3d (column-major)
function toCss(m) {
  return `matrix3d(${m[0]},${m[4]},${m[8]},${m[12]},${m[1]},${m[5]},${m[9]},${m[13]},${m[2]},${m[6]},${m[10]},${m[14]},${m[3]},${m[7]},${m[11]},${m[15]})`
}

const IDENTITY = [1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1]
const SENS = 0.008

export function useDragRotate(dragHandle, rotateTarget) {
  useEffect(() => {
    const el = dragHandle.current
    if (!el) return

    let isDragging = false
    let lastX = 0, lastY = 0
    let angVX = 0, angVY = 0
    let mat = [...IDENTITY]
    let rafId = null

    const apply = () => {
      rotateTarget.current.style.transform = toCss(mat)
    }

    const cancelInertia = () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
    }

    const tick = () => {
      angVX *= 0.93
      angVY *= 0.93
      // Pre-multiply so rotation always applies in world/screen space
      mat = mm(mm(rxM(angVY), ryM(angVX)), mat)
      apply()
      if (Math.abs(angVX) > 0.001 || Math.abs(angVY) > 0.001) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = null
      }
    }

    const onDown = (e) => {
      isDragging = true
      lastX = e.clientX
      lastY = e.clientY
      angVX = 0
      angVY = 0
      cancelInertia()
      el.style.cursor = 'grabbing'
    }

    const onMove = (e) => {
      if (!isDragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      angVX = dx * SENS
      angVY = -dy * SENS
      mat = mm(mm(rxM(angVY), ryM(angVX)), mat)
      apply()
    }

    const onUp = () => {
      if (!isDragging) return
      isDragging = false
      el.style.cursor = 'grab'
      rafId = requestAnimationFrame(tick)
    }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.style.cursor = 'grab'
    el.style.userSelect = 'none'
    el.style.touchAction = 'none'

    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      cancelInertia()
    }
  }, [])
}
