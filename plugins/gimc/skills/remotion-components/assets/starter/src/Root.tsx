import { Composition } from 'remotion'
import { Reel } from './Reel'
import { reelDurationInFrames, type ReelProps } from './types'
import example from '../props.json'

const FPS = 30

export const Root = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={reelDurationInFrames(example as ReelProps, FPS)}
    defaultProps={example as ReelProps}
    // The length follows the beats in the props passed with --props.
    calculateMetadata={({ props }) => ({ durationInFrames: reelDurationInFrames(props, FPS) })}
  />
)
