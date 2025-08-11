import { test, expect } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { TAGS } from 'data/testTags.data';
import { oneCustomerSchema } from 'data/schemas/customer.schema';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { ICustomerFromResponse } from 'types/customer.types';

test.describe('[API][Customer] Get Customer By ID', () => {
  let token = '';
  let customer: ICustomerFromResponse;

  test.beforeEach(async ({ signInApiService, customersApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    customer = await customersApiService.createCustomer(token);
  });

  test.describe('Positive', () => {
    test('Get customer by id - 200 OK', { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] }, async ({ customersController }) => {
      const response = await customersController.getById(customer._id, token);
      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(oneCustomerSchema, response.body);
      const currentCustomer = response.body.Customer;
      expect.soft(customer).toEqual(currentCustomer);
    });
  });

  test.afterEach(async ({ customersController }) => {
    await customersController.delete(customer._id, token);
  });

  test.describe('Negative', () => {
    test(
      'Get customer by ID with empty token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const token = '';
        const response = await customersController.getById(customer._id, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );

    test(
      'Get customer by ID with invalid token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const token = 'Beer eyJhbGci';
        const response = await customersController.getById(customer._id, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );

    test(
      'Get customer by ID with deleted id - wasnt found',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const invalidId = '684e61b31c508c5d5e53f421';
        const response = await customersController.getById(invalidId, token);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_NOT_FOUND(invalidId));
      },
    );
  });
});
