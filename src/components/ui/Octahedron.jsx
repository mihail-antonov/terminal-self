const R = 115
const apothem = R / Math.sqrt(3)
const edge = R * Math.sqrt(2)
const triH = edge * (Math.sqrt(3) / 2)
const D = (4 / 3) * triH
const tiltDeg = Math.asin(1 / Math.sqrt(3)) * (180 / Math.PI)
const yAngles = [45, -45, 135, -135]

const facePos = {
  position: 'absolute',
  width: edge,
  height: D,
  left: `calc(50% - ${edge / 2}px)`,
  top: `calc(50% - ${D / 2}px)`,
  transformOrigin: '50% 50%',
}

const upPts = `${edge / 2},0 ${edge},${triH} 0,${triH}`
const dnPts = `0,${triH / 3} ${edge},${triH / 3} ${edge / 2},${D}`

const faces = yAngles.flatMap((yA, i) => [
  {
    key: `t${i}`,
    transform: `rotateY(${yA}deg) rotateX(${tiltDeg}deg) translateZ(${apothem}px)`,
    pts: upPts,
    stroke: 'rgba(255,107,0,0.22)',
  },
  {
    key: `b${i}`,
    transform: `rotateY(${yA}deg) rotateX(${-tiltDeg}deg) translateZ(${apothem}px)`,
    pts: dnPts,
    stroke: 'rgba(255,107,0,0.18)',
  },
])

export function Octahedron({introRef, rotateRef, dragRef}) {
  return (
    <div className="mx-auto" style={{perspective: '900px', width: R * 2, height: R * 2}}>
      <div
        ref={introRef}
        className="relative"
        style={{transformStyle: 'preserve-3d', width: R * 2, height: R * 2}}
      >
        <div ref={rotateRef} className="absolute w-full h-full" style={{transformStyle: 'preserve-3d'}}>
          <div ref={dragRef} className="absolute w-full h-full" style={{transformStyle: 'preserve-3d'}}>
            {faces.map(({key, transform, pts, stroke}) => (
              <div key={key} style={{...facePos, transform}}>
                <svg width={edge} height={D} viewBox={`0 0 ${edge} ${D}`} className="block">
                  <polygon points={pts} fill="rgba(17,17,19,0.8)" stroke={stroke} strokeWidth="1"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
