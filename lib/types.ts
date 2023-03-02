export type VueResponsivenessBreakpoints = Record<string, number | null>;

export type VueResponsivenessMatches = Record<
  string,
  { min: boolean; max: boolean; only: boolean }
>;
