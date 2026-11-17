import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { useReel } from '../context'
import { enter } from '../motion'
import { enterFrames, fontStack, TYPE } from '../theme'
import { SafeArea } from './SafeArea'

/**
 * The end card: "Comment KEYWORD" typed into a comment field, plus the promise. The keyword must be the one the
 * reply campaign in GIMC listens for (social-engagement). At least 2 s on screen (motion-design §8).
 */
export const CTACard = ({ keyword, promise }: { keyword: string; promise: string }) => {
  const { theme } = useReel()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const p = enter(frame, fps, enterFrames(theme))
  const typed = keyword.slice(0, Math.max(0, Math.floor((frame - 8) / 2)))
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <SafeArea style={{ justifyContent: 'center', gap: 40 }}>
        <div style={{ opacity: p, fontFamily: fontStack(theme, 'display'), fontSize: TYPE.headline, fontWeight: 700, lineHeight: 1.05, color: theme.colors.text }}>
          Comment
        </div>
        <div style={{ opacity: p, scale: `${0.95 + 0.05 * p}`, alignSelf: 'flex-start', minWidth: 360, backgroundColor: theme.colors.accent, color: theme.colors.accentText, fontFamily: fontStack(theme, 'display'), fontSize: TYPE.headline, fontWeight: 800, padding: '12px 32px', borderRadius: 24 }}>
          {typed || ' '}
        </div>
        <div style={{ opacity: enter(frame, fps, enterFrames(theme), 10), fontFamily: fontStack(theme, 'body'), fontSize: TYPE.body, lineHeight: 1.2, color: theme.colors.text, textWrap: 'balance' }}>
          {promise}
        </div>
        {theme.logo ? <Img src={staticFile(theme.logo)} style={{ height: 72, objectFit: 'contain', alignSelf: 'flex-start', opacity: p }} /> : null}
      </SafeArea>
    </AbsoluteFill>
  )
}
