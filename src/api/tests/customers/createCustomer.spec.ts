import { test } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { generateCustomerData } from 'data/customers/generateCustomer.data';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';

import {
  positiveCreateCustomerCases,
  negativeCreateCustomerCase,
  negativeCreateCustomerCaseWithoutToken,
} from 'data/customers/createCustomerCases.data';

test.describe('[API] [Customers] Create A New Customer', () => {
  let token = '';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.describe('Positive', () => {
    positiveCreateCustomerCases.forEach(({ name, data, expectedStatusCode, isSuccess, errorMessage }) => {
      test(
        `Should create customer: ${name} - ${expectedStatusCode} Created`,
        { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ customersController, dataDisposalUtils }) => {
          const response = await customersController.create(data, token);
          dataDisposalUtils.trackCustomer(response.body.Customer._id);
          validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
        },
      );
    });
  });

  test.describe('Negative', () => {
    negativeCreateCustomerCaseWithoutToken.forEach(({ name, data, token, expectedStatusCode, isSuccess, errorMessage }) => {
      test(
        `Should not create customer ${name} - ${expectedStatusCode}`,
        { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
        async ({ customersController }) => {
          const response = await customersController.create(data, token);
          validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
        },
      );
    });

    negativeCreateCustomerCase.forEach(({ name, data, expectedStatusCode, isSuccess, errorMessage }) => {
      test(`Should NOT create customer: ${name}`, { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] }, async ({ customersController }) => {
        const response = await customersController.create(data, token);
        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
      });
    });

    test(
      'Should NOT create customer with duplicate email - 409 Conflict',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController, customersApiService, dataDisposalUtils }) => {
        const customer1Data = generateCustomerData();
        const createResponse1 = await customersApiService.createCustomer(token, customer1Data);

        dataDisposalUtils.trackCustomer(createResponse1._id);

        const customer2Data = {
          ...generateCustomerData(),
          email: customer1Data.email,
        };
        const createResponse2 = await customersController.create(customer2Data, token);

        validateResponse(createResponse2, STATUS_CODES.CONFLICT, false, `Customer with email '${customer2Data.email}' already exists`);
      },
    );
  });
});
