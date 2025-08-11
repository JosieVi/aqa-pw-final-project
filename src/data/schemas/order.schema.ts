import { DELIVERY } from 'data/orders/delivery.data';
import { ORDER_HISTORY_ACTIONS } from 'data/orders/history.data';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { productInOrderSchema } from './product.schema';
import { addressSchema, customerSchema } from './customer.schema';
import { ordersMetaSchema } from './base.schema';

export const commentSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    text: { type: 'string' },
    createdOn: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['_id', 'text', 'createdOn'],
};

export const deliverySchema = {
  type: 'object',
  properties: {
    finalDate: { type: 'string', format: 'date-time' },
    condition: {
      type: 'string',
      enum: Object.values(DELIVERY),
    },
    address: addressSchema,
  },
  required: ['finalDate', 'condition', 'address'],
};

export const orderHistorySchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: Object.values(ORDER_STATUS),
    },
    customer: { type: 'string' },
    products: {
      type: 'array',
      items: productInOrderSchema,
    },
    total_price: { type: 'number' },
    action: {
      type: 'string',
      enum: Object.values(ORDER_HISTORY_ACTIONS),
    },
    changedOn: { type: 'string' },
  },
  required: ['status', 'customer', 'products', 'total_price', 'action', 'changedOn'],
};

export const createOrderPayloadSchema = {
  type: 'object',
  properties: {
    customer: { type: 'string' },
    products: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['customer', 'products'],
};

export const orderReceiveSchema = {
  type: 'object',
  properties: {
    products: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['products'],
};

export const orderStatusUpdateSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: Object.values(ORDER_STATUS),
    },
  },
  required: ['status'],
};

export const orderSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    status: {
      type: 'string',
      enum: Object.values(ORDER_STATUS),
    },
    customer: customerSchema,
    products: {
      type: 'array',
      items: productInOrderSchema,
    },
    total_price: {
      type: 'number',
    },
    createdOn: {
      type: 'string',
      format: 'date-time',
    },
    delivery: { ...deliverySchema, nullable: true },
    comments: {
      type: 'array',
      items: commentSchema,
    },
    history: {
      type: 'array',
      items: orderHistorySchema,
    },
  },
  required: ['status', 'customer', 'products', 'total_price', 'createdOn'],
};

export const orderWithoutDeliverySchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    status: {
      type: 'string',
      enum: Object.values(ORDER_STATUS),
    },
    customer: customerSchema,
    products: {
      type: 'array',
      items: productInOrderSchema,
    },
    total_price: { type: 'number' },
    createdOn: {
      type: 'string',
      format: 'date-time',
    },
    delivery: {
      type: ['object', 'null'],
    },
    comments: {
      type: 'array',
      items: commentSchema,
    },
    history: {
      type: 'array',
      items: orderHistorySchema,
    },
  },
  required: ['status', 'customer', 'products', 'total_price', 'createdOn'],
};

export const createOrderResponseSchema = orderSchema;

export const getFilteredOrdersResponseSchema = {
  type: 'object',
  properties: {
    orders: {
      type: 'array',
      items: orderSchema,
    },
    meta: ordersMetaSchema,
  },
  required: ['orders', 'meta'],
};

export const getOrderByIDResponseSchema = orderSchema;

export const updateOrderResponseSchema = orderSchema;

export const deleteOrderResponseSchema = {};

export const assignManagerResponseSchema = orderSchema;

export const unassignManagerResponseSchema = orderSchema;

export const addCommentResponseSchema = orderSchema;

export const deleteCommentResponseSchema = {};

export const updateDeliveryResponseSchema = orderSchema;

export const receiveProductsResponseSchema = orderSchema;

export const updateStatusResponseSchema = orderSchema;
