export type VueResponsivenessBreakpoints = Record<string, number | null>

export type VueResponsivenessOptions = {
  /** Keep the server fallback state until the root has mounted. */
  ssr?: boolean
}

export type VueResponsivenessMatches<Breakpoint extends string = string> =
  Record<Breakpoint, { min: boolean; max: boolean; only: boolean }> & {
    current: Breakpoint | ''
    isMin(interval: Breakpoint): boolean
    isMax(interval: Breakpoint): boolean
    isOnly(interval: Breakpoint): boolean
    orientation: 'portrait' | 'landscape'
    hover: 'none' | 'hover'
    prefers: {
      colorScheme: 'dark' | 'light'
      contrast: 'more' | 'less' | 'custom' | 'no-preference'
      reducedMotion: 'reduce' | 'no-preference'
    }
  }
