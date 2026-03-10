// import { OrdersController } from 'api/controllers/orders.controller';
import { generateDeliveryData } from 'data/orders/generateDeliveryData.data';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { TAGS } from 'data/testTags.data';
import { expect, test } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';

test.describe('[API] Orders Controller Health Checks', () => {
  let token: string;
  // let OrdersController: OrdersController;
  let createdOrderId: string = '';
  let createdCustomerId: string = '';
  let createdProductIds: string[] = [];
  const createdManagerId: string = '680d4d7dd006ba3d475ff67b';

  test.beforeEach(async ({ ordersApiService, signInApiService }) => {
    // OrdersController = new OrdersController(request);
    token = await signInApiService.loginAsLocalUser();

    const createOrderResponse = await ordersApiService.createDraftOrder(3, token);
    createdOrderId = createOrderResponse._id;
    createdCustomerId = createOrderResponse.customer._id;
    createdProductIds = createOrderResponse.products.map((p) => p._id);
  });

  test.afterEach(async ({ dataDisposalUtils }) => {
    await dataDisposalUtils.clearOrders(createdOrderId);
    await dataDisposalUtils.clearProducts(createdProductIds);
    await dataDisposalUtils.clearCustomers(createdCustomerId);
    createdOrderId = '';
    createdCustomerId = '';
    createdProductIds.length = 0;
  });

  test('Should get 200 OK from GET /filtered and sorted list of orders via API', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const response = await ordersController.getFilteredOrders(token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from GET /order by ID via API', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const response = await ordersController.getByID(createdOrderId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /order by ID via API', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const updatedData = {
      customer: createdCustomerId,
      products: createdProductIds,
      status: ORDER_STATUS.DRAFT,
    };
    console.log(`updatedData: ${JSON.stringify(updatedData)}`);
    console.log(`createdOrderId: ${createdOrderId}`);
    const response = await ordersController.updateOrder(createdOrderId, updatedData, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /assign manager to order', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const response = await ordersController.assignManager(createdOrderId, createdManagerId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /unassign manager from order', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const response = await ordersController.unassignManager(createdOrderId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from POST /order comment via API', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const commentText = 'Комментарий Health Check';
    const response = await ordersController.addComment(createdOrderId, commentText, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /order delivery via API', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const deliveryData = generateDeliveryData();
    const response = await ordersController.updateDelivery(createdOrderId, deliveryData, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /order receive via API', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const productsToReceive = [createdProductIds[0]];
    await ordersController.updateDelivery(createdOrderId, generateDeliveryData(), token);
    await ordersController.updateStatus(createdOrderId, ORDER_STATUS.IN_PROCESS, token);
    const response = await ordersController.receiveProducts(createdOrderId, productsToReceive, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /order status via API', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const newStatus = ORDER_STATUS.IN_PROCESS;
    await ordersController.updateDelivery(createdOrderId, generateDeliveryData(), token);
    const response = await ordersController.updateStatus(createdOrderId, newStatus, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 204 from DELETE /order comment via API', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const commentResponse = await ordersController.addComment(createdOrderId, 'New comment for health check', token);
    validateResponse(commentResponse, STATUS_CODES.OK, true, null);
    const tempCommentId = commentResponse.body.Order.comments[commentResponse.body.Order.comments.length - 1]._id;
    expect(tempCommentId).toBeDefined();

    const response = await ordersController.deleteComment(createdOrderId, tempCommentId, token);
    validateResponse(response, STATUS_CODES.DELETED);
  });

  test('Should get 204 from DELETE /order via API', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const response = await ordersController.delete(createdOrderId, token);

    createdOrderId = '';
    validateResponse(response, STATUS_CODES.DELETED);
  });

  test.skip('Should delete orders via API (clean if needed)', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ ordersController }) => {
    const id = ['68572d641c508c5d5e5d3221'];
    id.forEach(async (id) => {
      const response = await ordersController.delete(id, token);
      validateResponse(response, STATUS_CODES.DELETED);
    });
  });
  // test.describe('Check controller for POST /order', () => {
  //   test('Should get 201 CREATED from POST /order via API and create a new order', async ({
  //     customersApiService,
  //     productsApiService,
  //   }) => {
  //     const customerResponse = await customersApiService.createCustomer(token);
  //     createdCustomerId = customerResponse._id;

  //     const productsResponse = await productsApiService.createMultiple(1, token);
  //     createdProductIds = productsResponse.map((p) => p._id);

  //     const orderData = {
  //       customer: createdCustomerId,
  //       products: createdProductIds,
  //     };

  //     const createOrderResponse = await OrdersController.create(
  //       orderData,
  //       token,
  //     );
  //     validateResponse(createOrderResponse, STATUS_CODES.CREATED, true, null);

  //     createdOrderId = createOrderResponse.body.Order._id;
  //     console.log(createdOrderId);
  //   });
  // });
});
