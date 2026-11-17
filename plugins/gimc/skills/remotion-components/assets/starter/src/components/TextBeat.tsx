import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { useReel } from '../context'
import { enter } from '../motion'
import { enterFrames, fontStack, TYPE } from '../theme'
import { SafeArea } from './SafeArea'
import { Words } from './Words'

/** A value beat: an optional small kicker above one headline. */
export const TextBeat = ({ text, emphasis, kicker }: { text: string; emphasis?: string; kicker?: string }) => {
  const { theme } = useReel()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const p = enter(frame, fps, enterFrames(theme))
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <SafeArea style={{ justifyContent: 'center', gap: 32 }}>
        {kicker ? (
          <div style={{ opacity: p, fontFamily: fontStack(theme, 'body'), fontSize: TYPE.small + 8, fontWeight: 600, color: theme.colors.muted, letterSpacing: '0.04em' }}>
            {kicker}
          </div>
        ) : null}
        <Words text={text} emphasis={emphasis} size={TYPE.headline} font={fontStack(theme, 'display')} delay={kicker ? 4 : 0} />
      </SafeArea>
    </AbsoluteFill>
  )
}
