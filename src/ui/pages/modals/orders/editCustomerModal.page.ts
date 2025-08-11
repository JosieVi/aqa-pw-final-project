import { BaseModal } from '../baseModal.page';
import { logStep } from 'utils/reporter.utils';

export class EditCustomerModalPage extends BaseModal {
  readonly uniqueElement = this.page.locator('#edit-customer-modal .modal-content');

  readonly modalTitle = this.uniqueElement.locator('h5');
  readonly customersList = this.uniqueElement.locator('select[name="Customer"]');
  readonly saveButton = this.uniqueElement.locator('#update-customer-btn');
  readonly cancelButton = this.uniqueElement.locator('#cancel-edit-customer-modal-btn');
  readonly closeButton = this.uniqueElement.locator('.btn-close.hover-danger');

  @logStep('Get modal title')
  async getModalTitle() {
    return await this.modalTitle.innerText();
  }

  @logStep('Select another customer for order')
  async selectCustomer(customerName: string) {
    await this.customersList.selectOption({ value: customerName });
  }

  @logStep('Click on the confirm button')
  async clickSaveButton() {
    await this.saveButton.click();
  }

  @logStep('Click on the cancel button')
  async clickCancelButton() {
    await this.cancelButton.click();
  }

  @logStep('Click on the close button')
  async clickCloseButton() {
    await this.closeButton.click();
  }
}
