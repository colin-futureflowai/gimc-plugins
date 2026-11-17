import { Video } from '@remotion/media'
import { AbsoluteFill, Img, staticFile } from 'remotion'
import { useReel } from '../context'
import { fontStack, TYPE } from '../theme'
import { LowerThird } from './LowerThird'
import { SafeArea } from './SafeArea'
import { Words } from './Words'

const isVideo = (src: string) => /\.(mp4|mov|webm)$/i.test(src)

/** B-roll or a photo full-bleed (it may run through the danger zones), with optional text on a readable backing. */
export const MediaBeat = ({ src, text, lowerThird }: { src: string; text?: string; lowerThird?: { name: string; title: string } }) => {
  const { theme } = useReel()
  const media = staticFile(src)
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      {isVideo(src) ? <Video src={media} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Img src={media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      {text ? (
        <SafeArea style={{ justifyContent: 'flex-start', paddingTop: 40 }}>
          <div style={{ backgroundColor: theme.colors.bg, padding: '24px 28px', alignSelf: 'flex-start' }}>
            <Words text={text} size={TYPE.body + 8} font={fontStack(theme, 'display')} />
          </div>
        </SafeArea>
      ) : null}
      {lowerThird ? <LowerThird {...lowerThird} /> : null}
    </AbsoluteFill>
  )
}
