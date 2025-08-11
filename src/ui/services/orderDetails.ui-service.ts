import { expect } from '@playwright/test';
import { logStep } from 'utils/reporter.utils';
import { BaseUIService } from './base.ui-service';
import { OrdersPage } from 'ui/pages/orders/orders.page';
import { OrderDetailsPage } from 'ui/pages/orders/orderDetails.page';
import { PRODUCT_STATUS } from 'data/orders/productStatuses.data';

export class OrderDetailsService extends BaseUIService {
  readonly orderDetailsPage = new OrderDetailsPage(this.page);
  readonly ordersPage = new OrdersPage(this.page);

  @logStep('Receive all products in the order')
  async receiveAllProducts() {
    await this.orderDetailsPage.receivedProductsSection.clickReceiveButton();
    await this.orderDetailsPage.receivedProductsSection.clickSelectAllCheckbox();
    await this.orderDetailsPage.receivedProductsSection.clickSaveReceivedProductsButton();
    await this.orderDetailsPage.receivedProductsSection.waitForOpened();
  }

  @logStep('Verify all products are received')
  async verifyAllProductsReceived() {
    const productAccordionCount = await this.orderDetailsPage.receivedProductsSection.getProductsAccordionCount();
    expect(productAccordionCount).toBeGreaterThan(0);
    for (let i = 0; i < productAccordionCount; i++) {
      const statusText = await this.orderDetailsPage.receivedProductsSection.allReceivedStatusSpans.nth(i).innerText();
      expect(statusText).toBe(PRODUCT_STATUS.RECEIVED);
    }
  }

  @logStep('Verify no receive options are available')
  async verifyNoReceiveOptionsAvailable(expectedOrderStatus: string) {
    await logStep(`Verifying no receive options for order in status: ${expectedOrderStatus}`);
    await expect(this.orderDetailsPage.receivedProductsSection.receiveButton).not.toBeVisible();
  }

  async refreshPage() {
    await this.page.reload();
  }
}
