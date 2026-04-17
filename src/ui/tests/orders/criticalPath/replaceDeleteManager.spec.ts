import { NOTIFICATION } from 'data/orders/notification.data';
import { TOASTER } from 'data/orders/toaster.data';
import { TAGS } from 'data/testTags.data';
import { expect, test } from 'fixtures/index.fixture';

test.describe('[UI] [Orders] [Orders Details] [Edit Products] Replace/delete assigned manager', () => {
  let orderId: string;
  let managerFullName: string;

  test.beforeEach(async ({ homeUIService, ordersPage, orderDetailsPage, orderFactory }) => {
    const result = await orderFactory.orderManagerAssignedStatus(1);
    orderId = result._id;

    managerFullName = `Admin Admin`;

    await homeUIService.openAsLoggedInUser();
    await homeUIService.openModule('Orders');

    await ordersPage.clickDetailsButton(orderId);
    await orderDetailsPage.waitForOpened();
  });

  test('Replace assigned manager', { tag: [TAGS.ORDERS] }, async ({ orderDetailsPage, ordersPage, notificationsModal }) => {
    await orderDetailsPage.topPanel.clickEditAssignedManagerButton();
    await orderDetailsPage.waitForOpened();

    await orderDetailsPage.editAssignedManagerInOrderModal.clickManagerListItem(managerFullName);
    await orderDetailsPage.editAssignedManagerInOrderModal.clickSaveButton();

    await orderDetailsPage.waitForNotification(TOASTER.MANAGER_SUCCESSFULLY_ASSIGNED);

    await expect(orderDetailsPage.editAssignedManagerInOrderModal.modalContainer).toBeHidden();

    const updatedAssignedManager = await orderDetailsPage.topPanel.getAssignedManagerName();
    await expect.soft(updatedAssignedManager, 'Manager name is incorrect').toBe(managerFullName);

    await ordersPage.clickOpenNotifications();
    await notificationsModal.waitForSpinner();
    const notificationText = await notificationsModal.getNotificationText(0);
    await expect(notificationText, 'Notification text is incorrect').toBe(NOTIFICATION.MANAGER_ASSIGNED);
  });

  test('Delete assigned manager', { tag: [TAGS.ORDERS] }, async ({ orderDetailsPage, confirmationModal }) => {
    await orderDetailsPage.topPanel.clickRemoveAssignedManagerButton();
    await orderDetailsPage.waitForOpened();

    await confirmationModal.clickConfirmButton();
    await orderDetailsPage.waitForSpinner();

    await orderDetailsPage.waitForNotification(TOASTER.MANAGER_SUCCESSFULLY_UNASSIGNED);

    await expect(orderDetailsPage.topPanel.assignManagerButton, '"Click to select manager" button is not displayed').toBeVisible();
  });
});
