import { BaseModal } from '../baseModal.page';
import { logStep } from 'utils/reporter.utils';
export class ConfirmationModal extends BaseModal {
  readonly modalContainer = this.page.locator('.modal-content');
  readonly modalTitle = this.modalContainer.locator('h5.modal-title');
  readonly confirmButton = this.modalContainer.locator('.modal-footer button[type="submit"]');
  readonly modalContent = this.modalContainer.locator('.modal-body-text > p');
  uniqueElement = this.modalTitle;

  @logStep('Get modal title')
  async getModalTitle() {
    return await this.uniqueElement.innerText();
  }

  @logStep('Click on the confirm button')
  async clickConfirmButton() {
    await this.confirmButton.click();
  }

  @logStep('Get modal content')
  async getModalContent() {
    return await this.modalContent.innerText();
  }
}
