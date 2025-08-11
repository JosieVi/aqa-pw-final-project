import { expect, test } from 'fixtures/ui-services.fixture';
import { TAGS } from 'data/testTags.data';
import { OrdersListColumnForSorting } from 'data/orders/ordersListColumn.data';

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
    const TEST_ORDER_ID = '68618f821c508c5d5e6b9842';
    const PRODUCT_NAME_1 = 'Product 1751224193253 vUjpOfYLCt';
    test('Verify section title "Requested Products"', async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(TEST_ORDER_ID);
      await orderDetailsPage.receivedProductsSection.waitForOpened();
      const title = await orderDetailsPage.receivedProductsSection.getTitle();
      await expect(title).toBe('Requested Products');
    });

    test('Verify products accordion count', async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(TEST_ORDER_ID);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      const productCount = await orderDetailsPage.receivedProductsSection.getProductsAccordionCount();
      await expect(productCount).toEqual(1);
    });

    test('Verify product received statuses', async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(TEST_ORDER_ID);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      const productCount = await orderDetailsPage.receivedProductsSection.getProductsAccordionCount();
      const allStatuses = await orderDetailsPage.receivedProductsSection.getAllProductReceivedStatusTexts();
      await expect(allStatuses.length).toBe(productCount);
      await expect(allStatuses).toContain('Not Received');

      const status1 = await orderDetailsPage.receivedProductsSection.getProductReceivedStatusText(PRODUCT_NAME_1);
      await expect(status1).toBe('Not Received');
    });

    test('Verify product accordion expanded/collapsed state', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(TEST_ORDER_ID);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      let isExpanded1 = await orderDetailsPage.receivedProductsSection.isProductAccordionExpanded(PRODUCT_NAME_1);
      let isCollapsed1 = await orderDetailsPage.receivedProductsSection.isProductAccordionCollapsed(PRODUCT_NAME_1);
      await expect(isExpanded1).toBe(false);
      await expect(isCollapsed1).toBe(true);

      await orderDetailsPage.receivedProductsSection.clickProductAccordionHeaderButton(PRODUCT_NAME_1);
      isExpanded1 = await orderDetailsPage.receivedProductsSection.isProductAccordionExpanded(PRODUCT_NAME_1);
      isCollapsed1 = await orderDetailsPage.receivedProductsSection.isProductAccordionCollapsed(PRODUCT_NAME_1);
      await expect(isExpanded1).toBe(true);
      await expect(isCollapsed1).toBe(false);
    });

    test('Verify clickEditProductsPencilButton', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(TEST_ORDER_ID);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      await orderDetailsPage.receivedProductsSection.clickEditProductsPencilButton();
    });

    test('Verify product details as object', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(TEST_ORDER_ID);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      await orderDetailsPage.receivedProductsSection.clickProductAccordionHeaderButton(PRODUCT_NAME_1);
      const expandedForDetails1 = await orderDetailsPage.receivedProductsSection.isProductAccordionExpanded(PRODUCT_NAME_1);
      await expect(expandedForDetails1).toBe(true);

      const details1 = await orderDetailsPage.receivedProductsSection.getProductDetailsAsObject(PRODUCT_NAME_1);
      await expect(details1.Name).toBe(PRODUCT_NAME_1);
      await expect(details1.Price).toMatch(/^\$\d+(\.\d{2})?$/);
      console.log(`Детали для "${PRODUCT_NAME_1}": \n ${JSON.stringify(details1)}`);
    });
  });
  test.describe('Orders Details - Received Products section - Orders in Progress', () => {
    const TEST_ORDER_ID = '68618f821c508c5d5e6b9842';
    const PRODUCT_NAME_1 = 'Product 1751224193253 vUjpOfYLCt';
    test('Verify click on Receive button', async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(TEST_ORDER_ID);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      await orderDetailsPage.receivedProductsSection.clickReceiveButton();
    });

    test('Verify "Select All" checkbox', async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(TEST_ORDER_ID);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      await expect(orderDetailsPage.receivedProductsSection.receiveButton).toBeVisible();
      await orderDetailsPage.receivedProductsSection.clickReceiveButton();

      await expect(orderDetailsPage.receivedProductsSection.cancelReceivingButton).toBeVisible();
      await expect(orderDetailsPage.receivedProductsSection.saveReceivedProductsButton).toBeVisible();

      const initialSelectAllChecked = await orderDetailsPage.receivedProductsSection.isSelectAllCheckboxChecked();
      await expect(initialSelectAllChecked).toBe(false);

      await orderDetailsPage.receivedProductsSection.clickSelectAllCheckbox();
      const afterClickSelectAllChecked = await orderDetailsPage.receivedProductsSection.isSelectAllCheckboxChecked();
      await expect(afterClickSelectAllChecked).toBe(true);

      await orderDetailsPage.receivedProductsSection.clickSelectAllCheckbox();
      const afterUncheckSelectAllChecked = await orderDetailsPage.receivedProductsSection.isSelectAllCheckboxChecked();
      await expect(afterUncheckSelectAllChecked).toBe(false);
    });

    test('Verify individual product received checkbox', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(TEST_ORDER_ID);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      await expect(orderDetailsPage.receivedProductsSection.receiveButton).toBeVisible();
      await orderDetailsPage.receivedProductsSection.clickReceiveButton();

      const initialChecked = await orderDetailsPage.receivedProductsSection.isProductReceivedCheckboxChecked(PRODUCT_NAME_1);
      await expect(initialChecked).toBe(false);

      await orderDetailsPage.receivedProductsSection.setProductReceivedCheckbox(PRODUCT_NAME_1, true);
      const afterCheck = await orderDetailsPage.receivedProductsSection.isProductReceivedCheckboxChecked(PRODUCT_NAME_1);
      await expect(afterCheck).toBe(true);

      await orderDetailsPage.receivedProductsSection.setProductReceivedCheckbox(PRODUCT_NAME_1, false);
      const afterUncheck = await orderDetailsPage.receivedProductsSection.isProductReceivedCheckboxChecked(PRODUCT_NAME_1);
      await expect(afterUncheck).toBe(false);
    });

    test('Verify Cancel Receiving button', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(TEST_ORDER_ID);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      await expect(orderDetailsPage.receivedProductsSection.receiveButton).toBeVisible();
      await orderDetailsPage.receivedProductsSection.clickReceiveButton();

      await orderDetailsPage.receivedProductsSection.setProductReceivedCheckbox(PRODUCT_NAME_1, true);
      await expect(await orderDetailsPage.receivedProductsSection.isProductReceivedCheckboxChecked(PRODUCT_NAME_1)).toBe(true);

      await orderDetailsPage.receivedProductsSection.clickCancelReceivingButton();

      await expect(orderDetailsPage.receivedProductsSection.cancelReceivingButton).not.toBeVisible();
      await expect(orderDetailsPage.receivedProductsSection.saveReceivedProductsButton).not.toBeVisible();
      await expect(orderDetailsPage.receivedProductsSection.receiveButton).toBeVisible();
    });

    test('Verify "Save Received Products" button', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, orderDetailsPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickDetailsButton(TEST_ORDER_ID);
      await orderDetailsPage.receivedProductsSection.waitForOpened();

      await expect(orderDetailsPage.receivedProductsSection.receiveButton).toBeVisible();
      await orderDetailsPage.receivedProductsSection.clickReceiveButton();
      await orderDetailsPage.receivedProductsSection.waitForOpened();
      await orderDetailsPage.receivedProductsSection.setProductReceivedCheckbox(PRODUCT_NAME_1, true);
      await expect(await orderDetailsPage.receivedProductsSection.isProductReceivedCheckboxChecked(PRODUCT_NAME_1)).toBe(true);

      await orderDetailsPage.receivedProductsSection.clickSaveReceivedProductsButton();
      await orderDetailsPage.receivedProductsSection.waitForOpened();
      const updatedStatus = await orderDetailsPage.receivedProductsSection.getProductReceivedStatusText(PRODUCT_NAME_1);
      await expect(updatedStatus).toBe('Received');
    });
  });
  test.describe('Orders list', () => {
    test('Should display Orders List title', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      const title = await ordersPage.getOrdersListTitle();
      expect(title).toBe('Orders List');
    });

    test('Should navigate to Create Order page after clicking button', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      await ordersPage.clickCreateOrderButton();
    });

    test('Should filter orders by search input', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      const searchText = 'test1751146382399@gmail.com';

      await ordersPage.fillSearchInputField(searchText);
      await ordersPage.clickSearchButton();

      await ordersPage.allTableRows.first().waitFor({ state: 'visible' });
    });

    test('Should sort Order Number column to ASC when initially unsorted', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();
      const initialDirection = await ordersPage.getCurrentSortDirection(OrdersListColumnForSorting.OrderNumber);
      expect(initialDirection).toBe('none');
      await ordersPage.sortColumnBy(OrdersListColumnForSorting.OrderNumber, 'asc');
      const finalDirection = await ordersPage.getCurrentSortDirection(OrdersListColumnForSorting.OrderNumber);
      expect(finalDirection).toBe('asc');
    });

    test(
      'Should navigate to order details page after clicking details button',
      { tag: [TAGS.SMOKE] },
      async ({ homeUIService, ordersPage, page }) => {
        await homeUIService.openAsLoggedInUser();
        await homeUIService.openModule('Orders');
        await ordersPage.waitForOpened();

        const orderNumberToClick = '68605f8e1c508c5d5e6ac297';

        await ordersPage.clickDetailsButton(orderNumberToClick);
        await page.waitForURL(`**/orders/${orderNumberToClick}`);
      },
    );

    test('Should reopen order after clicking reopen button', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage, confirmationModal }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      const orderNumberToReopen = '68603a701c508c5d5e6a9e7a';

      await ordersPage.clickReopenButton(orderNumberToReopen);
      await confirmationModal.waitForOpened();
      await confirmationModal.clickConfirmButton();
    });

    test('Should change items per page to 25', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      await ordersPage.selectItemsPerPage('25');
      const rowCount = await ordersPage.getRowCount();
      expect(rowCount).toBeLessThanOrEqual(25);
    });

    test('Should navigate to next page', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      await ordersPage.clickNextPageButton();
      await ordersPage.tableBody.waitFor({ state: 'visible' });
    });

    test('Should navigate to previous page', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      await ordersPage.clickPageNumberButton(2);
      await ordersPage.tableBody.waitFor({ state: 'visible' });

      await ordersPage.clickPreviousPageButton();
      await ordersPage.tableBody.waitFor({ state: 'visible' });
    });

    test('Should navigate to a specific page number', { tag: [TAGS.SMOKE] }, async ({ homeUIService, ordersPage }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
      await ordersPage.waitForOpened();

      const targetPageNumber = 3;

      await ordersPage.clickPageNumberButton(targetPageNumber);
      await ordersPage.tableBody.waitFor({ state: 'visible' });

      await expect(ordersPage.getPageByNumber(targetPageNumber)).toHaveAttribute('aria-current', 'page');
    });
  });
  test.describe('Order Details Page - Top Panel and Received Products Section', () => {
    const TEST_ORDER_ID = '68618f851c508c5d5e6b9983';
    test(
      'should verify order details from top panel and add a received product',
      { tag: [TAGS.SMOKE] },
      async ({ homeUIService, orderDetailsPage, ordersPage }) => {
        await test.step('Navigate to an Order Details Page', async () => {
          await homeUIService.openAsLoggedInUser();
          await homeUIService.openModule('Orders');
          await ordersPage.waitForOpened();

          await ordersPage.clickDetailsButton(TEST_ORDER_ID);
          await orderDetailsPage.waitForOpened();

          const orderDetails = await orderDetailsPage.topPanel.getOrderDetails();
          console.log(`orderDetails: ${JSON.stringify(orderDetails)}`);

          await orderDetailsPage.receivedProductsSection.clickReceiveButton();
          await orderDetailsPage.receivedProductsSection.clickCancelReceivingButton();
        });
      },
    );
  });
});
