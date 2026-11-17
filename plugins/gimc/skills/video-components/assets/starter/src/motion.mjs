import { num } from './html.mjs'

/**
 * GSAP eases by role (motion-design §7, after Hyperframes `references/motion.md`). One curve on everything is the
 * flat default that makes a reel look generated:
 * - `arrive`: an element landing, on a long tail;
 * - `arriveSoft`: the same for small elements and words;
 * - `camera`: a camera move or a colour flood, easing both ways;
 * - `exit`: leaving or zooming through, accelerating;
 * - `pop`: a little overshoot, only for position and scale (`enter` never puts it on opacity or colour).
 */
export const EASE = { arrive: 'expo.out', arriveSoft: 'power4.out', camera: 'power2.inOut', exit: 'power3.in', pop: 'back.out(1.4)' }

/**
 * The opacity an entrance starts from on the first frame of a beat. A cut never lands on an empty frame: the new
 * beat's text is already there, faint (and blurred or a little lower), and sharpens in place. From 0 the cut frame
 * and the next few read as a flash.
 */
export const CUT_OPACITY = 0.4

/** Frames at 30 fps → seconds, for delays and staggers written in frames (motion-design speaks in frames). */
export const frames = (n) => n / 30

const springy = (ease) => /^(back|elastic|bounce)/.test(ease)
const line = (selector, from, to, at) => `tl.fromTo(${JSON.stringify(selector)}, ${JSON.stringify(from)}, ${JSON.stringify(to)}, ${num(at)});`

/** A GSAP tween from `from` to `to` as a line of timeline code, `at` seconds on the root timeline. */
export const tween = (selector, at, duration, from, to, ease = EASE.arrive) => line(selector, from, { ...to, duration, ease }, at)

/**
 * An entrance: from `from` (opacity 0 unless given) to the element's resting state. With a springy ease the
 * overshoot stays on position and scale; opacity gets its own tween without overshoot.
 */
export const enter = (selector, at, duration, from = {}, ease = EASE.arrive) => {
  const start = { opacity: 0, ...from }
  const rest = (k) => (k === 'opacity' || k === 'scale' ? 1 : k === 'filter' ? 'blur(0px)' : 0)
  const end = Object.fromEntries(Object.keys(start).map((k) => [k, rest(k)]))
  if (!springy(ease)) return line(selector, start, { ...end, duration, ease }, at)
  const { opacity, ...moves } = start
  const { opacity: o, ...movesEnd } = end
  return [line(selector, { opacity }, { opacity: o, duration, ease: EASE.arriveSoft }, at), ...(Object.keys(moves).length ? [line(selector, moves, { ...movesEnd, duration, ease }, at)] : [])].join(' ')
}

/** An exit: 40–75 % of the entrance it answers, one accelerating move to `to` (opacity 0 unless given). */
export const exit = (selector, at, entrance, to = {}) =>
  `tl.to(${JSON.stringify(selector)}, ${JSON.stringify({ opacity: 0, ...to, duration: Number((entrance * 0.5).toFixed(3)), ease: EASE.exit })}, ${num(at)});`

/** An instant change (no tween) at `at` seconds, e.g. a caption word turning accent. */
export const set = (selector, at, vars) => `tl.set(${JSON.stringify(selector)}, ${JSON.stringify(vars)}, ${num(at)});`
