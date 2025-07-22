export type VueResponsivenessBreakpoints = Record<string, number | null>

export type VueResponsivenessMatches = Record<
  string,
  { min: boolean; max: boolean; only: boolean }
> & {
  current: string
  isMin(interval: string): boolean
  isMax(interval: string): boolean
  isOnly(interval: string): boolean
  orientation: 'portrait' | 'landscape'
  hover: 'none' | 'hover'
  prefers: {
    colorScheme: 'dark' | 'light'
    contrast: 'more' | 'less' | 'custom' | 'no-preference'
    reducedMotion: 'reduce' | 'no-preference'
  }
}
