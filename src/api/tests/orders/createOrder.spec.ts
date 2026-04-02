import { test } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { getOrderByIDResponseSchema } from 'data/schemas/order.schema';
import { extractIds } from 'utils/helper';
import { ERROR_MESSAGES } from 'data/errorMessages';

test.describe('[API] [Orders] Create a new order', () => {
  const createdOrderIds: string[] = [];
  let productsId: string[] = [];

  test.afterEach(async ({ dataDisposalUtils }) => {
    await dataDisposalUtils.clearOrders(createdOrderIds);
    createdOrderIds.length = 0;
  });

  test.describe('Positive', () => {
    test(
      'Should create order with one product - 201 Created',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ workerToken, ordersController, customerFactory, productFactory }) => {
        const customer = await customerFactory.singleCustomer();
        const product = await productFactory.singleProduct();

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, workerToken);
        validateResponse(response, STATUS_CODES.CREATED, true, null);
        validateSchema(getOrderByIDResponseSchema, response.body.Order);
        createdOrderIds.push(response.body.Order._id);
      },
    );

    test(
      'Should create order with five products - 201 Created',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ workerToken, ordersController, productFactory, customerFactory }) => {
        const customer = await customerFactory.singleCustomer();
        const products = await productFactory.multipleProducts(5);

        productsId = extractIds(products);

        const data = {
          customer: customer._id,
          products: productsId,
        };

        const response = await ordersController.create(data, workerToken);
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
      async ({ workerToken, ordersController, productFactory, customerFactory }) => {
        const customer = await customerFactory.singleCustomer();
        const products = await productFactory.multipleProducts(6);

        productsId = extractIds(products);

        const data = {
          customer: customer._id,
          products: productsId,
        };

        const response = await ordersController.create(data, workerToken);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INCORRECT_REQUEST_BODY);
      },
    );

    test(
      '400 Bad Request - Create order without products',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController, customerFactory }) => {
        const customer = await customerFactory.singleCustomer();

        productsId = [];

        const data = {
          customer: customer._id,
          products: productsId,
        };

        const response = await ordersController.create(data, workerToken);
        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INCORRECT_REQUEST_BODY);
      },
    );

    test(
      '401 Unauthorized - Create order without token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController, customerFactory, productFactory }) => {
        const customer = await customerFactory.singleCustomer();
        const product = await productFactory.singleProduct();

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
      async ({ ordersController, customerFactory, productFactory }) => {
        const customer = await customerFactory.singleCustomer();
        const product = await productFactory.singleProduct();

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
      async ({ workerToken, ordersController, customersApiService, customerFactory, productFactory, dataDisposalUtils }) => {
        const customer = await customerFactory.singleCustomer();
        const product = await productFactory.singleProduct();

        await customersApiService.deleteCustomer(customer._id, workerToken);
        dataDisposalUtils.removeCustomer(customer._id);

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, workerToken);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_NOT_FOUND(customer._id));
      },
    );

    test(
      '404 Not Found - Create order without customer',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController, productFactory }) => {
        const product = await productFactory.singleProduct();

        const data = {
          customer: '',
          products: [product._id],
        };

        const response = await ordersController.create(data, workerToken);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.MISSING_CUSTOMER);
      },
    );

    test(
      '404 Not Found - Create order with not exist product',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController, customerFactory, productFactory, productsApiService, dataDisposalUtils }) => {
        const customer = await customerFactory.singleCustomer();
        const product = await productFactory.singleProduct();

        await productsApiService.delete(product._id, workerToken);
        dataDisposalUtils.removeProduct(product._id);

        const data = {
          customer: customer._id,
          products: [product._id],
        };

        const response = await ordersController.create(data, workerToken);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.PRODUCT_NOT_FOUND(product._id));
      },
    );
  });
});
