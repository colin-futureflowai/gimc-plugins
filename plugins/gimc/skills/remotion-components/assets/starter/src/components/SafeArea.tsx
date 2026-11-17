import type { CSSProperties, ReactNode } from 'react'
import { AbsoluteFill, useVideoConfig } from 'remotion'
import { useReel } from '../context'
import { safeArea } from '../safe-zones'

/** Lays its children out inside the platform's safe area. Everything that must be read goes in here. */
export const SafeArea = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => {
  const { platform } = useReel()
  const { width, height } = useVideoConfig()
  const a = safeArea(platform, width, height)
  return (
    <AbsoluteFill style={{ top: a.top, left: a.left, width: a.width, height: a.height, display: 'flex', flexDirection: 'column', ...style }}>
      {children}
    </AbsoluteFill>
  )
}
