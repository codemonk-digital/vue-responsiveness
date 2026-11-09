import { createApp } from 'vue'
import {
  Presets,
  VueResponsiveness,
  useMatches,
  type VueResponsivenessBreakpoints,
  type VueResponsivenessMatches
} from 'vue-responsiveness'

const breakpoints: VueResponsivenessBreakpoints = { phone: 0, wide: 900 }
createApp({}).use(VueResponsiveness, breakpoints)
createApp({}).use(VueResponsiveness, Presets.Bootstrap_5)

// Existing consumers can continue to use arbitrary custom names.
export function readCustomBreakpoint() {
  const matches: VueResponsivenessMatches = useMatches()
  const dynamicName: string = 'phone'
  return [matches.phone.only, matches[dynamicName].min, matches.isMax('wide')]
}
