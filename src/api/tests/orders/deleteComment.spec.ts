import { test, expect } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { TAGS } from 'data/testTags.data';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { generateCommentData } from 'data/orders/generateCommentData.data';
import { generateUniqueId } from 'utils/generateUniqueID.utils';

test.describe('[API] Delete order comment', () => {
  let token: string;
  let orderId: string;
  let commentId: string;
  const createdOrderIds: string[] = [];
  const createdProductIds: string[] = [];
  const createdCustomerIds: string[] = [];

  test.beforeAll(async ({ signInApiService, ordersApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    const order = await ordersApiService.createDraftOrder(1, token);
    orderId = order._id;
    createdOrderIds.push(orderId);
    createdCustomerIds.push(order.customer._id);
    order.products.forEach((product) => createdProductIds.push(product._id));

    await ordersApiService.addComment(orderId, generateCommentData(), token);
    const orderDetails = await ordersApiService.getOrderByID(orderId, token);
    commentId = orderDetails.comments[0]._id;
  });

  test.afterAll(async ({ dataDisposalUtils }) => {
    await dataDisposalUtils.clearOrders(createdOrderIds);
    await dataDisposalUtils.clearProducts(createdProductIds);
    await dataDisposalUtils.clearCustomers(createdCustomerIds);
  });

  test.describe('Positive cases', () => {
    test('Successful comment deletion', { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] }, async ({ ordersController }) => {
      const deleteResponse = await ordersController.deleteComment(orderId, commentId, token);

      expect(deleteResponse.status).toBe(STATUS_CODES.DELETED);
      expect.soft(deleteResponse.body).toBe('');

      const orderAfterDelete = await ordersController.getByID(orderId, token);
      const commentExists = orderAfterDelete.body.Order.comments.some((c: { _id: string }) => c._id === commentId);
      expect(commentExists).toBeFalsy();
    });
  });

  test.describe('Negative cases', () => {
    test('Delete non-existent comment', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const fakeCommentId = generateUniqueId();
      const response = await ordersController.deleteComment(orderId, fakeCommentId, token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.COMMENT_NOT_FOUND);
    });

    test('Delete comment from non-existent order', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const nonExistentOrderId = generateUniqueId();
      const response = await ordersController.deleteComment(nonExistentOrderId, commentId, token);

      validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.ORDER_NOT_FOUND_WITH_ID(nonExistentOrderId));
    });

    test('Delete comment with empty token', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const response = await ordersController.deleteComment(orderId, commentId, '');

      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
    });

    test('Delete comment with invalid token', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const response = await ordersController.deleteComment(orderId, commentId, 'Invalid Token');

      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
    });
  });
});
