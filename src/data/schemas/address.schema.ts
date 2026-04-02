import { COUNTRIES } from 'data/customers/countries.data';

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
