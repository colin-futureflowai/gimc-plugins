import { useCurrentFrame, useVideoConfig } from 'remotion'
import { useReel } from '../context'
import { enter, slide } from '../motion'
import { enterFrames } from '../theme'

/**
 * Text that enters word by word (2–4 frames apart, motion-design §7); more than 5 words enter as one block.
 * `emphasis` (a word or phrase from `text`) gets the accent colour.
 */
export const Words = ({ text, emphasis, size, font, delay = 0 }: { text: string; emphasis?: string; size: number; font: string; delay?: number }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const { theme } = useReel()
  const words = text.split(' ')
  const emphasised = new Set((emphasis ?? '').toLowerCase().split(' ').filter(Boolean))
  const stagger = words.length <= 5 ? 3 : 0
  return (
    <div style={{ fontFamily: font, fontSize: size, fontWeight: 700, lineHeight: 1.05, color: theme.colors.text, display: 'flex', flexWrap: 'wrap', columnGap: size * 0.25 }}>
      {words.map((word, i) => {
        const p = enter(frame, fps, enterFrames(theme), delay + i * stagger)
        const isEmphasis = emphasised.has(word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''))
        return (
          <span key={i} style={{ opacity: p, translate: `0 ${slide(p, 30)}px`, color: isEmphasis ? theme.colors.accent : undefined }}>
            {word}
          </span>
        )
      })}
    </div>
  )
}
