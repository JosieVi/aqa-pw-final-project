import { expect, test } from 'fixtures/ordersCustom.fixture';
import { TAGS } from 'data/testTags.data';
import { OrderSetupService } from 'ui/services/orderSetup.ui-service';
import { ORDER_STATUS } from 'data/orders/statuses.data';
test.describe('[UI] [Orders] [Customer]', () => {
  test.describe('[Positive]', () => {
    let targetOrderId: string;
    let initialCustomerNameInOrder: string | null;
    let token: string;

    test.beforeEach(async ({ homeUIService, ordersPage, orderDetailsPage, orderDraftStatus, page }) => {
      const PRODUCTS_TO_CREATE_COUNT = 1;
      const { id } = await orderDraftStatus(PRODUCTS_TO_CREATE_COUNT);
      targetOrderId = id;

      await homeUIService.openAsLoggedInUser();
      token = (await page.context().cookies()).find((c) => c.name === 'Authorization')!.value;
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      await ordersPage.clickDetailsButton(targetOrderId);
      await orderDetailsPage.topPanel.waitForOpened();

      initialCustomerNameInOrder = await orderDetailsPage.customerDetailsSection.getCustomerName();
      await expect(initialCustomerNameInOrder).toBeTruthy();
    });

    test(
      'Should open edit customer modal and show current customer in the list as default',
      { tag: [TAGS.UI] },
      async ({ orderDetailsPage, editCustomerModalPage }) => {
        await expect(orderDetailsPage.customerDetailsSection.editCustomerButton).toBeVisible();
        await expect(orderDetailsPage.customerDetailsSection.editCustomerButton).toBeEnabled();

        await orderDetailsPage.customerDetailsSection.clickEditCustomerButton();

        await expect(editCustomerModalPage.uniqueElement).toBeVisible();
        const modalTitle = await editCustomerModalPage.getModalTitle();
        await expect(modalTitle).toBe('Edit Customer');
        await expect(editCustomerModalPage.customersList).toBeVisible();
        await expect(editCustomerModalPage.saveButton).toBeVisible();
        await expect(editCustomerModalPage.cancelButton).toBeVisible();
        await expect(editCustomerModalPage.closeButton).toBeVisible();

        const selectedCustomerInModal = await editCustomerModalPage.customersList.inputValue();
        await expect(selectedCustomerInModal).toBe(initialCustomerNameInOrder);

        await editCustomerModalPage.clickCloseButton();
        await editCustomerModalPage.waitForClosed;
      },
    );

    test('Should change customer and save changes', { tag: [TAGS.UI] }, async ({ orderDetailsPage, editCustomerModalPage, customersApiService }) => {
      const CUSTOMER_TO_CHANGE_TO_NAME = (await customersApiService.createCustomer(token)).name;
      await orderDetailsPage.customerDetailsSection.clickEditCustomerButton();
      await expect(editCustomerModalPage.uniqueElement).toBeVisible();

      await editCustomerModalPage.selectCustomer(CUSTOMER_TO_CHANGE_TO_NAME);

      await editCustomerModalPage.clickSaveButton();

      await editCustomerModalPage.waitForClosed();

      const updatedCustomerName = await orderDetailsPage.customerDetailsSection.getCustomerName();
      await expect(updatedCustomerName).toBe(CUSTOMER_TO_CHANGE_TO_NAME);
    });

    test(
      'Should change customer and cancel changes without saving',
      { tag: [TAGS.UI] },
      async ({ orderDetailsPage, editCustomerModalPage, customersApiService }) => {
        const CUSTOMER_TO_CHANGE_TO_NAME = (await customersApiService.createCustomer(token)).name;
        await orderDetailsPage.customerDetailsSection.clickEditCustomerButton();
        await expect(editCustomerModalPage.uniqueElement).toBeVisible();

        await editCustomerModalPage.selectCustomer(CUSTOMER_TO_CHANGE_TO_NAME);

        await editCustomerModalPage.clickCancelButton();

        await editCustomerModalPage.waitForClosed();

        const originalCustomerName = await orderDetailsPage.customerDetailsSection.getCustomerName();
        await expect(originalCustomerName).toBe(initialCustomerNameInOrder);
      },
    );

    test.describe('[Negative] Orders were created without service', () => {
      let targetOrderId: string;

      test.beforeEach(async ({ homeUIService, ordersPage, orderDetailsPage, orderCanceledStatus }) => {
        const PRODUCTS_TO_CREATE_COUNT = 1;

        const { id } = await orderCanceledStatus(PRODUCTS_TO_CREATE_COUNT);
        targetOrderId = id;

        await homeUIService.openAsLoggedInUser();
        await homeUIService.openModule('Orders');
        await ordersPage.waitForOpened();

        await ordersPage.clickDetailsButton(targetOrderId);
        await orderDetailsPage.topPanel.waitForOpened();
      });

      test('Should not open edit customer modal for Canceled order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
        const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

        await expect(editButton).not.toBeVisible();
      });
    });

    test.describe('[Negative] Orders were created without service', () => {
      let targetOrderId: string;

      test.beforeEach(async ({ homeUIService, ordersPage, orderDetailsPage, orderInProcessStatus }) => {
        const PRODUCTS_TO_CREATE_COUNT = 1;

        const { id } = await orderInProcessStatus(PRODUCTS_TO_CREATE_COUNT);
        targetOrderId = id;

        await homeUIService.openAsLoggedInUser();
        await homeUIService.openModule('Orders');
        await ordersPage.waitForOpened();

        await ordersPage.clickDetailsButton(targetOrderId);
        await orderDetailsPage.topPanel.waitForOpened();
      });

      test('Should not open edit customer modal for In Process order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
        const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

        await expect(editButton).not.toBeVisible();
      });
    });

    test.describe('[Negative] Orders were created without service', () => {
      let targetOrderId: string;

      test.beforeEach(async ({ homeUIService, ordersPage, orderDetailsPage, orderReceivedStatus }) => {
        const PRODUCTS_TO_CREATE_COUNT = 1;

        const { id } = await orderReceivedStatus(PRODUCTS_TO_CREATE_COUNT);
        targetOrderId = id;

        await homeUIService.openAsLoggedInUser();
        await homeUIService.openModule('Orders');
        await ordersPage.waitForOpened();

        await ordersPage.clickDetailsButton(targetOrderId);
        await orderDetailsPage.topPanel.waitForOpened();
      });

      test('Should not open edit customer modal for Received order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
        const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

        await expect(editButton).not.toBeVisible();
      });
    });

    test.describe('[Negative] Orders were created without service', () => {
      let targetOrderId: string;

      test.beforeEach(async ({ homeUIService, ordersPage, orderDetailsPage, orderPartiallyReceivedStatus }) => {
        const PRODUCTS_TO_CREATE_COUNT = 1;

        const { id } = await orderPartiallyReceivedStatus(PRODUCTS_TO_CREATE_COUNT);
        targetOrderId = id;

        await homeUIService.openAsLoggedInUser();
        await homeUIService.openModule('Orders');
        await ordersPage.waitForOpened();

        await ordersPage.clickDetailsButton(targetOrderId);
        await orderDetailsPage.topPanel.waitForOpened();
      });
      test('Should not open edit customer modal for Partially Received order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
        const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

        await expect(editButton).not.toBeVisible();
      });
    });

    test.describe('[Negative] Orders were created dynamically by service', () => {
      let orderSetupService: OrderSetupService;

      test.beforeEach(
        async ({
          page,
          orderInProcessStatus,
          orderDraftStatus,
          orderDraftWithDeliveryStatus,
          orderCanceledStatus,
          orderPartiallyReceivedStatus,
          orderReceivedStatus,
        }) => {
          const allOrderFixtures = {
            orderInProcessStatus,
            orderDraftStatus,
            orderDraftWithDeliveryStatus,
            orderCanceledStatus,
            orderPartiallyReceivedStatus,
            orderReceivedStatus,
          };

          orderSetupService = new OrderSetupService(page, allOrderFixtures);
        },
      );

      test('Should not open edit customer modal for Canceled order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
        await orderSetupService.createOrderAndNavigateToDetails(ORDER_STATUS.CANCELED);

        const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

        await expect(editButton).not.toBeVisible();
      });

      test('Should not open edit customer modal for Partially Received order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
        await orderSetupService.createOrderAndNavigateToDetails(ORDER_STATUS.PARTIALLY_RECEIVED, 2, 1);

        const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

        await expect(editButton).not.toBeVisible();
      });

      test('Should not open edit customer modal for Received order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
        await orderSetupService.createOrderAndNavigateToDetails(ORDER_STATUS.RECEIVED);

        const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

        await expect(editButton).not.toBeVisible();
      });

      test('Should not open edit customer modal for In Process order', { tag: [TAGS.UI] }, async ({ orderDetailsPage }) => {
        await orderSetupService.createOrderAndNavigateToDetails(ORDER_STATUS.IN_PROCESS);

        const editButton = orderDetailsPage.customerDetailsSection.editCustomerButton;

        await expect(editButton).not.toBeVisible();
      });
    });
  });
});
