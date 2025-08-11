import { COUNTRIES } from 'data/customers/countries.data';
import { baseSchemaPart, customersMetaSchema, sortingSchemaPart } from 'data/schemas/base.schema';
import { productInOrderSchema } from 'data/schemas/product.schema';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { commentSchema, deliverySchema, orderHistorySchema } from './order.schema';

export const customerSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    house: {
      type: 'number',
    },
    flat: {
      type: 'number',
    },
    street: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    country: {
      type: 'string',
      enum: Object.values(COUNTRIES),
    },
    createdOn: {
      type: 'string',
      format: 'date-time',
    },
    notes: {
      type: 'string',
    },
  },
  required: ['_id', 'email', 'name', 'country', 'street', 'city', 'createdOn', 'house', 'flat', 'phone'],
};

export const oneCustomerSchema = {
  type: 'object',
  properties: {
    Customer: {
      ...customerSchema,
    },
    ...baseSchemaPart,
  },
  required: ['Customer', 'IsSuccess', 'ErrorMessage'],
};

export const allCustomersResponseSchema = {
  type: 'object',
  properties: {
    Customers: {
      type: 'array',
      items: customerSchema,
    },
    ...baseSchemaPart,
  },
  required: ['Customers', 'IsSuccess', 'ErrorMessage'],
};

export const customersListSchema = {
  type: 'object',
  properties: {
    Customers: {
      type: 'array',
      items: customerSchema,
    },
    sorting: {
      type: 'object',
      properties: sortingSchemaPart,
      required: ['sortField', 'sortOrder'],
    },
    ...customersMetaSchema,
    ...baseSchemaPart,
  },
  required: ['Customers', 'sorting', 'IsSuccess', 'ErrorMessage', 'total', 'page', 'limit', 'search', 'country'],
};

export const addressSchema = {
  type: 'object',
  properties: {
    country: {
      type: 'string',
      enum: Object.values(COUNTRIES),
    },
    city: { type: 'string' },
    street: { type: 'string' },
    house: { type: 'number' },
    flat: { type: 'number' },
  },
  required: ['country', 'city', 'street', 'house', 'flat'],
};

export const customerAssociatedOrdersSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    status: {
      type: 'string',
      enum: Object.values(ORDER_STATUS),
    },
    customer: {
      type: 'string',
    },
    customerSchema,
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
      anyOf: [deliverySchema, { type: 'null' }],
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
  required: ['_id', 'status', 'customer', 'products', 'total_price', 'createdOn'],
};

export const orderListSchema = {
  type: 'array',
  items: customerAssociatedOrdersSchema,
};
