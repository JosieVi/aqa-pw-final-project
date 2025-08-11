import { test } from 'fixtures/api-services.fixture';
import { generateCustomerData } from 'data/customers/generateCustomer.data';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import {
  negativeTestCasesForUpdate,
  negativeTestCasesForUpdateWithoutToken,
  positiveTestCasesForUpdate,
} from 'data/customers/updateCustomerCases.data';
import { ICustomer } from 'types/customer.types';
import { STATUS_CODES } from 'data/statusCodes';

test.describe('[API] [Customers] Update the customer by ID', () => {
  let token = '';
  let originalCustomerID = '';
  let dublicateCustomerID = '';
  let originalCustomerData: ICustomer = {} as ICustomer;

  test.beforeEach(async ({ signInApiService, customersApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    originalCustomerData = generateCustomerData();
    const originalCustomer = await customersApiService.createCustomer(token, originalCustomerData);
    originalCustomerID = originalCustomer._id;
  });

  test.afterEach(async ({ customersApiService }) => {
    if (originalCustomerID) {
      await customersApiService.deleteCustomer(originalCustomerID, token);
    }
    if (dublicateCustomerID) {
      await customersApiService.deleteCustomer(dublicateCustomerID, token);
    }
  });

  test.describe('Positive', () => {
    positiveTestCasesForUpdate.forEach(({ name, newCustomerData, expectedStatusCode, isSuccess, errorMessage }) => {
      test(`Should update customer: ${name}`, { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE, TAGS.REGRESSION] }, async ({ customersController }) => {
        const response = await customersController.update(originalCustomerID, { ...originalCustomerData, ...newCustomerData }, token);
        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
      });
    });
  });

  test.describe('Negative', () => {
    negativeTestCasesForUpdateWithoutToken.forEach(({ name, newCustomerData, token, expectedStatusCode, isSuccess, errorMessage }) => {
      test(`Should NOT update customer: ${name}`, { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] }, async ({ customersController }) => {
        const response = await customersController.update(originalCustomerID, { ...originalCustomerData, ...newCustomerData }, token);
        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
      });
    });

    negativeTestCasesForUpdate.forEach(({ name, newCustomerData, expectedStatusCode, isSuccess, errorMessage }) => {
      test(`Should NOT update customer: ${name}`, { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] }, async ({ customersController }) => {
        const response = await customersController.update(originalCustomerID, { ...originalCustomerData, ...newCustomerData }, token);
        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
      });
    });

    test(
      'Should NOT update customer: Duplicate email',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController, customersApiService }) => {
        const dublicateCustomerData = generateCustomerData();
        const dublicateCustomer = await customersApiService.createCustomer(token, dublicateCustomerData);
        dublicateCustomerID = dublicateCustomer._id;

        const response = await customersController.update(originalCustomerID, { ...originalCustomerData, email: dublicateCustomerData.email }, token);
        validateResponse(response, STATUS_CODES.CONFLICT, false, `Customer with email '${dublicateCustomerData.email}' already exists`);
      },
    );

    test(
      'Should NOT update customer: ID of non-existent customer',
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersController, customersApiService }) => {
        const secondCustomerData = generateCustomerData();
        const secondCustomer = await customersApiService.createCustomer(token, secondCustomerData);
        const secondCustomerID = secondCustomer._id;
        await customersApiService.deleteCustomer(secondCustomerID, token);

        const response = await customersController.update(secondCustomerID, generateCustomerData(), token);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Customer with id '${secondCustomerID}' wasn't found`);
      },
    );
  });
});
