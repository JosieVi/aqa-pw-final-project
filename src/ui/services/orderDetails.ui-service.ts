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
  async verifyAllProductsReceived(): Promise<void> {
    const productAccordionCount = await this.orderDetailsPage.receivedProductsSection.getProductsAccordionCount();
    expect(productAccordionCount).toBeGreaterThan(0);

    const allStatusTexts = await this.orderDetailsPage.receivedProductsSection.getAllProductReceivedStatusTexts();

    // Use soft assertions to check all products without stopping at first failure
    allStatusTexts.forEach((statusText, index) => {
      expect.soft(statusText, `Product at index ${index} should have status "${PRODUCT_STATUS.RECEIVED}"`).toBe(PRODUCT_STATUS.RECEIVED);
    });

    // Final hard assertion to fail the test if any product has wrong status
    const allReceived = allStatusTexts.every((status) => status === PRODUCT_STATUS.RECEIVED);
    expect(allReceived, `All ${allStatusTexts.length} products should be received`).toBeTruthy();
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
