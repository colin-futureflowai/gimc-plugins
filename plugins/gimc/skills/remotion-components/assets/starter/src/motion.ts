import { Easing, interpolate, spring } from 'remotion'

/** 0 → 1 entrance without overshoot (damped spring), starting `delay` frames into the sequence. */
export const enter = (frame: number, fps: number, durationInFrames: number, delay = 0) =>
  spring({ frame: frame - delay, fps, durationInFrames, config: { damping: 200 } })

/** 1 → 0 exit in the last `frames` frames of a sequence of `length` frames; faster than the entrance. */
export const exit = (frame: number, length: number, frames = 6) =>
  interpolate(frame, [length - frames, length], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })

/** Px offset for a slide-in: from `distance` to 0 as `progress` goes 0 → 1. */
export const slide = (progress: number, distance = 40) => interpolate(progress, [0, 1], [distance, 0])
