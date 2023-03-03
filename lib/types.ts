export type VueResponsivenessBreakpoints = Record<string, number | null>;

export type VueResponsivenessMatches<T extends string = ""> = Record<
  T,
  { min: boolean; max: boolean; only: boolean }
> & { current: T };
