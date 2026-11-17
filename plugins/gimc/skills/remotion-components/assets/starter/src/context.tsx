import { createContext, useContext } from 'react'
import type { Platform } from './safe-zones'
import type { Theme } from './theme'

export const ReelContext = createContext<{ theme: Theme; platform: Platform } | null>(null)

export const useReel = () => {
  const value = useContext(ReelContext)
  if (!value) throw new Error('useReel outside <Reel>')
  return value
}
