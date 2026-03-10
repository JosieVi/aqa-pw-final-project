import { IOrderExtraction } from '../types/order.types';
import { IOrder } from '../types/order.types';

export const extractIds = <T extends { _id: string }>(item: T[]): string[] => item.map((i) => i?._id ?? false).filter(Boolean) as string[];

export const extractDataFromOrder = (order: IOrder): IOrderExtraction => ({
  orderId: order._id,
  productsIds: extractIds(order.products),
  customerId: order.customer._id,
});
