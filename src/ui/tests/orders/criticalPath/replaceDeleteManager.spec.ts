import { MOCK_MANAGER_NASTYA } from 'data/orders/mockOrders.data';
import { NOTIFICATION } from 'data/orders/notification.data';
import { TOASTER } from 'data/orders/toaster.data';
import { TAGS } from 'data/testTags.data';
import { expect, test } from 'fixtures/ordersCustom.fixture';

test.describe('[UI] [Orders] [Orders Details] [Edit Products] Replace/delete assigned manager', () => {
  let orderId: string;
  let managerUsername: string;
  let managerFirstName: string;
  let managerLastName: string;

  test.beforeEach(async ({ homeUIService, ordersPage, orderDetailsPage, signInApiService, ordersApiService }) => {
    const token = await signInApiService.loginAsLocalUser();
    const result = await ordersApiService.createManagerAssignedOrder(1, token);
    orderId = result._id;

    managerUsername = MOCK_MANAGER_NASTYA.username;
    managerFirstName = MOCK_MANAGER_NASTYA.firstName;
    managerLastName = MOCK_MANAGER_NASTYA.lastName;

    await homeUIService.openAsLoggedInUser();
    await homeUIService.openModule('Orders');

    await ordersPage.clickDetailsButton(orderId);
    await orderDetailsPage.waitForOpened();
  });

  test('Replace assigned manager', { tag: [TAGS.ORDERS] }, async ({ orderDetailsPage, ordersPage, notificationsModal }) => {
    //открываем модалку изменения менеджера
    await orderDetailsPage.topPanel.clickEditAssignedManagerButton();
    await orderDetailsPage.waitForOpened();

    //выбираем отличного от назначнного
    await orderDetailsPage.editAssignedManagerInOrderModal.clickManagerListItem(managerUsername);
    await orderDetailsPage.editAssignedManagerInOrderModal.clickSaveButton();
    await orderDetailsPage.waitForSpinner();

    //проверка всплывающего уведомления о назначении менелджера
    await orderDetailsPage.waitForNotification(TOASTER.MANAGER_SUCCESSFULLY_ASSIGNED);

    //проверка assigned manager в поле заказа
    const updatedAssignedManager = await orderDetailsPage.topPanel.getAssignedManagerName();
    await expect.soft(updatedAssignedManager, 'Manager name is incorrect').toBe(`${managerFirstName} ${managerLastName}`);

    //проверка уведомления в модалке уведомлений о назначении менеджером
    await ordersPage.clickOpenNotifications();
    const notificationText = await notificationsModal.getNotificationText(0);
    await expect(notificationText, 'Notification text is incorrect').toBe(NOTIFICATION.MANAGER_ASSIGNED);
  });

  test('Delete assigned manager', { tag: [TAGS.ORDERS] }, async ({ orderDetailsPage, confirmationModal }) => {
    //удаляем уже назначенного менеджера и ждем открытия модалки
    await orderDetailsPage.topPanel.clickRemoveAssignedManagerButton();
    await orderDetailsPage.waitForOpened();

    // подтверждаем удаление
    await confirmationModal.clickConfirmButton();
    await orderDetailsPage.waitForSpinner();

    //проверка всплывающего уведомления об удаление менелджера
    await orderDetailsPage.waitForNotification(TOASTER.MANAGER_SUCCESSFULLY_UNASSIGNED);

    //проверка что менеджер пропал из поля назначенный менеджер в заказе
    await expect(orderDetailsPage.topPanel.assignManagerButton, '"Click to select manager" button is not displayed').toBeVisible();
  });
});
