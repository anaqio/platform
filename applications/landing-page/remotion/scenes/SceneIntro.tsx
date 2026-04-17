import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'

import { COLORS, FONTS, GRADIENT } from '../lib/brand'
import { fadeIn, fadeOut, slideUp } from '../lib/helpers'
import { SCENES } from '../lib/timing'

export function SceneIntro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const local = Math.max(0, frame - SCENES.intro.start)
  const sceneDur = SCENES.intro.end - SCENES.intro.start

  const opacity = fadeIn(local, 0, 20) * fadeOut(local, sceneDur - 20, 15)
  const logoY = slideUp(local, 0, fps)
  const taglineOpacity = fadeIn(local, 12, 18)

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      {/* Ambient radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${COLORS.blue}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 96,
          fontWeight: 700,
          fontStyle: 'italic',
          background: GRADIENT,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.12em',
          transform: `translateY(${logoY}px)`,
          lineHeight: 1,
        }}
      >
        ANAQIO
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 18,
          color: COLORS.muted,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginTop: 16,
          opacity: taglineOpacity,
        }}
      >
        AI Virtual Studio for Fashion Commerce
      </div>

      {/* Thin line separator */}
      <div
        style={{
          width: 60,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.blue}, transparent)`,
          marginTop: 32,
          opacity: taglineOpacity,
        }}
      />
    </AbsoluteFill>
  )
}
