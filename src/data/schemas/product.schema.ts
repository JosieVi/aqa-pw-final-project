import { MANUFACTURERS } from 'data/products/manufacturers.data';
import { baseSchemaPart, productsMetaSchema, sortingSchemaPart } from 'data/schemas/base.schema';

export const productSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    amount: {
      type: 'number',
    },
    price: {
      type: 'number',
    },
    manufacturer: {
      type: 'string',
      enum: Object.values(MANUFACTURERS),
    },
    createdOn: {
      type: 'string',
      format: 'date-time',
    },
    notes: {
      type: 'string',
    },
  },
  required: ['_id', 'name', 'amount', 'price', 'manufacturer', 'createdOn'],
  additionalProperties: false,
};

export const oneProductResponseSchema = {
  type: 'object',
  properties: {
    Product: {
      ...productSchema,
    },
    ...baseSchemaPart,
  },
  required: ['Product', 'isSuccess', 'errorMessage'],
};

export const allProductsResponseSchema = {
  type: 'object',
  properties: {
    Products: {
      type: 'array',
      items: productSchema,
    },
    ...baseSchemaPart,
  },
  required: ['Products', 'isSuccess', 'errorMessage'],
};

export const productsListSchema = {
  type: 'object',
  properties: {
    Customers: {
      type: 'array',
      items: productSchema,
    },
    sorting: {
      type: 'object',
      properties: sortingSchemaPart,
      required: ['sortField', 'sortOrder'],
    },
    ...productsMetaSchema,
    ...baseSchemaPart,
  },
  required: ['Products', 'sorting', 'isSuccess', 'errorMessage', 'total', 'page', 'limit', 'search', 'manufacturer'],
};

export const productInOrderSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    amount: {
      type: 'number',
    },
    price: {
      type: 'number',
    },
    manufacturer: {
      type: 'string',
      enum: Object.values(MANUFACTURERS),
    },
    received: {
      type: 'boolean',
    },
    notes: {
      type: 'string',
    },
  },
  required: ['_id', 'name', 'amount', 'price', 'manufacturer', 'received'],
  additionalProperties: false,
};

export const errorResponseSchema = {
  type: 'object',
  properties: {
    isSuccess: { type: 'boolean', const: false },
    errorMessage: { type: 'string' },
  },
  required: ['isSuccess', 'errorMessage'],
};
