import { TAGS } from 'data/testTags.data';
import { OrdersListColumnForSorting } from 'data/orders/ordersListColumn.data';
import { expect, test } from 'fixtures/index.fixture';

test.describe('[UI] [Sales Portal]', () => {
  test.describe('Login via services', () => {
    test.skip('Should login to Sales Portal by openAsLoggedInUser and get token', { tag: [TAGS.SMOKE] }, async ({ page, homeUIService }) => {
      await homeUIService.openAsLoggedInUser();
      const token = (await page.context().cookies()).find((c) => c.name === 'Authorization')!.value;
      console.log(`First token: ${token}`);
    });

    test.skip('Should login to Sales Portal by loginAsLocalUser and get token', { tag: [TAGS.SMOKE] }, async ({ signInApiService }) => {
      const token = await signInApiService.loginAsLocalUser();
      console.log(`Second token: ${token}`);
    });

    test.skip('Should open Order module', { tag: [TAGS.SMOKE] }, async ({ homeUIService }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
    });
  });

  test.describe('Orders Details - Received Products section - Orders in Draft', () => {
    let orderId: string;
    let productName: string;

    test.beforeEach(async ({ orderFactory }) => {
      // Arrange: Create a draft order with known data via API fixture
      const order = await orderFactory.orderDraftStatus(1);
      orderId = order._id;
      productName = order.products[0].name;
    });

    test('Verify section title "Requested Products"', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act
      await ordersPage.clickDetailsButton(orderId);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      // Assert
      const title = await orderDetailsPage.receivedProductsSection.getTitle();
      await expect(title).toBe('Requested Products');
    });

    test('Verify products accordion count', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act
      await ordersPage.clickDetailsButton(orderId);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      // Assert
      const totalProducts = await orderDetailsPage.receivedProductsSection.getProductsAccordionCount();
      await expect(totalProducts).toEqual(1);
    });

    test('Verify product received statuses', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act
      await ordersPage.clickDetailsButton(orderId);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      // Assert
      const totalProducts = await orderDetailsPage.receivedProductsSection.getProductsAccordionCount();
      const allStatuses = await orderDetailsPage.receivedProductsSection.getAllProductReceivedStatusTexts();
      await expect(allStatuses.length).toBe(totalProducts);
      await expect(allStatuses).toContain('Not Received');

      const status = await orderDetailsPage.receivedProductsSection.getProductReceivedStatusText(productName);
      await expect(status).toBe('Not Received');
    });

    test('Verify product accordion expanded/collapsed state', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act
      await ordersPage.clickDetailsButton(orderId);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      // Assert - initial state (collapsed)
      let isExpanded = await orderDetailsPage.receivedProductsSection.isProductAccordionExpanded(productName);
      let isCollapsed = await orderDetailsPage.receivedProductsSection.isProductAccordionCollapsed(productName);
      await expect(isExpanded).toBe(false);
      await expect(isCollapsed).toBe(true);

      // Act - expand accordion
      await orderDetailsPage.receivedProductsSection.clickProductAccordionHeaderButton(productName);

      // Assert - expanded state
      isExpanded = await orderDetailsPage.receivedProductsSection.isProductAccordionExpanded(productName);
      isCollapsed = await orderDetailsPage.receivedProductsSection.isProductAccordionCollapsed(productName);
      await expect(isExpanded).toBe(true);
      await expect(isCollapsed).toBe(false);
    });

    test('Verify clickEditProductsPencilButton', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act
      await ordersPage.clickDetailsButton(orderId);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      // Act & Assert
      await orderDetailsPage.receivedProductsSection.clickEditProductsPencilButton();
    });

    test('Verify product details as object', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act
      await ordersPage.clickDetailsButton(orderId);
      await orderDetailsPage.receivedProductsSection.waitForOpened();
      await orderDetailsPage.receivedProductsSection.clickProductAccordionHeaderButton(productName);

      // Assert
      const isExpanded = await orderDetailsPage.receivedProductsSection.isProductAccordionExpanded(productName);
      await expect(isExpanded).toBe(true);

      const details = await orderDetailsPage.receivedProductsSection.getProductDetailsAsObject(productName);
      await expect(details.Name).toBe(productName);
      await expect(details.Price).toMatch(/^\$\d+(\.\d{2})?$/);
    });
  });

  test.describe('Orders Details - Received Products section - Orders in Progress', () => {
    let orderId: string;
    let productName: string;

    test.beforeEach(async ({ orderFactory }) => {
      // Arrange: Create an in-process order with known data via API fixture
      const order = await orderFactory.orderInProcessStatus(1);
      orderId = order._id;
      productName = order.products[0].name;
    });

    test('Verify click on Receive button', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act
      await ordersPage.clickDetailsButton(orderId);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      // Act & Assert
      await orderDetailsPage.receivedProductsSection.clickReceiveButton();
    });

    test('Verify "Select All" checkbox', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act - navigate to order and start receiving
      await ordersPage.clickDetailsButton(orderId);
      await orderDetailsPage.receivedProductsSection.waitForOpened();
      await expect(orderDetailsPage.receivedProductsSection.receiveButton).toBeVisible();
      await orderDetailsPage.receivedProductsSection.clickReceiveButton();

      // Assert - buttons are visible
      await expect(orderDetailsPage.receivedProductsSection.cancelReceivingButton).toBeVisible();
      await expect(orderDetailsPage.receivedProductsSection.saveReceivedProductsButton).toBeVisible();

      // Assert - initial checkbox state
      const initialSelectAllChecked = await orderDetailsPage.receivedProductsSection.isSelectAllCheckboxChecked();
      await expect(initialSelectAllChecked).toBe(false);

      // Act - check and uncheck
      await orderDetailsPage.receivedProductsSection.clickSelectAllCheckbox();
      const afterClickSelectAllChecked = await orderDetailsPage.receivedProductsSection.isSelectAllCheckboxChecked();
      await expect(afterClickSelectAllChecked).toBe(true);

      await orderDetailsPage.receivedProductsSection.clickSelectAllCheckbox();
      const afterUncheckSelectAllChecked = await orderDetailsPage.receivedProductsSection.isSelectAllCheckboxChecked();
      await expect(afterUncheckSelectAllChecked).toBe(false);
    });

    test('Verify individual product received checkbox', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act - navigate and start receiving
      await ordersPage.clickDetailsButton(orderId);
      await orderDetailsPage.receivedProductsSection.waitForOpened();
      await expect(orderDetailsPage.receivedProductsSection.receiveButton).toBeVisible();
      await orderDetailsPage.receivedProductsSection.clickReceiveButton();

      // Assert - initial state
      const initialChecked = await orderDetailsPage.receivedProductsSection.isProductReceivedCheckboxChecked(productName);
      await expect(initialChecked).toBe(false);

      // Act & Assert - check
      await orderDetailsPage.receivedProductsSection.setProductReceivedCheckbox(productName, true);
      const afterCheck = await orderDetailsPage.receivedProductsSection.isProductReceivedCheckboxChecked(productName);
      await expect(afterCheck).toBe(true);

      // Act & Assert - uncheck
      await orderDetailsPage.receivedProductsSection.setProductReceivedCheckbox(productName, false);
      const afterUncheck = await orderDetailsPage.receivedProductsSection.isProductReceivedCheckboxChecked(productName);
      await expect(afterUncheck).toBe(false);
    });

    test('Verify Cancel Receiving button', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act - navigate and start receiving
      await ordersPage.clickDetailsButton(orderId);
      await orderDetailsPage.receivedProductsSection.waitForOpened();
      await expect(orderDetailsPage.receivedProductsSection.receiveButton).toBeVisible();
      await orderDetailsPage.receivedProductsSection.clickReceiveButton();

      // Act - check product and cancel
      await orderDetailsPage.receivedProductsSection.setProductReceivedCheckbox(productName, true);
      await expect(await orderDetailsPage.receivedProductsSection.isProductReceivedCheckboxChecked(productName)).toBe(true);
      await orderDetailsPage.receivedProductsSection.clickCancelReceivingButton();

      // Assert - receiving mode is closed
      await expect(orderDetailsPage.receivedProductsSection.cancelReceivingButton).not.toBeVisible();
      await expect(orderDetailsPage.receivedProductsSection.saveReceivedProductsButton).not.toBeVisible();
      await expect(orderDetailsPage.receivedProductsSection.receiveButton).toBeVisible();
    });

    test('Verify "Save Received Products" button', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act - navigate and start receiving
      await ordersPage.clickDetailsButton(orderId);
      await orderDetailsPage.receivedProductsSection.waitForOpened();
      await expect(orderDetailsPage.receivedProductsSection.receiveButton).toBeVisible();
      await orderDetailsPage.receivedProductsSection.clickReceiveButton();
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      // Act - check product and save
      await orderDetailsPage.receivedProductsSection.setProductReceivedCheckbox(productName, true);
      await expect(await orderDetailsPage.receivedProductsSection.isProductReceivedCheckboxChecked(productName)).toBe(true);
      await orderDetailsPage.receivedProductsSection.clickSaveReceivedProductsButton();
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      // Assert - status changed to Received
      const updatedStatus = await orderDetailsPage.receivedProductsSection.getProductReceivedStatusText(productName);
      await expect(updatedStatus).toBe('Received');
    });
  });

  test.describe('Orders list', () => {
    test('Should display Orders List title', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');

      // Act
      await ordersPage.waitForOpened();

      // Assert
      const title = await ordersPage.getOrdersListTitle();
      await expect(title).toBe('Orders List');
    });

    test('Should navigate to Create Order page after clicking button', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act
      await ordersPage.clickCreateOrderButton();
    });

    test('Should filter orders by search input', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, customerFactory }) => {
      // Arrange - create a customer with known email
      const customer = await customerFactory.singleCustomer();
      const searchEmail = customer.email ?? '';

      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act
      await ordersPage.fillSearchInputField(searchEmail);
      await ordersPage.clickSearchButton();

      // Assert
      await ordersPage.allTableRows.first().waitFor({ state: 'visible' });
    });

    test('Should sort Order Number column to ASC when initially unsorted', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act & Assert - initial state
      const initialDirection = await ordersPage.getCurrentSortDirection(OrdersListColumnForSorting.OrderNumber);
      await expect(initialDirection).toBe('none');

      // Act - sort
      await ordersPage.sortColumnBy(OrdersListColumnForSorting.OrderNumber, 'asc');

      // Assert - final state
      const finalDirection = await ordersPage.getCurrentSortDirection(OrdersListColumnForSorting.OrderNumber);
      await expect(finalDirection).toBe('asc');
    });

    test(
      'Should navigate to order details page after clicking details button',
      { tag: [TAGS.SMOKE] },
      async ({ homeUIService, ordersPage, orderFactory, page }) => {
        // Arrange - create a draft order
        const order = await orderFactory.orderDraftStatus(1);
        const orderNumberToClick = order._id;

        await homeUIService.openAsLoggedInUser();
        await homeUIService.openModule('Orders');
        await ordersPage.waitForOpened();

        // Act
        await ordersPage.clickDetailsButton(orderNumberToClick);

        // Assert
        await page.waitForURL(`**/orders/${orderNumberToClick}`);
      },
    );

    test(
      'Should reopen order after clicking reopen button',
      { tag: [TAGS.SMOKE] },
      async ({ homeUIService, ordersPage, orderFactory, confirmationModal }) => {
        // Arrange - create a canceled order
        const order = await orderFactory.orderCanceledStatus(1);
        const orderNumberToReopen = order._id;

        await homeUIService.openAsLoggedInUser();
        await homeUIService.openModule('Orders');
        await ordersPage.waitForOpened();

        // Act
        await ordersPage.clickReopenButton(orderNumberToReopen);

        // Assert
        await confirmationModal.waitForOpened();
        await confirmationModal.clickConfirmButton();
      },
    );

    test('Should change items per page to 25', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act
      await ordersPage.selectItemsPerPage('25');

      // Assert
      const rowCount = await ordersPage.getRowCount();
      await expect(rowCount).toBeLessThanOrEqual(25);
    });

    test('Should navigate to next page', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act
      await ordersPage.clickNextPageButton();

      // Assert
      await ordersPage.tableBody.waitFor({ state: 'visible' });
    });

    test('Should navigate to previous page', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      // Act - go to page 2
      await ordersPage.clickPageNumberButton(2);
      await ordersPage.tableBody.waitFor({ state: 'visible' });

      // Act - go back to page 1
      await ordersPage.clickPreviousPageButton();

      // Assert
      await ordersPage.tableBody.waitFor({ state: 'visible' });
    });

    test('Should navigate to a specific page number', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      // Arrange
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      const targetPageNumber = 3;

      // Act
      await ordersPage.clickPageNumberButton(targetPageNumber);

      // Assert
      await ordersPage.tableBody.waitFor({ state: 'visible' });
      await expect(ordersPage.getPageByNumber(targetPageNumber)).toHaveAttribute('aria-current', 'page');
    });
  });

  test.describe('Order Details Page - Top Panel and Received Products Section', () => {
    let orderId: string;

    test.beforeEach(async ({ orderFactory }) => {
      // Arrange: Create an in-process order
      const order = await orderFactory.orderInProcessStatus(1);
      orderId = order._id;
    });

    test(
      'should verify order details from top panel and add a received product',
      { tag: [TAGS.SMOKE] },
      async ({ homeUIService, orderDetailsPage, ordersPage }) => {
        await test.step('Navigate to an Order Details Page', async () => {
          // Arrange
          await homeUIService.openAsLoggedInUser();
          await homeUIService.openModule('Orders');
          await ordersPage.waitForOpened();

          // Act
          await ordersPage.clickDetailsButton(orderId);
          await orderDetailsPage.waitForOpened();

          // Assert
          const orderDetails = await orderDetailsPage.topPanel.getOrderDetails();
          console.log(`orderDetails: ${JSON.stringify(orderDetails)}`);

          // Act - receive and cancel
          await orderDetailsPage.receivedProductsSection.clickReceiveButton();
          await orderDetailsPage.receivedProductsSection.clickCancelReceivingButton();
        });
      },
    );
  });
});
