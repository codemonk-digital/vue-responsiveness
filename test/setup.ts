import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeEach, vi } from 'vitest'

import { createMediaQueries } from './media-queries'

export let mediaQueries: ReturnType<typeof createMediaQueries>

beforeEach(() => {
  mediaQueries = createMediaQueries()
  vi.stubGlobal('matchMedia', mediaQueries.matchMedia)
})

enableAutoUnmount(afterEach)
afterEach(() => vi.unstubAllGlobals())
