import { test } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { getOrderByIDResponseSchema } from 'data/schemas/order.schema';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { extractIds } from 'utils/helper';
import { MOCK_ORDER_DRAFT } from 'data/orders/mockOrders.data';
import { generateUniqueId } from 'utils/generateUniqueID.utils';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { generateDeliveryData } from 'data/orders/generateDeliveryData.data';

test.describe('[API] [Orders] Update order by ID', () => {
  let orderId: string = '';
  let customerId: string = '';
  let productIds: string[] = [];

  test.beforeEach(async ({ orderFactory }) => {
    const order = await orderFactory.orderDraftStatus(5);
    orderId = order._id;
    customerId = order.customer._id;
    productIds = order.products.map((product) => product._id);
  });

  test.describe('Positive', () => {
    test(
      '200 OK - Update order with new customer and 1 product',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ workerToken, ordersController, customersApiService, productsApiService }) => {
        const newCustomer = await customersApiService.createCustomer(workerToken);
        const newProduct = await productsApiService.create(workerToken);

        const updateData = {
          customer: newCustomer._id,
          products: [newProduct._id],
        };

        const response = await ordersController.updateOrder(orderId, updateData, workerToken);
        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(getOrderByIDResponseSchema, response.body.Order);
      },
    );
  });

  test.describe('Negative', () => {
    test(
      '400 Bad Request - Update order with 6 products',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController, productsApiService }) => {
        const allProducts = await productsApiService.createMultiple(6, workerToken);
        const productIds = extractIds(allProducts);

        const updateData = {
          customer: customerId,
          products: productIds,
        };

        const response = await ordersController.updateOrder(orderId, updateData, workerToken);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INCORRECT_REQUEST_BODY);
      },
    );

    test(
      '400 Bad Request - Update order with empty products array',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController }) => {
        const updateData = {
          customer: customerId,
          products: [],
        };

        const response = await ordersController.updateOrder(orderId, updateData, workerToken);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INCORRECT_REQUEST_BODY);
      },
    );

    test(
      '404 Not Found - Update order with invalid order id',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController }) => {
        const orderId = MOCK_ORDER_DRAFT._id;

        const updateData = {
          customer: customerId,
          products: productIds,
        };

        const response = await ordersController.updateOrder(orderId, updateData, workerToken);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.ORDER_NOT_FOUND_WITH_ID(orderId));
      },
    );

    test(
      '404 Non Found - Update order with invalid product id',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController }) => {
        const notExistProductId = generateUniqueId();

        const updateData = {
          customer: customerId,
          products: [notExistProductId],
        };

        const response = await ordersController.updateOrder(orderId, updateData, workerToken);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.PRODUCT_NOT_FOUND(notExistProductId));
      },
    );

    test(
      '404 Non Found - Update order with invalid customer id',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController }) => {
        const notExistCustomerId = generateUniqueId();

        const updateData = {
          customer: notExistCustomerId,
          products: productIds,
        };

        const response = await ordersController.updateOrder(orderId, updateData, workerToken);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_NOT_FOUND(notExistCustomerId));
      },
    );

    test('401 Unauthorized - Update order with invalid token', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const updateData = {
        customer: customerId,

        products: productIds,
      };

      const response = await ordersController.updateOrder(orderId, updateData, 'Invalid token');
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
    });

    test('400 Bad Request - Update order with empty token', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const updateData = {
        customer: customerId,
        products: productIds,
      };

      const response = await ordersController.updateOrder(orderId, updateData, '');
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
    });

    test(
      '400 Bad Request - Update order which status is Canceled',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController }) => {
        await ordersController.updateStatus(orderId, ORDER_STATUS.CANCELED, workerToken);

        const updateData = {
          customer: customerId,
          products: productIds,
        };

        const response = await ordersController.updateOrder(orderId, updateData, workerToken);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );

    test(
      '400 Bad Request - Update order which status is In Process',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController }) => {
        const data = generateDeliveryData();
        await ordersController.updateDelivery(orderId, data, workerToken);
        await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, workerToken);

        const updateData = {
          customer: customerId,
          products: productIds,
        };

        const response = await ordersController.updateOrder(orderId, updateData, workerToken);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );

    test(
      '400 Bad Request - Update order which status is Received',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController }) => {
        const data = generateDeliveryData();
        await ordersController.updateDelivery(orderId, data, workerToken);
        await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, workerToken);
        await ordersController.receiveProducts(orderId, productIds, workerToken);

        const updateData = {
          customer: customerId,
          products: productIds,
        };

        const response = await ordersController.updateOrder(orderId, updateData, workerToken);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );
  });
});
