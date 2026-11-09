import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['lib/**/*.{test,spec}.ts', 'test/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts'],
      exclude: ['lib/**/*.{test,spec}.ts', 'lib/**/*.d.ts'],
      reporter: ['text', 'json', 'html'],
      thresholds: { lines: 100, statements: 100, functions: 100, branches: 100 }
    },
    setupFiles: ['./test/setup.ts'],
    reporters: ['dot']
  }
})
