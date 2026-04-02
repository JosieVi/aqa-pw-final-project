import { test, expect } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { TAGS } from 'data/testTags.data';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { generateCommentData } from 'data/orders/generateCommentData.data';
import { generateUniqueId } from 'utils/generateUniqueID.utils';

test.describe('[API] [Orders] Delete order comment', () => {
  let orderId: string;
  let commentId: string;
  let orderDetails: any;

  test.beforeEach(async ({ workerToken, ordersApiService, orderFactory }) => {
    const order = await orderFactory.orderDraftStatus();
    orderId = order._id;

    await ordersApiService.addComment(orderId, generateCommentData(), workerToken);
    orderDetails = await ordersApiService.getOrderByID(orderId, workerToken);
    commentId = orderDetails.comments[0]._id;
  });

  test.describe('Positive cases', () => {
    test(
      'Schould delete comment successfully - 204 Deleted',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ workerToken, ordersController }) => {
        const deleteResponse = await ordersController.deleteComment(orderId, commentId, workerToken);

        expect(deleteResponse.status, `Status code should be 204 after successful comment deletion, but it is ${deleteResponse.status}`).toBe(
          STATUS_CODES.DELETED,
        );
        expect.soft(deleteResponse.body).toBe('');

        const orderAfterDelete = await ordersController.getByID(orderId, workerToken);
        const commentExists = orderAfterDelete.body.Order.comments.some((c: { _id: string }) => c._id === commentId);
        expect(commentExists).toBeFalsy();
      },
    );
  });

  test.describe('Negative cases', () => {
    test(
      'Should NOT delete non-existent comment - 404 NOT FOUND',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController }) => {
        const fakeCommentId = generateUniqueId();
        const response = await ordersController.deleteComment(orderId, fakeCommentId, workerToken);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.COMMENT_NOT_FOUND);
      },
    );

    test(
      'Should NOT delete comment from non-existent order - 404 NOT FOUND',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController }) => {
        const nonExistentOrderId = generateUniqueId();
        const response = await ordersController.deleteComment(nonExistentOrderId, commentId, workerToken);

        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.ORDER_NOT_FOUND_WITH_ID(nonExistentOrderId));
      },
    );

    test(
      'Should NOT delete comment with empty token - 401 UNAUTHORIZED',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        const response = await ordersController.deleteComment(orderId, commentId, '');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );

    test(
      'Should NOT delete comment with invalid token - 401 UNAUTHORIZED',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        const response = await ordersController.deleteComment(orderId, commentId, 'Invalid Token');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );
  });
});
