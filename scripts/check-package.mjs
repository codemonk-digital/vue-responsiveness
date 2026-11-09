import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { stdout } from 'node:process'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

const require = createRequire(import.meta.url)
const variants = [
  ['ES module', await import('vue-responsiveness')],
  ['CommonJS', require('vue-responsiveness')]
]

for (const [format, bundle] of variants) {
  const app = createSSRApp({
    setup() {
      const matches = bundle.useMatches()
      assert.equal(matches, app.config.globalProperties.$matches)
      assert.equal(matches.isOnly('wide'), false)
      return () => h('output', matches.current)
    }
  }).use(bundle.VueResponsiveness, { phone: 0, wide: 900 })
  assert.equal(await renderToString(app), '<output></output>')
  assert.equal(bundle.Presets.Bootstrap_5.md, 768)
  stdout.write(`${format} package entry passed.\n`)
}
