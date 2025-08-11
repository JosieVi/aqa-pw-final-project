import { test, expect } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { TAGS } from 'data/testTags.data';
import { allCustomersResponseSchema } from 'data/schemas/customer.schema';
import { ERROR_MESSAGES } from 'data/errorMessages';

test.describe('[API][Customers] Get All Customers', () => {
  let token = '';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.describe('Positive', () => {
    test('Get all customers - 200 OK', { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] }, async ({ customersController }) => {
      const response = await customersController.getAllCustomers(token);
      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(allCustomersResponseSchema, response.body);
      const customers = response.body.Customers;
      expect.soft(Array.isArray(customers)).toBeTruthy();
      expect.soft(customers.length).toBeGreaterThan(0);
    });
  });

  test.describe('Negative', () => {
    test(
      'Get all customers with empty token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const token = '';
        const response = await customersController.getAllCustomers(token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );

    test(
      'Get all customers with invalid token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const token = 'Beer eyJhbGci';
        const response = await customersController.getAllCustomers(token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );
  });
});
