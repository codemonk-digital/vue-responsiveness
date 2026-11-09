import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Presets, type PresetName } from './presets'
import { VueResponsiveness } from './vue-responsiveness'
import { mediaQueries } from '../test/setup'

describe('framework preset compatibility', () => {
  it.each<[PresetName, number, string]>([
    ['Bootstrap_3', 600, 'xs'],
    ['Bootstrap_3', 767.99, 'xs'],
    ['Bootstrap_3', 768, 'sm'],
    ['Bootstrap_3', 991.99, 'sm'],
    ['Bootstrap_3', 992, 'md'],
    ['Bootstrap_3', 1199.99, 'md'],
    ['Bootstrap_3', 1200, 'lg'],
    ['Material_UI', 1259.99, 'md'],
    ['Material_UI', 1260, 'md'],
    ['Material_UI', 1279.99, 'md'],
    ['Material_UI', 1280, 'lg']
  ])('%s matches %s px as %s', (preset, width, expected) => {
    mediaQueries.update({ width })
    const wrapper = mount(
      { template: '<output>{{ $matches.current }}</output>' },
      {
        global: { plugins: [[VueResponsiveness, Presets[preset]]] }
      }
    )
    expect(wrapper.text()).toBe(expected)
  })
})
