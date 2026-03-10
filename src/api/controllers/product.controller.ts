import { apiConfig } from 'config/api-config';
import { IProductPayload, IProductSearchParams, IProductResponse, IProductsListResponse, IProductsSearchResponse } from 'types/product.types';
import { logStep } from 'utils/reporter.utils';
import { convertRequestParams } from 'utils/requestParams.utils';
import { BaseController } from './base.controller';

export class ProductsController extends BaseController {
  @logStep('POST/product via API')
  async create(productData: IProductPayload, token: string) {
    return await this.request.send<IProductResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.PRODUCTS,
      method: 'post',
      data: productData,
    });
  }

  @logStep('GET/product via API')
  async getById(productId: string, token: string) {
    return await this.request.send<IProductResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(productId),
      method: 'get',
    });
  }

  @logStep('GET ALL/ filtered and sorted list of products via API')
  async getFilteredProducts(token: string, params?: IProductSearchParams) {
    return await this.request.send<IProductsSearchResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.PRODUCTS + (params ? convertRequestParams(params) : ''),
      method: 'get',
    });
  }

  @logStep('GET ALL/ products via API')
  async getAll(token: string) {
    return await this.request.send<IProductsListResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ALL_PRODUCTS,
      method: 'get',
    });
  }

  @logStep('PUT/product via API')
  async update(id: string, body: Partial<IProductPayload>, token: string) {
    return await this.request.send<IProductResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(id),
      method: 'put',
      data: body,
    });
  }

  @logStep('DELETE/product via API')
  async delete(id: string, token: string) {
    return await this.request.send<null>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.PRODUCT_BY_ID(id),
      method: 'delete',
    });
  }
}
