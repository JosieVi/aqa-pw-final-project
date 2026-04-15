import { Locator, test } from '@playwright/test';
import { SalesPortalPage } from './salesPortal.page';
import { ModuleName } from 'types/home.types';
import { PAGE_TITLES, LINK_NAMES } from 'data/uiTexts.data';

export class HomePage extends SalesPortalPage {
  readonly title = this.page.getByRole('heading', {
    name: PAGE_TITLES.WELCOME,
  });
  readonly customersButton = this.page.getByRole('link', { name: LINK_NAMES.VIEW_CUSTOMERS });
  readonly productsButton = this.page.getByRole('link', { name: LINK_NAMES.VIEW_PRODUCTS });
  readonly ordersButton = this.page.getByRole('link', { name: LINK_NAMES.VIEW_ORDERS });

  readonly uniqueElement: Locator = this.title;

  async clickModuleButton(moduleName: ModuleName): Promise<void> {
    const moduleButtons: Record<ModuleName, Locator> = {
      Customers: this.customersButton,
      Products: this.productsButton,
      Orders: this.ordersButton,
    };
    return await test.step(`Click on the ${moduleName} module button`, async () => {
      await moduleButtons[moduleName].click();
    });
  }
}
