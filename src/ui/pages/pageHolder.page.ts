import { expect } from '@playwright/test';
import { logStep } from 'utils/reporter.utils';
import { BasePage } from './base.page';
import { SALES_PORTAL_URL } from 'config/environment';

export abstract class PageHolder extends BasePage {
  readonly spinner = this.page.locator('.spinner-border');
  readonly notification = this.page.locator('.toast-body');

  @logStep('Wait for Page to be opened')
  async waitForOpened(): Promise<void> {
    await expect(this.uniqueElement).toBeVisible();
    await this.waitForSpinner();
  }

  @logStep('Wait for Spinner to be hidden')
  async waitForSpinner(): Promise<void> {
    await expect(this.spinner).toHaveCount(0, { timeout: 15000 });
  }

  @logStep('Wait for Notification to appear')
  async waitForNotification(text: string): Promise<void> {
    await expect(this.notification.last()).toHaveText(text);
  }

  @logStep('Open Sales Portal')
  async openPortal(): Promise<void> {
    await this.page.goto(SALES_PORTAL_URL);
  }
}
