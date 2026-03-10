import { APIRequestContext, test as base } from '@playwright/test';
import { SignInController } from 'api/controllers/signIn.controller';
import { CustomersController } from 'api/controllers/customer.controller';
import { ProductsController } from 'api/controllers/product.controller';
import { OrdersController } from 'api/controllers/order.controller';

type ControllerConstructor<T> = new (request: APIRequestContext) => T;

const useController =
  <T>(Ctor: ControllerConstructor<T>) =>
  async ({ request }: { request: APIRequestContext }, use: (inst: T) => Promise<void>) => {
    await use(new Ctor(request));
  };

interface ISalesPortalControllers {
  signInController: SignInController;
  customersController: CustomersController;
  productsController: ProductsController;
  ordersController: OrdersController;
}

export const test = base.extend<ISalesPortalControllers>({
  signInController: useController(SignInController),
  customersController: useController(CustomersController),
  productsController: useController(ProductsController),
  ordersController: useController(OrdersController),
});

export { expect } from '@playwright/test';
