import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { VueResponsiveness, useMatches } from './vue-responsiveness'
import { mediaQueries } from '../test/setup'

const View = defineComponent({
  setup() {
    const matches = useMatches()
    return () =>
      h(matches.md.min ? 'main' : 'aside', matches.prefers.colorScheme)
  }
})
const Root = defineComponent({ render: () => h(View) })

describe('explicit SSR mode', () => {
  it('hydrates the server fallback before sampling the client viewport and preferences', async () => {
    mediaQueries.update({ width: 1024, colorScheme: 'dark' })
    const browserWindow = window
    vi.stubGlobal('window', undefined)
    const server = createSSRApp(Root).use(VueResponsiveness, undefined, {
      ssr: true
    })
    const html = await renderToString(server)
    expect(html).toBe('<aside>light</aside>')
    expect(mediaQueries.matchMedia).not.toHaveBeenCalled()
    vi.stubGlobal('window', browserWindow)

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.append(container)
    const client = createSSRApp(Root).use(VueResponsiveness, undefined, {
      ssr: true
    })
    const warn = vi.fn()
    client.config.warnHandler = warn
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      expect(mediaQueries.listenerCount).toBe(0)
      client.mount(container)
      await nextTick()
      expect(warn).not.toHaveBeenCalled()
      expect(error).not.toHaveBeenCalled()
      expect(container.innerHTML).toBe('<main>dark</main>')
      expect(mediaQueries.listenerCount).toBeGreaterThan(0)

      mediaQueries.update({ width: 500, colorScheme: 'light' })
      await nextTick()
      expect(container.innerHTML).toBe('<aside>light</aside>')
    } finally {
      client.unmount()
      container.remove()
      error.mockRestore()
    }
    expect(mediaQueries.listenerCount).toBe(0)
  })

  it('does not attach delayed listeners after the app has been disposed', () => {
    const app = createSSRApp(Root).use(VueResponsiveness, undefined, {
      ssr: true
    })
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const container = document.createElement('div')
    container.innerHTML = '<aside>light</aside>'
    try {
      app.unmount()
      app.mount(container)
      expect(mediaQueries.listenerCount).toBe(0)
      expect(mediaQueries.matchMedia).not.toHaveBeenCalled()
    } finally {
      app.unmount()
      container.remove()
      warn.mockRestore()
    }
  })
})
