import { PageHolder } from './pageHolder.page';
import { logStep } from 'utils/reporter.utils';

export class SalesPortalPage extends PageHolder {
  // Основные контейнеры
  readonly header = this.page.locator('header#main-header');

  // Элементы хедера
  readonly portalTitle = this.header.locator('span.fs-4');

  // Навигационные элементы
  readonly navItem = (name: string) => this.header.locator(`a[name="${name}"]`);
  readonly activeNavItem = this.header.locator('a.active[name]');

  // Элементы уведомлений
  readonly notifications = {
    button: this.header.locator('#notification-bell'),
    badge: this.header.locator('#notification-badge'),
    badgeText: this.header.locator('#notification-badge').locator('xpath=./text()'),
  };

  // Элементы управления пользователем
  readonly userControls = {
    themeToggle: this.header.locator('#theme-toggle'),
    profileLink: this.header.locator('#user-menu-button a'),
    usernameText: this.header.locator('#user-menu-button a strong'),
    signOutButton: this.header.locator('#signOut'),
  };

  uniqueElement = this.portalTitle;

  @logStep('Navigate to a page')
  async navigateTo(name: 'home' | 'orders' | 'products' | 'customers' | 'managers') {
    await this.navItem(name).click();
  }

  @logStep('Check if the navigation item is active')
  async isNavItemActive(name: string): Promise<boolean | undefined> {
    const classes = await this.navItem(name).getAttribute('class');
    return classes?.includes('active');
  }

  @logStep('Get current active navigation item')
  async getActiveNavItem(): Promise<string | undefined> {
    return (await this.activeNavItem.getAttribute('name')) ?? undefined;
  }

  @logStep('Toggle theme')
  async clickToggleTheme() {
    await this.userControls.themeToggle.click();
  }

  @logStep('Open notifications')
  async clickOpenNotifications() {
    await this.notifications.button.click();
  }

  @logStep('Get notifications count')
  async getNotificationsCount(): Promise<number> {
    if (!(await this.notifications.badge.isVisible())) return 0;
    const countText = await this.notifications.badgeText.innerText();
    return parseInt(countText) || 0;
  }

  @logStep('Sign out')
  async clickSignOut() {
    await this.userControls.signOutButton.click();
  }

  @logStep('Get current username')
  async getCurrentUsername(): Promise<string> {
    return await this.userControls.usernameText.innerText();
  }
}
