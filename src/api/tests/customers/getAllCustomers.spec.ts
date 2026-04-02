import { test, expect } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { TAGS } from 'data/testTags.data';
import { allCustomersResponseSchema } from 'data/schemas/customer.schema';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { ICustomerEntity } from 'types/customer.types';

test.describe('[API] [Customers] Get All Customers', () => {
  let precreatedCustomers: ICustomerEntity[];

  test.beforeEach(async ({ customerFactory }) => {
    precreatedCustomers = await customerFactory.multipleCustomers();
  });

  test.describe('Positive', () => {
    test(
      'Should return all precreated customers - 200 OK',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ customersController, workerToken }) => {
        const response = await customersController.getAllCustomers(workerToken);
        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(allCustomersResponseSchema, response.body);
        const actualCustomers = response.body.Customers;

        const allPrecreatedCustomersAreInList = precreatedCustomers.every((precreatedCustomer) =>
          actualCustomers.some((actualCustomer) => actualCustomer._id === precreatedCustomer._id),
        );
        expect.soft(allPrecreatedCustomersAreInList, 'All precreated customers should be present in the response list').toBeTruthy();
      },
    );
  });

  test.describe('Negative', () => {
    test(
      'Should NOT return customers with empty token - 401 Unauthorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const token = '';
        const response = await customersController.getAllCustomers(token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );

    test(
      'Should NOT return customers with invalid token - 401 Unauthorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const token = 'Beer eyJhbGci';
        const response = await customersController.getAllCustomers(token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );
  });
});
