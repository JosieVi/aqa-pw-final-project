import { test, expect } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { TAGS } from 'data/testTags.data';
import { ICustomerFromResponse } from 'types/customer.types';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { validationErrorSchema } from 'data/schemas/base.schema';

test.describe('[API][Customer] Get Customer By Id', () => {
  let token = '';
  let customer: ICustomerFromResponse;

  test.beforeEach(async ({ signInApiService, customersApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    customer = await customersApiService.createCustomer(token);
  });

  test.describe('Positive', () => {
    test(
      'Should DELETE customer by correct id - 204 No Content',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const response = await customersController.delete(customer._id, token);
        validateResponse(response, STATUS_CODES.DELETED);
        expect.soft(response.body).toBe('');

        const responseAfterDelete = await customersController.getById(customer._id, token);
        validateResponse(responseAfterDelete, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_NOT_FOUND(customer._id));

        validateSchema(validationErrorSchema, responseAfterDelete.body);
      },
    );
  });
  test.describe('Negative', () => {
    test(
      'Should NOT DELETE customer by incorrect id - 404 Not Found',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const incorrectID = `${customer._id.slice(13)}${Date.now()}`;
        const response = await customersController.delete(incorrectID, token);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_NOT_FOUND(incorrectID));
        validateSchema(validationErrorSchema, response);
      },
    );
    test(
      'Should NOT DELETE customer with empty token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const token = '';
        const response = await customersController.delete(customer._id, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );

    test(
      'Should NOT DELETE customer with invalid token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const token = 'Beer eyJhbGci';
        const response = await customersController.delete(customer._id, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );
  });
});
