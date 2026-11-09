import type { VueResponsivenessBreakpoints } from './types.js'

export type PresetName =
  | 'Ant_Design'
  | 'Bootstrap_3'
  | 'Bootstrap_4'
  | 'Bootstrap_5'
  | 'Bulma'
  | 'Chakra'
  | 'Foundation'
  | 'Ionic'
  | 'Master_CSS'
  | 'Material_Design'
  | 'Materialize'
  | 'Material_UI'
  | 'Quasar'
  | 'Semantic_UI'
  | 'Skeleton'
  | 'Tailwind_CSS'
  | 'Vuetify'
  | 'Vuetify_3'
  | 'Windi_CSS'

export const Presets: Record<PresetName, VueResponsivenessBreakpoints> = {
  Ant_Design: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600
  },
  // Bootstrap 3.4: https://getbootstrap.com/docs/3.4/css/#grid-media-queries
  Bootstrap_3: {
    xs: 0,
    sm: 768,
    md: 992,
    lg: 1200
  },
  Bootstrap_4: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  },
  Bootstrap_5: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
  },
  Bulma: {
    mobile: 0,
    tablet: 769,
    desktop: 1024,
    widescreen: 1216,
    fullhd: 1408
  },
  // Chakra UI v2, projecting em values at 16px: https://v2.chakra-ui.com/docs/styled-system/responsive-styles
  Chakra: {
    xs: 0,
    sm: 480,
    md: 768,
    lg: 992,
    xl: 1280,
    '2xl': 1536
  },
  Foundation: {
    small: 0,
    medium: 640,
    large: 1024,
    xlarge: 1200,
    xxlarge: 1440
  },
  Ionic: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  },
  Master_CSS: {
    '3xs': 360,
    '2xs': 480,
    xs: 600,
    sm: 768,
    md: 1024,
    lg: 1280,
    xl: 1440,
    '2xl': 1600,
    '3xl': 1920,
    '4xl': 2560
  },
  Material_Design: {
    xs: 0,
    sm_8: 600,
    sm_12: 905,
    md: 1240,
    lg: 1440
  },
  // Materialize 1.0.0 minima: https://github.com/Dogfalo/materialize/blob/1.0.0/sass/components/_variables.scss
  Materialize: {
    s: 0,
    m: 601,
    l: 993,
    xl: 1201
  },
  // Material UI v4: https://v4.mui.com/customization/breakpoints/
  Material_UI: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  },
  Quasar: {
    xs: 0,
    sm: 600,
    md: 1024,
    lg: 1440,
    xl: 1920
  },
  Semantic_UI: {
    mobile: 0,
    tablet: 768,
    small_monitor: 992,
    large_monitor: 1200
  },
  Skeleton: {
    mobile: 0,
    phablet: 400,
    tablet: 550,
    desktop: 750,
    desktop_hd: 1000,
    desktop_hd_lg: 1200
  },
  Tailwind_CSS: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  },
  // Legacy five-tier subset; keep xl unbounded for existing consumers.
  Vuetify: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  },
  Vuetify_3: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    xxl: 2560
  },
  Windi_CSS: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  }
}
