import { test } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from '../../../utils/validations/schemaValidation';
import { getOrderByIDResponseSchema } from 'data/schemas/order.schema';
import { MOCK_ORDER_DRAFT } from '../../../data/orders/mockOrders.data';
import { ERROR_MESSAGES } from '../../../data/errorMessages';

test.describe('[API] [Orders] Get order by id', () => {
  let orderId = '';

  test.describe('Positive', () => {
    test('200 OK - Get order by id', { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] }, async ({ workerToken, ordersController, orderFactory }) => {
      const order = await orderFactory.orderDraftStatus();
      orderId = order._id;

      const response = await ordersController.getByID(orderId, workerToken);
      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(getOrderByIDResponseSchema, response.body.Order);
    });
  });

  test.describe('Negative', () => {
    test('404 Not Found - Get order by invalid id', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ workerToken, ordersController }) => {
      const id = MOCK_ORDER_DRAFT._id;

      const response = await ordersController.getByID(id, workerToken);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Order with id '${id}' wasn't found`);
    });

    test(
      '401 Unauthorized - Get order by id without token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, orderFactory }) => {
        const order = await orderFactory.orderDraftStatus();
        orderId = order._id;

        const response = await ordersController.getByID(orderId, '');
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );

    test(
      '401 Unauthorized - Get order by id with invalid token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, orderFactory }) => {
        const order = await orderFactory.orderDraftStatus();
        orderId = order._id;

        const response = await ordersController.getByID(orderId, 'Invalid token');
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );
  });
});
