import { useMemo } from 'react'

const SIZE = 168
const CX = 84
const CY = 84
const TOTAL_LINES = 60
const INNER_R = 62   // major lines start at 58px, minor at 64px — clear zone ⌀116px
const OUTER_R = 82   // major lines 24px long, minor 8px

function getLineCoords(index, innerR, outerR) {
  const angleDeg = (index / TOTAL_LINES) * 360 - 90
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    x1: CX + innerR * Math.cos(angleRad),
    y1: CY + innerR * Math.sin(angleRad),
    x2: CX + outerR * Math.cos(angleRad),
    y2: CY + outerR * Math.sin(angleRad),
  }
}

export function RadialTimer({ elapsedPct = 0, isRunning = false, isDark = true, mode = 'focus' }) {
  const accentColor = mode === 'focus' ? '#FF6B2B' : '#4A9DFF'

  const lines = useMemo(() => {
    return Array.from({ length: TOTAL_LINES }, (_, i) => {
      const isMajor = i % 5 === 0
      const innerR = isMajor ? INNER_R - 4 : INNER_R + 2
      const outerR = isMajor ? OUTER_R : OUTER_R - 10
      const coords = getLineCoords(i, innerR, outerR)
      const isElapsed = isRunning && (i / TOTAL_LINES) < elapsedPct

      return { ...coords, isMajor, isElapsed, i }
    })
  }, [elapsedPct, isRunning, isDark])

  const idSuffix = `${isDark ? 'd' : 'l'}-${mode}`

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <radialGradient id={`glow-${idSuffix}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={isRunning ? 0.5 : 0} />
            <stop offset="45%" stopColor={accentColor} stopOpacity={isRunning ? 0.2 : 0} />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </radialGradient>
          <filter id={`blur-${idSuffix}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* Ambient glow */}
        {isRunning && (
          <circle
            cx={CX}
            cy={CY}
            r={52}
            fill={`url(#glow-${idSuffix})`}
            filter={`url(#blur-${idSuffix})`}
          />
        )}

        {/* Radial lines */}
        {lines.map(({ x1, y1, x2, y2, isMajor, isElapsed, i }) => {
          let stroke, strokeWidth, opacity

          if (isElapsed) {
            stroke = accentColor
            strokeWidth = isMajor ? 2.2 : 1.4
            opacity = isMajor ? 1 : 0.85
          } else if (isDark) {
            stroke = isMajor ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)'
            strokeWidth = isMajor ? 1.5 : 1
            opacity = 1
          } else {
            stroke = isMajor ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.09)'
            strokeWidth = isMajor ? 1.5 : 1
            opacity = 1
          }

          return (
            <line
              key={i}
              x1={x1.toFixed(2)}
              y1={y1.toFixed(2)}
              x2={x2.toFixed(2)}
              y2={y2.toFixed(2)}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              opacity={opacity}
            />
          )
        })}

        {/* Center glow */}
        {isRunning && (
          <circle
            cx={CX}
            cy={CY}
            r={9}
            fill={accentColor}
            opacity={0.25}
            filter={`url(#blur-${idSuffix})`}
          />
        )}

        {/* Center dot */}
        <circle
          cx={CX}
          cy={CY}
          r={isRunning ? 4.5 : 3}
          fill={isRunning ? accentColor : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)')}
        />
      </svg>
    </div>
  )
}
