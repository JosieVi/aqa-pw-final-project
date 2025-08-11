import { OrderDetailsPage } from 'ui/pages/orders/orderDetails.page';
import { OrdersPage } from 'ui/pages/orders/orders.page';
import { logStep } from 'utils/reporter.utils';
import { BaseUIService } from './base.ui-service';
import { HomeUIService } from './home.ui-service';
import { ICreateOrderData, ICustomOrder as OrderCreationFixtures } from 'fixtures/ordersCustom.fixture';
import { Page } from '@playwright/test';
import { ORDER_STATUS } from 'data/orders/statuses.data';

export class OrderSetupService extends BaseUIService {
  readonly homeUIService = new HomeUIService(this.page);
  readonly ordersPage = new OrdersPage(this.page);
  readonly orderDetailsPage = new OrderDetailsPage(this.page);
  private orderFixtures: OrderCreationFixtures;

  constructor(page: Page, orderFixtures: OrderCreationFixtures) {
    super(page);
    this.orderFixtures = orderFixtures;
  }

  @logStep('Create order and navigate to details')
  async createOrderAndNavigateToDetails(status: ORDER_STATUS, productsCount: number = 1, receivedCount?: number): Promise<string> {
    let orderCreationFn: (count?: number, receivedCount?: number) => Promise<ICreateOrderData>;

    switch (status) {
      case ORDER_STATUS.IN_PROCESS:
        orderCreationFn = this.orderFixtures.orderInProcessStatus;
        break;
      case ORDER_STATUS.DRAFT:
        orderCreationFn = this.orderFixtures.orderDraftStatus;
        break;
      case ORDER_STATUS.CANCELED:
        orderCreationFn = this.orderFixtures.orderCanceledStatus;
        break;
      case ORDER_STATUS.PARTIALLY_RECEIVED:
        orderCreationFn = (count, recCount) => this.orderFixtures.orderPartiallyReceivedStatus(count, recCount);
        break;
      case ORDER_STATUS.RECEIVED:
        orderCreationFn = this.orderFixtures.orderReceivedStatus;
        break;

      default:
        throw new Error(`Unknown status: ${status}`);
    }

    const { id } = await orderCreationFn(productsCount, receivedCount);
    const targetOrderId = id;

    await this.homeUIService.openAsLoggedInUser();
    await this.homeUIService.openModule('Orders');
    await this.ordersPage.waitForOpened();

    await this.ordersPage.clickDetailsButton(targetOrderId);
    await this.orderDetailsPage.topPanel.waitForOpened();

    return targetOrderId;
  }
}
