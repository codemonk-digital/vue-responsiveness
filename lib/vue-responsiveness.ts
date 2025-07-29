import type { VueResponsivenessBreakpoints, VueResponsivenessMatches } from './'
import type { App } from 'vue'
import { Presets } from './'
import { reactive, computed } from 'vue'

type Orientation = 'portrait' | 'landscape'
type Hover = 'none' | 'hover'
type PrefersColorScheme = 'dark' | 'light'
type PrefersContrast = 'more' | 'less' | 'custom' | 'no-preference'
type PrefersReducedMotion = 'reduce' | 'no-preference'
type QueryConfig =
  | ['orientation', readonly Orientation[]]
  | ['hover', readonly (Hover)[]]
  | ['prefers-color-scheme', readonly PrefersColorScheme[], 'colorScheme']
  | [
  'prefers-contrast',
  readonly (PrefersContrast)[],
  'contrast'
]
  | [
  'prefers-reduced-motion',
  readonly PrefersReducedMotion[],
  'reducedMotion'
]

let matches: VueResponsivenessMatches


export const VueResponsiveness = {
  install(
    app: App,
    breakpoints: VueResponsivenessBreakpoints = Presets.Bootstrap_5
  ): void {
    const intervals = Object.entries(breakpoints)
      .sort(([, a], [, b]) => Number(a) - Number(b))
      .reduce(
        (out, [key, min], i, arr) => {
          out[key] = {
            min: min ? `(min-width: ${min}px)` : '',
            max: arr[i + 1]?.[1]
              ? `(max-width: ${(arr[i + 1][1] as number) - 0.1}px)`
              : ''
          }
          return out
        },
        {} as Record<string, { min: string; max: string }>
      )
    matches = reactive({
      isMin: computed(() => (key: string) => matches[key]?.min || false),
      isMax: computed(() => (key: string) => matches[key]?.max || false),
      isOnly: computed(() => (key: string) => matches[key]?.only || false),
      current: computed(
        () => Object.keys(intervals).find((key) => matches[key].only) || ''
      ),
      hover: 'hover',
      orientation: 'landscape' as Orientation,
      prefers: {
        colorScheme: 'light' as PrefersColorScheme,
        contrast: 'no-preference' as PrefersContrast,
        reducedMotion: 'no-preference' as PrefersReducedMotion
      },
      ...Object.keys(intervals).reduce((acc, key) => {
        acc[key] = { min: false, max: false, only: false }
        return acc
      }, {} as Partial<VueResponsivenessMatches>)
    }) as VueResponsivenessMatches

    if (typeof window !== 'undefined') {
      Object.entries(intervals).forEach(([interval, mediaQueries]) => {
        const queryLists = {
          min: window.matchMedia(mediaQueries.min),
          max: window.matchMedia(mediaQueries.max)
        }
        Object.entries(queryLists).forEach(([key, mediaQueryList]) => {
          const listener = ({
                              matches: val
                            }: MediaQueryListEvent | MediaQueryList) => {
            const { min, max } = {
              ...matches[interval],
              [key]: val
            } as { min: boolean; max: boolean }
            matches[interval] = { min, max, only: min && max }
          }
          mediaQueryList.addEventListener('change', listener)
          listener(mediaQueryList)
        })
      })

      const additionalQueries: QueryConfig[] = [
        ['orientation', ['portrait', 'landscape']],
        ['hover', ['none', 'hover']],
        ['prefers-color-scheme', ['dark', 'light'], 'colorScheme'],
        [
          'prefers-contrast',
          ['more', 'less', 'custom', 'no-preference'],
          'contrast'
        ],
        ['prefers-reduced-motion', ['reduce', 'no-preference'], 'reducedMotion']
      ]

      additionalQueries.forEach(([query, values, path]) => {
        values.forEach((value) => {
          const mediaQuery = window.matchMedia(`(${query}: ${value})`)

          const updateMatches = (l: MediaQueryListEvent | MediaQueryList) => {
            if (l.matches) {
              switch (query) {
                case 'orientation': {
                  matches[query] = value as 'portrait' | 'landscape'
                  break
                }
                case 'hover': {
                  matches[query] = value as 'none' | 'hover'
                  break
                }
                default: {
                  switch (path) {
                    case 'colorScheme':
                      matches.prefers[path] = value as 'dark' | 'light'
                      break
                    case 'contrast':
                      matches.prefers[path] = value as
                        | 'more'
                        | 'less'
                        | 'custom'
                        | 'no-preference'
                      break
                    case 'reducedMotion':
                      matches.prefers[path] = value as
                        | 'reduce'
                        | 'no-preference'
                      break
                    default:
                  }
                }
              }
            }
          }

          mediaQuery.addEventListener('change', updateMatches)
          updateMatches(mediaQuery)
        })
      })
    }

    app.config.globalProperties.$matches = matches
  }
}

export const useMatches = () => matches
