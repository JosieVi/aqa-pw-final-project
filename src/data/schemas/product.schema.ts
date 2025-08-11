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
  required: ['Product', 'IsSuccess', 'ErrorMessage'],
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
  required: ['Products', 'IsSuccess', 'ErrorMessage'],
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
  required: ['Products', 'sorting', 'IsSuccess', 'ErrorMessage', 'total', 'page', 'limit', 'search', 'manufacturer'],
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
    IsSuccess: { type: 'boolean', const: false },
    ErrorMessage: { type: 'string' },
  },
  required: ['IsSuccess', 'ErrorMessage'],
};
