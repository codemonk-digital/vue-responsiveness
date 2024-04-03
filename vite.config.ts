/// <reference types="vitest" />

import { defineConfig, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { configDefaults } from 'vitest/config'
import type { UserConfigExport as VitestConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

const config: UserConfigExport & { test: VitestConfig } = {
  plugins: [
    vue(),
    dts({
      include: ['./lib'],
      exclude: ['./src']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'VueResponsiveness',
      formats: ['es', 'umd'],
      fileName: 'vue-responsiveness'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  test: {
    ...configDefaults,
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'src/**', 'public/**'],
    setupFiles: [resolve(__dirname, 'test/setup.ts')],
    reporters: ['dot']
  } as VitestConfig
}

export default defineConfig(config)
