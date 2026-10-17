import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const BASE_PATH = '/react-avatar-kit/'
const baseURL = `http://127.0.0.1:${PORT}${BASE_PATH}`
const repoRoot = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  testDir: '.',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  ...(process.env.CI ? { workers: 2 } : {}),
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    cwd: repoRoot,
    command: 'npm run build:site && npx vite preview --config site/vite.config.ts --port 4173',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: 'e2e',
      testMatch: ['**/playground.e2e.ts', '**/a11y.e2e.ts'],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'docs',
      testMatch: '**/docs.e2e.ts',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'visual',
      testMatch: '**/*.visual.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 1700 },
        deviceScaleFactor: 1,
        colorScheme: 'dark',
        reducedMotion: 'reduce',
      },
      expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled' } },
    },
  ],
})
