import { Page } from '@playwright/test';

export class Mock {
  constructor(private page: Page) {}
}

export { expect } from '@playwright/test';
