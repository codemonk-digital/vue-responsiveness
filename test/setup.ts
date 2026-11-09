import { afterEach, beforeEach, vi } from 'vitest'
import { enableAutoUnmount } from '@vue/test-utils'
import { createMediaQueries } from './media-queries'

export let mediaQueries: ReturnType<typeof createMediaQueries>

beforeEach(() => {
  mediaQueries = createMediaQueries()
  vi.stubGlobal('matchMedia', mediaQueries.matchMedia)
})

enableAutoUnmount(afterEach)
afterEach(() => vi.unstubAllGlobals())
