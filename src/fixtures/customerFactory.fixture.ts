import { ICustomCustomer, ICustomerEntity, ICustomerPayload } from 'types/customer.types';
import { test as base } from './api-services.fixture';

export const test = base.extend<ICustomCustomer>({
  customerFactory: async ({ signInApiService, customersApiService, dataDisposalUtils }, use) => {
    const token = await signInApiService.loginAsLocalUser();

    const createCustomerWithCleanup = async (customData?: Partial<ICustomerPayload>): Promise<ICustomerEntity> => {
      const customer = await customersApiService.createCustomer(token, customData);
      dataDisposalUtils.trackCustomer(customer._id);

      return customer;
    };

    await use({
      singleCustomer: (customData = {}) => createCustomerWithCleanup(customData),
      multipleCustomers: (count = 3, customData = {}) => Promise.all(Array.from({ length: count }, () => createCustomerWithCleanup(customData))),
    });
  },
});

export { expect } from '@playwright/test';
