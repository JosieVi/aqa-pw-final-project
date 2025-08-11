import { TAGS } from 'data/testTags.data';
import { expect, test } from 'fixtures/ordersCustom.fixture';

test.describe('[UI] [Orders] [Orders Details] [Edit Products] Replace/add/delete product', () => {
  let productNames: string[] = [];
  let orderId: string;

  test.beforeEach(async ({ homeUIService, orderDraftStatus, ordersPage, orderDetailsPage, productsApiService, signInApiService }) => {
    const PRODUCTS_TO_CREATE_COUNT = 3;
    const result = await orderDraftStatus(PRODUCTS_TO_CREATE_COUNT);
    orderId = result.id;

    const token = await signInApiService.loginAsLocalUser();

    const products = await Promise.all(result.productsIds.map((productId) => productsApiService.getById(token, productId)));

    productNames = products.map((p) => p.name);

    await homeUIService.openAsLoggedInUser();
    await homeUIService.openModule('Orders');

    await ordersPage.clickDetailsButton(orderId);
    await orderDetailsPage.waitForOpened();

    await orderDetailsPage.receivedProductsSection.clickEditProductsPencilButton();
    await orderDetailsPage.waitForOpened();
  });

  test('Replace the first product with the second', { tag: [TAGS.ORDERS] }, async ({ orderDetailsPage }) => {
    const firstProductName = productNames[0];
    const secondProductName = productNames[1];

    await orderDetailsPage.editProductsInOrderModal.selectProductAtPosition(secondProductName, 1);

    await orderDetailsPage.editProductsInOrderModal.clickSave();
    await orderDetailsPage.waitForSpinner();

    const updatedProductNames = await orderDetailsPage.receivedProductsSection.getAllProductNames();
    expect(updatedProductNames).toContain(secondProductName);
    expect(updatedProductNames).not.toContain(firstProductName);
  });

  test('Add the same product as the second one', { tag: [TAGS.ORDERS] }, async ({ orderDetailsPage }) => {
    const firstProductName = productNames[0];

    await orderDetailsPage.editProductsInOrderModal.clickAddProduct();

    const productCount = await orderDetailsPage.editProductsInOrderModal.productsList.count();
    await orderDetailsPage.editProductsInOrderModal.selectProductAtPosition(firstProductName, productCount);

    await orderDetailsPage.editProductsInOrderModal.clickSave();
    await orderDetailsPage.waitForSpinner();

    const updatedProductNames = await orderDetailsPage.receivedProductsSection.getAllProductNames();
    expect(updatedProductNames.filter((name) => name === firstProductName).length).toEqual(2);
  });

  test('Delete the first product from the order', { tag: [TAGS.ORDERS] }, async ({ orderDetailsPage }) => {
    const firstProductName = productNames[0];

    const initialCount = await orderDetailsPage.editProductsInOrderModal.productsList.count();
    await orderDetailsPage.editProductsInOrderModal.removeProduct(0);

    await orderDetailsPage.editProductsInOrderModal.clickSave();
    await orderDetailsPage.waitForSpinner();

    const updatedProductNames = await orderDetailsPage.receivedProductsSection.getAllProductNames();
    expect(updatedProductNames.length).toBe(initialCount - 1);
    expect(updatedProductNames).not.toContain(firstProductName);
  });
});
