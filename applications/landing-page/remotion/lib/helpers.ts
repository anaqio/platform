import { interpolate, spring, useCurrentFrame } from 'remotion'

export function useLocalFrame(sceneStart: number) {
  const frame = useCurrentFrame()
  return Math.max(0, frame - sceneStart)
}

export function fadeIn(frame: number, delay = 0, duration = 20) {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

export function fadeOut(frame: number, start: number, duration = 15) {
  return interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

export function slideUp(frame: number, delay = 0, fps = 30) {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 80 },
  })
  return interpolate(progress, [0, 1], [40, 0])
}

export function scaleIn(frame: number, delay = 0, fps = 30) {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 100 },
  })
}
