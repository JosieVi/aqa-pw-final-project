import { test } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { generateProductData } from 'data/products/generateProduct.data';
import { positiveCreateCustomerCases, negativeCreateCustomerCase } from 'data/products/createProductCases.data';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { errorResponseSchema, oneProductResponseSchema } from 'data/schemas/product.schema';

test.describe('[API] [Products] Create a new product', () => {
  test.describe('Positive', () => {
    positiveCreateCustomerCases.forEach(({ name, data }) => {
      test(
        `Should create product: ${name}`,
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ workerToken, productsController }) => {
          const response = await productsController.create(data, workerToken);
          validateSchema(oneProductResponseSchema, response.body);
          console.log(response.body);
          validateResponse(response, STATUS_CODES.CREATED, true, null);
        },
      );
    });
  });

  test.describe('Negative', () => {
    negativeCreateCustomerCase.forEach(({ name, data, token: testCaseToken, expectedError, expectedStatusCode }) => {
      test(`Should NOT create product: ${name}`, { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ workerToken, productsController }) => {
        const usedToken = testCaseToken ?? workerToken;
        const statusCode = expectedStatusCode ?? STATUS_CODES.BAD_REQUEST;

        const response = await productsController.create(data, usedToken);
        validateSchema(errorResponseSchema, response.body);
        validateResponse(response, statusCode, false, expectedError);
      });
    });

    test(
      'Should NOT create product: Duplicate name',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ workerToken, productsController, productsApiService }) => {
        const firstProduct = await productsApiService.create(workerToken, generateProductData());

        const duplicateProductData = {
          ...generateProductData(),
          name: firstProduct.name,
        };

        const duplicateResponse = await productsController.create(duplicateProductData, workerToken);

        validateSchema(errorResponseSchema, duplicateResponse.body);
        validateResponse(duplicateResponse, STATUS_CODES.CONFLICT, false, `Product with name '${firstProduct.name}' already exists`);

        await productsApiService.delete(firstProduct._id, workerToken);
      },
    );
  });
});
