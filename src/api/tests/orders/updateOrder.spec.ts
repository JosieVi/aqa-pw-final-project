import { test } from 'fixtures/ordersCustom.fixture';
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
  let token = '';
  let orderId = '';

  const createdOrderIds: string[] = [];
  const createdCustomerIds: string[] = [];
  const createdProductIds: string[] = [];

  test.beforeEach(async ({ signInApiService, customersApiService, productsApiService, ordersApiService }) => {
    token = await signInApiService.loginAsLocalUser();

    const customer = await customersApiService.createCustomer(token);
    const product = await productsApiService.create(token);

    createdCustomerIds.push(customer._id);
    createdProductIds.push(product._id);

    const orderRes = await ordersApiService.create(
      {
        customer: customer._id,
        products: [product._id],
      },
      token,
    );

    orderId = orderRes._id;
    createdOrderIds.push(orderId);
  });

  test.afterAll(async ({ dataDisposalUtils }) => {
    await dataDisposalUtils.clearOrders(createdOrderIds);
    await dataDisposalUtils.clearCustomers(createdCustomerIds);
    await dataDisposalUtils.clearProducts(createdProductIds);
  });

  test.describe('Positive', () => {
    test(
      '200 OK - Update order with new customer and 1 product',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ ordersController, customersApiService, productsApiService }) => {
        const newCustomer = await customersApiService.createCustomer(token);
        const newProduct = await productsApiService.create(token);

        createdCustomerIds.push(newCustomer._id);
        createdProductIds.push(newProduct._id);

        const updateData = {
          customer: newCustomer._id,
          products: [newProduct._id],
        };

        const response = await ordersController.updateOrder(orderId, updateData, token);
        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(getOrderByIDResponseSchema, response.body.Order);
      },
    );
  });

  test.describe('Negative', () => {
    test(
      '400 Bad Request - Update order with 6 products',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, productsApiService }) => {
        const allProducts = await productsApiService.populate(6, token);
        const productIds = extractIds(allProducts);

        createdProductIds.push(...productIds);

        const updateData = {
          customer: createdCustomerIds[0],
          products: productIds,
        };

        const response = await ordersController.updateOrder(orderId, updateData, token);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INCORRECT_REQUEST_BODY);
      },
    );

    test(
      '400 Bad Request - Update order with empty products array',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        const updateData = {
          customer: createdCustomerIds[0],
          products: [],
        };

        const response = await ordersController.updateOrder(orderId, updateData, token);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INCORRECT_REQUEST_BODY);
      },
    );

    test('404 Not Found - Update order with invalid order id', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const orderId = MOCK_ORDER_DRAFT._id;

      const updateData = {
        customer: createdCustomerIds[0],
        products: createdProductIds,
      };

      const response = await ordersController.updateOrder(orderId, updateData, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.ORDER_NOT_FOUND_WITH_ID(orderId));
    });

    test('404 Non Found - Update order with invalid product id', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const notExistProductId = generateUniqueId();

      const updateData = {
        customer: createdCustomerIds[0],
        products: [notExistProductId],
      };

      const response = await ordersController.updateOrder(orderId, updateData, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.PRODUCT_NOT_FOUND(notExistProductId));
    });

    test('404 Non Found - Update order with invalid customer id', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const notExistCustomerId = generateUniqueId();

      const updateData = {
        customer: notExistCustomerId,
        products: createdProductIds,
      };

      const response = await ordersController.updateOrder(orderId, updateData, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_NOT_FOUND(notExistCustomerId));
    });

    test('401 Unauthorized - Update order with invalid token', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const updateData = {
        customer: createdCustomerIds[0],
        products: createdProductIds,
      };

      const response = await ordersController.updateOrder(orderId, updateData, 'Invalid token');
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
    });

    test('400 Bad Request - Update order with empty token', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const updateData = {
        customer: createdCustomerIds[0],
        products: createdProductIds,
      };

      const response = await ordersController.updateOrder(orderId, updateData, '');
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
    });

    test(
      '400 Bad Request - Update order which status is Canceled',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        await ordersController.updateStatus(orderId, ORDER_STATUS.CANCELED, token);

        const updateData = {
          customer: createdCustomerIds[0],
          products: createdProductIds,
        };

        const response = await ordersController.updateOrder(orderId, updateData, token);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );

    test(
      '400 Bad Request - Update order which status is In Process',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        const data = generateDeliveryData();
        await ordersController.updateDelivery(orderId, data, token);
        await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, token);

        const updateData = {
          customer: createdCustomerIds[0],
          products: createdProductIds,
        };

        const response = await ordersController.updateOrder(orderId, updateData, token);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );

    test(
      '400 Bad Request - Update order which status is Received',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        const data = generateDeliveryData();
        await ordersController.updateDelivery(orderId, data, token);
        await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, token);
        await ordersController.receiveProducts(orderId, createdProductIds, token);

        const updateData = {
          customer: createdCustomerIds[0],
          products: createdProductIds,
        };

        const response = await ordersController.updateOrder(orderId, updateData, token);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );
  });
});
