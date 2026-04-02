import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { test } from 'fixtures/index.fixture';
import { validateResponse } from 'utils/validations/responseValidation';

test.describe('[API] [Products] Delete product', () => {
  let productId: string;

  test.beforeEach(async ({ productFactory }) => {
    const product = await productFactory.singleProduct();
    productId = product._id;
  });

  test.describe('Positive', () => {
    test(
      'Should delete product - 200 OK',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ workerToken, productsController, dataDisposalUtils }) => {
        const response = await productsController.delete(productId, workerToken);
        validateResponse(response, STATUS_CODES.DELETED);

        const responseAfterDelete = await productsController.delete(productId, workerToken);
        validateResponse(responseAfterDelete, STATUS_CODES.NOT_FOUND, false, `Product with id '${productId}' wasn't found`);
        dataDisposalUtils.removeProduct(productId);
      },
    );
  });

  test.describe('Negative', () => {
    test(
      'Should NOT delete product with empty workerToken - 401 Unauthorized',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productsController }) => {
        const token = '';
        const response = await productsController.delete(productId, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Not authorized');
      },
    );

    test(
      'Should NOT delete product with invalid workerToken - 401 Unauthorized',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ productsController }) => {
        const token = 'Invalid workerToken';
        const response = await productsController.delete(productId, token);
        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Invalid access token');
      },
    );

    test(
      'Should NOT delete not exist product - 404 Not Found',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ workerToken, productsController }) => {
        const productId = '684f45261c508c5d5e553e8a';
        const response = await productsController.delete(productId, workerToken);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Product with id '${productId}' wasn't found`);
      },
    );
  });
});
