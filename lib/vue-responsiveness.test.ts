import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
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

  it.each([575.9, 575.95, 575.999, 576, 576.01])(
    'matches exactly one interval at fractional width %s',
    async (width) => {
      const wrapper = render()
      mediaQueries.update({ width })
      await nextTick()
      const state = JSON.parse(wrapper.text())
      expect(wrapper.attributes('data-current')).toBe(width < 576 ? 'xs' : 'sm')
      expect(
        ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].filter((key) => state[key].only)
      ).toHaveLength(1)
      expect(state.xs.max).toBe(!state.sm.min)
    }
  )

  it('supports a single breakpoint and fractional configured thresholds', async () => {
    const wrapper = render({ md: 0.25 })
    mediaQueries.update({ width: 0.25 })
    await nextTick()
    expect(wrapper.attributes('data-only')).toBe('true')
    mediaQueries.update({ width: 0.249 })
    await nextTick()
    expect(wrapper.attributes('data-current')).toBe('')
    expect(wrapper.attributes('data-max')).toBe('true')
  })

  it.each([
    [{ current: 0 }, 'reserved or empty'],
    [{ isMin: 0 }, 'reserved or empty'],
    [{ isMax: 0 }, 'reserved or empty'],
    [{ isOnly: 0 }, 'reserved or empty'],
    [{ prefers: 0 }, 'reserved or empty'],
    [{ orientation: 0 }, 'reserved or empty'],
    [{ hover: 0 }, 'reserved or empty'],
    [{ constructor: 0 }, 'reserved or empty'],
    [JSON.parse('{"__proto__": 0}'), 'reserved or empty'],
    [{ __v_isReactive: 0 }, 'reserved or empty'],
    [{ ' ': 0 }, 'reserved or empty'],
    [{ small: -1 }, 'finite non-negative number'],
    [{ small: NaN }, 'finite non-negative number'],
    [{ small: Infinity }, 'finite non-negative number'],
    [{ small: '600' }, 'finite non-negative number']
  ])(
    'rejects invalid configuration %j before attaching listeners',
    (configuration, message) => {
      const app = createSSRApp({})
      const unmount = app.unmount
      expect(() =>
        VueResponsiveness.install(
          app,
          configuration as VueResponsivenessBreakpoints
        )
      ).toThrow(message)
      expect(mediaQueries.matchMedia).not.toHaveBeenCalled()
      expect(app.unmount).toBe(unmount)
      expect(app.config.globalProperties).not.toHaveProperty('$matches')
    }
  )

  it('supports an empty configuration for preference-only use', async () => {
    const wrapper = render({})
    expect(wrapper.attributes('data-current')).toBe('')
    mediaQueries.update({ colorScheme: 'dark' })
    await nextTick()
    expect(JSON.parse(wrapper.text()).prefers.colorScheme).toBe('dark')
  })

  it('treats duplicate minimum widths as aliases of the same interval', async () => {
    const wrapper = render({ phone: null, small: 0, medium: 600 })
    mediaQueries.update({ width: 500 })
    await nextTick()
    const state = JSON.parse(wrapper.text())
    expect(state.phone).toEqual({ min: true, max: true, only: true })
    expect(state.small).toEqual(state.phone)
    expect(state.current).toBe('phone')
    mediaQueries.update({ width: 600 })
    await nextTick()
    expect(wrapper.attributes('data-current')).toBe('medium')
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

  it('keeps two apps with different breakpoints independent', async () => {
    const first = render({ md: 600, wide: 1000 })
    const second = render({ compact: 0, wide: 900 })

    mediaQueries.update({ width: 800 })
    await nextTick()

    expect(first.attributes()).toMatchObject({
      'data-current': 'md',
      'data-min': 'true',
      'data-max': 'true',
      'data-only': 'true'
    })
    expect(second.attributes('data-current')).toBe('compact')
    expect(JSON.parse(second.text())).not.toHaveProperty('md')
  })

  it('keeps a retained breakpoint object reactive', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const { md } = useMatches()
          return () => h('output', String(md.min))
        }
      }),
      { global: { plugins: [VueResponsiveness] } }
    )

    expect(wrapper.text()).toBe('true')
    mediaQueries.update({ width: 500 })
    await nextTick()
    expect(wrapper.text()).toBe('false')
  })

  it('unmounts one app without stopping updates in another', async () => {
    const first = render()
    const listenersPerApp = mediaQueries.listenerCount
    const second = render()
    expect(mediaQueries.listenerCount).toBe(listenersPerApp * 2)

    first.unmount()
    expect(mediaQueries.listenerCount).toBe(listenersPerApp)
    mediaQueries.update({ width: 500, colorScheme: 'dark' })
    await nextTick()
    expect(second.attributes('data-current')).toBe('xs')
    expect(JSON.parse(second.text()).prefers.colorScheme).toBe('dark')

    second.unmount()
    expect(mediaQueries.listenerCount).toBe(0)
  })

  it('resolves each server-rendered app independently', async () => {
    vi.stubGlobal('window', undefined)
    const first = createSSRApp(Consumer).use(VueResponsiveness, {
      md: 0,
      wide: 1000
    })
    const second = createSSRApp(Consumer).use(VueResponsiveness, {
      compact: 0,
      large: 900
    })
    const [firstHtml, secondHtml] = await Promise.all([
      renderToString(first),
      renderToString(second)
    ])

    expect(firstHtml).toContain('&quot;md&quot;')
    expect(firstHtml).not.toContain('&quot;compact&quot;')
    expect(secondHtml).toContain('&quot;compact&quot;')
    expect(secondHtml).not.toContain('&quot;md&quot;')
    expect(mediaQueries.matchMedia).not.toHaveBeenCalled()
  })

  it("reports a missing plugin instead of returning another app's state", () => {
    render()
    const wrapper = mount(
      defineComponent({
        setup() {
          try {
            useMatches()
            return () => h('output', 'unexpected state')
          } catch (error) {
            return () => h('output', (error as Error).message)
          }
        }
      })
    )
    expect(wrapper.text()).toBe(
      'Install VueResponsiveness before calling useMatches().'
    )
  })

  it('reports calls outside Vue setup', () => {
    expect(() => useMatches()).toThrow(
      'useMatches() must be called during Vue setup().'
    )
  })
})
