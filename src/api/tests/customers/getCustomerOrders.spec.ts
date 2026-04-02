import { test, expect } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { TAGS } from 'data/testTags.data';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { orderListSchema } from 'data/schemas/customer.schema';
import { ObjectId } from 'bson';

test.describe('[API] [Customers] Get Customer Orders by ID', () => {
  let customerId = '';
  let customerWithoutOrdersId = '';
  let orderIds: string[] = [];
  const totalOrders: number = 2;
  const totalProducts: number = 2;

  test.beforeEach(async ({ customerFactory, orderFactory }) => {
    const customerWithoutOrders = await customerFactory.singleCustomer();
    customerWithoutOrdersId = customerWithoutOrders._id;

    const { customer, orders } = await orderFactory.customerWithMultipleOrders({ totalOrders, totalProducts });

    customerId = customer._id;
    orderIds = orders.map((order) => order._id);
  });

  test.describe('Positive', () => {
    test(
      'Should return customer orders with valid ID - 200 OK',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ workerToken, customersController }) => {
        const response = await customersController.getCustomerOrdersById(customerId, workerToken);
        validateResponse(response, STATUS_CODES.OK, true, null);

        validateSchema(orderListSchema, response.body.Orders);

        const orders = response.body.Orders;
        expect(orders).toHaveLength(totalOrders);
        orders.forEach((order) => expect.soft(order.customer, `Expected customer ID: ${customerId}, but got: ${order.customer}`).toBe(customerId));

        const actualOrderIds = orders.map((order) => order._id);
        // TODO: use arayContainig for another tests where the order doesn't matter
        expect(actualOrderIds, `Actual order IDs ${actualOrderIds.join(', ')} should contain all expected order IDs ${orderIds.join(', ')}`).toEqual(
          expect.arrayContaining(orderIds),
        );
      },
    );

    test(
      'Should return empty array for customer without orders - 200 OK',
      { tag: [TAGS.API, TAGS.CUSTOMERS] },
      async ({ workerToken, customersController }) => {
        const response = await customersController.getCustomerOrdersById(customerWithoutOrdersId, workerToken);
        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(orderListSchema, response.body.Orders);
        expect(response.body.Orders).toHaveLength(0);
      },
    );
  });

  test.describe('Negative', () => {
    test(
      'Should NOT return orders for non-existent customer - 404 Not Found',
      { tag: [TAGS.API, TAGS.CUSTOMERS] },
      async ({ workerToken, customersController }) => {
        const nonExistentCustomerId = new ObjectId().toHexString();
        const response = await customersController.getCustomerOrdersById(nonExistentCustomerId, workerToken);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_ID_FOR_ORDERS_NOT_FOUND(nonExistentCustomerId));
      },
    );

    test(
      'Should NOT return orders when using empty token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const response = await customersController.getCustomerOrdersById(customerId, '');
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );

    test(
      'Should NOT return orders when using invalid token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const response = await customersController.getCustomerOrdersById(customerId, 'Invalid access token');
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );
  });
});
