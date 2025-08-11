import { type Locator } from '@playwright/test';
import { logStep } from 'utils/reporter.utils';
import { DELIVERY } from 'data/orders/delivery.data';
import { IDelivery } from 'types/orders.types';
import { COUNTRIES } from 'data/customers/countries.data';
import { OrderTab } from './orderTabs.page';

export class OrderDeliveryTab extends OrderTab {
  readonly deliveryButton = this.tabContainer.locator('#delivery-btn');
  readonly deliveryTabButton = this.page.locator('#delivery-tab');
  readonly uniqueElement = this.tabContainer.locator('#delivery.active');

  readonly scheduleDeliveryButton = this.page.locator('#delivery .delivery-btn', { hasText: 'Schedule Delivery' });
  readonly editDeliveryButton = this.page.locator('#delivery .delivery-btn', {
    hasText: 'Edit Delivery',
  });

  readonly deliveryTypeValue = this.getValueLocator('Delivery Type');
  readonly deliveryDateValue = this.getValueLocator('Delivery Date');
  readonly countryValue = this.getValueLocator('Country');
  readonly cityValue = this.getValueLocator('City');
  readonly streetValue = this.getValueLocator('Street');
  readonly houseValue = this.getValueLocator('House');
  readonly flatValue = this.getValueLocator('Flat');

  private getValueLocator(label: string) {
    return this.page.locator(`//div[@id="delivery"]//div[contains(@class, "c-details")][span[1][text()="${label}"]]/span[2]`);
  }

  private async getText(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return text ? text.trim() : '';
  }

  @logStep('Get full delivery info')
  async getDeliveryInfo(): Promise<IDelivery> {
    const [condition, finalDate, country, city, street, house, flat] = await Promise.all([
      this.getText(this.deliveryTypeValue),
      this.getText(this.deliveryDateValue),
      this.getText(this.countryValue),
      this.getText(this.cityValue),
      this.getText(this.streetValue),
      this.getText(this.houseValue),
      this.getText(this.flatValue),
    ]);

    return {
      condition: condition as DELIVERY,
      finalDate,
      address: {
        country: country as COUNTRIES,
        city,
        street,
        house: house ? Number(house) : undefined,
        flat: flat ? Number(flat) : undefined,
      },
    };
  }

  @logStep('Click Delivery Tab Button')
  async clickDeliveryTab() {
    await this.deliveryTabButton.click();
    await this.waitForOpened();
  }

  @logStep('Click Schedule Delivery Button')
  async clickScheduleDelivery() {
    this.deliveryButton.click();
  }

  @logStep('Click Edit Delivery Button')
  async clickEditDelivery() {
    this.editDeliveryButton.click();
  }
}
