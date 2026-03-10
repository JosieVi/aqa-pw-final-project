import { STATUS_CODES } from 'data/statusCodes';
import { generateProductData } from './generateProduct.data';
import { MANUFACTURERS } from './manufacturers.data';
import { faker } from '@faker-js/faker';

export const positiveCreateCustomerCases = [
  {
    name: 'Full valid data',
    data: generateProductData(),
  },
  {
    name: 'Without notes field',
    data: generateProductData({ notes: undefined }),
  },
  {
    name: '3-char name',
    data: generateProductData({
      name: faker.string.alpha({ length: 3, casing: 'mixed' }),
    }),
  },
  {
    name: '40-char name',
    data: generateProductData({
      name: `${faker.string.alpha({ length: 10, casing: 'mixed' })} ${faker.string.alpha({ length: 29, casing: 'mixed' })}`,
    }),
  },
  {
    name: 'Amount = 0',
    data: generateProductData({ amount: 0 }),
  },
  {
    name: 'Amount = 999',
    data: generateProductData({ amount: 999 }),
  },
  {
    name: 'Price = 1',
    data: generateProductData({ price: 1 }),
  },
  {
    name: 'Price = 99999',
    data: generateProductData({ price: 99999 }),
  },
  {
    name: '250-char notes',
    data: generateProductData({ notes: 'J'.repeat(250) }),
  },
  {
    name: 'Extra unknown field',
    data: {
      ...generateProductData(),
      extraField: 'should be ignored',
    },
  },
];

export const negativeCreateCustomerCase = [
  {
    name: 'Missing auth token',
    data: generateProductData(),
    expectedError: 'Not authorized',
    token: '',
    expectedStatusCode: STATUS_CODES.UNAUTHORIZED,
  },
  {
    name: 'Invalid auth token',
    data: generateProductData(),
    expectedError: 'Invalid access token',
    token: 'invalid_token',
    expectedStatusCode: STATUS_CODES.UNAUTHORIZED,
  },
  {
    name: 'Empty name',
    data: generateProductData({ name: '' }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Name contains @',
    data: generateProductData({ name: 'Julylljjll@' }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Name too long (41 chars)',
    data: generateProductData({ name: `${'A'.repeat(30)} ${'A'.repeat(10)}` }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Name too short (1 char)',
    data: generateProductData({ name: 'J' }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Name with 2 spaces',
    data: generateProductData({ name: 'Jul  Eri' }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Manufacturer is not from the suggested list',
    data: generateProductData({
      manufacturer: 'Ripple' as unknown as MANUFACTURERS,
    }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Invalid price (price = 0)',
    data: generateProductData({ price: 0 }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Price contains a negative number (price = -1)',
    data: generateProductData({ price: -2 }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Price exceeds upper limit',
    data: generateProductData({ price: 1000000 }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Price contains a non-integer number (price = 5.6)',
    data: generateProductData({ price: 5.6 }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Amount contains a negative number (amount = -1)',
    data: generateProductData({ amount: -1 }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Amount exceeds upper limit',
    data: generateProductData({ amount: 1000 }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Amount contains a non-integer number (amount = 5.6)',
    data: generateProductData({ amount: 5.6 }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Notes contain < >',
    data: generateProductData({ notes: 'This note contains <script>' }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Notes exceed max length (251 chars)',
    data: generateProductData({ notes: 'A'.repeat(251) }),
    expectedError: 'Incorrect request body',
  },
  {
    name: 'Amount is a string',
    data: {
      ...generateProductData(),
      amount: 'not-a-number' as unknown as number,
    },
    expectedError: 'Incorrect request body',
  },
];
