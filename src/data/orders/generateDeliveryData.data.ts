import { faker } from '@faker-js/faker';
import { COUNTRIES } from 'data/customers/countries.data';
import { IAddress, IDelivery } from 'types/orders.types';
import { DELIVERY } from './delivery.data';

export function generateDeliveryData(params?: { finalDate?: string; condition?: DELIVERY; address?: Partial<IAddress> }): IDelivery {
  const defaultAddress: IAddress = {
    country: faker.helpers.arrayElement(Object.values(COUNTRIES)),
    city: faker.location.city(),
    street: faker.location.street(),
    house: faker.number.int({ min: 1, max: 999 }),
    flat: faker.number.int({ min: 1, max: 9999 }),
  };

  return {
    finalDate: params?.finalDate ?? faker.date.future().toISOString().split('T')[0],
    condition: params?.condition ?? faker.helpers.arrayElement(Object.values(DELIVERY)),
    address: {
      ...defaultAddress,
      ...(params?.address || {}),
    },
  };
}
