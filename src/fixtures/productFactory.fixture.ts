import { ICustomProduct, IProductPayload, IProduct } from '../types/product.types';
import { test as base } from './api-services.fixture';

export const test = base.extend<ICustomProduct>({
  productFactory: async ({ workerToken, productsApiService, dataDisposalUtils }, use) => {
    // const token = await signInApiService.loginAsLocalUser();

    const createProductWithCleanup = async (customData?: Partial<IProductPayload>): Promise<IProduct> => {
      const product = await productsApiService.create(workerToken, customData);
      dataDisposalUtils.trackProduct(product._id);

      return product;
    };

    await use({
      singleProduct: createProductWithCleanup,
      multipleProducts: (productCount = 3, customData = {}) =>
        Promise.all(Array.from({ length: productCount }, () => createProductWithCleanup(customData))),
      multipleProductsIds: async (productCount = 3, customData = {}) => {
        const products = await Promise.all(Array.from({ length: productCount }, () => createProductWithCleanup(customData)));
        return products.map((p) => p._id);
      },
    });
  },
});

export { expect } from '@playwright/test';
