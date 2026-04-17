import { logStep } from 'utils/reporter.utils';
import { SalesPortalPage } from '../salesPortal.page';

export class ManagersPage extends SalesPortalPage {
  // Специфичные для контента элементы
  readonly pageTitle = this.page.getByRole('heading', { name: 'Managers List' });
  readonly addManagerButton = this.page.locator('a[name="add-button"]');

  // Секция поиска и фильтрации
  readonly searchInput = this.page.locator('#search');
  readonly searchButton = this.page.locator('#search-manager');
  readonly filterButton = this.page.locator('#filter');

  // Таблица и её контейнеры
  readonly tableContainer = this.page.locator('#table-container');
  readonly managersTable = this.page.locator('#table-managers');

  // Заголовки колонок (для сортировки)
  readonly firstNameHeader = this.managersTable.locator('th', { hasText: 'First Name' }).locator('div[onclick]');
  readonly lastNameHeader = this.managersTable.locator('th', { hasText: 'Last Name' }).locator('div[onclick]');
  readonly rolesHeader = this.managersTable.locator('th', { hasText: 'Roles' }).locator('div[onclick]');
  readonly createdOnHeader = this.managersTable.locator('th', { hasText: 'Created On' }).locator('div[onclick]');

  // Переопределяем уникальный элемент для проверки загрузки страницы
  uniqueElement = this.pageTitle;

  @logStep('Click Add Manager button')
  async clickAddManager() {
    await this.addManagerButton.click();
  }

  @logStep('Search for a manager')
  async searchManager(text: string) {
    await this.searchInput.fill(text);
    await this.searchButton.click();
  }
}
