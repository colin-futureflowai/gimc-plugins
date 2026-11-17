import { useCurrentFrame, useVideoConfig } from 'remotion'
import { useReel } from '../context'
import { enter, slide } from '../motion'
import { enterFrames, fontStack, TYPE } from '../theme'
import { SafeArea } from './SafeArea'

/** Name and role of the speaker, on a panel at the bottom of the safe area. */
export const LowerThird = ({ name, title }: { name: string; title: string }) => {
  const { theme } = useReel()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const p = enter(frame, fps, enterFrames(theme), 6)
  return (
    <SafeArea style={{ justifyContent: 'flex-end' }}>
      <div style={{ opacity: p, translate: `${-slide(p, 40)}px 0`, alignSelf: 'flex-start', backgroundColor: theme.colors.surface, padding: '20px 28px', borderLeft: `8px solid ${theme.colors.accent}` }}>
        <div style={{ fontFamily: fontStack(theme, 'display'), fontSize: TYPE.body, fontWeight: 700, color: theme.colors.text }}>{name}</div>
        <div style={{ fontFamily: fontStack(theme, 'body'), fontSize: TYPE.small + 8, color: theme.colors.muted }}>{title}</div>
      </div>
    </SafeArea>
  )
}
