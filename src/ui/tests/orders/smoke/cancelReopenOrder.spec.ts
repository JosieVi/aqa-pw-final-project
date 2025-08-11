import { ORDER_STATUS } from 'data/orders/statuses.data';
import { TAGS } from 'data/testTags.data';
import { expect, test } from 'fixtures/ordersCustom.fixture';

test.describe('[UI] [Orders] Cancel Order', () => {
  let token: string;
  let orderId: string = '';

  const testCases = [
    { testTitle: 'Canceled draft order', method: 'createDraftOrder' },
    { testTitle: 'Canceled in process order', method: 'createInProcessOrder' },
    {
      testTitle: 'Canceled draft with delivery order',
      method: 'createDraftOrderWithDelivery',
    },
  ] as const;

  testCases.forEach(({ testTitle, method }) => {
    test.beforeEach(async ({ ordersApiService, signInApiService, homeUIService }) => {
      token = await signInApiService.loginAsLocalUser();
      orderId = (await ordersApiService[method](1, token))._id;
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
  let token: string;
  let orderId: string = '';

  test.beforeEach(async ({ signInApiService, homeUIService, ordersApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    orderId = (await ordersApiService.createCanceledOrder(1, token))._id;
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
