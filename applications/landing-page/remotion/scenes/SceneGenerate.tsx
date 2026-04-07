import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import { COLORS, FONTS } from '../lib/brand';
import { fadeIn, fadeOut, slideUp } from '../lib/helpers';
import { SCENES } from '../lib/timing';
import { GenerationUI } from '../ui/GenerationUI';

export function SceneGenerate() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - SCENES.generate.start);
  const sceneDur = SCENES.generate.end - SCENES.generate.start;

  const opacity = fadeIn(local, 0, 20) * fadeOut(local, sceneDur - 20, 15);

  // Phase 1: show config (0-100 frames), Phase 2: generation animates (100-400 frames)
  const generationProgress = interpolate(local, [100, 360], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 55% 45% at 50% 55%, #7C3AED14 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 13,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#7C3AED',
          marginBottom: 20,
          opacity: fadeIn(local, 0, 15),
        }}
      >
        Step 2 — Configure & Generate
      </div>

      <div
        style={{
          opacity: fadeIn(local, 5, 20),
          transform: `translateY(${slideUp(local, 5, fps)}px)`,
        }}
      >
        <GenerationUI generationProgress={generationProgress} scale={1} />
      </div>
    </AbsoluteFill>
  );
}
