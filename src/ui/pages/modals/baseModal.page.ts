import { expect } from '@playwright/test';
import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { logStep } from 'utils/reporter.utils';
import { BUTTON_NAMES } from 'data/uiTexts.data';

export abstract class BaseModal extends SalesPortalPage {
  readonly closeButton = this.page.getByRole('button', {
    name: BUTTON_NAMES.CLOSE,
  });

  readonly cancelButton = this.page.getByRole('button', {
    name: BUTTON_NAMES.CANCEL,
    exact: true,
  });

  @logStep('Wait for Modal to be closed')
  async waitForClosed(): Promise<void> {
    await expect(this.uniqueElement).not.toBeVisible();
  }

  @logStep('Click on the Close button')
  async clickCloseButton(): Promise<void> {
    await this.closeButton.click();
  }

  @logStep('Click on the Cancel button')
  async clickCancelButton(): Promise<void> {
    await this.cancelButton.click();
  }
}
