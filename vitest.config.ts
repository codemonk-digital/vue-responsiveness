import { mergeConfig, defineConfig, configDefaults as vitestConfig } from 'vitest/config'
import viteConfig from './vite.config'
import { resolve } from 'path'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['**/lib/*.{test,spec}.?(c|m)[jt]s?(x)'],
      coverage: {
        exclude: [...(vitestConfig.coverage.exclude || []), '**/src/*']
      },
      setupFiles: [resolve(__dirname, 'test/setup.ts')],
      reporters: ['dot']
    },
  }),
)
