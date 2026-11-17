/**
 * Danger-zone margins in px on 1080×1920 (motion-design/references/safe-zones.md, researched 17-11-2026).
 * `universal` takes the largest margin of every platform.
 */
export const SAFE_ZONES = {
  'instagram-reels': { top: 269, bottom: 672, left: 65, right: 65 },
  'instagram-stories': { top: 269, bottom: 672, left: 65, right: 65 },
  'facebook-reels': { top: 269, bottom: 672, left: 65, right: 65 },
  'youtube-shorts': { top: 288, bottom: 672, left: 48, right: 192 },
  tiktok: { top: 240, bottom: 660, left: 120, right: 300 },
  linkedin: { top: 260, bottom: 560, left: 112, right: 210 },
  universal: { top: 288, bottom: 672, left: 120, right: 300 },
}

export const WIDTH = 1080
export const HEIGHT = 1920

export const safeArea = (platform) => {
  const z = SAFE_ZONES[platform]
  if (!z) throw new Error(`Unknown platform "${platform}". Use one of: ${Object.keys(SAFE_ZONES).join(', ')}`)
  return { ...z, width: WIDTH - z.left - z.right, height: HEIGHT - z.top - z.bottom }
}
