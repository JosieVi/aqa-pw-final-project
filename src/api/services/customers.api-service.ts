import { APIRequestContext } from '@playwright/test';
import { CustomersController } from 'api/controllers/customers.controller';
import { generateCustomerData } from 'data/customers/generateCustomer.data';
import { STATUS_CODES } from 'data/statusCodes';
import { ICustomer, ICustomerFilterParams, ICustomersAllResponse } from 'types/customer.types';
import { logStep } from 'utils/reporter.utils';
import { validateResponse } from 'utils/validations/responseValidation';

export class CustomersApiService {
  controller: CustomersController;

  constructor(request: APIRequestContext) {
    this.controller = new CustomersController(request);
  }

  @logStep('Create Customer via API')
  async createCustomer(token: string, customData?: ICustomer) {
    const body = generateCustomerData(customData);
    const response = await this.controller.create(body, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    return response.body.Customer;
  }

  @logStep('Get filtered and sorted list of customers via API')
  async getFilteredCustomers(token: string, params?: ICustomerFilterParams) {
    const response = await this.controller.getFilteredCustomers(token, params);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body;
  }

  @logStep('Get all customers via API')
  async getAllCustomers(token: string) {
    const response = await this.controller.getAllCustomers(token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body as ICustomersAllResponse;
  }

  @logStep('Get Customer by ID via API')
  async getCustomerById(id: string, token: string) {
    const response = await this.controller.getById(id, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Customer;
  }

  @logStep('Update Customer by ID via API')
  async updateCustomer(id: string, updates: Partial<ICustomer>, token: string) {
    const response = await this.controller.update(id, updates, token);
    validateResponse(response, STATUS_CODES.OK, true, null);
    return response.body.Customer;
  }

  @logStep('Delete Customer by ID via API')
  async deleteCustomer(id: string, token: string) {
    const response = await this.controller.delete(id, token);
    validateResponse(response, STATUS_CODES.DELETED, null, null);
  }

  @logStep('Create multiple test customers via API')
  async createTestUsers(token: string, count = 3, customData: Partial<ICustomer> = {}) {
    const users = [];
    for (let i = 0; i < count; i++) {
      const userData: ICustomer = {
        ...generateCustomerData(), // Полностью сгенерированный объект
        ...customData, // Перезаписываем кастомными данными
      };
      const user = await this.createCustomer(token, userData);
      users.push(user);
    }
    return users;
  }
}
