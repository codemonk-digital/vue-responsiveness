export type VueResponsivenessBreakpoints = Record<string, number | null>;

export type VueResponsivenessMatches = Record<
  string,
  { min: boolean; max: boolean; only: boolean }
>;

declare module "vue" {
  // eslint-disable-next-line no-unused-vars
  interface ComponentCustomProperties {
    $matches: VueResponsivenessMatches;
  }
}
