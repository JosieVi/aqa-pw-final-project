import { test } from '@playwright/test';
import { ModuleName } from 'types/home.types';
import { HomePage } from 'ui/pages/home.page';
import { logStep } from 'utils/reporter.utils';
import { BaseUIService } from './base.ui-service';
import { OrdersPage } from 'ui/pages/orders/orders.page';

export class HomeUIService extends BaseUIService {
  readonly homePage = new HomePage(this.page);
  readonly ordersPage = new OrdersPage(this.page);

  async openModule(moduleName: ModuleName) {
    return await test.step(`Open ${moduleName} module on Home Page`, async () => {
      await this.homePage.clickModuleButton(moduleName);
      await (this as any)[`${moduleName.toLowerCase()}Page`].waitForOpened();
    });
  }

  @logStep('Open Sales Portal on Home Page as logged in user')
  async openAsLoggedInUser() {
    await this.homePage.openPortal();
    await this.homePage.waitForOpened();
  }
}
