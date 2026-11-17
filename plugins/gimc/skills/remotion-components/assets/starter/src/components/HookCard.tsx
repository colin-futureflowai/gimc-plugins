import { AbsoluteFill } from 'remotion'
import { useReel } from '../context'
import { fontStack, TYPE } from '../theme'
import { SafeArea } from './SafeArea'
import { Words } from './Words'

/** The first beat: big display type in the upper half of the safe area, moving on frame 0. */
export const HookCard = ({ text, emphasis }: { text: string; emphasis?: string }) => {
  const { theme } = useReel()
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <SafeArea style={{ justifyContent: 'flex-start', paddingTop: 80 }}>
        <Words text={text} emphasis={emphasis} size={TYPE.hook} font={fontStack(theme, 'display')} />
      </SafeArea>
    </AbsoluteFill>
  )
}
