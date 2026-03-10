import { mergeTests } from '@playwright/test';
import { test as apiServices } from './api-services.fixture';
import { test as uiServices } from './ui-services.fixture';
import { test as mocks } from './mock.fixture';
import { test as customOrders } from './orderFactory.fixture';
import { OrderSetupService } from 'ui/services/orderSetup.ui-service';

export interface IIntegrationServices {
  orderSetupService: OrderSetupService;
}
const combinedTest = mergeTests(apiServices, uiServices, mocks, customOrders);

export const test = combinedTest.extend<IIntegrationServices>({
  orderSetupService: async ({ page, orderFactory }, use) => {
    const service = new OrderSetupService(page, orderFactory);
    await use(service);
  },
});

export { expect } from '@playwright/test';
