import { num } from './html.mjs'

/**
 * GSAP eases (motion-design §7). Text enters with a strong ease-out and no overshoot; only a card may pop a
 * little. Exits are ease-in and faster than the entrance.
 */
export const EASE = { enter: 'power3.out', pop: 'back.out(1.4)', exit: 'power2.in', hold: 'sine.inOut' }

/** Frames at 30 fps → seconds, for delays and staggers written in frames (motion-design speaks in frames). */
export const frames = (n) => n / 30

/**
 * A GSAP entrance as a line of timeline code: from `from` (opacity 0 unless given) to the element's resting
 * state, `at` seconds on the root timeline.
 */
export const enter = (selector, at, duration, from = {}, ease = EASE.enter) => {
  const start = { opacity: 0, ...from }
  const end = Object.fromEntries(Object.keys(start).map((k) => [k, k === 'opacity' || k === 'scale' ? 1 : 0]))
  return `tl.fromTo(${JSON.stringify(selector)}, ${JSON.stringify(start)}, ${JSON.stringify({ ...end, duration, ease })}, ${num(at)});`
}

/** An instant change (no tween) at `at` seconds, e.g. a caption word turning accent. */
export const set = (selector, at, vars) => `tl.set(${JSON.stringify(selector)}, ${JSON.stringify(vars)}, ${num(at)});`
