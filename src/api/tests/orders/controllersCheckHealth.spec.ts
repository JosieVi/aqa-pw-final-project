import { OrdersAPIController } from 'api/controllers/orders.controller';
import { generateDeliveryData } from 'data/orders/generateDeliveryData.data';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { TAGS } from 'data/testTags.data';
import { expect, test } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';

test.describe('[API] Orders Controller Health Checks', () => {
  let token: string;
  let ordersAPIController: OrdersAPIController;
  let createdOrderId: string = '';
  let createdCustomerId: string = '';
  let createdProductIds: string[] = [];
  const createdManagerId: string = '680d4d7dd006ba3d475ff67b';

  test.beforeEach(async ({ ordersApiService, signInApiService, request }) => {
    ordersAPIController = new OrdersAPIController(request);
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

  test('Should get 200 OK from GET /filtered and sorted list of orders via API', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const response = await ordersAPIController.getFilteredOrders(token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from GET /order by ID via API', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const response = await ordersAPIController.getByID(createdOrderId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /order by ID via API', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const updatedData = {
      customer: createdCustomerId,
      products: createdProductIds,
      status: ORDER_STATUS.DRAFT,
    };
    console.log(`updatedData: ${JSON.stringify(updatedData)}`);
    console.log(`createdOrderId: ${createdOrderId}`);
    const response = await ordersAPIController.updateOrder(createdOrderId, updatedData, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /assign manager to order', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const response = await ordersAPIController.assignManager(createdOrderId, createdManagerId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /unassign manager from order', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const response = await ordersAPIController.unassignManager(createdOrderId, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from POST /order comment via API', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const commentText = 'Комментарий Health Check';
    const response = await ordersAPIController.addComment(createdOrderId, commentText, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /order delivery via API', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const deliveryData = generateDeliveryData();
    const response = await ordersAPIController.updateDelivery(createdOrderId, deliveryData, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /order receive via API', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const productsToReceive = [createdProductIds[0]];
    await ordersAPIController.updateDelivery(createdOrderId, generateDeliveryData(), token);
    await ordersAPIController.updateStatus(createdOrderId, ORDER_STATUS.IN_PROCESS, token);
    const response = await ordersAPIController.receiveProducts(createdOrderId, productsToReceive, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 200 OK from PUT /order status via API', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const newStatus = ORDER_STATUS.IN_PROCESS;
    await ordersAPIController.updateDelivery(createdOrderId, generateDeliveryData(), token);
    const response = await ordersAPIController.updateStatus(createdOrderId, newStatus, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
  });

  test('Should get 204 from DELETE /order comment via API', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const commentResponse = await ordersAPIController.addComment(createdOrderId, 'New comment for health check', token);
    validateResponse(commentResponse, STATUS_CODES.OK, true, null);
    const tempCommentId = commentResponse.body.Order.comments[commentResponse.body.Order.comments.length - 1]._id;
    expect(tempCommentId).toBeDefined();

    const response = await ordersAPIController.deleteComment(createdOrderId, tempCommentId, token);
    validateResponse(response, STATUS_CODES.DELETED, null, null);
  });

  test('Should get 204 from DELETE /order via API', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const response = await ordersAPIController.delete(createdOrderId, token);

    createdOrderId = '';
    validateResponse(response, STATUS_CODES.DELETED, null, null);
  });

  test.skip('Should delete orders via API (clean if needed)', { tag: [TAGS.API, TAGS.ORDERS] }, async () => {
    const id = ['68572d641c508c5d5e5d3221'];
    id.forEach(async (id) => {
      const response = await ordersAPIController.delete(id, token);
      validateResponse(response, STATUS_CODES.DELETED, null, null);
    });
  });
  // test.describe('Check controller for POST /order', () => {
  //   test('Should get 201 CREATED from POST /order via API and create a new order', async ({
  //     customersApiService,
  //     productsApiService,
  //   }) => {
  //     const customerResponse = await customersApiService.createCustomer(token);
  //     createdCustomerId = customerResponse._id;

  //     const productsResponse = await productsApiService.populate(1, token);
  //     createdProductIds = productsResponse.map((p) => p._id);

  //     const orderData = {
  //       customer: createdCustomerId,
  //       products: createdProductIds,
  //     };

  //     const createOrderResponse = await ordersAPIController.create(
  //       orderData,
  //       token,
  //     );
  //     validateResponse(createOrderResponse, STATUS_CODES.CREATED, true, null);

  //     createdOrderId = createOrderResponse.body.Order._id;
  //     console.log(createdOrderId);
  //   });
  // });
});
