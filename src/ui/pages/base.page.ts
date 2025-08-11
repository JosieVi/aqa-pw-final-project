import { Page, test } from '@playwright/test';
import { IResponse } from 'types/api.types';

export abstract class BasePage {
  constructor(protected page: Page) {}

  async interceptRequest<T extends unknown[]>(url: string, triggerAction: (...args: T) => Promise<void>, ...args: T) {
    return await test.step(`Intercept Request for URL: ${url}`, async () => {
      const [request] = await Promise.all([this.page.waitForRequest((request) => request.url().includes(url)), triggerAction(...args)]);
      return request;
    });
  }

  async interceptResponse<U extends object | null, T extends unknown[]>(
    url: string,
    triggerAction: (...args: T) => Promise<void>,
    ...args: T
  ): Promise<IResponse<U>> {
    const [response] = await Promise.all([this.page.waitForResponse((response) => response.url().includes(url)), triggerAction(...args)]);
    return await test.step(`Intercept Response for URL: ${url}`, async () => {
      return {
        status: response.status(),
        headers: response.headers(),
        body: (await response.json()) as U,
      };
    });
  }
}
