import { AbsoluteFill, useCurrentFrame } from 'remotion';

import { COLORS, FONTS, GRADIENT } from '../lib/brand';
import { loadFonts } from '../lib/fonts';
import { fadeIn } from '../lib/helpers';
import { SceneCTA } from '../scenes/SceneCTA';
import { SceneGenerate } from '../scenes/SceneGenerate';
import { SceneIntro } from '../scenes/SceneIntro';
import { SceneProblem } from '../scenes/SceneProblem';
import { SceneResults } from '../scenes/SceneResults';
import { SceneUpload } from '../scenes/SceneUpload';

loadFonts();

// 9:16 canvas: 1080 × 1920
// Scenes are designed for 1920 × 1080 (16:9 reference)
//
// Strategy: scale scenes to 74% → content renders at ~1421 × 800px
//   • Width  1421px > 1080px canvas  → clip 170px each side (fine — content is centered)
//   • Height  800px < 1920px canvas  → 560px above + 560px below for brand framing
//
const CONTENT_SCALE = 0.74;
const CONTENT_HEIGHT = Math.round(1080 * CONTENT_SCALE); // 799
const BAND_HEIGHT = Math.round((1920 - CONTENT_HEIGHT) / 2); // 560

function BrandHeader() {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, 0, 25);
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: BAND_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        opacity,
        zIndex: 10,
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 70%, ${COLORS.blue}18 0%, transparent 75%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 72,
          fontWeight: 700,
          fontStyle: 'italic',
          letterSpacing: '0.12em',
          background: GRADIENT,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
        }}
      >
        ANAQIO
      </div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 15,
          color: COLORS.muted,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        AI Virtual Studio
      </div>
      {/* Thin brand line */}
      <div
        style={{
          width: 48,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.blue}, ${COLORS.purple}, transparent)`,
          marginTop: 6,
        }}
      />
    </div>
  );
}

function BrandFooter() {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, 10, 25);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: BAND_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        opacity,
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${COLORS.purple}14 0%, transparent 75%)`,
          pointerEvents: 'none',
        }}
      />
      {/* CTA pill */}
      <div
        style={{
          padding: '12px 32px',
          background: GRADIENT,
          borderRadius: 40,
          fontFamily: FONTS.body,
          fontSize: 16,
          fontWeight: 600,
          color: COLORS.white,
          letterSpacing: '0.04em',
          boxShadow: `0 8px 32px ${COLORS.blue}40`,
        }}
      >
        Join the Waitlist
      </div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 13,
          color: COLORS.muted,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        anaqio.com
      </div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 11,
          color: `${COLORS.muted}80`,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginTop: 4,
        }}
      >
        Launching Q3 2026 · Casablanca
      </div>
    </div>
  );
}

export function AnaqioDemo9x16() {
  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: 'hidden' }}>
      {/* Top brand band */}
      <BrandHeader />

      {/* Scenes — 1920×1080 reference frame, scaled and clipped */}
      <div
        style={{
          position: 'absolute',
          top: BAND_HEIGHT,
          left: 0,
          // Reference frame at full 16:9 resolution
          width: 1920,
          height: 1080,
          transform: `scale(${CONTENT_SCALE})`,
          transformOrigin: 'top left',
          // Clip the horizontal overflow (170px each side at 74% scale)
          overflow: 'hidden',
        }}
      >
        <SceneIntro />
        <SceneProblem />
        <SceneUpload />
        <SceneGenerate />
        <SceneResults />
        <SceneCTA />
      </div>

      {/* Bottom brand band */}
      <BrandFooter />
    </AbsoluteFill>
  );
}
