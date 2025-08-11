import { PRODUCT_STATUS } from 'data/orders/productStatuses.data';
import { TAGS } from 'data/testTags.data';

import { expect, test } from 'fixtures/ordersCustom.fixture';

test.describe('[UI] [Orders] [Orders Details] [Received Products Section] Order without Received Products', () => {
  test.beforeEach(async ({ homeUIService, orderInProcessStatus, ordersPage, orderDetailsPage }) => {
    const PRODUCTS_TO_CREATE_COUNT = 3;
    const { id: orderId } = await orderInProcessStatus(PRODUCTS_TO_CREATE_COUNT);

    await homeUIService.openAsLoggedInUser();
    await homeUIService.openModule('Orders');

    await ordersPage.clickDetailsButton(orderId);
    await orderDetailsPage.waitForOpened();
  });

  test('Should allow receiving all products for a In Process order', { tag: [TAGS.SMOKE] }, async ({ orderDetailsService, orderDetailsPage }) => {
    const initialProductStatusTexts = await orderDetailsPage.receivedProductsSection.getAllProductReceivedStatusTexts();
    initialProductStatusTexts.forEach((status) => expect(status).toBe(PRODUCT_STATUS.NOT_RECEIVED));
    await orderDetailsService.receiveAllProducts();
    await orderDetailsService.verifyAllProductsReceived();
  });
});

test.describe('[UI] [Orders] [Orders Details] [Received Products Section] Order with Partially Received Products', () => {
  let totalProductsCount: number;
  const RECEIVED_AT_START = 1;

  test.beforeEach(async ({ homeUIService, orderPartiallyReceivedStatus, ordersPage, orderDetailsPage }) => {
    const PRODUCTS_TO_CREATE_COUNT = 3;
    const { id: orderId, productsIds } = await orderPartiallyReceivedStatus(PRODUCTS_TO_CREATE_COUNT, RECEIVED_AT_START);
    totalProductsCount = productsIds.length;

    await homeUIService.openAsLoggedInUser();
    await homeUIService.openModule('Orders');

    await ordersPage.clickDetailsButton(orderId);
    await orderDetailsPage.waitForOpened();
  });

  test(
    'Should allow receiving all products for a In Process order with partially received products',
    { tag: [TAGS.SMOKE] },
    async ({ orderDetailsService, orderDetailsPage }) => {
      const initialProductStatusTexts = await orderDetailsPage.receivedProductsSection.getAllProductReceivedStatusTexts();
      const initiallyReceivedCount = initialProductStatusTexts.filter((status) => status === PRODUCT_STATUS.RECEIVED).length;
      const initiallyNotReceivedCount = initialProductStatusTexts.filter((status) => status === PRODUCT_STATUS.NOT_RECEIVED).length;

      expect(initiallyReceivedCount).toBe(RECEIVED_AT_START);
      expect(initiallyNotReceivedCount).toBe(totalProductsCount - RECEIVED_AT_START);

      await orderDetailsService.receiveAllProducts();

      await orderDetailsService.verifyAllProductsReceived();
    },
  );
});
