import { BaseModal } from '../baseModal.page';
import { logStep } from 'utils/reporter.utils';

export class NotificationsModal extends BaseModal {
  private readonly modalContainer = this.page.locator('#notification-popover');

  // Основные элементы модального окна
  readonly modalTitle = this.modalContainer.locator('.card-header span.fw-bold');
  readonly markAllReadButton = this.modalContainer.locator('#mark-all-read');
  readonly closeButton = this.modalContainer.locator('.card-header .btn-close');
  readonly notificationsList = this.modalContainer.locator('#notification-list');
  readonly notificationItems = this.notificationsList.locator('li.list-group-item');

  // Локаторы для элементов уведомлений
  readonly notificationTexts = this.modalContainer.locator('span[data-testid="notification-text"]');
  readonly notificationDates = this.modalContainer.locator('small[data-testid="notification-date"]');
  readonly orderDetailsLinks = this.modalContainer.locator('a[data-testid="order-details-link"]');
  readonly notificationContents = this.modalContainer.locator('div[data-read]');

  uniqueElement = this.modalTitle;

  @logStep('Get modal title')
  async getModalTitle() {
    return await this.uniqueElement.innerText();
  }

  @logStep('Mark all notifications as read')
  async markAllAsRead() {
    await this.markAllReadButton.click();
    await this.waitForSpinner();
  }

  @logStep('Close notifications modal')
  async close() {
    await this.closeButton.click();
  }

  @logStep('Get notifications count')
  async getNotificationsCount() {
    return await this.notificationItems.count();
  }

  @logStep('Get notification text by index')
  async getNotificationText(index: number) {
    return await this.notificationTexts.nth(index).innerText();
  }

  @logStep('Get notification date by index')
  async getNotificationDate(index: number) {
    return await this.notificationDates.nth(index).innerText();
  }

  @logStep('Click on Order Details link by index')
  async clickOrderDetailsLink(index: number) {
    await this.orderDetailsLinks.nth(index).click();
  }

  @logStep('Get Order Details link text by index')
  async getOrderDetailsLinkText(index: number) {
    return await this.orderDetailsLinks.nth(index).innerText();
  }

  @logStep('Check if notification is unread (bold) by index')
  async isNotificationUnread(index: number) {
    const isRead = (await this.notificationContents.nth(index).getAttribute('data-read')) === 'true';
    return !isRead;
  }

  @logStep('Click on notification content by index')
  async clickNotification(index: number) {
    await this.notificationContents.nth(index).click();
  }
}
