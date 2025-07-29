import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import App from '../src/App.vue'
import { VueResponsiveness, useMatches } from './vue-responsiveness'
import { type VueResponsivenessBreakpoints } from './types'
import { Presets } from './presets'
import { vi } from 'vitest'

const createMockMediaQueryList = (matches: boolean, query: string) => {
  const listeners: ((event: { matches: boolean }) => void)[] = []
  return {
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((event, cb) => {
      if (event === 'change') {
        listeners.push(cb)
      }
    }),
    removeEventListener: vi.fn((event, cb) => {
      if (event === 'change') {
        const index = listeners.indexOf(cb)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }),
    dispatchEvent: vi.fn(),
    _simulateChange: (newMatches: boolean) => {
      listeners.forEach((cb) => cb({ matches: newMatches }))
    }
  }
}

describe('vue-responsiveness', () => {
  const baseState = Object.assign(
    {},
    {
      current: 'xs',
      hover: 'hover',
      orientation: 'landscape',
      prefers: {
        colorScheme: 'light',
        contrast: 'no-preference',
        reducedMotion: 'no-preference'
      },
    },
    ...Object.keys(Presets.Bootstrap_5).map((key) => ({
      [key]: {
        max: true,
        min: true,
        only: true
      }
    }))
  )
  const render = (breakpoints?: VueResponsivenessBreakpoints) =>
    mount(App, {
      global: {
        plugins: [[VueResponsiveness, breakpoints]]
      }
    })

  it('should work', () => {
    expect(render().element).toMatchSnapshot()
  })

  it('should work with custom breakpoints', () => {
    expect(render({ min: null, max: 1000 }).element).toMatchSnapshot()
  })

  it('should reverse unordered values', () => {
    expect(render({ max: 1000, min: null }).element).toMatchSnapshot()
  })

  it('should match $matches', () => {
    const { isMax, isMin, isOnly, ...rest } = render().vm.$matches
    expect(rest).toEqual(baseState)
    expect(isMax('sm')).toBe(true)
    expect(isMin('sm')).toBe(true)
    expect(isOnly('sm')).toBe(true)
  })

  it('useMatches() should work', () => {
    const App = defineComponent({
      setup: () => ({ matches: useMatches() }),
      template: '<div />'
    })
    const { vm } = mount(App, {
      global: {
        plugins: [[VueResponsiveness]]
      }
    })
    const { isMax, isMin, isOnly, ...rest } = vm.matches
    expect(rest).toEqual(baseState)
    expect(isMax('sm')).toBe(true)
    expect(isMin('sm')).toBe(true)
    expect(isOnly('sm')).toBe(true)
  })

  it('should return window.matchMedia matches', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
    const { isMax, isMin, isOnly, current } = render().vm.$matches
    expect(isMax('sm')).toBe(false)
    expect(isMin('sm')).toBe(false)
    expect(isOnly('sm')).toBe(false)
    expect(current).toBe('')
  })

  it('media query: hover', () => {
    const mockHoverNone = createMockMediaQueryList(true, '(hover: none)')
    const mockHoverHover = createMockMediaQueryList(false, '(hover: hover)')

    window.matchMedia = vi.fn((query) => {
      if (query === '(hover: none)') return mockHoverNone
      if (query === '(hover: hover)') return mockHoverHover

      return createMockMediaQueryList(true, query)
    })

    const { $matches: matches } = render().vm

    expect(matches.hover).toBe('none')

    mockHoverNone._simulateChange(false)
    mockHoverHover._simulateChange(true)

    expect(matches.hover).toBe('hover')

    mockHoverNone._simulateChange(true)
    mockHoverHover._simulateChange(false)

    expect(matches.hover).toBe('none')
  })

  it('media query: orientation', () => {
    const mockOrientationLandscape = createMockMediaQueryList(true, '(orientation: landscape)')
    const mockOrientationPortrait = createMockMediaQueryList(false, '(orientation: portrait)')

    window.matchMedia = vi.fn((query) => {
      if (query === '(orientation: landscape)') return mockOrientationLandscape
      if (query === '(orientation: portrait)') return mockOrientationPortrait

      return createMockMediaQueryList(true, query)
    })

    const { $matches: matches } = render().vm

    expect(matches.orientation).toBe('landscape')

    mockOrientationLandscape._simulateChange(false)
    mockOrientationPortrait._simulateChange(true)

    expect(matches.orientation).toBe('portrait')

    mockOrientationLandscape._simulateChange(true)
    mockOrientationPortrait._simulateChange(false)

    expect(matches.orientation).toBe('landscape')
  })

  it('media query: prefers-color-scheme', () => {
    const mockPrefersLight = createMockMediaQueryList(true, '(prefers-color-scheme: light)')
    const mockPrefersDark = createMockMediaQueryList(false, '(prefers-color-scheme: dark)')

    window.matchMedia = vi.fn((query) => {
      if (query === '(prefers-color-scheme: light)') return mockPrefersLight
      if (query === '(prefers-color-scheme: dark)') return mockPrefersDark

      return createMockMediaQueryList(false, query)
    })

    const { $matches: matches } = render().vm

    expect(matches.prefers.colorScheme).toBe('light')

    mockPrefersLight._simulateChange(false)
    mockPrefersDark._simulateChange(true)

    expect(matches.prefers.colorScheme).toBe('dark')

    mockPrefersLight._simulateChange(true)
    mockPrefersDark._simulateChange(false)

    expect(matches.prefers.colorScheme).toBe('light')
  })

  it('media query: prefers-contrast', () => {

    const mockPrefersContrastMore = createMockMediaQueryList(false, '(prefers-contrast: more)')
    const mockPrefersContrastLess = createMockMediaQueryList(false, '(prefers-contrast: less)')
    const mockPrefersContrastCustom = createMockMediaQueryList(false, '(prefers-contrast: custom)')
    const mockPrefersContrastNoPreference = createMockMediaQueryList(true, '(prefers-contrast: no-preference)')

    window.matchMedia = vi.fn((query) => {
      switch (query) {
        case '(prefers-contrast: more)': return mockPrefersContrastMore
        case '(prefers-contrast: less)': return mockPrefersContrastLess
        case '(prefers-contrast: custom)': return mockPrefersContrastCustom
        case '(prefers-contrast: no-preference)': return mockPrefersContrastNoPreference

      default:
          return createMockMediaQueryList(false, query);
      }
    })

    const { $matches: matches } = render().vm

    expect(matches.prefers.contrast).toBe('no-preference')

    mockPrefersContrastNoPreference._simulateChange(false)
    mockPrefersContrastMore._simulateChange(true)
    expect(matches.prefers.contrast).toBe('more')

    mockPrefersContrastMore._simulateChange(false)
    mockPrefersContrastLess._simulateChange(true)
    expect(matches.prefers.contrast).toBe('less')

    mockPrefersContrastLess._simulateChange(false)
    mockPrefersContrastCustom._simulateChange(true)
    expect(matches.prefers.contrast).toBe('custom')

    mockPrefersContrastCustom._simulateChange(false)
    mockPrefersContrastNoPreference._simulateChange(true)
    expect(matches.prefers.contrast).toBe('no-preference')
  })

  it('media query: prefers-reduced-motion', () => {
    const mockPrefersReducedMotionReduce = createMockMediaQueryList(false, '(prefers-reduced-motion: reduce)')
    const mockPrefersReducedMotionNoPreference = createMockMediaQueryList(true, '(prefers-reduced-motion: no-preference)')

    window.matchMedia = vi.fn((query) => {
      switch (query) {
        case '(prefers-reduced-motion: reduce)': return mockPrefersReducedMotionReduce
        case '(prefers-reduced-motion: no-preference)': return mockPrefersReducedMotionNoPreference

        default:
          return createMockMediaQueryList(false, query);
      }
    })

    const wrapper = render()
    const matches = wrapper.vm.$matches

    expect(matches.prefers.reducedMotion).toBe('no-preference')

    mockPrefersReducedMotionNoPreference._simulateChange(false)
    mockPrefersReducedMotionReduce._simulateChange(true)
    expect(matches.prefers.reducedMotion).toBe('reduce')

    mockPrefersReducedMotionReduce._simulateChange(false)
    mockPrefersReducedMotionNoPreference._simulateChange(true)
    expect(matches.prefers.reducedMotion).toBe('no-preference')
  })

})
