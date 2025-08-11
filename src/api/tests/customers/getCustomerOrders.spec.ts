import { test, expect } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { TAGS } from 'data/testTags.data';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { orderListSchema } from 'data/schemas/customer.schema';
import { ObjectId } from 'bson';

test.describe('[API][Customers] Get Customer Orders by ID', () => {
  let token = '';
  let customerId = '';
  let customerWithoutOrdersId = '';
  let orderIds: string[] = [];

  test.beforeAll(async ({ signInApiService, customersApiService, ordersApiService, productsApiService }) => {
    token = await signInApiService.loginAsLocalUser();

    const customer = await customersApiService.createCustomer(token);
    customerId = customer._id;

    const customerWithoutOrders = await customersApiService.createCustomer(token);
    customerWithoutOrdersId = customerWithoutOrders._id;

    const order1 = await ordersApiService.create(
      {
        customer: customerId,
        products: (await productsApiService.populate(1, token)).map((p) => p._id),
      },
      token,
    );

    const order2 = await ordersApiService.create(
      {
        customer: customerId,
        products: (await productsApiService.populate(1, token)).map((p) => p._id),
      },
      token,
    );

    orderIds = [order1._id, order2._id];
  });

  test.afterAll(async ({ customersApiService, ordersApiService }) => {
    for (const orderId of orderIds) {
      await ordersApiService.deleteOrder(orderId, token);
    }

    const customersToDelete = [customerId, customerWithoutOrdersId];
    for (const id of customersToDelete) {
      if (id) await customersApiService.deleteCustomer(id, token);
    }
  });

  test.describe('Positive cases', () => {
    test(
      'Should return customer orders with valid ID - 200 OK',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const response = await customersController.getCustomerOrdersById(customerId, token);

        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(orderListSchema, response.body.Orders);

        const orders = response.body.Orders;
        expect(orders).toHaveLength(2);
        orders.forEach((order) => expect(order.customer).toBe(customerId));

        const returnedOrderIds = orders.map((order) => order._id);
        expect(returnedOrderIds).toEqual(expect.arrayContaining(orderIds));
      },
    );

    test('Should return empty array for customer without orders - 200 OK', { tag: [TAGS.API, TAGS.CUSTOMERS] }, async ({ customersController }) => {
      const response = await customersController.getCustomerOrdersById(customerWithoutOrdersId, token);

      validateResponse(response, STATUS_CODES.OK, true, null);
      expect(response.body.Orders).toHaveLength(0);
    });
  });

  test.describe('Negative cases', () => {
    test('Should return 404 for non-existent customer', { tag: [TAGS.API, TAGS.CUSTOMERS] }, async ({ customersController }) => {
      const nonExistentCustomerId = new ObjectId().toHexString();
      const response = await customersController.getCustomerOrdersById(nonExistentCustomerId, token);

      validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_ID_FOR_ORDERS_NOT_FOUND(nonExistentCustomerId));
    });

    test('Should return 401 when using empty token', { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] }, async ({ customersController }) => {
      const response = await customersController.getCustomerOrdersById(customerId, '');

      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Not authorized');
    });

    test('Should return 401 when using invalid token', { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] }, async ({ customersController }) => {
      const response = await customersController.getCustomerOrdersById(customerId, 'Invalid access token');

      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Invalid access token');
    });
  });
});
