import { VueResponsivenessMatches } from './types'

declare module '@vue/runtime-core' {
  // eslint-disable-next-line no-unused-vars
  interface ComponentCustomProperties {
    $matches: VueResponsivenessMatches
  }
}

export * from './presets'
export * from './types'
export * from './vue-responsiveness'
