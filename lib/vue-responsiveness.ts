import type { App, InjectionKey } from 'vue'
import { computed, getCurrentInstance, inject, reactive } from 'vue'

import { Presets } from './presets.js'
import type {
  VueResponsivenessBreakpoints,
  VueResponsivenessMatches,
  VueResponsivenessOptions
} from './types.js'

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
    breakpoints: VueResponsivenessBreakpoints = Presets.Bootstrap_5,
    options: VueResponsivenessOptions = {}
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
      orientation: 'landscape',
      prefers: {
        colorScheme: 'light',
        contrast: 'no-preference',
        reducedMotion: 'no-preference'
      },
      ...intervals.reduce((acc, [key]) => {
        acc[key] = { min: false, max: false, only: false }
        return acc
      }, {} as Partial<VueResponsivenessMatches>)
    }) as VueResponsivenessMatches

    const connect = () => {
      if (typeof window === 'undefined' || cleanedUp) return
      const subscribe = (query: MediaQueryList, update: () => void) => {
        query.addEventListener('change', update)
        cleanups.push(() => query.removeEventListener('change', update))
      }
      const observePreference = <Value extends string>(
        feature: string,
        values: readonly Value[],
        apply: (value: Value) => void
      ) => {
        values.forEach((value) => {
          const query = window.matchMedia(`(${feature}: ${value})`)
          const update = () => {
            if (query.matches) apply(value)
          }
          subscribe(query, update)
          update()
        })
      }

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
      queryLists.forEach((query) => subscribe(query, updateBreakpoints))
      updateBreakpoints()

      observePreference('orientation', ['portrait', 'landscape'], (value) => {
        matches.orientation = value
      })
      observePreference('hover', ['none', 'hover'], (value) => {
        matches.hover = value
      })
      observePreference('prefers-color-scheme', ['dark', 'light'], (value) => {
        matches.prefers.colorScheme = value
      })
      observePreference(
        'prefers-contrast',
        ['more', 'less', 'custom', 'no-preference'],
        (value) => {
          matches.prefers.contrast = value
        }
      )
      observePreference(
        'prefers-reduced-motion',
        ['reduce', 'no-preference'],
        (value) => {
          matches.prefers.reducedMotion = value
        }
      )
    }

    if (options.ssr) {
      app.mixin({
        mounted() {
          if (this === this.$root) connect()
        }
      })
    } else {
      connect()
    }

    app.provide(matchesKey, matches)
    app.config.globalProperties.$matches = matches
  }
}

export const useMatches = <
  Breakpoint extends string = string
>(): VueResponsivenessMatches<Breakpoint> => {
  if (!getCurrentInstance()) {
    throw new Error('useMatches() must be called during Vue setup().')
  }

  const matches = inject(matchesKey, undefined)
  if (!matches) {
    throw new Error('Install VueResponsiveness before calling useMatches().')
  }
  return matches as VueResponsivenessMatches<Breakpoint>
}
