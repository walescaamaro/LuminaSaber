import { defineConfig } from '@playwright/test';

const port = Number(process.env.PORT || 4317);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL,
    headless: true,
    serviceWorkers: 'block',
  },
  webServer: {
    command: 'npm run start',
    url: `${baseURL}/cadastro`,
    reuseExistingServer: process.env.E2E_SERVER_MANAGED === '1',
    timeout: 30_000,
  },
});
