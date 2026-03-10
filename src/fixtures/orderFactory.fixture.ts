import { mergeTests } from '@playwright/test';
import { test as customerTest } from './customerFactory.fixture';
import { test as productTest } from './productFactory.fixture';
import { CustomerMultipleOrdersParams, IOrderPayload, ICustomOrder, IOrder, MultipleOrdersParams } from '../types/order.types';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { generateDeliveryData } from 'data/orders/generateDeliveryData.data';
import { MOCK_MANAGER_OLGA } from 'data/orders/mockOrders.data';
const baseTest = mergeTests(customerTest, productTest);

export const test = baseTest.extend<ICustomOrder>({
  orderFactory: async ({ signInApiService, ordersApiService, customerFactory, productFactory, dataDisposalUtils }, use) => {
    const token = await signInApiService.loginAsLocalUser();

    const createDraftOrder = async (totalProducts = 1, existingCustomerId?: string): Promise<IOrder> => {
      const customerId = existingCustomerId || (await customerFactory.singleCustomer())._id;
      const productsIds = await productFactory.multipleProductsIds(totalProducts);

      const orderData: IOrderPayload = {
        customer: customerId,
        products: productsIds,
      };

      const draftOrder = await ordersApiService.create(orderData, token);

      dataDisposalUtils.trackOrder(draftOrder._id);

      return draftOrder;
    };

    const createInProcessOrder = async (totalProducts = 1): Promise<IOrder> => {
      const draftOrder = await createDraftOrder(totalProducts);

      const deliveryData = generateDeliveryData();
      const orderWithDelivery = await ordersApiService.updateDelivery(draftOrder._id, deliveryData, token);

      const inProcessOrder = await ordersApiService.updateStatus(orderWithDelivery._id, ORDER_STATUS.IN_PROCESS, token);

      return inProcessOrder;
    };

    const createPartiallyReceivedOrder = async (receivedProductsCount: number = 1, countInOrder: number = 3) => {
      const inProcessOrder = await createInProcessOrder(countInOrder);

      const receivedProductsId = inProcessOrder.products.slice(0, receivedProductsCount).map((p) => p._id);

      const partiallyReceivedOrder = await ordersApiService.receiveProducts(inProcessOrder._id, receivedProductsId, token);

      return partiallyReceivedOrder;
    };

    const createReceivedOrder = async (totalProducts: number = 3) => {
      const inProcessOrder = await createInProcessOrder(totalProducts);

      const allProductIds = inProcessOrder.products.map((p) => p._id);

      const receivedOrder = await ordersApiService.receiveProducts(inProcessOrder._id, allProductIds, token);

      return receivedOrder;
    };

    const createCanceledOrder = async (totalProducts: number = 1) => {
      const draftOrder = await createDraftOrder(totalProducts);

      const canceledOrder = await ordersApiService.updateStatus(draftOrder._id, ORDER_STATUS.CANCELED, token);

      return canceledOrder;
    };

    const createCanceledAndReopenedOrder = async (totalProducts: number = 1) => {
      const draftOrder = await createDraftOrder(totalProducts);

      const canceledOrder = await ordersApiService.updateStatus(draftOrder._id, ORDER_STATUS.CANCELED, token);

      const reopenedOrder = await ordersApiService.updateStatus(canceledOrder._id, ORDER_STATUS.DRAFT, token);

      return reopenedOrder;
    };

    const createDraftOrderWithDelivery = async (totalProducts: number = 1) => {
      const draftOrder = await createDraftOrder(totalProducts);

      const deliveryData = generateDeliveryData();

      const draftOrderWithDelivery = await ordersApiService.updateDelivery(draftOrder._id, deliveryData, token);

      return draftOrderWithDelivery;
    };

    const createManagerAssignedOrder = async (totalProducts: number = 1, managerId: string = MOCK_MANAGER_OLGA._id) => {
      const draftOrder = await createDraftOrder(totalProducts);

      const assignedOrder = await ordersApiService.assignManager(draftOrder._id, managerId, token);

      return assignedOrder;
    };

    const createMultipleDraftOrders = async ({ totalOrders = 3, totalProducts = 1, existingCustomerId }: MultipleOrdersParams = {}) => {
      const draftOrders = await Promise.all(Array.from({ length: totalOrders }, () => createDraftOrder(totalProducts, existingCustomerId)));
      return draftOrders;
    };

    const createCustomerWithMultipleOrders = async ({ totalOrders = 3, totalProducts = 3 }: CustomerMultipleOrdersParams = {}) => {
      const customer = await customerFactory.singleCustomer();
      const orders = await createMultipleDraftOrders({ totalOrders, totalProducts, existingCustomerId: customer._id });
      return { customer, orders };
    };
    await use({
      orderDraftStatus: createDraftOrder,
      orderInProcessStatus: createInProcessOrder,
      orderPartiallyReceivedStatus: createPartiallyReceivedOrder,
      orderReceivedStatus: createReceivedOrder,
      orderCanceledStatus: createCanceledOrder,
      orderCanceledAndReopenedStatus: createCanceledAndReopenedOrder,
      orderDraftWithDeliveryStatus: createDraftOrderWithDelivery,
      orderManagerAssignedStatus: createManagerAssignedOrder,
      multipleDraftOrders: createMultipleDraftOrders,
      customerWithMultipleOrders: createCustomerWithMultipleOrders,
    });
  },
});

export { expect } from '@playwright/test';
