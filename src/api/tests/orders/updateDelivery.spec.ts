import { expect } from 'fixtures/api-services.fixture';
import { generateDeliveryData } from 'data/orders/generateDeliveryData.data';
import {
  negativeTestCasesForDelivery,
  negativeTestCasesForDeliveryWithoutToken,
  positiveTestCasesForDelivery,
} from 'data/orders/updateDeliveryCases.data';
import { deliverySchema } from 'data/schemas/order.schema';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/testTags.data';
import { orderDraftStatus } from 'fixtures/ordersCustom.fixture';
import { generateUniqueId } from 'utils/generateUniqueID.utils';
import { validateResponse } from 'utils/validations/responseValidation';
import { validateSchema } from 'utils/validations/schemaValidation';

orderDraftStatus.describe('[API] [Orders] Update delivery', () => {
  let token = '';

  orderDraftStatus.beforeEach(async ({ signInApiService }) => {
    token = await signInApiService.loginAsLocalUser();
  });

  orderDraftStatus.describe('Positive', () => {
    positiveTestCasesForDelivery.forEach(({ name, data, expectedStatusCode, isSuccess, errorMessage }) => {
      orderDraftStatus(
        `Should update delivery: ${name}`,
        { tag: [TAGS.API, TAGS.ORDERS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ ordersController, orderDraftStatus }) => {
          const { id: orderId } = await orderDraftStatus();

          const response = await ordersController.updateDelivery(orderId, data, token);

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

  orderDraftStatus.describe('Negative', () => {
    negativeTestCasesForDelivery.forEach(({ name, data, expectedStatusCode, isSuccess, errorMessage }) => {
      orderDraftStatus(
        `Should NOT update delivery: ${name}`,
        { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
        async ({ ordersController, orderDraftStatus }) => {
          const { id: orderId } = await orderDraftStatus();

          const response = await ordersController.updateDelivery(orderId, data, token);

          validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
        },
      );
    });

    negativeTestCasesForDeliveryWithoutToken.forEach(({ name, data, invalidToken, expectedStatusCode, isSuccess, errorMessage }) => {
      orderDraftStatus(
        `Should NOT update delivery: ${name}`,
        { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
        async ({ ordersController, orderDraftStatus }) => {
          const { id: orderId } = await orderDraftStatus();

          const response = await ordersController.updateDelivery(orderId, data, invalidToken);

          validateResponse(response, expectedStatusCode, isSuccess, errorMessage);
        },
      );
    });

    orderDraftStatus(
      'Should NOT update delivery: For non-existent order check',
      { tag: [TAGS.API, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersController }) => {
        const id = generateUniqueId();
        const delivery = generateDeliveryData();

        const response = await ordersController.updateDelivery(id, delivery, token);

        validateResponse(response, STATUS_CODES.NOT_FOUND, false, `Order with id '${id}' wasn't found`);
      },
    );
  });
});
