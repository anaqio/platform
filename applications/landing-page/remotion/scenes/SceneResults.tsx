import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import { COLORS, FONTS } from '../lib/brand';
import { fadeIn, fadeOut, slideUp } from '../lib/helpers';
import { SCENES } from '../lib/timing';
import { ResultsUI } from '../ui/ResultsUI';

export function SceneResults() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - SCENES.results.start);
  const sceneDur = SCENES.results.end - SCENES.results.start;

  const opacity = fadeIn(local, 0, 20) * fadeOut(local, sceneDur - 20, 15);
  const revealProgress = interpolate(local, [20, 280], [0, 1], {
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
          background: `radial-gradient(ellipse 60% 50% at 50% 55%, ${COLORS.blue}12 0%, ${COLORS.purple}08 50%, transparent 80%)`,
        }}
      />

      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 13,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: COLORS.blueLight,
          marginBottom: 20,
          opacity: fadeIn(local, 0, 15),
        }}
      >
        Step 3 — Your Lookbook, Ready
      </div>

      <div
        style={{
          opacity: fadeIn(local, 5, 20),
          transform: `translateY(${slideUp(local, 5, fps)}px)`,
        }}
      >
        <ResultsUI revealProgress={revealProgress} scale={1} />
      </div>
    </AbsoluteFill>
  );
}
