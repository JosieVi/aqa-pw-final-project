import { test } from 'fixtures/index.fixture';
import { generateCustomerData } from 'data/customers/generateCustomer.data';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import {
  negativeTestCasesForUpdate,
  negativeTestCasesForUpdateWithoutToken,
  positiveTestCasesForUpdate,
} from 'data/customers/updateCustomerCases.data';
import { ICustomerPayload } from 'types/customer.types';
import { STATUS_CODES } from 'data/statusCodes';
import { ERROR_MESSAGES } from 'data/errorMessages';

test.describe('[API] [Customers] Update the customer by ID', () => {
  let expectedCustomerId = '';
  const expectedCustomerData: ICustomerPayload = generateCustomerData();

  test.beforeEach(async ({ customerFactory }) => {
    const expectedCustomer = await customerFactory.singleCustomer();
    expectedCustomerId = expectedCustomer._id;
  });

  test.describe('Positive', () => {
    positiveTestCasesForUpdate.forEach(({ name, newCustomerData, expectedStatusCode, isSuccess, errorMessage }) => {
      test(
        `Should update customer: ${name}`,
        { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ workerToken, customersController }) => {
          const response = await customersController.update(expectedCustomerId, { ...expectedCustomerData, ...newCustomerData }, workerToken);
          validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
        },
      );
    });
  });

  test.describe('Negative', () => {
    negativeTestCasesForUpdateWithoutToken.forEach(({ name, newCustomerData, token, expectedStatusCode, isSuccess, errorMessage }) => {
      test(`Should NOT update customer: ${name}`, { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] }, async ({ customersController }) => {
        const response = await customersController.update(expectedCustomerId, { ...expectedCustomerData, ...newCustomerData }, token);
        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
      });
    });

    negativeTestCasesForUpdate.forEach(({ name, newCustomerData, expectedStatusCode, isSuccess, errorMessage }) => {
      test(
        `Should NOT update customer: ${name}`,
        { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
        async ({ workerToken, customersController }) => {
          const response = await customersController.update(expectedCustomerId, { ...expectedCustomerData, ...newCustomerData }, workerToken);
          validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
        },
      );
    });

    test(
      'Should NOT update customer: Duplicate email',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ workerToken, customersController, customerFactory }) => {
        const duplicateCustomer = await customerFactory.singleCustomer();

        const duplicateEmail = duplicateCustomer.email || '';

        const response = await customersController.update(expectedCustomerId, { ...expectedCustomerData, email: duplicateEmail }, workerToken);
        validateResponse(response, STATUS_CODES.CONFLICT, false, ERROR_MESSAGES.CUSTOMER_ALREADY_EXISTS(duplicateEmail));
      },
    );

    test(
      'Should NOT update customer: ID of non-existent customer - 404 Not Found',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ workerToken, customersController, customersApiService }) => {
        const secondCustomerData = generateCustomerData();
        const secondCustomer = await customersApiService.createCustomer(workerToken, secondCustomerData);
        const secondCustomerID = secondCustomer._id;
        await customersApiService.deleteCustomer(secondCustomerID, workerToken);

        const response = await customersController.update(secondCustomerID, generateCustomerData(), workerToken);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.CUSTOMER_NOT_FOUND(secondCustomerID));
      },
    );
  });
});
