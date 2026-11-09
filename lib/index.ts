import type { VueResponsivenessMatches } from './types.js'

declare module 'vue' {
  interface ComponentCustomProperties {
    $matches: VueResponsivenessMatches
  }
}

export * from './presets.js'
export * from './types.js'
export * from './vue-responsiveness.js'
