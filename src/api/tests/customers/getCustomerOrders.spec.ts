import { test, expect } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { TAGS } from 'data/testTags.data';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { orderListSchema } from 'data/schemas/customer.schema';
import { ObjectId } from 'bson';

test.describe('[API] [Customers] Get Customer Orders by ID', () => {
  let token = '';
  let customerId = '';
  let customerWithoutOrdersId = '';
  let orderIds: string[] = [];
  const totalOrders: number = 4;
  const totalProducts: number = 3;

  test.beforeEach(async ({ signInApiService, customerFactory, orderFactory }) => {
    token = await signInApiService.loginAsLocalUser();
    const customerWithoutOrders = await customerFactory.singleCustomer();
    customerWithoutOrdersId = customerWithoutOrders._id;
    // dataDisposalUtils.trackCustomer(customerWithoutOrdersId);

    const { customer, orders } = await orderFactory.createCustomerWithMultipleOrders({ totalOrders, totalProducts });
    //console.log(`customer id: ${customer._id}, orders: ${orders.map((o) => o._id).join(', ')}`);
    customerId = customer._id;
    orderIds = orders.map((order) => order._id);

    // [customerWithoutOrdersId, customerId].forEach((id) => dataDisposalUtils.trackCustomer(id));
    // orders.forEach((orderIds) => dataDisposalUtils.trackOrder(orderIds._id));

    // customerId = customer._id;

    //   const customerWithoutOrders = await customersApiService.createCustomer(token);
    //   customerWithoutOrdersId = customerWithoutOrders._id;

    //   const order1 = await ordersApiService.create(
    //     {
    //       customer: customerId,
    //       products: (await productsApiService.createMultiple(1, token)).map((p) => p._id),
    //     },
    //     token,
    //   );

    //   const order2 = await ordersApiService.create(
    //     {
    //       customer: customerId,
    //       products: (await productsApiService.createMultiple(1, token)).map((p) => p._id),
    //     },
    //     token,
    //   );

    //   orderIds = [order1._id, order2._id];
    // });

    // test.afterAll(async ({ customersApiService, ordersApiService }) => {
    //   for (const orderId of orderIds) {
    //     await ordersApiService.deleteOrder(orderId, token);
    //   }

    //   const customersToDelete = [customerId, customerWithoutOrdersId];
    //   for (const id of customersToDelete) {
    //     if (id) await customersApiService.deleteCustomer(id, token);
    //   }
  });

  test.describe('Positive', () => {
    test(
      'Should return customer orders with valid ID - 200 OK',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const response = await customersController.getCustomerOrdersById(customerId, token);
        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(orderListSchema, response.body.Orders);

        const orders = response.body.Orders;
        expect(orders).toHaveLength(totalOrders);
        orders.forEach((order) => expect.soft(order.customer, `Expected customer ID: ${customerId}, but got: ${order.customer}`).toBe(customerId));

        const actualOrderIds = orders.map((order) => order._id);
        // TODO: use arayContainig for another tests
        expect(actualOrderIds, `Actual order IDs ${actualOrderIds.join(', ')} should contain all expected order IDs ${orderIds.join(', ')}`).toEqual(
          expect.arrayContaining(orderIds),
        );
      },
    );

    test('Should return empty array for customer without orders - 200 OK', { tag: [TAGS.API, TAGS.CUSTOMERS] }, async ({ customersController }) => {
      const response = await customersController.getCustomerOrdersById(customerWithoutOrdersId, token);
      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(orderListSchema, response.body.Orders);
      expect(response.body.Orders).toHaveLength(0);
    });
  });

  test.describe('Negative', () => {
    test(
      'Should NOT return orders for non-existent customer - 404 Not Found',
      { tag: [TAGS.API, TAGS.CUSTOMERS] },
      async ({ customersController }) => {
        const nonExistentCustomerId = new ObjectId().toHexString();
        const response = await customersController.getCustomerOrdersById(nonExistentCustomerId, token);
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
