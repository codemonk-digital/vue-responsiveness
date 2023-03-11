export type VueResponsivenessBreakpoints = Record<string, number | null>

export type VueResponsivenessMatches = Record<
  string,
  { min: boolean; max: boolean; only: boolean }
> & {
  current: string
  isMin(interval: string): boolean
  isMax(interval: string): boolean
  isOnly(interval: string): boolean
}
