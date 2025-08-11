import { expect } from 'fixtures/api-services.fixture';
import { assignManagerResponseSchema, unassignManagerResponseSchema } from 'data/schemas/order.schema';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { orderDraftStatus } from 'fixtures/ordersCustom.fixture';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';
import { ERROR_MESSAGES } from 'data/errorMessages';

orderDraftStatus.describe('[API] [Orders] Assign manager', () => {
  let token = '';
  const managerId = '680795ced006ba3d475fca1f';

  orderDraftStatus.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderDraftStatus.describe('Positive', () => {
    orderDraftStatus(
      `Should assign manager`,
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ ordersController, orderDraftStatus }) => {
        const { id: orderId } = await orderDraftStatus();

        const response = await ordersController.assignManager(orderId, managerId, token);

        validateResponse(response, STATUS_CODES.OK, true, null);
        const assignedOrder = response.body.Order;

        await validateSchema(assignManagerResponseSchema, assignedOrder);

        expect(assignedOrder.assignedManager?._id).toBe(managerId);
      },
    );
  });

  orderDraftStatus.describe('Negative', () => {
    orderDraftStatus(
      'Should return 401 when using invalid token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderDraftStatus, ordersController }) => {
        const { id: orderId } = await orderDraftStatus();
        const response = await ordersController.assignManager(orderId, managerId, 'Invalid access token');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );
  });
  orderDraftStatus.describe('Negative', () => {
    orderDraftStatus(
      'Should return 401 when using empty token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderDraftStatus, ordersController }) => {
        const { id: orderId } = await orderDraftStatus();
        const response = await ordersController.assignManager(orderId, managerId, '');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );
  });
  orderDraftStatus.describe('Negative', () => {
    orderDraftStatus(
      'Should return 404 when invalid Manager id',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderDraftStatus, ordersController }) => {
        const { id: orderId } = await orderDraftStatus();
        const invalidManagerId = '000000000000000000000000';
        const response = await ordersController.assignManager(orderId, invalidManagerId, token);

        validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.MANAGER_NOT_FOUND(invalidManagerId));
      },
    );
  });
});

orderDraftStatus.describe('[API] [Orders] Unassign manager', () => {
  let token = '';
  const managerId = '680795ced006ba3d475fca1f';

  orderDraftStatus.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderDraftStatus.describe('Positive', () => {
    orderDraftStatus(
      `Should unassign manager`,
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
      async ({ ordersController, orderDraftStatus }) => {
        const { id: orderId } = await orderDraftStatus();

        await ordersController.assignManager(orderId, managerId, token);

        const response = await ordersController.unassignManager(orderId, token);

        validateResponse(response, STATUS_CODES.OK, true, null);

        const unAssignedOrder = response.body.Order;

        await validateSchema(unassignManagerResponseSchema, unAssignedOrder);

        expect(unAssignedOrder._id).toBe(orderId);
        expect(unAssignedOrder.assignedManager).toBe(null);
      },
    );
  });
  orderDraftStatus.describe('Negative', () => {
    orderDraftStatus(
      'Should return 401 when using invalid token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderDraftStatus, ordersController }) => {
        const { id: orderId } = await orderDraftStatus();
        const response = await ordersController.unassignManager(orderId, 'Invalid access token');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
      },
    );
  });
  orderDraftStatus.describe('Negative', () => {
    orderDraftStatus(
      'Should return 401 when using empty token',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ orderDraftStatus, ordersController }) => {
        const { id: orderId } = await orderDraftStatus();
        const response = await ordersController.unassignManager(orderId, '');

        validateResponse(response, STATUS_CODES.UNAUTHORIZED, false, ERROR_MESSAGES.NOT_AUTHORIZED);
      },
    );
  });
  orderDraftStatus.describe('Negative', () => {
    orderDraftStatus('Should return 404 when invalid order id', { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController }) => {
      const invalidOrderId = '000000000000000000000000';
      const response = await ordersController.unassignManager(invalidOrderId, token);

      validateResponse(response, STATUS_CODES.NOT_FOUND, false, ERROR_MESSAGES.ORDER_NOT_FOUND_WITH_ID(invalidOrderId));
    });
  });
});
