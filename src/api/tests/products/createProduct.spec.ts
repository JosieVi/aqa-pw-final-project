import { test } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { generateProductData } from 'data/products/generateProduct.data';
import { positiveTestCasesForCreate, negativeTestCasesForCreate } from 'data/products/createProductCases.data';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { errorResponseSchema, oneProductResponseSchema } from 'data/schemas/product.schema';

test.describe('[API] [Products] Create a new product', () => {
  let token = '';
  let productId = '';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.describe('Positive', () => {
    test.afterEach(async ({ productsApiService }) => {
      if (productId) {
        await productsApiService.delete(productId, token);
      }
    });

    positiveTestCasesForCreate.forEach(({ name, data }) => {
      test(`Should create product: ${name}`, { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] }, async ({ productsController }) => {
        const response = await productsController.create(data, token);
        validateSchema(oneProductResponseSchema, response.body);
        validateResponse(response, STATUS_CODES.CREATED, true, null);
        productId = response.body.Product._id;
      });
    });
  });

  test.describe('Negative', () => {
    negativeTestCasesForCreate.forEach(({ name, data, token: testCaseToken, expectedError, expectedStatusCode }) => {
      test(`Should NOT create product: ${name}`, { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productsController }) => {
        const usedToken = testCaseToken ?? token;
        const statusCode = expectedStatusCode ?? STATUS_CODES.BAD_REQUEST;

        const response = await productsController.create(data, usedToken);
        validateSchema(errorResponseSchema, response.body);
        validateResponse(response, statusCode, false, expectedError);
      });
    });

    test(
      'Should NOT create product: Duplicate name',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productsController, productsApiService }) => {
        const firstProduct = await productsApiService.create(token, generateProductData());

        const duplicateProductData = {
          ...generateProductData(),
          name: firstProduct.name,
        };

        const duplicateResponse = await productsController.create(duplicateProductData, token);

        validateSchema(errorResponseSchema, duplicateResponse.body);
        validateResponse(duplicateResponse, STATUS_CODES.CONFLICT, false, `Product with name '${firstProduct.name}' already exists`);

        await productsApiService.delete(firstProduct._id, token);
      },
    );
  });
});
