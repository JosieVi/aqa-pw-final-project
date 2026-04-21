import { test as base } from 'fixtures/controllers.fixture';
import { SignInApiService } from 'api/services/signIn.api-service';
import { ProductsApiService } from 'api/services/product.api-service';
import { CustomersApiService } from 'api/services/customer.api-service';
import { OrdersAPIService } from 'api/services/order.api-service';
import { DataDisposalUtils } from 'utils/dataDisposal.utils';
import { SignInController } from 'api/controllers/signIn.controller';
import { apiConfig } from 'config/api-config';
import { ManagersApiService } from 'api/services/manager.api-services';

interface IApiServices {
  customersApiService: CustomersApiService;
  signInApiService: SignInApiService;
  productsApiService: ProductsApiService;
  ordersApiService: OrdersAPIService;
  dataDisposalUtils: DataDisposalUtils;
  managersApiService: ManagersApiService;
}
// NEW
export interface IWorkerFixtures {
  workerToken: string;
}

export const test = base.extend<IApiServices, IWorkerFixtures>({
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

  managersApiService: async ({ managersController }, use) => {
    await use(new ManagersApiService(managersController));
  },

  dataDisposalUtils: async ({ ordersApiService, customersApiService, productsApiService, managersApiService, signInApiService }, use) => {
    const utils = new DataDisposalUtils(ordersApiService, customersApiService, productsApiService, signInApiService, managersApiService);
    await use(utils);
    await utils.tearDown();
  },

  workerToken: [
    async ({ playwright }, use) => {
      const context = await playwright.request.newContext({ baseURL: apiConfig.BASE_URL });
      const service = new SignInApiService(new SignInController(context));
      const token = await service.loginAsLocalUser();
      await use(token);
      await context.dispose();
    },
    { scope: 'worker' },
  ],
});

export { expect } from '@playwright/test';
