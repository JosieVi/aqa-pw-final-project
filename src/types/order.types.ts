import { IResponseFields, OrdersSortField, SortDirection } from 'types/api.types';
import { ICustomerEntity } from 'types/customer.types';
import { IProductPayload } from 'types/product.types';
import { COUNTRIES } from 'data/customers/countries.data';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { DELIVERY, LOCATION } from 'data/orders/delivery.data';
import { ORDER_HISTORY_ACTIONS } from 'data/orders/history.data';
import { ROLES } from 'data/orders/roles.data';

export interface IOrderExtraction {
  orderId: string;
  productsIds: string[];
  customerId: string;
}

export interface IOrderFactory {
  orderDraftStatus: (totalProducts?: number, existingCustomerId?: string) => Promise<IOrder>;
  orderInProcessStatus: (totalProducts?: number) => Promise<IOrder>;
  orderPartiallyReceivedStatus: (receivedProductsCount?: number, countInOrder?: number) => Promise<IOrder>;
  orderReceivedStatus: (totalProducts?: number) => Promise<IOrder>;
  orderCanceledStatus: (totalProducts?: number) => Promise<IOrder>;
  orderCanceledAndReopenedStatus: (totalProducts?: number) => Promise<IOrder>;
  orderDraftWithDeliveryStatus: (totalProducts?: number) => Promise<IOrder>;
  orderManagerAssignedStatus: (totalProducts?: number, managerId?: string) => Promise<IOrder>;

  multipleDraftOrders: (params?: MultipleOrdersParams) => Promise<IOrder[]>;
  customerWithMultipleOrders: (params?: CustomerMultipleOrdersParams) => Promise<{
    customer: ICustomerEntity;
    orders: IOrder[];
  }>;
}

export type MultipleOrdersParams = {
  totalOrders?: number;
  totalProducts?: number;
  existingCustomerId?: string;
};

export type CustomerMultipleOrdersParams = {
  totalOrders?: number;
  totalProducts?: number;
};

export interface ICustomOrder {
  orderFactory: IOrderFactory;
}

// ===== Запросы =====
export interface IOrderFilterParams {
  search?: string;
  status?: ORDER_STATUS[];
  sortField?: OrdersSortField;
  sortOrder?: SortDirection;
}

export interface IAddCommentRequest {
  comment: string;
}

// ===== Ответы =====
export interface IOrderResponse extends IResponseFields {
  Order: IOrder;
}

export interface IOrderListResponse extends IResponseFields {
  Orders: IOrder[];
}

export interface IOrderSearchResponse extends IResponseFields {
  Orders: IOrder[];
  total: number;
  page: number;
  limit: number;
  search: string;
  status: ORDER_STATUS[];
  sorting: {
    sortField: OrdersSortField;
    sortOrder: SortDirection;
  };
}

// ===== Основные сущности =====
export interface IOrderPayload {
  customer: string;
  products: string[];
}

// export interface IOrderDataWithId extends IOrderPayload {
//   _id: string;
// }

export interface IOrder {
  readonly _id: string;
  readonly status: ORDER_STATUS;
  readonly customer: ICustomerEntity;
  // "customer": "69a9ffa69ead50d82422182b"
  readonly products: IProductFromOrder[];
  readonly delivery: IDelivery | null;
  readonly total_price: number;
  // total_price?: number;
  readonly createdOn: string;
  readonly history: IHistory[];
  readonly comments: IComment[];
  readonly assignedManager: IManager | null;
}

// export interface IOrder extends IOrder {
//   readonly _id: string;
// }

// ===== Подсущности =====
export interface IProductFromOrder extends IProductPayload {
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

export interface IComment {
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
