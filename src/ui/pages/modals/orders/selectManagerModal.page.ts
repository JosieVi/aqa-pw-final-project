import { BaseModal } from '../baseModal.page';
import { logStep } from 'utils/reporter.utils';

export class SelectManagerModal extends BaseModal {
  readonly modalTitle = this.page.locator('h5.modal-title');
  readonly managerSearchInput = this.page.locator('#manager-search-input');
  readonly managerList = this.page.locator('#manager-list');
  readonly saveButton = this.page.locator('#update-manager-btn');

  uniqueElement = this.modalTitle;

  @logStep('Get modal title')
  async getModalTitle() {
    return await this.uniqueElement.innerText();
  }

  @logStep('Fill the manager search input')
  async fillManagerSearchInput(managerName: string) {
    await this.managerSearchInput.fill(managerName);
  }

  getManagerListItem(managerUsername: string) {
    // Ищем <li>, в котором есть <small> с точным текстом (username/email в скобках)
    return this.managerList.locator(`xpath=.//li[.//small[normalize-space(text())="(${managerUsername})"]]`);
  }

  @logStep('Click on the manager list item')
  async clickManagerListItem(managerName: string) {
    await this.getManagerListItem(managerName).click();
  }

  @logStep('Click on the Save button')
  async clickSaveButton() {
    await this.saveButton.click();
  }
}
