import { expect } from 'fixtures/api-services.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { orderSchema } from 'data/schemas/order.schema';
import { validateSchema } from 'utils/validations/schemaValidation';
import { validateResponse } from 'utils/validations/responseValidation';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { ORDER_HISTORY_ACTIONS } from 'data/orders/history.data';
import {
  orderCanceledStatus,
  orderDraftStatus,
  orderDraftWithDeliveryStatus,
  orderInProcessStatus,
  orderPartiallyReceivedStatus,
  orderReceivedStatus,
} from 'fixtures/ordersCustom.fixture';
import { generateUniqueId } from 'utils/generateUniqueID.utils';

orderDraftStatus.describe('[API][Orders] Draft - Canceled', () => {
  let token = '';

  orderDraftStatus.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderDraftStatus.describe('Positive cases', () => {
    orderDraftStatus(
      'Successful order status update from "Draft" to "Canceled"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ orderDraftStatus, ordersController }) => {
        const { id: orderId } = await orderDraftStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.CANCELED, token);

        validateResponse(response, STATUS_CODES.OK, true, null);
        const updatedOrder = response.body.Order;
        validateSchema(orderSchema, updatedOrder);

        expect(updatedOrder._id, 'Order ID should remain the same after status update').toBe(orderId);

        // Check order history
        const processStartedEntry = updatedOrder.history.find((entry) => entry.action === ORDER_HISTORY_ACTIONS.CANCELED);
        expect(processStartedEntry, 'History should contain cancellation entry').toBeTruthy();
      },
    );
  });
});

orderDraftWithDeliveryStatus.describe('[API][Orders] Draft with delivery - In Process Orders/Canceled', () => {
  let token = '';

  orderDraftWithDeliveryStatus.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderDraftWithDeliveryStatus.describe('Positive cases', () => {
    orderDraftWithDeliveryStatus(
      'Successful order status update from "Draft with delivery" to "In Process"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ orderDraftWithDeliveryStatus, ordersController }) => {
        const { id: orderId } = await orderDraftWithDeliveryStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, token);

        validateResponse(response, STATUS_CODES.OK, true, null);
        const updatedOrder = response.body.Order;
        validateSchema(orderSchema, updatedOrder);

        expect(updatedOrder._id, 'Order ID should not change during status update').toBe(orderId);

        // Check order history
        const processStartedEntry = updatedOrder.history.find((entry) => entry.action === ORDER_HISTORY_ACTIONS.PROCESSED);
        expect(processStartedEntry, 'History should contain process started entry').toBeTruthy();
      },
    );

    orderDraftWithDeliveryStatus(
      'Successful order status update from "Draft with delivery" to "Cancelled"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ orderDraftWithDeliveryStatus, ordersController }) => {
        const { id: orderId } = await orderDraftWithDeliveryStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.CANCELED, token);

        validateResponse(response, STATUS_CODES.OK, true, null);
        const updatedOrder = response.body.Order;
        validateSchema(orderSchema, updatedOrder);

        expect(updatedOrder._id, 'Order ID should remain unchanged').toBe(orderId);

        // Check order history
        const processStartedEntry = updatedOrder.history.find((entry) => entry.action === ORDER_HISTORY_ACTIONS.CANCELED);
        expect(processStartedEntry, 'History should contain cancellation record').toBeTruthy();
      },
    );
  });
});

orderCanceledStatus.describe('[API][Orders] Canceled - Draft/In Process', () => {
  let token = '';

  orderCanceledStatus.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderCanceledStatus.describe('Positive cases', () => {
    orderCanceledStatus(
      'Successful order status update from "Canceled" to "Draft"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ orderCanceledStatus, ordersController }) => {
        const { id: orderId } = await orderCanceledStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.DRAFT, token);

        validateResponse(response, STATUS_CODES.OK, true, null);
        const updatedOrder = response.body.Order;
        validateSchema(orderSchema, updatedOrder);

        expect(updatedOrder._id, 'Order ID must stay the same after reopening').toBe(orderId);

        // Check order history
        const processStartedEntry = updatedOrder.history.find((entry) => entry.action === ORDER_HISTORY_ACTIONS.REOPENED);
        expect(processStartedEntry, 'History should contain reopening entry').toBeTruthy();
      },
    );
  });

  orderCanceledStatus.describe('Negative cases', () => {
    orderCanceledStatus(
      'Update status to In Process for Canceled order',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ orderCanceledStatus, ordersController }) => {
        const { id: orderId } = await orderCanceledStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, token);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );
  });
});

orderInProcessStatus.describe('[API][Orders] In Process - Draft/Canceled/In Process/Partially Received/Received', () => {
  let token = '';

  orderInProcessStatus.beforeAll(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderInProcessStatus.describe('Positive cases', () => {
    orderInProcessStatus(
      'Successful order status update from "Canceled" to "In Process"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ orderInProcessStatus, ordersController }) => {
        const { id: orderId } = await orderInProcessStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, token);

        validateResponse(response, STATUS_CODES.OK, true, null);
        const updatedOrder = response.body.Order;
        validateSchema(orderSchema, updatedOrder);

        expect(updatedOrder._id, 'Order ID must remain constant').toBe(orderId);

        // Check order history
        const processStartedEntry = updatedOrder.history.find((entry) => entry.action === ORDER_HISTORY_ACTIONS.PROCESSED);
        expect(processStartedEntry, 'Process started should be recorded in history').toBeTruthy();
      },
    );

    orderInProcessStatus(
      'Successful order status update from "In Process" to "Canceled"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ orderInProcessStatus, ordersController }) => {
        const { id: orderId } = await orderInProcessStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.CANCELED, token);

        validateResponse(response, STATUS_CODES.OK, true, null);
        const updatedOrder = response.body.Order;
        validateSchema(orderSchema, updatedOrder);

        expect(updatedOrder._id, 'Order ID should not change').toBe(orderId);

        // Check order history
        const processStartedEntry = updatedOrder.history.find((entry) => entry.action === ORDER_HISTORY_ACTIONS.CANCELED);
        expect(processStartedEntry, 'Cancellation should be recorded in history').toBeTruthy();
      },
    );
  });

  orderInProcessStatus.describe('Negative cases', () => {
    orderInProcessStatus(
      'Update status to Draft for In Process order',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ orderInProcessStatus, ordersController }) => {
        const { id: orderId } = await orderInProcessStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.DRAFT, token);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.CANT_REOPEN_ORDER);
      },
    );

    orderInProcessStatus(
      'Update order status to "Received" from "In Process"',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ orderInProcessStatus, ordersController }) => {
        const { id: orderId } = await orderInProcessStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.RECEIVED, token);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );

    orderInProcessStatus(
      'Update order status to "Partially Received" from "In Process"',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ orderInProcessStatus, ordersController }) => {
        const { id: orderId } = await orderInProcessStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.PARTIALLY_RECEIVED, token);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );

    orderInProcessStatus(
      'Should return error when order does not exist - 404 Bad Request',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ ordersController }) => {
        const nonExistentOrder = generateUniqueId();
        const response = await ordersController.updateStatus(nonExistentOrder, ORDER_STATUS.PARTIALLY_RECEIVED, token);

        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.ORDER_NOT_FOUND_WITH_ID(nonExistentOrder));
      },
    );

    orderInProcessStatus(
      'Should return 401 when using invalid token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderInProcessStatus, ordersController }) => {
        const { id: orderId } = await orderInProcessStatus();

        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.PARTIALLY_RECEIVED, 'Invalid access token');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );

    orderInProcessStatus(
      'Should return 401 when using empty token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderInProcessStatus, ordersController }) => {
        const { id: orderId } = await orderInProcessStatus();

        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.PARTIALLY_RECEIVED, '');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );
  });

  orderPartiallyReceivedStatus.describe('[API][Orders] Partially Received - Received', () => {
    let token = '';

    orderPartiallyReceivedStatus.beforeAll(async ({ signInApiService }) => {
      token = await signInApiService.loginAsLocalUser();
    });
    orderPartiallyReceivedStatus.describe('Negative cases', () => {
      orderPartiallyReceivedStatus(
        'Update order status to "Received" from "Partially Received"',
        { tag: [TAGS.API, TAGS.ORDERS] },
        async ({ orderPartiallyReceivedStatus, ordersController }) => {
          const { id: orderId } = await orderPartiallyReceivedStatus();
          const response = await ordersController.updateStatus(orderId, ORDER_STATUS.RECEIVED, token);

          validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
        },
      );
    });
  });

  orderReceivedStatus.describe('[API][Orders] Received - In Process', () => {
    let token = '';

    orderReceivedStatus.beforeAll(async ({ signInApiService }) => {
      token = await signInApiService.loginAsLocalUser();
    });
    orderReceivedStatus.describe('Negative cases', () => {
      orderReceivedStatus(
        'Update order status to "In Process" from "Received"',
        { tag: [TAGS.API, TAGS.ORDERS] },
        async ({ orderReceivedStatus, ordersController }) => {
          const { id: orderId } = await orderReceivedStatus();
          const response = await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, token);

          validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
        },
      );
    });
  });
});
