import { generateDeliveryData } from 'data/orders/generateDeliveryData.data';
import {
  negativeTestCasesForDelivery,
  negativeTestCasesForDeliveryWithoutToken,
  positiveTestCasesForDelivery,
} from 'data/orders/updateDeliveryCases.data';
import { deliverySchema } from 'data/schemas/order.schema';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { test, expect } from 'fixtures/index.fixture';
import { generateUniqueId } from 'utils/generateUniqueID.utils';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';

test.describe('[API] [Orders] Update delivery', () => {
  test.describe('Positive', () => {
    positiveTestCasesForDelivery.forEach(({ name, data, expectedStatusCode, isSuccess, errorMessage }) => {
      test(
        `Should update delivery: ${name}`,
        { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ workerToken, ordersController, orderFactory }) => {
          const order = await orderFactory.orderDraftStatus();
          const orderId = order._id;

          const response = await ordersController.updateDelivery(orderId, data, workerToken);

          validateResponse(response, expectedStatusCode, isSuccess, errorMessage);

          await validateSchema(deliverySchema, response.body.Order.delivery!);

          const expectedDelivery = {
            ...data,
            finalDate: new Date(data.finalDate).toISOString(),
          };
          expect(response.body.Order.delivery).toMatchObject(expectedDelivery as unknown as Record<string, unknown>);
        },
      );
    });
  });

  test.describe('Negative', () => {
    negativeTestCasesForDelivery.forEach(({ name, data, expectedStatusCode, isSuccess, errorMessage }) => {
      test(
        `Should NOT update delivery: ${name}`,
        { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
        async ({ workerToken, ordersController, orderFactory }) => {
          const order = await orderFactory.orderDraftStatus();
          const orderId = order._id;

          const response = await ordersController.updateDelivery(orderId, data, workerToken);

          validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
        },
      );
    });

    negativeTestCasesForDeliveryWithoutToken.forEach(({ name, data, invalidToken, expectedStatusCode, isSuccess, errorMessage }) => {
      test(`Should NOT update delivery: ${name}`, { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] }, async ({ ordersController, orderFactory }) => {
        const order = await orderFactory.orderDraftStatus();
        const orderId = order._id;

        const response = await ordersController.updateDelivery(orderId, data, invalidToken);

        validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
      });
    });

    test(
      'Should NOT update delivery: For non-existent order check',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ workerToken, ordersController }) => {
        const id = generateUniqueId();
        const delivery = generateDeliveryData();

        const response = await ordersController.updateDelivery(id, delivery, workerToken);

        validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Order with id '${id}' wasn't found`);
      },
    );
  });
});
