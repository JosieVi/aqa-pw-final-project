import { TAGS } from 'data/testTags.data';
import { expect, test } from 'fixtures/index.fixture';

test.describe('[UI] [Orders] [Order Details] [Edit Products] Replace/add/delete product', () => {
  let productNames: string[] = [];
  let orderId: string;

  test.beforeEach(async ({ orderFactory, orderDetailsPage }) => {
    productNames = [];
    const PRODUCTS_TO_CREATE_COUNT = 3;
    const result = await orderFactory.orderDraftStatus(PRODUCTS_TO_CREATE_COUNT);
    orderId = result._id;

    result.products.forEach((product) => productNames.push(product.name));
    // productNames.forEach((name) => console.log('name of product', name));

    // await homeUIService.openAsLoggedInUser();
    // await homeUIService.openModule('Orders');

    // await ordersPage.clickDetailsButton(orderId);
    // await orderDetailsPage.waitForOpened();

    await orderDetailsPage.openById(orderId);
    await orderDetailsPage.waitForOpened();

    await orderDetailsPage.receivedProductsSection.clickEditProductsPencilButton();
    await orderDetailsPage.editProductsInOrderModal.waitForOpened();
  });

  test('Should replace the first product with the second', { tag: [TAGS.ORDERS] }, async ({ orderDetailsPage }) => {
    const firstProductName = productNames[0];
    const secondProductName = productNames[1];

    await orderDetailsPage.editProductsInOrderModal.selectProductAtPosition(secondProductName, 1);

    // Use clickSaveAndWaitForResponse to ensure the backend has processed the update
    // before asserting the DOM state — prevents race condition between API response and re-render
    await orderDetailsPage.editProductsInOrderModal.clickSaveAndWaitForResponse();
    await orderDetailsPage.waitForSpinner();

    const updatedProductNames = await orderDetailsPage.receivedProductsSection.getAllProductNames();
    expect(updatedProductNames).toContain(secondProductName);
    expect(updatedProductNames).not.toContain(firstProductName);
  });

  test('Should add the same product as the second one', { tag: [TAGS.ORDERS] }, async ({ orderDetailsPage }) => {
    const firstProductName = productNames[0];

    await orderDetailsPage.editProductsInOrderModal.clickAddProduct();

    const totalProducts = await orderDetailsPage.editProductsInOrderModal.productsList.count();

    await orderDetailsPage.editProductsInOrderModal.selectProductAtPosition(firstProductName, totalProducts);

    // Use clickSaveAndWaitForResponse to ensure the backend has processed the update
    // before asserting the DOM state — prevents race condition between API response and re-render
    await orderDetailsPage.editProductsInOrderModal.clickSaveAndWaitForResponse();
    await orderDetailsPage.waitForSpinner();

    const updatedProductNames = await orderDetailsPage.receivedProductsSection.getAllProductNames();
    expect(updatedProductNames.filter((name) => name === firstProductName).length).toEqual(2);
  });

  test('Should delete the first product from the order', { tag: [TAGS.ORDERS] }, async ({ orderDetailsPage }) => {
    const firstProductName = productNames[0];

    const initialCount = await orderDetailsPage.editProductsInOrderModal.productsList.count();
    await orderDetailsPage.editProductsInOrderModal.removeProduct(0);

    // Use clickSaveAndWaitForResponse to ensure the backend has processed the update
    // before asserting the DOM state — prevents race condition between API response and re-render
    await orderDetailsPage.editProductsInOrderModal.clickSaveAndWaitForResponse();
    await orderDetailsPage.waitForSpinner();

    const updatedProductNames = await orderDetailsPage.receivedProductsSection.getAllProductNames();
    expect(updatedProductNames.length).toBe(initialCount - 1);
    expect(updatedProductNames).not.toContain(firstProductName);
  });
});
