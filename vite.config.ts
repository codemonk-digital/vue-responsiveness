import { defineConfig, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'unplugin-dts/vite'

const config: UserConfigExport = {
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      include: ['./lib'],
      exclude: ['./src', './lib/**/*.test.ts'],
      beforeWriteFile(filePath) {
        return {
          filePath: filePath.replace(/([/\\]dist)[/\\]lib([/\\])/, '$1$2')
        }
      }
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
    rolldownOptions: {
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
