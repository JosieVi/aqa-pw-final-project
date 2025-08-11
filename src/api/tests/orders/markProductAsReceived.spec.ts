import { expect } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { orderSchema } from 'data/schemas/order.schema';
import { validateSchema } from 'utils/validations/schemaValidation';
import { validateResponse } from 'utils/validations/responseValidation';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { ORDER_HISTORY_ACTIONS } from '../../../data/orders/history.data';
import {
  orderCanceledStatus,
  orderDraftStatus,
  orderInProcessStatus,
  orderPartiallyReceivedStatus,
  orderReceivedStatus,
} from '../../../fixtures/ordersCustom.fixture';
import { generateUniqueId } from '../../../utils/generateUniqueID.utils';

orderInProcessStatus.describe('[API][Orders] Products Receipt - In Process Orders', () => {
  let token = '';

  orderInProcessStatus.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderInProcessStatus.describe('Positive cases', () => {
    orderInProcessStatus(
      'Should successfully mark all products as received - 200 OK',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ orderInProcessStatus, ordersController }) => {
        const { id: orderId, productsIds } = await orderInProcessStatus();
        const response = await ordersController.receiveProducts(orderId, productsIds, token);

        validateResponse(response, STATUS_CODES.OK, true, null);

        const updatedOrder = response.body.Order;
        validateSchema(orderSchema, updatedOrder);

        expect(updatedOrder._id).toBe(orderId);
        expect(updatedOrder.status).toBe(ORDER_STATUS.RECEIVED);

        updatedOrder.products.forEach((product) => {
          expect(product).toEqual(
            expect.objectContaining({
              received: true,
            }),
          );
        });

        const receiveEntry = updatedOrder.history?.find((entry) => entry.action === ORDER_HISTORY_ACTIONS.RECEIVED_ALL);
        expect(receiveEntry).toBeTruthy();
      },
    );

    orderInProcessStatus(
      'Should successfully mark one product as received - Partial Receipt',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderInProcessStatus, ordersController }) => {
        const { id: orderId, productsIds } = await orderInProcessStatus(2);
        const response = await ordersController.receiveProducts(orderId, [productsIds[0]], token);

        validateResponse(response, STATUS_CODES.OK, true, null);

        const partiallyUpdatedOrder = response.body.Order;
        validateSchema(orderSchema, partiallyUpdatedOrder);

        expect(partiallyUpdatedOrder._id).toBe(orderId);
        expect(partiallyUpdatedOrder.status).toBe(ORDER_STATUS.PARTIALLY_RECEIVED);

        const receivedProduct = partiallyUpdatedOrder.products.find((p) => p._id === productsIds[0]);
        expect(receivedProduct?.received).toBeTruthy();

        const notReceivedProduct = partiallyUpdatedOrder.products.find((p) => p._id === productsIds[1]);
        expect(notReceivedProduct?.received).toBeFalsy();

        const partialHistoryEntry = partiallyUpdatedOrder.history.find((entry) => entry.action === ORDER_HISTORY_ACTIONS.RECEIVED);
        expect(partialHistoryEntry).toBeTruthy();
        expect(partialHistoryEntry?.status).toBe(ORDER_STATUS.PARTIALLY_RECEIVED);
      },
    );

    orderInProcessStatus(
      'Should return error when products do not exist in order - 400 Bad Request',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ orderInProcessStatus, ordersController, ordersApiService }) => {
        const { id: orderId } = await orderInProcessStatus();

        const orderBefore = await ordersApiService.getOrderByID(orderId, token);
        expect(orderBefore.status).toBe(ORDER_STATUS.IN_PROCESS);

        const nonExistentProductId = generateUniqueId();
        const response = await ordersController.receiveProducts(orderId, [nonExistentProductId], token);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.PRODUCT_IS_NOT_REQUESTED_IN_ORDER(nonExistentProductId));
      },
    );

    orderInProcessStatus(
      'Should return 401 when using empty token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderInProcessStatus, ordersController }) => {
        const { id: orderId, productsIds } = await orderInProcessStatus();

        const response = await ordersController.receiveProducts(orderId, [productsIds[0]], '');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Not authorized');
      },
    );

    orderInProcessStatus(
      'Should return 401 when using invalid token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderInProcessStatus, ordersController }) => {
        const { id: orderId, productsIds } = await orderInProcessStatus();

        const response = await ordersController.receiveProducts(orderId, [productsIds[0]], 'Invalid access token');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, 'Invalid access token');
      },
    );
  });
});

orderPartiallyReceivedStatus.describe('[API][Orders] Products Receipt - Partially Received Orders', () => {
  let token = '';

  orderPartiallyReceivedStatus.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderPartiallyReceivedStatus(
    'Should successfully mark all products as received from Partially Received status - 200 OK',
    { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
    async ({ orderPartiallyReceivedStatus, ordersController }) => {
      const { id: orderId, productsIds } = await orderPartiallyReceivedStatus();

      const fullResponse = await ordersController.receiveProducts(orderId, productsIds, token);

      validateResponse(fullResponse, STATUS_CODES.OK, true, null);

      const fullyUpdatedOrder = fullResponse.body.Order;
      validateSchema(orderSchema, fullyUpdatedOrder);

      expect(fullyUpdatedOrder._id).toBe(orderId);
      expect(fullyUpdatedOrder.status).toBe(ORDER_STATUS.RECEIVED);

      fullyUpdatedOrder.products.forEach((product) => {
        expect(product.received).toBeTruthy();
      });

      const fullHistoryEntry = fullyUpdatedOrder.history.find((entry) => entry.action === ORDER_HISTORY_ACTIONS.RECEIVED_ALL);
      expect(fullHistoryEntry).toBeDefined();
      expect(fullHistoryEntry?.status).toBe(ORDER_STATUS.RECEIVED);
    },
  );
});

orderReceivedStatus.describe('[API][Orders] Products Receipt - Already Received Orders', () => {
  let token = '';

  orderReceivedStatus.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderReceivedStatus(
    'Should return error when trying to receive already received products - 400 Bad Request',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async ({ orderReceivedStatus, ordersController, ordersApiService }) => {
      const { id: orderId, productsIds } = await orderReceivedStatus();

      const orderBefore = await ordersApiService.getOrderByID(orderId, token);
      expect(orderBefore.status).toBe(ORDER_STATUS.RECEIVED);

      const response = await ordersController.receiveProducts(orderId, productsIds, token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
    },
  );
});

orderDraftStatus.describe('[API][Orders] Products Receipt - Draft Orders', () => {
  let token = '';

  orderDraftStatus.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderDraftStatus(
    'Should return error when trying to receive products for Draft order - 400 Bad Request',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async ({ orderDraftStatus, ordersController }) => {
      const { id: orderId, productsIds } = await orderDraftStatus();

      const response = await ordersController.receiveProducts(orderId, productsIds, token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
    },
  );
});

orderCanceledStatus.describe('[API][Orders] Products Receipt - Canceled Orders', () => {
  let token = '';

  orderCanceledStatus.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderCanceledStatus.skip(
    'Should return error when trying to receive products for Canceled order - 400 Bad Request',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async ({ orderCanceledStatus, ordersController }) => {
      const { id: orderId, productsIds } = await orderCanceledStatus();

      const response = await ordersController.receiveProducts(orderId, productsIds, token);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
    },
  );
});

orderInProcessStatus.describe('[API][Orders] Products Receipt - Edge Cases', () => {
  let token = '';

  orderInProcessStatus.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderInProcessStatus(
    'Should return error when order does not exist - 404 Not Found',
    { tag: [TAGS.API, TAGS.ORDERS] },
    async ({ ordersController }) => {
      const nonExistentOrderId = generateUniqueId();
      const anyProductIds = [generateUniqueId()];

      const response = await ordersController.receiveProducts(nonExistentOrderId, anyProductIds, token);

      validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.ORDER_NOT_FOUND);
    },
  );
});
