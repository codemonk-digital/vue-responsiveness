import type { VueResponsivenessMatches } from './types'

declare module 'vue' {
  interface ComponentCustomProperties {
    $matches: VueResponsivenessMatches
  }
}

export * from './presets'
export * from './types'
export * from './vue-responsiveness'
