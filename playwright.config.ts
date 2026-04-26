import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 60000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off',
    actionTimeout: 10000,
    navigationTimeout: 15000,
    headless: false, // แสดงเบราว์เซอร์จริง
    slowMo: 500, // ทำให้ช้าลง 500ms เพื่อให้เห็นการทำงาน
  },
  globalSetup: undefined,
  globalTeardown: undefined,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
