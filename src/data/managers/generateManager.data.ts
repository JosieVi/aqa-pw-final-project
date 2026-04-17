import { faker } from '@faker-js/faker';
import { ICreateManagerPayload } from 'types/manager.types';

export function generateManagerData(params?: Partial<ICreateManagerPayload>): ICreateManagerPayload {
  return {
    username: faker.string.alpha(10),
    password: faker.string.alpha(10),
    firstName: faker.string.alpha(10),
    lastName: faker.string.alpha(10),
    ...params,
  };
}
