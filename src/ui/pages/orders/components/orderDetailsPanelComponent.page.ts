import { PageHolder } from 'ui/pages/pageHolder.page';
import { logStep } from 'utils/reporter.utils';

export class OrderDetailsPanelComponent extends PageHolder {
  readonly backToOrdersLink = this.page.getByRole('link', { name: 'Orders' });
  readonly title = this.page.getByRole('heading', {
    name: 'Order Details',
  });
  readonly orderNumberValue = this.page.locator(
    'span:has-text("Order number:") + span',
  );

  readonly assignManagerButton = this.page.getByRole('button', {
    name: 'Click to select manager',
  });
  readonly editAssignedManagerButton = this.page.getByRole('button', {
    name: 'Edit Assigned Manager',
  });
  readonly removeAssignedManagerButton = this.page.getByRole('button', {
    name: 'Remove Assigned Manager',
  });
  readonly assignedManagerLink = this.page.locator('#assigned-manager-link');
  readonly cancelOrderButton = this.page.locator('#cancel-order');
  readonly reopenOrderButton = this.page.locator('#reopen-order');
  readonly processOrderButton = this.page.locator('#process-order');
  readonly refreshOrderButton = this.page.locator('#refresh-order');
  readonly orderStatusBarContainer = this.page.locator(
    '#order-status-bar-container',
  );
  readonly orderStatusValue = this.orderStatusBarContainer.locator(
    'div:has-text("Order Status") > span.text-primary',
  );
  readonly totalPriceValue = this.orderStatusBarContainer.locator(
    'div:has-text("Total Price") > span.text-primary',
  );
  readonly deliveryDateValue = this.orderStatusBarContainer.locator(
    'div:has-text("Delivery") > span.text-primary',
  );
  readonly createdOnDateValue = this.orderStatusBarContainer.locator(
    'div:has-text("Created On") > span.text-primary',
  );

  uniqueElement = this.title;

  @logStep('Click on "Orders" back link')
  async clickBackToOrdersLink() {
    await this.backToOrdersLink.click();
  }

  @logStep('Get Order Number value')
  async getOrderNumber() {
    return await this.orderNumberValue.textContent();
  }

  @logStep('Click on Assign Manager button')
  async clickAssignManagerButton() {
    await this.assignManagerButton.click();
  }

  @logStep('Click on Edit Assigned Manager button')
  async clickEditAssignedManagerButton() {
    await this.editAssignedManagerButton.click();
  }

  @logStep('Click on Remove Assigned Manager button')
  async clickRemoveAssignedManagerButton() {
    await this.removeAssignedManagerButton.click();
  }

  @logStep('Click on Assigned Manager link')
  async clickAssignedManagerLink() {
    await this.assignedManagerLink.click();
  }

  @logStep('Get Assigned Manager link text')
  async getAssignedManagerName() {
    return await this.assignedManagerLink.textContent();
  }

  @logStep('Click on Cancel Order button')
  async clickCancelOrderButton() {
    await this.cancelOrderButton.click();
  }

  @logStep('Click on Reopen Order button')
  async clickReopenOrderButton() {
    await this.reopenOrderButton.click();
  }

  @logStep('Click on Process Order button')
  async clickProcessOrderButton() {
    await this.processOrderButton.click();
  }

  @logStep('Click on Refresh Order button')
  async clickRefreshOrderButton() {
    await this.refreshOrderButton.click();
  }

  @logStep('Get Order Status value')
  async getOrderStatus() {
    return await this.orderStatusValue.textContent();
  }

  @logStep('Get Total Price value')
  async getTotalPrice() {
    return await this.totalPriceValue.textContent();
  }

  @logStep('Get Delivery Date value')
  async getDeliveryDate() {
    return await this.deliveryDateValue.textContent();
  }

  @logStep('Get Created On Date value')
  async getCreatedOnDate() {
    return await this.createdOnDateValue.textContent();
  }
}
