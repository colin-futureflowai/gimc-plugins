import type { Caption } from '@remotion/captions'
import type { Platform } from './safe-zones'
import type { Theme } from './theme'

/** One beat of the reel. `seconds` comes from the voiceover timestamps (reel-builder), not from a guess. */
export type Beat =
  | { type: 'hook'; seconds: number; text: string; emphasis?: string }
  | { type: 'text'; seconds: number; text: string; emphasis?: string; kicker?: string }
  | { type: 'media'; seconds: number; src: string; text?: string; lowerThird?: { name: string; title: string } }
  | { type: 'cta'; seconds: number; keyword: string; promise: string }

export type ReelProps = {
  theme: Theme
  platform: Platform
  beats: Beat[]
  /** Voiceover file in public/, e.g. "voiceover.mp3". */
  voiceover?: string
  /** Word-level captions from the voiceover transcript, in the @remotion/captions `Caption` shape. */
  captions?: Caption[]
  /** Draws the danger zones of `platform` on top. Only for checking; never in the export. */
  showSafeZones?: boolean
}

export const reelDurationInFrames = (props: ReelProps, fps: number) =>
  Math.max(1, props.beats.reduce((sum, beat) => sum + Math.round(beat.seconds * fps), 0))
