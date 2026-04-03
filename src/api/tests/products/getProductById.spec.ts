import { test, expect } from 'fixtures/index.fixture';
import { oneProductResponseSchema } from 'data/schemas/product.schema';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { IProduct } from 'types/product.types';

test.describe('[API] [Products] Get Product By Id', () => {
  let product: IProduct;

  test.beforeEach(async ({ productFactory }) => {
    product = await productFactory.singleProduct();
  });

  test.describe('Positive', () => {
    test(
      'Get product by id - 200 OK',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ workerToken, productsController }) => {
        const response = await productsController.getById(product._id, workerToken);
        validateResponse(response, STATUS_CODES.OK, true, null);
        validateSchema(oneProductResponseSchema, response.body);
        const newProduct = response.body.Product;
        expect.soft(product).toEqual(newProduct);
      },
    );
  });

  test.describe('Negative', () => {
    test('Get product by id with empty token', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productsController }) => {
      const token = '';
      const response = await productsController.getById(product._id, token);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Not authorized');
    });

    test('Get product by id with invalid token', { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] }, async ({ productsController }) => {
      const token = 'Invalid Token';
      const response = await productsController.getById(product._id, token);
      validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Invalid access token');
    });

    test(
      'Get product by id with not exist product',
      { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
      async ({ workerToken, productsController }) => {
        const productId = '684f45261c508c5d5e553e8a';
        const response = await productsController.getById(productId, workerToken);
        validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Product with id '${productId}' wasn't found`);
      },
    );
  });
});
