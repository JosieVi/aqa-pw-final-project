import { OrderDetailsPage } from 'ui/pages/orders/orderDetails.page';
import { OrdersPage } from 'ui/pages/orders/orders.page';
import { logStep } from 'utils/reporter.utils';
import { BaseUIService } from './base.ui-service';
import { HomeUIService } from './home.ui-service';
import { Page } from '@playwright/test';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { IOrder, IOrderFactory } from 'types/order.types';

export class OrderSetupService extends BaseUIService {
  readonly homeUIService = new HomeUIService(this.page);
  readonly ordersPage = new OrdersPage(this.page);
  readonly orderDetailsPage = new OrderDetailsPage(this.page);
  private orderFactory: IOrderFactory;

  constructor(page: Page, orderFactory: IOrderFactory) {
    super(page);
    this.orderFactory = orderFactory;
  }

  @logStep('Create order and navigate to details')
  async createOrderAndNavigateToDetails(status: ORDER_STATUS, totalProducts: number = 1, receivedCount?: number): Promise<string> {
    let orderCreationFn: (count?: number, receivedCount?: number) => Promise<IOrder>;

    switch (status) {
      case ORDER_STATUS.IN_PROCESS:
        orderCreationFn = (count) => this.orderFactory.orderInProcessStatus(count);
        break;
      case ORDER_STATUS.DRAFT:
        orderCreationFn = (count) => this.orderFactory.orderDraftStatus(count);
        break;
      case ORDER_STATUS.CANCELED:
        orderCreationFn = (count) => this.orderFactory.orderCanceledStatus(count);
        break;
      case ORDER_STATUS.PARTIALLY_RECEIVED:
        orderCreationFn = (count, recCount) => this.orderFactory.orderPartiallyReceivedStatus(count, recCount);
        break;
      case ORDER_STATUS.RECEIVED:
        orderCreationFn = (count) => this.orderFactory.orderReceivedStatus(count);
        break;

      default:
        throw new Error(`Unknown status: ${status}`);
    }

    const { id } = await orderCreationFn(totalProducts, receivedCount);
    const targetOrderId = id;

    await this.homeUIService.openAsLoggedInUser();
    await this.homeUIService.openModule('Orders');
    await this.ordersPage.waitForOpened();

    await this.ordersPage.clickDetailsButton(targetOrderId);
    await this.orderDetailsPage.topPanel.waitForOpened();

    return targetOrderId;
  }
}
