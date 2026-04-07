import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { COLORS, FONTS } from '../lib/brand';
import { fadeIn, fadeOut, slideUp } from '../lib/helpers';
import { SCENES } from '../lib/timing';

const PAIN_POINTS = [
  { icon: '📸', text: 'Expensive photographers' },
  { icon: '🏛', text: 'Studio rentals & setup' },
  { icon: '⏳', text: 'Weeks of production time' },
  { icon: '💸', text: 'Thousands per collection' },
];

export function SceneProblem() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - SCENES.problem.start);
  const sceneDur = SCENES.problem.end - SCENES.problem.start;

  const fadeOutOpacity = fadeOut(local, sceneDur - 20, 15);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 160px',
        opacity: fadeOutOpacity,
      }}
    >
      {/* Background noise/texture suggestion */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${COLORS.purple}10 0%, transparent 70%)`,
        }}
      />

      {/* Headline */}
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 52,
          fontWeight: 700,
          fontStyle: 'italic',
          color: COLORS.text,
          textAlign: 'center',
          lineHeight: 1.15,
          opacity: fadeIn(local, 0, 20),
          transform: `translateY(${slideUp(local, 0, fps)}px)`,
          marginBottom: 48,
        }}
      >
        Fashion content is expensive.
        <br />
        <span style={{ color: COLORS.muted, fontWeight: 400 }}>
          And painfully slow.
        </span>
      </div>

      {/* Pain points */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {PAIN_POINTS.map(({ icon, text }, i) => {
          const cardOpacity = fadeIn(local, 20 + i * 15, 18);
          const cardY = slideUp(local, 20 + i * 15, fps);
          return (
            <div
              key={text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 20px',
                background: `${COLORS.bgCard}`,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                minWidth: 220,
              }}
            >
              <span style={{ fontSize: 24 }}>{icon}</span>
              <span
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 15,
                  color: COLORS.mutedLight,
                }}
              >
                {text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bridge text */}
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 16,
          color: COLORS.muted,
          textAlign: 'center',
          marginTop: 48,
          opacity: fadeIn(local, 80, 20),
          letterSpacing: '0.04em',
        }}
      >
        There&#39;s a better way.
      </div>
    </AbsoluteFill>
  );
}
