import { BaseModal } from '../baseModal.page';
import { logStep } from 'utils/reporter.utils';

export class FiltersModal extends BaseModal {
  readonly modalTitle = this.page.locator('h5.modal-title');
  readonly applyButton = this.page.locator('#apply-filters');
  readonly clearButton = this.page.locator('#clear-filters');

  readonly openFilterButton = this.page.locator('#filter');

  readonly draftCheckbox = this.page.locator('input#Draft-filter');
  readonly inProcessCheckbox = this.page.locator('input#In\\ Process-filter');
  readonly partiallyReceivedCheckbox = this.page.locator('input#Partially\\ Received-filter');
  readonly receivedCheckbox = this.page.locator('input#Received-filter');
  readonly canceledCheckbox = this.page.locator('input#Canceled-filter');

  uniqueElement = this.modalTitle;

  @logStep('Get modal title')
  async getModalTitle(): Promise<string> {
    return await this.uniqueElement.innerText();
  }

  @logStep('Toggle filter checkbox by name')
  async toggleFilter(filterName: 'Draft' | 'In Process' | 'Partially Received' | 'Received' | 'Canceled') {
    const checkboxMap = {
      Draft: this.draftCheckbox,
      'In Process': this.inProcessCheckbox,
      'Partially Received': this.partiallyReceivedCheckbox,
      Received: this.receivedCheckbox,
      Canceled: this.canceledCheckbox,
    };
    const checkbox = checkboxMap[filterName];
    if (!checkbox) throw new Error(`Unknown filter name: ${filterName}`);
    await checkbox.click();
  }

  @logStep('Check if filter checkbox is checked')
  async isFilterChecked(filterName: 'Draft' | 'In Process' | 'Partially Received' | 'Received' | 'Canceled'): Promise<boolean> {
    const checkboxMap = {
      Draft: this.draftCheckbox,
      'In Process': this.inProcessCheckbox,
      'Partially Received': this.partiallyReceivedCheckbox,
      Received: this.receivedCheckbox,
      Canceled: this.canceledCheckbox,
    };
    const checkbox = checkboxMap[filterName];
    if (!checkbox) throw new Error(`Unknown filter name: ${filterName}`);
    return await checkbox.isChecked();
  }

  @logStep('Click Apply filters button')
  async clickApply() {
    await this.applyButton.click();
  }

  @logStep('Click Clear filters button')
  async clickClear() {
    await this.clearButton.click();
  }
}
