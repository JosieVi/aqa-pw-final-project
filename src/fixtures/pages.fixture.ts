import { test as base } from 'fixtures/mock.fixture';

import { HomePage } from 'ui/pages/home.page';
import { SignInPage } from 'ui/pages/signIn.page';
import { OrdersPage } from 'ui/pages/orders/orders.page';
import { ConfirmationModal } from 'ui/pages/modals/orders/confirmationModal.page';
import { OrderDetailsPage } from 'ui/pages/orders/orderDetails.page';
import { CreateOrderModal } from 'ui/pages/modals/orders/createOrderModal.page';
import { EditCustomerModalPage } from 'ui/pages/modals/orders/editCustomerModal.page';

import { FiltersModal } from 'ui/pages/modals/orders/orderListFilter.page';
import { SelectManagerModal } from 'ui/pages/modals/orders/selectManagerModal.page';
import { EditOrderModal } from 'ui/pages/modals/orders/editProductsInOrderModal.page';
import { ScheduleDeliveryPage } from 'ui/pages/scheduleDelivery.page';
import { EditDeliveryPage } from 'ui/pages/editDelivery.page';
import { NotificationsModal } from 'ui/pages/modals/orders/notificationModal.page';

interface ISalesPortalPages {
  homePage: HomePage;
  signInPage: SignInPage;
  ordersPage: OrdersPage;
  orderDetailsPage: OrderDetailsPage;
  confirmationModal: ConfirmationModal;
  createOrderModal: CreateOrderModal;
  editCustomerModalPage: EditCustomerModalPage;
  editOrderModal: EditOrderModal;
  filtersModal: FiltersModal;
  selectManagerModal: SelectManagerModal;
  scheduleDeliveryPage: ScheduleDeliveryPage;
  editDeliveryPage: EditDeliveryPage;
  notificationsModal: NotificationsModal;
}

export const test = base.extend<ISalesPortalPages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },

  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },

  orderDetailsPage: async ({ page }, use) => {
    await use(new OrderDetailsPage(page));
  },

  confirmationModal: async ({ page }, use) => {
    await use(new ConfirmationModal(page));
  },

  createOrderModal: async ({ page }, use) => {
    await use(new CreateOrderModal(page));
  },

  editCustomerModalPage: async ({ page }, use) => {
    await use(new EditCustomerModalPage(page));
  },

  editOrderModal: async ({ page }, use) => {
    await use(new EditOrderModal(page));
  },

  filtersModal: async ({ page }, use) => {
    await use(new FiltersModal(page));
  },

  selectManagerModal: async ({ page }, use) => {
    await use(new SelectManagerModal(page));
  },
  scheduleDeliveryPage: async ({ page }, use) => {
    await use(new ScheduleDeliveryPage(page));
  },
  editDeliveryPage: async ({ page }, use) => {
    await use(new EditDeliveryPage(page));
  },

  notificationsModal: async ({ page }, use) => {
    await use(new NotificationsModal(page));
  },
});

export { expect } from '@playwright/test';
