import { Audio } from '@remotion/media'
import { useEffect, useState } from 'react'
import { AbsoluteFill, cancelRender, continueRender, delayRender, Series, staticFile, useVideoConfig } from 'remotion'
import { Captions } from './components/Captions'
import { CTACard } from './components/CTACard'
import { HookCard } from './components/HookCard'
import { MediaBeat } from './components/MediaBeat'
import { SafeZoneOverlay } from './components/SafeZoneOverlay'
import { TextBeat } from './components/TextBeat'
import { ReelContext } from './context'
import { loadThemeFonts } from './fonts'
import type { Beat, ReelProps } from './types'

const BeatView = ({ beat }: { beat: Beat }) => {
  switch (beat.type) {
    case 'hook':
      return <HookCard text={beat.text} emphasis={beat.emphasis} />
    case 'text':
      return <TextBeat text={beat.text} emphasis={beat.emphasis} kicker={beat.kicker} />
    case 'media':
      return <MediaBeat src={beat.src} text={beat.text} lowerThird={beat.lowerThird} />
    case 'cta':
      return <CTACard keyword={beat.keyword} promise={beat.promise} />
  }
}

export const Reel = (props: ReelProps) => {
  const { fps } = useVideoConfig()
  const [handle] = useState(() => delayRender('Loading brand fonts'))
  useEffect(() => {
    loadThemeFonts(props.theme).then(() => continueRender(handle)).catch((error) => cancelRender(error))
  }, [handle, props.theme])

  return (
    <ReelContext.Provider value={{ theme: props.theme, platform: props.platform }}>
      <AbsoluteFill style={{ backgroundColor: props.theme.colors.bg }}>
        <Series>
          {props.beats.map((beat, i) => (
            <Series.Sequence key={i} durationInFrames={Math.max(1, Math.round(beat.seconds * fps))}>
              <BeatView beat={beat} />
            </Series.Sequence>
          ))}
        </Series>
        {props.voiceover ? <Audio src={staticFile(props.voiceover)} /> : null}
        {props.captions?.length ? <Captions captions={props.captions} /> : null}
        {props.showSafeZones ? <SafeZoneOverlay platform={props.platform} /> : null}
      </AbsoluteFill>
    </ReelContext.Provider>
  )
}
