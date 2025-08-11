import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { test } from 'fixtures/api-services.fixture';
import { IProductFromResponse } from 'types/products.types';
import { validateResponse } from 'utils/validations/responseValidation';

test.describe('[API] [Products] Delete product', () => {
  let token = '';
  let product: IProductFromResponse;

  test.beforeEach(async ({ signInApiService, productsApiService }) => {
    token = await signInApiService.loginAsLocalUser();
    product = await productsApiService.create(token);
  });

  test.describe('Positive', () => {
    test('Delete product - 200 OK', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] }, async ({ productsController }) => {
      const response = await productsController.delete(product._id, token);
      validateResponse(response, STATUS_CODES.DELETED, null, null);

      const responseAfterDelete = await productsController.delete(product._id, token);
      validateResponse(responseAfterDelete, STATUS_CODES.NOT_FOUND, false, `Product with id '${product._id}' wasn't found`);
    });
  });

  test.describe('Negative', () => {
    test(
      'Delete product with empty token - 401 Unauthorized',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productsController }) => {
        const token = '';
        const response = await productsController.delete(product._id, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Not authorized');
      },
    );

    test(
      'Delete product with invalid token - 401 Unauthorized',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productsController }) => {
        const token = 'Invalid Token';
        const response = await productsController.delete(product._id, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Invalid access token');
      },
    );

    test('Delete not exist product - 404 Not Found', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productsController }) => {
      const productId = '684f45261c508c5d5e553e8a';
      const response = await productsController.delete(productId, token);
      validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Product with id '${productId}' wasn't found`);
    });
  });
});
