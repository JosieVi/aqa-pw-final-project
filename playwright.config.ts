import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { SALES_PORTAL_URL } from './src/config/environment';

dotenv.config();

export default defineConfig({
  workers: process.env.CI ? 2 : 4,
  timeout: 60000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  reporter: [['list'], ['html'], ['allure-playwright', { resultsDir: 'allure-results', detail: true }], ['./src/utils/reporters/InfluxReporter.ts']],

  use: {
    baseURL: SALES_PORTAL_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'sales-portal-ui',
      testDir: './src/ui/tests',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'sales-portal-api',
      testDir: './src/api/tests',
      use: {
        baseURL: SALES_PORTAL_URL,
      },
    },
  ],
});
