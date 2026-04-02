import { test } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { TAGS } from 'data/testTags.data';
import { ICustomerEntity } from 'types/customer.types';
import { ERROR_MESSAGES } from 'data/errorMessages';

test.describe('[API] [Customers] Delete Customer By ID', () => {
  let customer: ICustomerEntity;

  test.beforeEach(async ({ customerFactory }) => {
    customer = await customerFactory.singleCustomer();
  });

  test.describe('Positive', () => {
    test(
      'Should successfully delete customer - 204 No Content',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ workerToken, customersController, dataDisposalUtils }) => {
        const response = await customersController.delete(customer._id, workerToken);
        validateResponse(response, STATUS_CODES.DELETED);
        dataDisposalUtils.removeCustomer(customer._id);

        const responseAfterDelete = await customersController.getById(customer._id, workerToken);
        validateResponse(responseAfterDelete, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_NOT_FOUND(customer._id));
      },
    );
  });
  test.describe('Negative', () => {
    test(
      'Should NOT delete customer with incorrect ID - 404 Not Found',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ workerToken, customersController }) => {
        const incorrectID = `${customer._id.slice(0, -4)}ffff`;
        const response = await customersController.delete(incorrectID, workerToken);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_NOT_FOUND(incorrectID));
      },
    );
    test(
      'Should NOT delete customer with empty token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const token = '';
        const response = await customersController.delete(customer._id, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );

    test(
      'Should NOT delete customer with invalid token - 401 Unauthorized',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController }) => {
        const token = 'Beer eyJhbGci';
        const response = await customersController.delete(customer._id, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );
  });
});
