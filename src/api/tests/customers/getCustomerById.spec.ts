import { test, expect } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { TAGS } from 'data/testTags.data';
import { oneCustomerSchema } from 'data/schemas/customer.schema';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { ICustomerEntity } from 'types/customer.types';

test.describe('[API] [Customers] Get Customer By ID', () => {
  let token = '';
  let customer: ICustomerEntity;

  test.beforeEach(async ({ signInApiService, customerFactory }) => {
    token = await signInApiService.loginAsLocalUser();
    customer = await customerFactory.singleCustomer();
  });

  test.describe('Positive', () => {
    test(
      'Should successfully get customer by ID - 200 OK',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const response = await customersController.getById(customer._id, token);
        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(oneCustomerSchema, response.body);
        const actualCustomer = response.body.Customer;
        expect.soft(actualCustomer, `Customer from response should be the same as the one created`).toEqual(customer);
      },
    );
  });

  test.describe('Negative', () => {
    test(
      'Should NOT get customer by ID with empty token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        token = '';
        const response = await customersController.getById(customer._id, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );

    test(
      'Should NOT get customer by ID with invalid token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        token = 'Beer eyJhbGci';
        const response = await customersController.getById(customer._id, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );

    test(
      'Should NOT get customer with non-existing id - 404 Not Found',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const invalidId = '684e61b31c508c5d5e53f421';
        const response = await customersController.getById(invalidId, token);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_NOT_FOUND(invalidId));
      },
    );
  });
});
