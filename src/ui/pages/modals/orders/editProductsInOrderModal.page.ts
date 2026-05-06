import { Locator } from '@playwright/test';
import { logStep } from 'utils/reporter.utils';
import { ManagmentOrderModal } from '../baseModalManagmentOrder.page';

export class EditOrderModal extends ManagmentOrderModal {
  readonly saveButton = this.page.locator('#update-products-btn');
  readonly saveButtonDisabled = this.saveButton.locator(':disabled');

  readonly uniqueElement: Locator = this.modalTitle;

  @logStep('Click Save button')
  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }

  @logStep('Click Save button and wait for API response')
  async clickSaveAndWaitForResponse(): Promise<void> {
    // Intercept the PUT/PATCH response so we know the backend has processed
    // the update before we start asserting the updated DOM state
    await Promise.all([this.page.waitForResponse((resp) => resp.url().includes('/api/orders') && resp.status() === 200), this.saveButton.click()]);
  }

  @logStep('Check if Save button is enabled')
  async isSaveEnabled(): Promise<boolean> {
    return await this.saveButton.isEnabled();
  }

  @logStep('Check if Save button is disabled')
  async isSaveDisabled(): Promise<boolean> {
    return await this.saveButtonDisabled.isVisible();
  }
}
