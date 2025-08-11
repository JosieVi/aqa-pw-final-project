import { generateProductData } from 'data/products/generateProduct.data';
import { negativeTestCasesForUpdate, positiveTestCasesForUpdate } from 'data/products/updateProductCases.data';
import { errorResponseSchema, oneProductResponseSchema } from 'data/schemas/product.schema';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { test } from 'fixtures/api-services.fixture';
import { IProduct } from 'types/products.types';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';

test.describe('[API] [Products] Update product by ID', () => {
  let token = '';
  let productId = '';
  let originalProductData: IProduct;

  test.beforeEach(async ({ signInApiService, productsApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    originalProductData = generateProductData() as IProduct;
    const createdProduct = await productsApiService.create(token, originalProductData);
    productId = createdProduct._id;
  });

  test.describe('Positive', () => {
    test.afterEach(async ({ productsApiService }) => {
      await productsApiService.delete(productId, token);
    });

    positiveTestCasesForUpdate.forEach(({ name, data }) => {
      test(`Should update product: ${name}`, { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] }, async ({ productsController }) => {
        const updateProduct: Partial<IProduct> = {
          ...originalProductData,
          ...data,
        };
        const response = await productsController.update(productId, updateProduct, token);
        validateSchema(oneProductResponseSchema, response.body);
        validateResponse(response, STATUS_CODES.OK, true, null);
      });
    });
  });

  test.describe('Negative', () => {
    test.afterEach(async ({ productsApiService }) => {
      await productsApiService.delete(productId, token);
    });
    negativeTestCasesForUpdate.forEach(({ name, data, token: testCaseToken, expectedError, expectedStatusCode }) => {
      test(`Should NOT update product: ${name}`, { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productsController }) => {
        const usedToken = testCaseToken ?? token;
        const statusCode = expectedStatusCode ?? STATUS_CODES.BAD_REQUEST;
        const response = await productsController.update(productId, data, usedToken);
        validateSchema(errorResponseSchema, response.body);
        validateResponse(response, statusCode, false, expectedError);
      });
    });

    test(
      'Should NOT update product: Duplicate name',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productsController, productsApiService }) => {
        const firstProduct = await productsApiService.create(token, generateProductData());

        const duplicateProductData = {
          ...originalProductData,
          name: firstProduct.name,
        };

        const duplicateResponse = await productsController.update(productId, duplicateProductData, token);

        validateSchema(errorResponseSchema, duplicateResponse.body);
        validateResponse(duplicateResponse, STATUS_CODES.CONFLICT, false, `Product with name '${firstProduct.name}' already exists`);

        await productsApiService.delete(firstProduct._id, token);
      },
    );
    test(
      'Should NOT update product: ID of non-existent product',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productsController, productsApiService }) => {
        const testProduct = await productsApiService.create(token, generateProductData());
        const testProductId = testProduct._id;

        await productsApiService.delete(testProductId, token);

        const response = await productsController.update(testProductId, generateProductData(), token);
        validateSchema(errorResponseSchema, response.body);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Product with id '${testProductId}' wasn't found`);
      },
    );
  });
});
