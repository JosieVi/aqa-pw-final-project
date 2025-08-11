import { test } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { getOrderByIDResponseSchema } from 'data/schemas/order.schema';
import { extractIds } from 'utils/helper';
import { ERROR_MESSAGES } from 'data/errorMessages';

test.describe('[API] [Orders] Create a new order', () => {
  let token = '';
  const createdOrderIds: string[] = [];
  const createdProductIds: string[] = [];
  const createdCustomerIds: string[] = [];
  let productsId: string[] = [];

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.afterAll(async ({ dataDisposalUtils }) => {
    await dataDisposalUtils.clearOrders(createdOrderIds);
    await dataDisposalUtils.clearCustomers(createdCustomerIds);
    await dataDisposalUtils.clearProducts(createdProductIds);
  });

  test.describe('Positive', () => {
    test(
      '201 Created - Create order with one product',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ ordersController, customersApiService, productsApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const product = await productsApiService.create(token);

        createdCustomerIds.push(customer._id);
        createdProductIds.push(product._id);

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, token);
        validateResponse(response, STATUS_CODES.CREATED, true, null);
        validateSchema(getOrderByIDResponseSchema, response.body.Order);
        createdOrderIds.push(response.body.Order._id);
      },
    );

    test(
      '201 Created - Create order with five products',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ ordersController, productsApiService, customersApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const products = await productsApiService.populate(5, token);

        productsId = extractIds(products);
        createdCustomerIds.push(customer._id);
        createdProductIds.push(...productsId);

        const data = {
          customer: customer._id,
          products: productsId,
        };

        const response = await ordersController.create(data, token);
        validateResponse(response, STATUS_CODES.CREATED, true, null);
        validateSchema(getOrderByIDResponseSchema, response.body.Order);
        createdOrderIds.push(response.body.Order._id);
      },
    );
  });

  test.describe('Negative', () => {
    test(
      '400 Bad Request - Create order with 6 products',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, productsApiService, customersApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const products = await productsApiService.populate(6, token);

        productsId = extractIds(products);
        createdCustomerIds.push(customer._id);
        createdProductIds.push(...productsId);

        const data = {
          customer: customer._id,
          products: productsId,
        };

        const response = await ordersController.create(data, token);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INCORRECT_REQUEST_BODY);
      },
    );

    test(
      '400 Bad Request - Create order without products',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, customersApiService }) => {
        const customer = await customersApiService.createCustomer(token);

        productsId = [];
        createdCustomerIds.push(customer._id);

        const data = {
          customer: customer._id,
          products: productsId,
        };

        const response = await ordersController.create(data, token);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INCORRECT_REQUEST_BODY);
      },
    );

    test(
      '401 Unauthorized - Create order without token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, customersApiService, productsApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const product = await productsApiService.create(token);

        createdCustomerIds.push(customer._id);
        createdProductIds.push(product._id);

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, '');
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );

    test(
      '401 Unauthorized - Create order with invalid token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, customersApiService, productsApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const product = await productsApiService.create(token);

        createdCustomerIds.push(customer._id);
        createdProductIds.push(product._id);

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, 'Invalid token');
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );

    test(
      '404 Not Found - Create order with not exist customer',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, customersApiService, productsApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const product = await productsApiService.create(token);

        await customersApiService.deleteCustomer(customer._id, token);

        createdProductIds.push(product._id);

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, token);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_NOT_FOUND(customer._id));
      },
    );

    test(
      '404 Not Found - Create order without customer',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, productsApiService }) => {
        const product = await productsApiService.create(token);

        createdProductIds.push(product._id);

        const data = {
          customer: '',
          products: [product._id],
        };

        const response = await ordersController.create(data, token);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.MISSING_CUSTOMER);
      },
    );

    test(
      '404 Not Found - Create order with not exist product',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, customersApiService, productsApiService }) => {
        const customer = await customersApiService.createCustomer(token);
        const product = await productsApiService.create(token);

        await productsApiService.delete(product._id, token);

        createdCustomerIds.push(customer._id);

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, token);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.PRODUCT_NOT_FOUND(product._id));
      },
    );
  });
});
