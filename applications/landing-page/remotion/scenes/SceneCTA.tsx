import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'

import { COLORS, FONTS, GRADIENT } from '../lib/brand'
import { fadeIn, slideUp } from '../lib/helpers'
import { SCENES } from '../lib/timing'

export function SceneCTA() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const local = Math.max(0, frame - SCENES.cta.start)

  const opacity = fadeIn(local, 0, 20)

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
      {/* Glow background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${COLORS.blue}20 0%, ${COLORS.purple}12 40%, transparent 75%)`,
        }}
      />

      {/* Brand name */}
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 80,
          fontWeight: 700,
          fontStyle: 'italic',
          background: GRADIENT,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.1em',
          transform: `translateY(${slideUp(local, 0, fps)}px)`,
          lineHeight: 1,
        }}
      >
        ANAQIO
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 20,
          color: COLORS.mutedLight,
          marginTop: 16,
          textAlign: 'center',
          opacity: fadeIn(local, 12, 18),
          transform: `translateY(${slideUp(local, 12, fps)}px)`,
          letterSpacing: '0.06em',
        }}
      >
        Professional fashion visuals, at the speed of AI.
      </div>

      {/* Divider */}
      <div
        style={{
          width: 80,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.blue}, ${COLORS.purple}, transparent)`,
          margin: '28px 0',
          opacity: fadeIn(local, 20, 18),
        }}
      />

      {/* CTA button */}
      <div
        style={{
          padding: '16px 40px',
          background: GRADIENT,
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 600,
          color: COLORS.white,
          fontFamily: FONTS.body,
          opacity: fadeIn(local, 25, 18),
          transform: `translateY(${slideUp(local, 25, fps)}px)`,
          boxShadow: `0 12px 40px ${COLORS.blue}50`,
          letterSpacing: '0.04em',
        }}
      >
        Join the Waitlist · anaqio.com
      </div>

      {/* Footer info */}
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 12,
          color: COLORS.muted,
          marginTop: 20,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          opacity: fadeIn(local, 35, 18),
        }}
      >
        Launching Q3 2026 · Casablanca
      </div>
    </AbsoluteFill>
  )
}
