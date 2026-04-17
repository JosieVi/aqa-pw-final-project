import { COUNTRIES } from 'data/customers/countries.data';
import { baseSchemaPart, customersMetaSchema, sortingSchemaPart } from 'data/schemas/base.schema';

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
