import type { VueResponsivenessBreakpoints, VueResponsivenessMatches } from './'
import type { App } from 'vue'
import { Presets } from './'
import { computed, reactive } from 'vue'

let matches: VueResponsivenessMatches

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export const VueResponsiveness = {
  install(
    app: App,
    breakpoints: VueResponsivenessBreakpoints = Presets.Bootstrap_5
  ): void {
    const intervals = (
      Object.entries(breakpoints) as Entries<typeof breakpoints>
    )
      .sort(([, a], [, b]) => (a || 0) - (b || 0))
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
        () =>
          Object.entries(matches).find(
            ([, value]) => typeof value === 'object' && value.only
          )?.[0] as string
      ),
      ...Object.keys(intervals).reduce(
        (acc, key) => {
          acc[key] = { min: false, max: false, only: false }
          return acc
        },
        {} as Record<'min' | 'max' | 'only', boolean>
      )
    })

    if (typeof window !== 'undefined') {
      ;(Object.entries(intervals) as Entries<typeof intervals>).forEach(
        ([interval, mediaQueries]) => {
          const queryLists = {
            min: window.matchMedia(mediaQueries.min),
            max: window.matchMedia(mediaQueries.max)
          }
          ;(Object.entries(queryLists) as Entries<typeof queryLists>).forEach(
            ([key, mediaQueryList]) => {
              const listener = ({ matches: val }) => {
                const { min, max } = { ...matches[interval], [key]: val }
                matches[interval] = { min, max, only: min && max }
              }
              mediaQueryList.addEventListener('change', listener)
              listener(mediaQueryList)
            }
          )
        }
      )
    }

    app.config.globalProperties.$matches = matches
  }
}

export const useMatches = () => matches
