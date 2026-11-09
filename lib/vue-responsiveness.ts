import type {
  VueResponsivenessBreakpoints,
  VueResponsivenessMatches
} from './types'
import type { App, InjectionKey } from 'vue'
import { Presets } from './presets'
import { reactive, computed, getCurrentInstance, inject } from 'vue'

type Orientation = 'portrait' | 'landscape'
type Hover = 'none' | 'hover'
type PrefersColorScheme = 'dark' | 'light'
type PrefersContrast = 'more' | 'less' | 'custom' | 'no-preference'
type PrefersReducedMotion = 'reduce' | 'no-preference'
type QueryConfig =
  | ['orientation', readonly Orientation[]]
  | ['hover', readonly Hover[]]
  | ['prefers-color-scheme', readonly PrefersColorScheme[], 'colorScheme']
  | ['prefers-contrast', readonly PrefersContrast[], 'contrast']
  | ['prefers-reduced-motion', readonly PrefersReducedMotion[], 'reducedMotion']

const matchesKey: InjectionKey<VueResponsivenessMatches> =
  Symbol('VueResponsiveness')

function normalizeBreakpoints(breakpoints: VueResponsivenessBreakpoints) {
  const reserved = new Set([
    'current',
    'isMin',
    'isMax',
    'isOnly',
    'orientation',
    'hover',
    'prefers'
  ])
  return Object.entries(breakpoints)
    .map(([key, value]) => {
      if (
        !key.trim() ||
        reserved.has(key) ||
        key in Object.prototype ||
        key.startsWith('__v_')
      ) {
        throw new Error(`Breakpoint name "${key}" is reserved or empty.`)
      }
      const min = value === null ? 0 : value
      if (typeof min !== 'number' || !Number.isFinite(min) || min < 0) {
        throw new Error(
          `Breakpoint "${key}" must have a finite non-negative number as its minimum width.`
        )
      }
      return [key, min] as const
    })
    .sort(([, a], [, b]) => a - b)
}

export const VueResponsiveness = {
  install(
    app: App,
    breakpoints: VueResponsivenessBreakpoints = Presets.Bootstrap_5
  ): void {
    const intervals = normalizeBreakpoints(breakpoints)
    const widths = [...new Set(intervals.map(([, min]) => min))]
    const indices = intervals.map(
      ([key, min]) => [key, widths.indexOf(min)] as const
    )
    const cleanups: (() => void)[] = []
    let cleanedUp = false
    const cleanup = () => {
      if (cleanedUp) return
      cleanedUp = true
      cleanups.splice(0).forEach((removeListener) => removeListener())
    }

    const unmount = app.unmount.bind(app)
    app.unmount = (...args) => {
      cleanup()
      unmount(...args)
    }

    const matches: VueResponsivenessMatches = reactive({
      isMin: (key: string) => matches[key]?.min || false,
      isMax: (key: string) => matches[key]?.max || false,
      isOnly: (key: string) => matches[key]?.only || false,
      current: computed(
        () => intervals.find(([key]) => matches[key].only)?.[0] || ''
      ),
      hover: 'hover',
      orientation: 'landscape' as Orientation,
      prefers: {
        colorScheme: 'light' as PrefersColorScheme,
        contrast: 'no-preference' as PrefersContrast,
        reducedMotion: 'no-preference' as PrefersReducedMotion
      },
      ...intervals.reduce((acc, [key]) => {
        acc[key] = { min: false, max: false, only: false }
        return acc
      }, {} as Partial<VueResponsivenessMatches>)
    }) as VueResponsivenessMatches

    if (typeof window !== 'undefined') {
      const queryLists = widths.map((min) =>
        window.matchMedia(`(min-width: ${min}px)`)
      )
      const updateBreakpoints = () => {
        indices.forEach(([key, index]) => {
          const min = queryLists[index].matches
          const max = !queryLists[index + 1]?.matches
          Object.assign(matches[key], { min, max, only: min && max })
        })
      }
      queryLists.forEach((query) => {
        query.addEventListener('change', updateBreakpoints)
        cleanups.push(() =>
          query.removeEventListener('change', updateBreakpoints)
        )
      })
      updateBreakpoints()

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
                        'more' | 'less' | 'custom' | 'no-preference'
                      break
                    case 'reducedMotion':
                      matches.prefers[path] = value as
                        'reduce' | 'no-preference'
                      break
                  }
                }
              }
            }
          }

          mediaQuery.addEventListener('change', updateMatches)
          cleanups.push(() =>
            mediaQuery.removeEventListener('change', updateMatches)
          )
          updateMatches(mediaQuery)
        })
      })
    }

    app.provide(matchesKey, matches)
    app.config.globalProperties.$matches = matches
  }
}

export const useMatches = (): VueResponsivenessMatches => {
  if (!getCurrentInstance()) {
    throw new Error('useMatches() must be called during Vue setup().')
  }

  const matches = inject(matchesKey, undefined)
  if (!matches) {
    throw new Error('Install VueResponsiveness before calling useMatches().')
  }
  return matches
}
