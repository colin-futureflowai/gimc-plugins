import { AbsoluteFill, useVideoConfig } from 'remotion'
import { safeArea, type Platform } from '../safe-zones'

/** Draws the danger zones in red. Only for checking frames (showSafeZones); never in the export. */
export const SafeZoneOverlay = ({ platform }: { platform: Platform }) => {
  const { width, height } = useVideoConfig()
  const a = safeArea(platform, width, height)
  const zone = { position: 'absolute', backgroundColor: 'rgba(255, 0, 0, 0.35)' } as const
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ ...zone, top: 0, left: 0, width, height: a.top }} />
      <div style={{ ...zone, bottom: 0, left: 0, width, height: a.bottom }} />
      <div style={{ ...zone, top: a.top, left: 0, width: a.left, height: a.height }} />
      <div style={{ ...zone, top: a.top, right: 0, width: a.right, height: a.height }} />
    </AbsoluteFill>
  )
}
