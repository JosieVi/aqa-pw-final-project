import { generateProductData } from 'data/products/generateProduct.data';
import { negativeTestCasesForUpdate, positiveTestCasesForUpdate } from 'data/products/updateProductCases.data';
import { errorResponseSchema, oneProductResponseSchema } from 'data/schemas/product.schema';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { test } from 'fixtures/productFactory.fixture';
import { IProduct, IProductPayload } from 'types/product.types';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';

test.describe('[API] [Products] Update product by ID', () => {
  let product: IProduct;

  test.beforeEach(async ({ productFactory }) => {
    product = await productFactory.singleProduct();
  });

  test.describe('Positive', () => {
    // test.afterEach(async ({ workerToken, productsApiService }) => {
    //   await productsApiService.delete(product._id, workerToken);
    // });

    positiveTestCasesForUpdate.forEach(({ name, data }) => {
      test(
        `Should update product: ${name}`,
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ workerToken, productsController }) => {
          const updateProduct: Partial<IProductPayload> = {
            ...product,
            ...data,
          };
          const response = await productsController.update(product._id, updateProduct, workerToken);
          validateSchema(oneProductResponseSchema, response.body);
          validateResponse(response, STATUS_CODES.OK, true, null);
        },
      );
    });
  });

  test.describe('Negative', () => {
    // test.afterEach(async ({ workerToken, productsApiService }) => {
    //   await productsApiService.delete(product._id, workerToken);
    // });
    negativeTestCasesForUpdate.forEach(({ name, data, token: testCaseToken, expectedError, expectedStatusCode }) => {
      test(`Should NOT update product: ${name}`, { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ workerToken, productsController }) => {
        const usedToken = testCaseToken ?? workerToken;
        const statusCode = expectedStatusCode ?? STATUS_CODES.BAD_REQUEST;
        const response = await productsController.update(product._id, data, usedToken);
        validateSchema(errorResponseSchema, response.body);
        validateResponse(response, statusCode, false, expectedError);
      });
    });

    test(
      'Should NOT update product: Duplicate name',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ workerToken, productsController, productsApiService }) => {
        const firstProduct = await productsApiService.create(workerToken, generateProductData());

        const duplicateProductData = {
          ...product,
          name: firstProduct.name,
        };

        const duplicateResponse = await productsController.update(product._id, duplicateProductData, workerToken);

        validateSchema(errorResponseSchema, duplicateResponse.body);
        validateResponse(duplicateResponse, STATUS_CODES.CONFLICT, false, `Product with name '${firstProduct.name}' already exists`);

        await productsApiService.delete(firstProduct._id, workerToken);
      },
    );
    test(
      'Should NOT update product: ID of non-existent product',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ workerToken, productsController, productsApiService }) => {
        const testProduct = await productsApiService.create(workerToken, generateProductData());
        const testProductId = testProduct._id;

        await productsApiService.delete(testProductId, workerToken);

        const response = await productsController.update(testProductId, generateProductData(), workerToken);
        validateSchema(errorResponseSchema, response.body);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Product with id '${testProductId}' wasn't found`);
      },
    );
  });
});
