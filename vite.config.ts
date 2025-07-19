import { defineConfig, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

const config: UserConfigExport = {
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
  }
}

export default defineConfig(config)
