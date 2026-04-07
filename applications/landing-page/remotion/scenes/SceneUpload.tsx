import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import { COLORS, FONTS } from '../lib/brand';
import { fadeIn, fadeOut, slideUp } from '../lib/helpers';
import { SCENES } from '../lib/timing';
import { UploadUI } from '../ui/UploadUI';

export function SceneUpload() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - SCENES.upload.start);
  const sceneDur = SCENES.upload.end - SCENES.upload.start;

  const opacity = fadeIn(local, 0, 20) * fadeOut(local, sceneDur - 20, 15);
  const uploadProgress = interpolate(local, [30, 220], [0, 1], {
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
          background: `radial-gradient(ellipse 50% 40% at 50% 55%, ${COLORS.blue}12 0%, transparent 70%)`,
        }}
      />

      {/* Label */}
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 13,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: COLORS.blue,
          marginBottom: 20,
          opacity: fadeIn(local, 0, 15),
        }}
      >
        Step 1 — Upload
      </div>

      {/* UI card */}
      <div
        style={{
          opacity: fadeIn(local, 5, 20),
          transform: `translateY(${slideUp(local, 5, fps)}px)`,
        }}
      >
        <UploadUI progress={uploadProgress} scale={1} />
      </div>
    </AbsoluteFill>
  );
}
