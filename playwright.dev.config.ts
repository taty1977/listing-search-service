import { defineConfig } from '@playwright/test';
import config from './playwright.config';

// Replace webServer rather than merging configs, which would start both servers.
export default defineConfig({
  ...config,
  outputDir: 'test-results/dev',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/dev', open: 'never' }]],
  webServer: {
    command: 'npm run dev:next -- --hostname 127.0.0.1 --port 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: false,
    timeout: 60_000,
    env: { PLAYWRIGHT_DEV: '1' },
  },
});
