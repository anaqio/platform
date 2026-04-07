import { Composition } from 'remotion';

import { AnaqioDemo16x9 } from './compositions/AnaqioDemo16x9';
import { AnaqioDemo9x16 } from './compositions/AnaqioDemo9x16';
import { DURATION_FRAMES, FPS } from './lib/timing';

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="AnaqioDemo16x9"
        component={AnaqioDemo16x9}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="AnaqioDemo9x16"
        component={AnaqioDemo9x16}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
}
