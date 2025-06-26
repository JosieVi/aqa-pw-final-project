import { BaseModal } from '../baseModal.page';
import { logStep } from 'utils/reporter.utils';

export class editAssignedManagerModal extends BaseModal {
  readonly modalTitle = this.page.getByRole('heading', {
    name: 'Edit Assigned Manager',
    exact: true,
  });
  readonly managerSearchInput = this.page.locator('#manager-search-input');
  readonly managerList = this.page.locator('#manager-list');
  readonly saveButton = this.page.locator('#update-manager-btn');

  uniqueElement = this.modalTitle;

  @logStep('Get modal title')
  async getModalTitle() {
    return await this.uniqueElement.innerText();
  }

  @logStep('fill the manager search input')
  async fillManagerSearchInput(managerName: string) {
    await this.managerSearchInput.fill(managerName);
  }

  getManagerListItem(managerName: string) {
    return this.managerList.locator('li', { hasText: managerName });
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
