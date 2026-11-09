import { describe, expect, it, vi } from 'vitest'

import { createMediaQueries } from './media-queries'

describe('media-query test adapter', () => {
  it('updates all query values before notifying and emits only transitions', () => {
    const media = createMediaQueries({ width: 500 })
    const above = media.matchMedia('(min-width: 600px)')
    const below = media.matchMedia('(max-width: 599.9px)')
    const readState = vi.fn(() => [above.matches, below.matches])
    above.addEventListener('change', readState)

    media.update({ width: 700 })
    expect(readState).toHaveLastReturnedWith([true, false])
    expect(readState).toHaveBeenCalledTimes(1)

    media.update({ width: 800 })
    expect(readState).toHaveBeenCalledTimes(1)

    above.removeEventListener('change', readState)
    media.update({ width: 400 })
    expect(readState).toHaveBeenCalledTimes(1)
    expect(above.matches).toBe(false)
    expect(media.listenerCount).toBe(0)
  })

  it('fails explicitly when a test needs an unsupported query', () => {
    const media = createMediaQueries()
    expect(() => media.matchMedia('(display-mode: fullscreen)')).toThrow(
      'Unsupported media query in test adapter'
    )
  })
})
