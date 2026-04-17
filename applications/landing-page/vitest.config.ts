import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [react() as any],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 10_000,
    include: ['__spec__/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', '.claude', 'test-results', 'playwright-report'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['components/**', 'lib/**', 'hooks/**'],
      exclude: [
        'node_modules',
        '.next',
        '**/*.d.ts',
        'vitest.config.ts',
        'vitest.setup.ts',
        'playwright.config.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
