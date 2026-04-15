import { Page } from '@playwright/test';

/**
 * Base class for UI services.
 * Services provide higher-level operations that may span multiple pages.
 * Unlike pages, services do not have a uniqueElement and are not meant to be waited for.
 */
export class BaseUIService {
  constructor(protected page: Page) {}
}
