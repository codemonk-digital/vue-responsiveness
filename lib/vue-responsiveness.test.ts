import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { VueResponsiveness, useMatches } from './vue-responsiveness'
import type { VueResponsivenessBreakpoints } from './types'
import { mediaQueries } from '../test/setup'

const Consumer = defineComponent({
  setup() {
    const matches = useMatches()
    return () =>
      h(
        'output',
        {
          'data-current': matches.current,
          'data-min': matches.isMin('md'),
          'data-max': matches.isMax('md'),
          'data-only': matches.isOnly('md')
        },
        JSON.stringify(matches)
      )
  }
})

const render = (breakpoints?: VueResponsivenessBreakpoints) =>
  mount(Consumer, {
    global: { plugins: [[VueResponsiveness, breakpoints]] }
  })

describe('responsive state', () => {
  it('exposes the same state to templates and the composable', () => {
    const wrapper = mount(
      defineComponent({
        setup: () => ({ matches: useMatches() }),
        template:
          '<output>{{ matches === $matches }}:{{ $matches.current }}</output>'
      }),
      { global: { plugins: [VueResponsiveness] } }
    )
    expect(wrapper.text()).toBe('true:lg')
  })

  it('matches a coherent initial viewport', () => {
    const wrapper = render()
    expect(wrapper.attributes()).toMatchObject({
      'data-current': 'lg',
      'data-min': 'true',
      'data-max': 'false',
      'data-only': 'false'
    })
    const state = JSON.parse(wrapper.text())
    const matching = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].filter(
      (key) => state[key].only
    )
    expect(matching).toEqual(['lg'])
  })

  it('updates rendered breakpoint state when the viewport crosses thresholds', async () => {
    const wrapper = render()
    for (const [width, current, min, max, only] of [
      [500, 'xs', false, true, false],
      [768, 'md', true, true, true],
      [992, 'lg', true, false, false],
      [767, 'sm', false, true, false]
    ] as const) {
      mediaQueries.update({ width })
      await nextTick()
      expect(wrapper.attributes()).toMatchObject({
        'data-current': current,
        'data-min': String(min),
        'data-max': String(max),
        'data-only': String(only)
      })
    }
  })

  it.each([
    { small: 0, medium: 777, large: 1234 },
    { large: 1234, small: 0, medium: 777 },
    { large: 1234, small: null, medium: 777 }
  ])(
    'sorts custom breakpoints and supports the existing null lower bound: %j',
    async (breakpoints) => {
      const wrapper = render(breakpoints)
      expect(wrapper.attributes('data-current')).toBe('medium')
      mediaQueries.update({ width: 1400 })
      await nextTick()
      expect(wrapper.attributes('data-current')).toBe('large')
      expect(wrapper.attributes('data-min')).toBe('false')
      expect(wrapper.attributes('data-max')).toBe('false')
      expect(wrapper.attributes('data-only')).toBe('false')
    }
  )

  it('leaves current empty below the first configured breakpoint', () => {
    mediaQueries.update({ width: 300 })
    expect(render({ md: 600 }).attributes('data-current')).toBe('')
  })

  it('updates all supported media preferences in rendered output', async () => {
    const wrapper = render()
    const initial = JSON.parse(wrapper.text())
    expect(initial).toMatchObject({
      hover: 'hover',
      orientation: 'landscape',
      prefers: {
        colorScheme: 'light',
        contrast: 'no-preference',
        reducedMotion: 'no-preference'
      }
    })
    mediaQueries.update({
      hover: 'none',
      orientation: 'portrait',
      colorScheme: 'dark',
      contrast: 'more',
      reducedMotion: 'reduce'
    })
    await nextTick()
    expect(JSON.parse(wrapper.text())).toMatchObject({
      hover: 'none',
      orientation: 'portrait',
      prefers: {
        colorScheme: 'dark',
        contrast: 'more',
        reducedMotion: 'reduce'
      }
    })
    for (const contrast of ['less', 'custom', 'no-preference'] as const) {
      mediaQueries.update({ contrast })
      await nextTick()
      expect(JSON.parse(wrapper.text()).prefers.contrast).toBe(contrast)
    }
    mediaQueries.update({
      hover: 'hover',
      orientation: 'landscape',
      colorScheme: 'light',
      reducedMotion: 'no-preference'
    })
    await nextTick()
    expect(JSON.parse(wrapper.text())).toEqual(initial)
  })

  it('removes subscriptions when its app unmounts', () => {
    const wrapper = render()
    expect(mediaQueries.listenerCount).toBeGreaterThan(0)
    wrapper.unmount()
    expect(mediaQueries.listenerCount).toBe(0)
  })

  it('can install without browser globals', () => {
    vi.stubGlobal('window', undefined)
    const app = createSSRApp({})
    app.use(VueResponsiveness)
    expect(app.config.globalProperties.$matches.current).toBe('')
    expect(app.config.globalProperties.$matches.isMin('md')).toBe(false)
  })
})
