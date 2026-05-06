import { Page, test as base } from '@playwright/test';
import { SignInApiService } from 'api/services/signIn.api-service';
import { SignInController } from 'api/controllers/signIn.controller';
import { apiConfig } from 'config/api-config';
import { SALES_PORTAL_URL } from 'config/environment';

/**
 * Test-scoped fixtures interface for authentication
 */
export interface IAuthTestFixtures {
  authPage: Page;
}

/**
 * Worker-scoped fixtures interface for authentication
 */
export interface IWorkerAuthFixtures {
  workerAuthCookies: Array<{ name: string; value: string; domain: string; path: string }>;
}

/**
 * This fixture provides an authenticated page.
 * Each worker gets its own authenticated page with a unique token, eliminating race conditions.
 */
export const authFixture = base.extend<IAuthTestFixtures, IWorkerAuthFixtures>({
  // Worker-scoped: Get auth token once per worker
  workerAuthCookies: [
    async ({ playwright }, use) => {
      const apiContext = await playwright.request.newContext({
        baseURL: apiConfig.BASE_URL,
        timeout: 5000,
      });

      const controller = new SignInController(apiContext);
      const service = new SignInApiService(controller);

      // Retry login up to 3 times with exponential backoff to handle transient failures
      // (server warming up, rate limits, network hiccups) that can occur when workers start
      let token: string | undefined;
      const maxRetries = 3;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          token = await service.loginAsLocalUser();
          if (token) break;
        } catch (error) {
          if (attempt === maxRetries) throw error;
          await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        }
      }

      if (!token) {
        throw new Error('Failed to obtain authentication token after multiple retries');
      }

      await apiContext.dispose();

      await use([
        {
          name: 'Authorization',
          value: token,
          domain: new URL(SALES_PORTAL_URL).hostname,
          path: '/',
        },
      ]);
    },
    { scope: 'worker' },
  ],

  // Test-scoped: Create a new page with auth cookies for each test
  authPage: async ({ browser, workerAuthCookies }, use) => {
    // Create browser context with authentication cookie
    const context = await browser.newContext({
      baseURL: SALES_PORTAL_URL,
    });

    await context.addCookies(workerAuthCookies);

    // Create a new page in the authenticated context
    const page = await context.newPage();

    await use(page);

    // Cleanup
    await context.close();
  },
});
