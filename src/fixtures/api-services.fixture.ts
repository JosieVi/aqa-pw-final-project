import { test as base } from 'fixtures/controllers.fixture';
import { SignInApiService } from 'api/services/signIn.api-service';
import { ProductsApiService } from 'api/services/product.api-service';
import { CustomersApiService } from 'api/services/customer.api-service';
import { OrdersAPIService } from 'api/services/order.api-service';
import { DataDisposalUtils } from 'utils/dataDisposal.utils';

interface IApiServices {
  customersApiService: CustomersApiService;
  signInApiService: SignInApiService;
  productsApiService: ProductsApiService;
  ordersApiService: OrdersAPIService;
  dataDisposalUtils: DataDisposalUtils;
}

export const test = base.extend<IApiServices>({
  signInApiService: async ({ signInController }, use) => {
    await use(new SignInApiService(signInController));
  },

  productsApiService: async ({ productsController }, use) => {
    await use(new ProductsApiService(productsController));
  },

  customersApiService: async ({ customersController }, use) => {
    await use(new CustomersApiService(customersController));
  },

  ordersApiService: async ({ ordersController }, use) => {
    await use(new OrdersAPIService(ordersController));
  },

  dataDisposalUtils: async ({ ordersApiService, customersApiService, productsApiService, signInApiService }, use) => {
    const utils = new DataDisposalUtils(ordersApiService, customersApiService, productsApiService, signInApiService);
    await use(utils);
    await utils.tearDown();
  },
});

export { expect } from '@playwright/test';
