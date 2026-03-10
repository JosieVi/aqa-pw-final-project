import { apiConfig } from 'config/api-config';
import { CustomersSortField, SortDirection } from 'types/api.types';
import {
  ICustomerPayload,
  ICustomerFilterParams,
  ISingleCustomerResponse,
  ICustomerListResponse,
  IFilteredCustomersResponse,
} from 'types/customer.types';
import { logStep } from 'utils/reporter.utils';
import { convertRequestParams } from 'utils/requestParams.utils';
import { IOrderListResponse } from 'types/order.types';
import { BaseController } from './base.controller';

export class CustomersController extends BaseController {
  @logStep('GET /customers with pagination via API')
  async getCustomersWithPagination(
    token: string,
    params?: {
      page?: number;
      limit?: number;
      sortField?: CustomersSortField;
      sortOrder?: SortDirection;
    },
  ) {
    const { page = 1, limit = 10, sortField = 'createdOn', sortOrder = 'desc' } = params || {};

    const queryParams: Record<string, string> = {};

    queryParams.page = page.toString();

    queryParams.limit = limit.toString();

    queryParams.sortField = sortField;
    queryParams.sortOrder = sortOrder;

    return await this.request.send<IFilteredCustomersResponse>({
      ...this.getAuthorizedOptions(token),
      url: `${apiConfig.ENDPOINTS.CUSTOMERS}?${new URLSearchParams(queryParams)}`,
      method: 'get',
    });
  }

  @logStep('POST /customers via API')
  async create(body: ICustomerPayload, token: string) {
    return await this.request.send<ISingleCustomerResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.CUSTOMERS,
      method: 'post',
      data: body,
    });
  }

  @logStep('GET /customers filtered and sorted list of customers via API')
  async getFilteredCustomers(token: string, params?: ICustomerFilterParams) {
    return await this.request.send<IFilteredCustomersResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.CUSTOMERS + (params ? convertRequestParams(params) : ''),
      method: 'get',
    });
  }

  @logStep('GET /customers/all via API')
  async getAllCustomers(token: string) {
    return await this.request.send<ICustomerListResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ALL_CUSTOMERS,
      method: 'get',
    });
  }

  @logStep('GET /customers/{id} via API')
  async getById(id: string, token: string) {
    return await this.request.send<ISingleCustomerResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: 'get',
    });
  }

  @logStep('PUT /customers/{id} via API')
  async update(id: string, body: Partial<ICustomerPayload>, token: string) {
    return await this.request.send<ISingleCustomerResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: 'put',
      data: body,
    });
  }

  @logStep('DELETE /customers/{id} via API')
  async delete(id: string, token: string) {
    return await this.request.send<null>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.CUSTOMER_BY_ID(id),
      method: 'delete',
    });
  }

  @logStep('GET /customers/{customerId}/orders via API')
  async getCustomerOrdersById(customerId: string, token: string) {
    return await this.request.send<IOrderListResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.CUSTOMER_ORDERS(customerId),
      method: 'get',
    });
  }
}
