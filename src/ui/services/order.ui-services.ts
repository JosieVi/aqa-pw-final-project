import { logStep } from 'utils/reporter.utils';
import { BaseUIService } from './base.ui-service';
import { OrdersPage } from 'ui/pages/orders/orders.page';
import test from '@playwright/test';

export class OrderService extends BaseUIService {
  readonly ordersPage = new OrdersPage(this.page);

  @logStep('Check if order with number "{orderNumber}" is visible in list')
  async isOrderVisibleInList(orderNumber: string) {
    return await test.step('Check if order with number "{orderNumber}" is visible in list', async () => {
      const orderRowLocator = this.ordersPage.tableRowByOrderNumber(orderNumber);
      return await orderRowLocator.isVisible();
    });
  }
}
