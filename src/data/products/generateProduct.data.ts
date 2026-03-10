import { faker } from '@faker-js/faker';
import { IProductPayload } from 'types/product.types';
import { getRandromEnumValue } from 'utils/enum.utils';
import { MANUFACTURERS } from 'data/products/manufacturers.data';

export function generateProductData(params?: Partial<IProductPayload>): IProductPayload {
  return {
    name: `Test ${faker.string.alpha({ length: 10, casing: 'mixed' })}`,
    manufacturer: getRandromEnumValue(MANUFACTURERS),
    price: faker.number.int({ min: 1, max: 99999 }),
    amount: faker.number.int({ min: 0, max: 999 }),
    notes: `Notes ${faker.string.alpha({ length: 10 })}`,
    ...params,
  };
}
