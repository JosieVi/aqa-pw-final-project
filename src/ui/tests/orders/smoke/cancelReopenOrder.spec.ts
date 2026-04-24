import { ORDER_STATUS } from 'data/orders/statuses.data';
import { TAGS } from 'data/testTags.data';
import { expect, test } from 'fixtures/index.fixture';

test.describe('[UI] [Orders] Cancel Order', () => {
  type FactoryMethod = 'orderDraftStatus' | 'orderInProcessStatus' | 'orderDraftWithDeliveryStatus';
  type OrderCreationMethod = (count: number) => Promise<{ _id: string; products: any[] }>;

  const testCases: { testTitle: string; method: FactoryMethod }[] = [
    { testTitle: 'Should cancel draft order', method: 'orderDraftStatus' },
    { testTitle: 'Should cancel in process order', method: 'orderInProcessStatus' },
    { testTitle: 'Should cancel draft order with delivery', method: 'orderDraftWithDeliveryStatus' },
  ];

  testCases.forEach(({ testTitle, method }) => {
    test.describe(`[UI] [Orders] ${testTitle}`, () => {
      let orderId: string;
      const PRODUCTS_COUNT = 1;

      test.beforeEach(async ({ homeUIService, orderFactory }) => {
        const result = await (orderFactory[method] as OrderCreationMethod)(PRODUCTS_COUNT);
        orderId = result._id;
        await homeUIService.openAsLoggedInUser();
        await homeUIService.openModule('Orders');
      });

      test(testTitle, { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] }, async ({ orderDetailsPage, ordersPage, confirmationModal }) => {
        await ordersPage.clickDetailsButton(orderId);
        await orderDetailsPage.waitForOpened();
        await orderDetailsPage.topPanel.clickCancelOrderButton();

        await orderDetailsPage.waitForSpinner();
        await confirmationModal.clickConfirmButton();
        await orderDetailsPage.waitForSpinner();

        const updatedStatus = await orderDetailsPage.topPanel.getOrderStatus();

        await expect(updatedStatus, 'Order status is incorrect').toBe(ORDER_STATUS.CANCELED);
        await expect(orderDetailsPage.topPanel.reopenOrderButton, 'Reopen order button is not displayed').toBeVisible();
      });
    });
  });

  test.describe('[UI] [Orders] Reopen order', () => {
    let orderId: string = '';

    test.beforeEach(async ({ homeUIService, orderFactory }) => {
      orderId = (await orderFactory.orderCanceledStatus())._id;
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
    });

    test(
      'Reopen canceled order (in process)',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ orderDetailsPage, ordersPage, confirmationModal }) => {
        await ordersPage.clickDetailsButton(orderId);
        await orderDetailsPage.waitForOpened();

        await orderDetailsPage.topPanel.clickReopenOrderButton();
        await orderDetailsPage.waitForSpinner();
        await confirmationModal.clickConfirmButton();
        await orderDetailsPage.waitForSpinner();

        const updatedStatus = await orderDetailsPage.topPanel.getOrderStatus();
        await expect(updatedStatus, 'Order status is incorrect').toBe(ORDER_STATUS.DRAFT);
        await expect(orderDetailsPage.topPanel.cancelOrderButton, 'Cancel button is not displayed').toBeVisible();
      },
    );
  });
});
