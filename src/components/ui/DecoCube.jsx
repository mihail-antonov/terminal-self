import { useRef, useEffect } from 'preact/hooks'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function DecoCube({ size = 56, borderOpacity = 0.15, trigger, yTravel = 90, initialRotate = 'rotateX(20deg) rotateY(45deg)', style }) {
  const ref = useRef()

  const R       = size / 2
  const apothem = R / Math.sqrt(3)
  const edge    = R * Math.sqrt(2)
  const triH    = edge * (Math.sqrt(3) / 2)
  const D       = (4 / 3) * triH
  const tiltDeg = Math.asin(1 / Math.sqrt(3)) * (180 / Math.PI)
  const yAngles = [45, -45, 135, -135]

  const facePos = {
    position:        'absolute',
    width:            edge,
    height:           D,
    left:            `calc(50% - ${edge / 2}px)`,
    top:             `calc(50% - ${D / 2}px)`,
    transformOrigin: '50% 50%',
  }

  const upPts = `${edge / 2},0 ${edge},${triH} 0,${triH}`
  const dnPts = `0,${triH / 3} ${edge},${triH / 3} ${edge / 2},${D}`

  const faces = yAngles.flatMap((yA, i) => [
    {
      key:       `t${i}`,
      transform: `rotateY(${yA}deg) rotateX(${tiltDeg}deg) translateZ(${apothem}px)`,
      pts:       upPts,
    },
    {
      key:       `b${i}`,
      transform: `rotateY(${yA}deg) rotateX(${-tiltDeg}deg) translateZ(${apothem}px)`,
      pts:       dnPts,
    },
  ])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y:    -yTravel,
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: 'top bottom',
          end:   'bottom top',
          scrub: true,
        },
      })
    })
    return () => ctx.revert()
  }, [trigger, yTravel])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="will-change-transform"
      style={{ perspective: `${size * 6}px`, width: size, height: size, ...style }}
    >
      <div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          width:           size,
          height:          size,
          transform:       initialRotate,
        }}
      >
        {faces.map(({ key, transform, pts }) => (
          <div key={key} style={{ ...facePos, transform }}>
            <svg width={edge} height={D} viewBox={`0 0 ${edge} ${D}`} className="block">
              <polygon
                points={pts}
                fill="transparent"
                stroke={`rgba(255,107,0,${borderOpacity})`}
                strokeWidth="1"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}
