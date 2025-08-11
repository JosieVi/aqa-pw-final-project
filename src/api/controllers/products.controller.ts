import { RequestApi } from 'api/apiClients/request';
import { apiConfig } from 'config/api-config';
import { IRequestOptions } from 'types/api.types';
import { IProduct, IProductFilterParams, IProductResponse, IProductsAllResponse, IProductsFilteredResponse } from 'types/products.types';
import { logStep } from 'utils/reporter.utils';
import { APIRequestContext } from '@playwright/test';
import { convertRequestParams } from 'utils/requestParams.utils';

export class ProductsController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep('POST/product via API')
  async create(productData: IProduct, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCTS,
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: productData,
    };
    return await this.request.send<IProductResponse>(options);
  }

  @logStep('GET/product via API')
  async getById(productId: string, token: string) {
    const options: IRequestOptions = {
      url: `${apiConfig.ENDPOINTS.PRODUCT_BY_ID(productId)}`,
      baseURL: apiConfig.BASE_URL,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductResponse>(options);
  }

  @logStep('GET ALL/ filtered and sorted list of products via API')
  async getFilteredProducts(token: string, params?: IProductFilterParams) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCTS + (params ? convertRequestParams(params) : ''),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductsFilteredResponse>(options);
  }

  @logStep('GET ALL/ products via API')
  async getAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ALL_PRODUCTS,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductsAllResponse>(options);
  }

  @logStep('PUT/product via API')
  async update(id: string, body: Partial<IProduct>, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(id),
      method: 'put',
      data: body,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IProductResponse>(options);
  }

  @logStep('DELETE/product via API')
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(id),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return await this.request.send<null>(options);
  }
}
