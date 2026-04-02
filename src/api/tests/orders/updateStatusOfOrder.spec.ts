import { expect, test } from 'fixtures/index.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { orderSchema } from 'data/schemas/order.schema';
import { validateSchema } from 'utils/validations/schemaValidation';
import { validateResponse } from 'utils/validations/responseValidation';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { ERROR_MESSAGES } from 'data/errorMessages';
import { ORDER_HISTORY_ACTIONS } from 'data/orders/history.data';
import { generateUniqueId } from 'utils/generateUniqueID.utils';

test.describe('[API][Orders] Draft - Canceled', () => {
  test.describe('Positive cases', () => {
    test(
      'Successful order status update from "Draft" to "Canceled"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ workerToken, orderFactory, ordersController }) => {
        const { _id: orderId } = await orderFactory.orderDraftStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.CANCELED, workerToken);

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

test.describe('[API][Orders] Draft with delivery - In Process Orders/Canceled', () => {
  test.describe('Positive cases', () => {
    test(
      'Successful order status update from "Draft with delivery" to "In Process"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ workerToken, orderFactory, ordersController }) => {
        const { _id: orderId } = await orderFactory.orderDraftWithDeliveryStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, workerToken);

        validateResponse(response, STATUS_CODES.OK, true, null);
        const updatedOrder = response.body.Order;
        validateSchema(orderSchema, updatedOrder);

        expect(updatedOrder._id, 'Order ID should not change during status update').toBe(orderId);

        // Check order history
        const processStartedEntry = updatedOrder.history.find((entry) => entry.action === ORDER_HISTORY_ACTIONS.PROCESSED);
        expect(processStartedEntry, 'History should contain process started entry').toBeTruthy();
      },
    );

    test(
      'Successful order status update from "Draft with delivery" to "Cancelled"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ workerToken, orderFactory, ordersController }) => {
        const { _id: orderId } = await orderFactory.orderDraftWithDeliveryStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.CANCELED, workerToken);

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

test.describe('[API][Orders] Canceled - Draft/In Process', () => {
  test.describe('Positive cases', () => {
    test(
      'Successful order status update from "Canceled" to "Draft"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ workerToken, orderFactory, ordersController }) => {
        const { _id: orderId } = await orderFactory.orderCanceledStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.DRAFT, workerToken);

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

  test.describe('Negative cases', () => {
    test(
      'Update status to In Process for Canceled order',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ workerToken, orderFactory, ordersController }) => {
        const { _id: orderId } = await orderFactory.orderCanceledStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, workerToken);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );
  });
});

test.describe('[API][Orders] In Process - Draft/Canceled/In Process/Partially Received/Received', () => {
  test.describe('Positive cases', () => {
    test(
      'Successful order status update from "Canceled" to "In Process"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ workerToken, orderFactory, ordersController }) => {
        const { _id: orderId } = await orderFactory.orderInProcessStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, workerToken);

        validateResponse(response, STATUS_CODES.OK, true, null);
        const updatedOrder = response.body.Order;
        validateSchema(orderSchema, updatedOrder);

        expect(updatedOrder._id, 'Order ID must remain constant').toBe(orderId);

        // Check order history
        const processStartedEntry = updatedOrder.history.find((entry) => entry.action === ORDER_HISTORY_ACTIONS.PROCESSED);
        expect(processStartedEntry, 'Process started should be recorded in history').toBeTruthy();
      },
    );

    test(
      'Successful order status update from "In Process" to "Canceled"',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE] },
      async ({ workerToken, orderFactory, ordersController }) => {
        const { _id: orderId } = await orderFactory.orderInProcessStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.CANCELED, workerToken);

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

  test.describe('Negative cases', () => {
    test('Update status to Draft for In Process order', { tag: [TAGS.API, TAGS.ORDERS] }, async ({ workerToken, orderFactory, ordersController }) => {
      const { _id: orderId } = await orderFactory.orderInProcessStatus();
      const response = await ordersController.updateStatus(orderId, ORDER_STATUS.DRAFT, workerToken);

      validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.CANT_REOPEN_ORDER);
    });

    test(
      'Update order status to "Received" from "In Process"',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ workerToken, orderFactory, ordersController }) => {
        const { _id: orderId } = await orderFactory.orderInProcessStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.RECEIVED, workerToken);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );

    test(
      'Update order status to "Partially Received" from "In Process"',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ workerToken, orderFactory, ordersController }) => {
        const { _id: orderId } = await orderFactory.orderInProcessStatus();
        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.PARTIALLY_RECEIVED, workerToken);

        validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
      },
    );

    test(
      'Should return error when order does not exist - 404 Bad Request',
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ workerToken, ordersController }) => {
        const nonExistentOrder = generateUniqueId();
        const response = await ordersController.updateStatus(nonExistentOrder, ORDER_STATUS.PARTIALLY_RECEIVED, workerToken);

        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.ORDER_NOT_FOUND_WITH_ID(nonExistentOrder));
      },
    );

    test(
      'Should return 401 when using invalid token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderFactory, ordersController }) => {
        const { _id: orderId } = await orderFactory.orderInProcessStatus();

        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.PARTIALLY_RECEIVED, 'Invalid access token');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );

    test(
      'Should return 401 when using empty token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderFactory, ordersController }) => {
        const { _id: orderId } = await orderFactory.orderInProcessStatus();

        const response = await ordersController.updateStatus(orderId, ORDER_STATUS.PARTIALLY_RECEIVED, '');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );
  });

  test.describe('[API][Orders] Partially Received - Received', () => {
    test.describe('Negative cases', () => {
      test(
        'Update order status to "Received" from "Partially Received"',
        { tag: [TAGS.API, TAGS.ORDERS] },
        async ({ workerToken, orderFactory, ordersController }) => {
          const { _id: orderId } = await orderFactory.orderPartiallyReceivedStatus();
          const response = await ordersController.updateStatus(orderId, ORDER_STATUS.RECEIVED, workerToken);

          validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
        },
      );
    });
  });

  test.describe('[API][Orders] Received - In Process', () => {
    test.describe('Negative cases', () => {
      test(
        'Update order status to "In Process" from "Received"',
        { tag: [TAGS.API, TAGS.ORDERS] },
        async ({ workerToken, orderFactory, ordersController }) => {
          const { _id: orderId } = await orderFactory.orderReceivedStatus();
          const response = await ordersController.updateStatus(orderId, ORDER_STATUS.IN_PROCESS, workerToken);

          validateResponse(response, STATUS_CODES.BAD_REQUEST, false, ERROR_MESSAGES.INVALID_ORDER_STATUS);
        },
      );
    });
  });
});
