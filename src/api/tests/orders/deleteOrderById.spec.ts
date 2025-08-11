import { test } from 'fixtures/ordersCustom.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { generateUniqueId } from 'utils/generateUniqueID.utils';

test.describe('[API] [Orders] Delete order by id', () => {
  let token: string;

  test.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.describe('Positive', () => {
    test(
      '204 No Content - Delete order by id',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ ordersController, orderDraftStatusWithPartialTeardown }) => {
        const { id } = await orderDraftStatusWithPartialTeardown(); // Чтобы не было удаления order в фикстуре
        const response = await ordersController.delete(id, token);

        validateResponse(response, STATUS_CODES.DELETED, null, null);
      },
    );
  });

  test.describe('Negative', () => {
    test(
      '401 Unauthorized - Delete order with invalid token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, orderDraftStatus }) => {
        const { id } = await orderDraftStatus();

        const token = 'Invalid token';
        const response = await ordersController.delete(id, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );

    test('401 Unauthorized - Delete order with empty token', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const id = generateUniqueId();
      const token = '';

      const response = await ordersController.delete(id, token);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
    });

    test('404 Not Found - Delete not exist order', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const fakeOrderId = generateUniqueId();

      const response = await ordersController.delete(fakeOrderId, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.ORDER_NOT_FOUND_WITH_ID(fakeOrderId));
    });
  });
});
