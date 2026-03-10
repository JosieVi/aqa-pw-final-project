import { IDelivery, IOrderPayload, IOrderSearchResponse, IOrderFilterParams, IOrderResponse } from 'types/order.types';
import { logStep } from 'utils/reporter.utils';
import { apiConfig } from 'config/api-config';
import { convertRequestParams } from 'utils/requestParams.utils';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { BaseController } from './base.controller';

export class OrdersController extends BaseController {
  @logStep('POST/ order via API')
  async create(data: IOrderPayload, token: string) {
    return await this.request.send<IOrderResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ORDERS,
      method: 'post',
      data: data,
    });
  }

  @logStep('GET / filtered and sorted list of orders via API')
  async getFilteredOrders(token: string, params?: IOrderFilterParams) {
    return await this.request.send<IOrderSearchResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ORDERS + (params ? convertRequestParams(params) : ''),
      method: 'get',
    });
  }

  @logStep('GET/ order via API')
  async getByID(id: string, token: string) {
    return await this.request.send<IOrderResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ORDER_BY_ID(id),
      method: 'get',
    });
  }

  @logStep('PUT/ order via API')
  async updateOrder(id: string, data: IOrderPayload, token: string) {
    return await this.request.send<IOrderResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ORDER_BY_ID(id),
      method: 'put',
      data: data,
    });
  }

  @logStep('DELETE/ order via API')
  async delete(id: string, token: string) {
    return await this.request.send<null>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ORDER_BY_ID(id),
      method: 'delete',
    });
  }

  @logStep('PUT/ assign manager to order')
  async assignManager(orderId: string, managerId: string, token: string) {
    return await this.request.send<IOrderResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ASSIGN_MANAGER(orderId, managerId),
      method: 'put',
    });
  }

  @logStep('PUT/ unassign manager from order')
  async unassignManager(orderId: string, token: string) {
    return await this.request.send<IOrderResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.UNASSIGN_MANAGER(orderId),
      method: 'put',
    });
  }

  @logStep('POST/ order comment via API')
  async addComment(id: string, text: string, token: string) {
    return await this.request.send<IOrderResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ORDER_COMMENT(id),
      method: 'post',
      data: { comment: text },
    });
  }

  @logStep('DELETE/ order comment via API')
  async deleteComment(order_id: string, comment_id: string, token: string) {
    return await this.request.send<IOrderResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ORDER_COMMENT_BY_ID(order_id, comment_id),
      method: 'delete',
    });
  }

  @logStep('POST/ order delivery via API')
  async updateDelivery(id: string, delivery: IDelivery, token: string) {
    return await this.request.send<IOrderResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ORDER_DELIVERY(id),
      method: 'post',
      data: delivery,
    });
  }

  @logStep('POST/ order receive via API')
  async receiveProducts(id: string, productIds: string[], token: string) {
    return await this.request.send<IOrderResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ORDER_RECEIVE(id),
      method: 'post',
      data: { products: productIds },
    });
  }

  @logStep('PUT/ order status via API')
  async updateStatus(id: string, status: ORDER_STATUS, token: string) {
    return await this.request.send<IOrderResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.ORDER_STATUS(id),
      method: 'put',
      data: { status: status },
    });
  }
}
