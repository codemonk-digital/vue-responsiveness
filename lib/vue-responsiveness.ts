import type { VueResponsivenessBreakpoints, VueResponsivenessMatches } from './'
import type { App } from 'vue'
import { Presets } from './'
import { reactive, computed } from 'vue'

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
          }: MediaQueryListEventMap['change']) => {
            const { min, max } = {
              ...matches[interval],
              [key]: val
            } as { min: boolean; max: boolean }
            matches[interval] = { min, max, only: min && max }
          }
          mediaQueryList.addEventListener('change', listener)
          listener(
            mediaQueryList as unknown as MediaQueryListEventMap['change']
          )
        })
      })
    }

    app.config.globalProperties.$matches = matches
  }
}

export const useMatches = () => matches
