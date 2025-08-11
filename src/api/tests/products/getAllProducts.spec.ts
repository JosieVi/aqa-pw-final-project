import { test, expect } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { allProductsResponseSchema } from 'data/schemas/product.schema';
import { TAGS } from 'data/testTags.data';

test.describe('[API] [Products] Get All Products', () => {
  let token = '';

  test.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  test.describe('Positive', () => {
    test('Get all products - 200 OK', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] }, async ({ productsController }) => {
      const response = await productsController.getAll(token);
      validateResponse(response, STATUS_CODES.OK, true, null);
      validateSchema(allProductsResponseSchema, response.body);
      const products = response.body.Products;
      expect.soft(Array.isArray(products)).toBeTruthy();
      expect.soft(products.length).toBeGreaterThan(0);
    });
  });

  test.describe('Negative', () => {
    test(
      'Get all products with empty token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productsController }) => {
        const token = '';
        const response = await productsController.getAll(token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Not authorized');
      },
    );

    test(
      'Get all products with invalid token - 401 Not authorized',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productsController }) => {
        const token = 'Invalid access token';
        const response = await productsController.getAll(token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Invalid access token');
      },
    );
  });
});
