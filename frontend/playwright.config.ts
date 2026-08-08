import { defineConfig } from '@playwright/test';

// Dedicated port so a dev server from another project on 5173 is never tested by mistake.
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5199',
  },
  webServer: {
    command: 'npm run dev -- --port 5199 --strictPort',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI,
  },
});
