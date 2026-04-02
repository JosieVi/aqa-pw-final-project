import { expect, test } from 'fixtures/index.fixture';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import {
  negativeTestCasesForAddComment,
  negativeTestCasesForAddCommentWithoutToken,
  positiveTestCasesForAddComment,
} from 'data/orders/addCommentCases.data';
import { generateCommentData } from 'data/orders/generateCommentData.data';
import { STATUS_CODES } from 'data/statusCodes';
import { addCommentResponseSchema } from 'data/schemas/order.schema';
import { generateUniqueId } from 'utils/generateUniqueID.utils';

test.describe('[API] [Orders] Add a comment', () => {
  test.describe('Positive', () => {
    positiveTestCasesForAddComment.forEach(({ name, comment, expectedStatusCode, isSuccess, errorMessage }) => {
      test(
        `Should add comment: ${name}`,
        { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ ordersController, workerToken, orderFactory }) => {
          const draftOrder = await orderFactory.orderDraftStatus(1);

          const response = await ordersController.addComment(draftOrder._id, comment, workerToken);

          validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
          await expect(response.body.Order).toMatchSchema(addCommentResponseSchema);

          const currentComment = response.body.Order.comments[0].text;
          expect.soft(comment).toEqual(currentComment);
        },
      );
    });

    test(
      'Should add second comment',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ ordersController, workerToken, orderFactory }) => {
        const draftOrder = await orderFactory.orderDraftStatus(1);

        const comment1 = generateCommentData();
        const response1 = await ordersController.addComment(draftOrder._id, comment1, workerToken);
        validateResponse(response1, STATUS_CODES.OK, true, null);

        const comment2 = generateCommentData();
        const response2 = await ordersController.addComment(draftOrder._id, comment2, workerToken);
        validateResponse(response2, STATUS_CODES.OK, true, null);
        await expect(response2.body.Order).toMatchSchema(addCommentResponseSchema);
        const currentComment2 = response2.body.Order.comments[1].text;
        expect.soft(comment2).toEqual(currentComment2);
      },
    );
  });

  test.describe('Negative', () => {
    negativeTestCasesForAddComment.forEach(({ name, comment, expectedStatusCode, isSuccess, errorMessage }) => {
      test(
        `Should NOT add comment: ${name} - ${expectedStatusCode}`,
        { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
        async ({ ordersController, workerToken, orderFactory }) => {
          const draftOrder = await orderFactory.orderDraftStatus(1);

          const response = await ordersController.addComment(draftOrder._id, comment, workerToken);

          validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
        },
      );
    });

    negativeTestCasesForAddCommentWithoutToken.forEach(({ name, comment, invalidToken, expectedStatusCode, isSuccess, errorMessage }) => {
      test(`Should NOT add comment: ${name}`, { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController, orderFactory }) => {
        const draftOrder = await orderFactory.orderDraftStatus(1);

        const response = await ordersController.addComment(draftOrder._id, comment, invalidToken);

        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
      });
    });

    test(
      'Should NOT add comment for non-existent order - 404 NOT FOUND',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController }) => {
        const id = generateUniqueId();
        const comment = generateCommentData();

        const response = await ordersController.addComment(id, comment, workerToken);

        validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Order with id '${id}' wasn't found`);
      },
    );
  });
});
