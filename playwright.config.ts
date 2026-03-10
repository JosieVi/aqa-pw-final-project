import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { apiConfig } from './src/config/api-config';
import { SALES_PORTAL_URL } from './src/config/environment';
import path from 'path';
import { rimraf } from 'rimraf';

dotenv.config();

export const STORAGE_STATE = path.join(__dirname, 'src/.auth/user.json');

if (!process.env.SKIP_CLEAN) {
  rimraf.sync(path.resolve(__dirname, 'allure-results'));
  console.log('--- Allure results cleaned ---');
}

export default defineConfig({
  // globalSetup: require.resolve('./src/config/global.setup'),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [['list'], ['html'], ['allure-playwright', { resultsDir: 'allure-results' }]],

  use: {
    baseURL: SALES_PORTAL_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup',
      testDir: 'src/auth',
      testMatch: /.*\.setup\.ts/,
      use: {
        baseURL: apiConfig.BASE_URL,
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },

    {
      name: 'sales-portal-ui',
      dependencies: ['setup'],
      testDir: './src/ui/tests',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
    },

    {
      name: 'sales-portal-api',
      testDir: './src/api/tests',
      use: {
        baseURL: apiConfig.BASE_URL,
      },
      metadata: { workers: 2 },
    },
  ],
});
