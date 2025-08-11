import { test } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { generateCustomerData } from 'data/customers/generateCustomer.data';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';

import {
  positiveTestCasesForCreate,
  negativeTestCasesForCreate,
  negativeTestCasesForCreateWithoutToken,
} from 'data/customers/createCustomerCases.data';

test.describe('[API] [Customers] Create a new customer', () => {
  let token = '';
  let id = '';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.describe('Positive', () => {
    test.afterEach(async ({ customersApiService }) => {
      if (id) {
        await customersApiService.deleteCustomer(id, token);
      }
    });

    positiveTestCasesForCreate.forEach(({ name, data, expectedStatusCode, isSuccess, errorMessage }) => {
      test(`Should create customer: ${name}`, { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] }, async ({ customersController }) => {
        const response = await customersController.create(data, token);
        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

        id = response.body.Customer._id;
      });
    });
  });

  test.describe('Negative', () => {
    negativeTestCasesForCreateWithoutToken.forEach(({ name, data, token, expectedStatusCode, isSuccess, errorMessage }) => {
      test(`Should NOT create customer: ${name}`, { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] }, async ({ customersController }) => {
        const response = await customersController.create(data, token);
        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
      });
    });

    negativeTestCasesForCreate.forEach(({ name, data, expectedStatusCode, isSuccess, errorMessage }) => {
      test(`Should NOT create customer: ${name}`, { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] }, async ({ customersController }) => {
        const response = await customersController.create(data, token);
        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
      });
    });

    test(
      'Should NOT create customer: Duplicate email',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController, customersApiService }) => {
        const customer1Data = generateCustomerData();
        const createResponse1 = await customersApiService.createCustomer(token, customer1Data);

        const customer2Data = {
          ...generateCustomerData(),
          email: customer1Data.email,
        };
        const createResponse2 = await customersController.create(customer2Data, token);

        validateResponse(createResponse2, STATUS_CODES.CONFLICT, false, `Customer with email '${customer2Data.email}' already exists`);

        id = createResponse1._id;
        if (id) {
          await customersApiService.deleteCustomer(id, token);
        }
      },
    );
  });
});
