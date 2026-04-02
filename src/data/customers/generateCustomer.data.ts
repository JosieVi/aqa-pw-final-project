import { faker } from '@faker-js/faker';
import { ICustomerPayload } from 'types/customer.types';
import { COUNTRIES } from 'data/customers/countries.data';
import { getRandromEnumValue } from 'utils/enum.utils';

export function generateCustomerData(params?: Partial<ICustomerPayload>): ICustomerPayload {
  const shortId = faker.string.alpha(4).toUpperCase();
  const prefix = 'test';

  return {
    email: `${prefix.toLowerCase()}${Date.now()}_${shortId}@example.com`,
    name: `${prefix} ${faker.string.alpha(35)}`,
    country: getRandromEnumValue(COUNTRIES),
    city: `${prefix}City ${faker.string.alpha(11)}`,
    street: `${prefix}Street ${faker.string.alphanumeric(29)}`,
    house: faker.number.int({ min: 1, max: 999 }),
    flat: faker.number.int({ min: 1, max: 9999 }),
    phone: `+${faker.number.int({ min: 1000000000, max: 9999999999 })}`,
    notes: `Notes ${faker.string.alpha(244)}`,
    ...params,
  };
}
