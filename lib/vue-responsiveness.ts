import {
  VueResponsivenessBreakpoints,
  VueResponsivenessMatches,
  Presets
} from './'
import { ReactiveVariable } from 'vue/macros'
import { App, computed, reactive } from 'vue'

let matches: ReactiveVariable<VueResponsivenessMatches>

export const VueResponsiveness = {
  install(
    app: App,
    breakpoints: VueResponsivenessBreakpoints = Presets.Bootstrap_5
  ): void {
    const intervals: Record<string, { min: string; max: string }> =
      Object.entries(breakpoints)
        .sort(([, a], [, b]) => (a || 0) - (b || 0))
        .reduce((out, [key, min], i, arr) => {
          out[key] = {
            min: min ? `(min-width: ${min}px)` : '',
            max: arr[i + 1]?.[1]
              ? `(max-width: ${(arr[i + 1][1] as number) - 0.1}px)`
              : ''
          }
          return out
        }, {} as Record<string, { min: string; max: string }>)
    matches = reactive({
      isMin: computed(() => (key: string) => matches[key]?.min || false),
      isMax: computed(() => (key: string) => matches[key]?.max || false),
      isOnly: computed(() => (key: string) => matches[key]?.only || false),
      ...Object.assign(
        {},
        ...Object.keys(intervals).map((_) => ({
          [_]: { min: false, max: false, only: false }
        })),
        {
          current: computed(
            () =>
              Object.entries(matches).find(
                ([, value]) => typeof value === 'object' && value.only
              )?.[0] as string
          )
        }
      )
    })

    if (typeof window !== 'undefined') {
      Object.entries(intervals).forEach(([interval, mediaQueries]) => {
        const queryLists: Record<'min' | 'max', MediaQueryList> = {
          min: window.matchMedia(mediaQueries.min),
          max: window.matchMedia(mediaQueries.max)
        }
        Object.entries(queryLists).forEach(([key, mediaQueryList]) => {
          const listener = ({ matches: val }: { matches: boolean }) => {
            const { min, max } = { ...matches[interval], [key]: val } as {
              min: boolean
              max: boolean
            }
            matches[interval] = { min, max, only: min && max }
          }
          mediaQueryList.addEventListener('change', listener)
          listener(mediaQueryList)
        })
      })
    }

    app.config.globalProperties.$matches = matches
  }
}

export const useMatches = () => matches
