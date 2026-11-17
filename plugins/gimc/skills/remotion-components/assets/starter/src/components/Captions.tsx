import { createTikTokStyleCaptions, type Caption } from '@remotion/captions'
import { useMemo } from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { useReel } from '../context'
import { fontStack, TYPE } from '../theme'
import { SafeArea } from './SafeArea'

/**
 * Subtitles from the voiceover's word timestamps: pages of a few words, the spoken word in the accent colour,
 * at the bottom of the safe area. Each word after the first starts with a space (the Caption format needs it).
 */
export const Captions = ({ captions }: { captions: Caption[] }) => {
  const { theme } = useReel()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const ms = (frame / fps) * 1000
  const { pages } = useMemo(() => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 900 }), [captions])
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs)
  if (!page) return null
  return (
    <AbsoluteFill>
      <SafeArea style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 24 }}>
        <div style={{ backgroundColor: theme.colors.bg, padding: '12px 24px', borderRadius: 16, fontFamily: fontStack(theme, 'body'), fontSize: TYPE.caption, fontWeight: 700, lineHeight: 1.15, textAlign: 'center', whiteSpace: 'pre-wrap', color: theme.colors.text }}>
          {page.tokens.map((t) => (
            <span key={t.fromMs} style={{ color: ms >= t.fromMs && ms < t.toMs ? theme.colors.accent : undefined }}>
              {t.text}
            </span>
          ))}
        </div>
      </SafeArea>
    </AbsoluteFill>
  )
}
