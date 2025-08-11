import { ICreateOrderData } from '../fixtures/ordersCustom.fixture';
import { IOrderFromResponse } from '../types/orders.types';

export const extractIds = <T extends { _id: string }>(item: T[]): string[] => item.map((i) => i?._id ?? false).filter(Boolean) as string[];

export const extractTestData = (order: IOrderFromResponse): ICreateOrderData => ({
  id: order._id,
  productsIds: extractIds(order.products),
  customerId: order.customer._id,
});
