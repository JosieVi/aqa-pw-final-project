import { mergeTests } from '@playwright/test';
import { test as apiServices } from './api-services.fixture';
import { test as uiServices } from './ui-services.fixture';
import { test as mocks } from './mock.fixture';
import { test as customOrders } from './orderFactory.fixture';
import { authFixture } from './ui-auth.fixture';
import { OrderSetupService } from 'ui/services/orderSetup.ui-service';

export interface IIntegrationServices {
  orderSetupService: OrderSetupService;
}

const combinedTest = mergeTests(apiServices, uiServices, mocks, customOrders, authFixture);

// Re-export authContext from authFixture for convenience
export { authFixture };

export const test = combinedTest.extend<IIntegrationServices>({
  // Override 'page' fixture to use authenticated page from authFixture
  page: async ({ authPage }, use) => {
    await use(authPage);
  },

  orderSetupService: async ({ page, orderFactory }, use) => {
    const service = new OrderSetupService(page, orderFactory);
    await use(service);
  },
});

export { expect } from '../../src/utils/validations/customMatchers';
