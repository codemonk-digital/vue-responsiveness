import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import App from '../src/App.vue'
import { VueResponsiveness, useMatches } from './vue-responsiveness'
import { VueResponsivenessBreakpoints } from './types'
import { Presets } from './presets'

describe('vue-responsiveness', () => {
  const bs5 = Object.assign(
    {},
    {
      current: 'xs'
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
    expect(rest).toEqual(bs5)
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
    expect(rest).toEqual(bs5)
    expect(isMax('sm')).toBe(true)
    expect(isMin('sm')).toBe(true)
    expect(isOnly('sm')).toBe(true)
  })

  it('should return window.matchMedia matches', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
    const { isMax, isMin, isOnly, current } = render().vm.$matches
    expect(isMax('sm')).toBe(false)
    expect(isMin('sm')).toBe(false)
    expect(isOnly('sm')).toBe(false)
    expect(current).toBe(undefined)
  })
})
