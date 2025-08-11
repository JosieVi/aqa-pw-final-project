import { IResponseFields, ordersSortField, sortDirection } from 'types/api.types';
import { ICustomerFromResponse } from 'types/customer.types';
import { IProduct } from 'types/products.types';
import { COUNTRIES } from 'data/customers/countries.data';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { DELIVERY, LOCATION } from 'data/orders/delivery.data';
import { ORDER_HISTORY_ACTIONS } from 'data/orders/history.data';
import { ROLES } from 'data/orders/roles.data';

// ===== Запросы =====
export interface IOrderRequestParams {
  search?: string;
  status?: ORDER_STATUS[];
  sortField?: ordersSortField;
  sortOrder?: sortDirection;
}

export interface IAddCommentRequest {
  comment: string;
}

// ===== Ответы =====
export interface IOrderResponse extends IResponseFields {
  Order: IOrderFromResponse;
}

export interface IOrdersResponse extends IResponseFields {
  Orders: IOrderFromResponse[];
}

export interface IOrderFilteredResponse extends IResponseFields {
  Orders: IOrderFromResponse[];
  total: number;
  page: number;
  limit: number;
  search: string;
  status: ORDER_STATUS[];
  sorting: {
    sortField: ordersSortField;
    sortOrder: sortDirection;
  };
}

// ===== Основные сущности =====
export interface IOrderData {
  customer: string;
  products: string[];
}

export interface IOrderDataWithId extends IOrderData {
  _id: string;
}

export interface IOrder {
  readonly status: ORDER_STATUS;
  readonly customer: ICustomerFromResponse;
  readonly products: IProductFromOrder[];
  readonly delivery: IDelivery | null;
  readonly total_price: number;
  readonly createdOn: string;
  readonly history: IHistory[];
  readonly comments: ICommentFromResponse[];
  readonly assignedManager: IManager | null;
}

export interface IOrderFromResponse extends IOrder {
  readonly _id: string;
}

// ===== Подсущности =====
export interface IProductFromOrder extends IProduct {
  _id: string;
  received: boolean;
}

export interface IAddress {
  location?: LOCATION;
  country?: COUNTRIES;
  city?: string;
  street?: string;
  house?: number;
  flat?: number;
}

export interface IDelivery {
  finalDate: string;
  condition: DELIVERY;
  address: IAddress;
}

export interface IHistory {
  readonly action: ORDER_HISTORY_ACTIONS;
  readonly status: ORDER_STATUS;
  readonly customer: string;
  readonly products: IProductFromOrder[];
  readonly total_price: number;
  readonly delivery: IDelivery | null;
  readonly changedOn: string;
  readonly performer: IManager;
  readonly assignedManager: IManager | null;
}

export interface ICommentFromResponse {
  readonly _id: string;
  readonly text: string;
  readonly createdOn: string;
}

export interface IManager {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: ROLES[];
  createdOn: string;
}
