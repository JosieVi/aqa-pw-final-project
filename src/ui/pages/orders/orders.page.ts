import test from '@playwright/test';
import { OrdersListColumn, OrdersListColumnForSorting } from 'data/orders/ordersListColumn.data';
import { sortDirection } from 'types/api.types';
import { SalesPortalPage } from 'ui/pages/salesPortal.page';
import { logStep } from 'utils/reporter.utils';

export class OrdersPage extends SalesPortalPage {
  // Верхняя часть страницы Orders List
  readonly ordersListTitle = this.page.getByRole('heading', {
    name: 'Orders List ',
  });
  readonly createOrderButton = this.page.getByRole('button', {
    name: 'Create Order',
  });
  readonly searchInputField = this.page.locator('#search');
  readonly searchButton = this.page.locator('#search-orders');
  readonly filterButton = this.page.locator('#filter');
  readonly chipButtonsContainer = this.page.locator('#chip-buttons');
  readonly allChips = this.chipButtonsContainer.locator('.chip');
  readonly allChipCloseButtons = this.chipButtonsContainer.locator('.closebtn');
  getChipByText(chipText: string) {
    return this.chipButtonsContainer.locator(`.chip:has-text("${chipText}")`);
  }
  getChipCloseButtonByText(chipText: string) {
    return this.getChipByText(chipText).locator('.close');
  }
  getChipButtonByIndex(index: number) {
    return this.allChips.nth(index);
  }

  // Табличная часть страницы Orders List
  readonly tableContainer = this.page.locator('#table-orders');
  readonly tableHeader = this.tableContainer.locator('thead');
  readonly tableBody = this.tableContainer.locator('tbody');

  readonly orderNumberHeader = this.tableHeader.getByText('Order Number', {
    exact: true,
  });
  readonly emailHeader = this.tableHeader.getByText('Email', { exact: true });
  readonly priceHeader = this.tableHeader.getByText('Price', { exact: true });
  readonly deliveryHeader = this.tableHeader.getByText('Delivery', {
    exact: true,
  });
  readonly statusHeader = this.tableHeader.getByText('Status', { exact: true });
  readonly assignedManagerHeader = this.tableHeader.getByText('Assigned Manager', { exact: true });
  readonly createdOnHeader = this.tableHeader.getByText('Created On', {
    exact: true,
  });
  readonly actionsHeader = this.tableHeader.getByText('Actions', {
    exact: true,
  });
  readonly allTableRows = this.tableBody.locator('tr');
  tableRowByOrderNumber(orderNumber: string) {
    return this.tableBody.locator('tr', { hasText: orderNumber });
  }
  private getSortableColumnHeaderLocator(columnName: OrdersListColumnForSorting) {
    return this.tableHeader.locator('th div[onclick*="sortOrdersInTable"]', {
      hasText: columnName,
    });
  }

  // Нижняя часть страницы Orders List (пагинация)
  readonly paginationControlsContainer = this.page.locator('#pagination-controls');
  readonly itemsOnPageLabel = this.paginationControlsContainer.getByText('Items on page:', {
    exact: true,
  });
  readonly paginationSelect = this.page.locator('#pagination-select');
  readonly paginationButtonsContainer = this.page.locator('#pagination-buttons');
  readonly previousPageButton = this.paginationButtonsContainer.locator('button[title="Previous"]');
  readonly nextPageButton = this.paginationButtonsContainer.locator('button[title="Next"]');
  getPageByNumber(pageNumber: number) {
    return this.paginationButtonsContainer.getByRole('button', {
      name: String(pageNumber),
      exact: true,
    });
  }
  detailsButtonByOrderNumber(orderNumber: string) {
    return this.tableRowByOrderNumber(orderNumber).locator('a.btn-link.table-btn:has(i.bi-card-text)');
  }
  reopenButtonByOrderNumber(orderNumber: string) {
    return this.tableRowByOrderNumber(orderNumber).locator('button.btn-link.table-btn i.bi-box-arrow-in-right');
  }

  uniqueElement = this.ordersListTitle;

  // Методы для работы с Orders List
  @logStep('Get Orders List Title')
  async getOrdersListTitle() {
    return this.ordersListTitle.innerText();
  }

  @logStep('Click Create Order Button')
  async clickCreateOrderButton() {
    await this.createOrderButton.click();
  }

  @logStep('Fill Search Input Field')
  async fillSearchInputField(searchText: string) {
    await this.searchInputField.fill(searchText);
  }

  @logStep('Click Search Button')
  async clickSearchButton() {
    await this.searchButton.click();
  }

  @logStep('Click Filter Button')
  async clickFilterButton() {
    await this.filterButton.click();
  }

  @logStep('Get Cell Text By Order Number And Column')
  async getCellTextByOrderNumberAndColumn(orderNumber: string, columnName: OrdersListColumn) {
    const row = this.tableRowByOrderNumber(orderNumber);
    const headerTexts = await this.tableHeader.locator('th > div > div').allTextContents();
    const columnIndex = headerTexts.indexOf(columnName);

    const cell = row.locator('td').nth(columnIndex);
    return await cell.innerText();
  }

  @logStep('Click Details Button')
  async clickDetailsButton(orderNumber: string) {
    const row = this.tableRowByOrderNumber(orderNumber);
    const detailsButton = row.locator('a.btn-link.table-btn i.bi-card-text').locator('..');
    await detailsButton.click();
  }

  @logStep('Click Reopen Button')
  async clickReopenButton(orderNumber: string) {
    const row = this.tableRowByOrderNumber(orderNumber);
    const reopenButton = row.locator('button.btn-link.table-btn i.bi-box-arrow-in-right').locator('..');
    await reopenButton.click();
  }

  @logStep('Click Column Header For Sort')
  async clickColumnHeaderForSort(columnName: OrdersListColumnForSorting) {
    const columnHeader = this.tableHeader.locator('th div[onclick*="sortOrdersInTable"]', { hasText: columnName });
    await columnHeader.click();
  }

  async getCurrentSortDirection(columnName: OrdersListColumnForSorting) {
    return await test.step(`Get current sort direction for column ${columnName}`, async () => {
      const columnHeader = this.getSortableColumnHeaderLocator(columnName);

      const [current, direction] = await Promise.all([columnHeader.getAttribute('current'), columnHeader.getAttribute('direction')]);
      return current === 'true' && (direction === 'asc' || direction === 'desc') ? direction : 'none';
    });
  }

  async sortColumnBy(columnName: OrdersListColumnForSorting, direction: sortDirection) {
    return await test.step(`Sort column ${columnName} by ${direction} direction`, async () => {
      const currentDirection = await this.getCurrentSortDirection(columnName);

      if (currentDirection === direction) {
        return;
      } else if (currentDirection === 'none') {
        await this.clickColumnHeaderForSort(columnName);
        const afterFirstClickDirection = await this.getCurrentSortDirection(columnName);

        if (afterFirstClickDirection !== direction) {
          await this.clickColumnHeaderForSort(columnName);
        }
      } else {
        await this.clickColumnHeaderForSort(columnName);
      }
    });
  }

  @logStep('Get Row Count')
  async getRowCount() {
    return await this.allTableRows.count();
  }

  @logStep('Select Items Per Page')
  async selectItemsPerPage(itemsPerPage: '10' | '25' | '50' | '100') {
    await this.paginationSelect.selectOption(itemsPerPage);
  }

  @logStep('Click Previous Page Button')
  async clickPreviousPageButton() {
    await this.previousPageButton.click();
  }

  @logStep('Click Next Page Button')
  async clickNextPageButton() {
    await this.nextPageButton.click();
  }

  @logStep('Click Page Number Button')
  async clickPageNumberButton(pageNumber: number) {
    const button = this.getPageByNumber(pageNumber);
    await button.click();
  }
}
