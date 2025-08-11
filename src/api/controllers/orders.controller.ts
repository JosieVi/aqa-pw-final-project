import { IDelivery, IOrderData, IOrderFilteredResponse, IOrderRequestParams, IOrderResponse } from 'types/orders.types';
import { logStep } from 'utils/reporter.utils';
import { apiConfig } from 'config/api-config';
import { IRequestOptions } from 'types/api.types';
import { convertRequestParams } from 'utils/requestParams.utils';
import { RequestApi } from 'api/apiClients/request';
import { APIRequestContext } from '@playwright/test';
import { ORDER_STATUS } from 'data/orders/statuses.data';

export class OrdersAPIController {
  private request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  @logStep('POST/ order via API')
  async create(data: IOrderData, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS,
      method: 'post',
      data: data,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('GET / filtered and sorted list of orders via API')
  async getFilteredOrders(token: string, params?: IOrderRequestParams) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDERS + (params ? convertRequestParams(params) : ''),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderFilteredResponse>(options);
  }

  @logStep('GET/ order via API')
  async getByID(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      url: apiConfig.ENDPOINTS.ORDER_BY_ID(id),
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('PUT/ order via API')
  async updateOrder(id: string, data: IOrderData, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_BY_ID(id),
      method: 'put',
      data: data,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('DELETE/ order via API')
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_BY_ID(id),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return await this.request.send<null>(options);
  }

  @logStep('PUT/ assign manager to order')
  async assignManager(orderId: string, managerId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ASSIGN_MANAGER(orderId, managerId),
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('PUT/ unassign manager from order')
  async unassignManager(orderId: string, token: string) {
    // разные названия orderId
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.UNASSIGN_MANAGER(orderId),
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('POST/ order comment via API')
  async addComment(id: string, text: string, token: string) {
    const comment = {
      comment: text,
    };
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_COMMENT(id),
      method: 'post',
      data: comment,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('DELETE/ order comment via API')
  async deleteComment(order_id: string, comment_id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_COMMENT_BY_ID(order_id, comment_id),
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('POST/ order delivery via API')
  async updateDelivery(id: string, delivery: IDelivery, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_DELIVERY(id),
      method: 'post',
      data: delivery,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('POST/ order receive via API')
  async receiveProducts(id: string, productIds: string[], token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_RECEIVE(id),
      method: 'post',
      data: { products: productIds },
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }

  @logStep('PUT/ order status via API')
  async updateStatus(id: string, status: ORDER_STATUS, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.BASE_URL,
      url: apiConfig.ENDPOINTS.ORDER_STATUS(id),
      method: 'put',
      data: { status: status },
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.request.send<IOrderResponse>(options);
  }
}
