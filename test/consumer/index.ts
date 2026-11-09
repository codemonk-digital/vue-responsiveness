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
createApp({}).use(VueResponsiveness, breakpoints, { ssr: true })

// Existing consumers can continue to use arbitrary custom names.
export function readCustomBreakpoint() {
  const matches: VueResponsivenessMatches = useMatches()
  const dynamicName: string = 'phone'
  return [matches.phone.only, matches[dynamicName].min, matches.isMax('wide')]
}

// Stronger names are opt-in. The default contract above remains permissive.
export function readTypedBreakpoint() {
  const matches: VueResponsivenessMatches<'phone' | 'wide'> = useMatches<
    'phone' | 'wide'
  >()
  const current: 'phone' | 'wide' | '' = matches.current
  const only: boolean = matches.phone.only
  const wide: boolean = matches.isMin('wide')
  // @ts-expect-error Misspelled names are rejected only in this opt-in mode.
  void matches.phoen.only
  // @ts-expect-error Helpers use the same declared names.
  matches.isMax('desktop')
  return { current, only, wide }
}
