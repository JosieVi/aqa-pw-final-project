import { DELIVERY } from 'data/orders/delivery.data';
import { generateDeliveryData } from 'data/orders/generateDeliveryData.data';
import { TAGS } from 'data/testTags.data';
import { test } from 'fixtures/ordersCustom.fixture';
import { generateValidDeliveryDate } from 'utils/date.utils';

test.describe('[UI] [Orders] [Order Details] [Delivery Tab]', () => {
  test.beforeEach(async ({ homeUIService, orderDraftStatus, ordersPage, signInApiService, page }) => {
    const PRODUCTS_TO_CREATE_COUNT = 1;
    const order = await orderDraftStatus(PRODUCTS_TO_CREATE_COUNT);
    targetOrderId = order.id;

    let token = await signInApiService.loginAsLocalUser();

    await homeUIService.openAsLoggedInUser();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token = (await page.context().cookies()).find((c) => c.name === 'Authorization')!.value;

    await homeUIService.openModule('Orders');
    await ordersPage.waitForOpened();
  });
  let targetOrderId: string;
  const createdOrderIds: string[] = [];
  const createdCustomerIds: string[] = [];
  const createdProductIds: string[] = [];

  test.afterEach(async ({ dataDisposalUtils }) => {
    await dataDisposalUtils.clearOrders(createdOrderIds);
    await dataDisposalUtils.clearProducts(createdProductIds);
    await dataDisposalUtils.clearCustomers(createdCustomerIds);
    createdOrderIds.length = 0;
    createdCustomerIds.length = 0;
    createdProductIds.length = 0;
  });

  test(
    'Schedule delivery with type "Delivery" and "Home" Location',
    {
      tag: [TAGS.API, TAGS.SMOKE, TAGS.UI, TAGS.ORDERS],
    },
    async ({ ordersPage, orderDetailsPage, scheduleDeliveryPage }) => {
      const delivery = generateDeliveryData({
        condition: DELIVERY.DELIVERY,
        finalDate: generateValidDeliveryDate(),
      });

      await ordersPage.clickDetailsButton(targetOrderId);
      await orderDetailsPage.topPanel.waitForOpened();

      await orderDetailsPage.deliverySection.clickDeliveryTab();
      await orderDetailsPage.deliverySection.waitForOpened();

      await orderDetailsPage.deliverySection.clickScheduleDelivery();
      await scheduleDeliveryPage.waitForOpened();

      await scheduleDeliveryPage.fillAddress(
        {
          ...delivery.address,
          finalDate: delivery.finalDate,
        },
        delivery.condition,
      );

      await scheduleDeliveryPage.saveDelivery();
    },
  );
});
