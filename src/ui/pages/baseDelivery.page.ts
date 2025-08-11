import { logStep } from 'utils/reporter.utils';
import { SalesPortalPage } from './salesPortal.page';
import { IAddress } from 'types/orders.types';
import { DATE_PICKER_MONTHS, DELIVERY, LOCATION } from 'data/orders/delivery.data';

export abstract class BaseDeliveryPage extends SalesPortalPage {
  readonly pageContainer = this.page.locator('#delivery-container');
  readonly deliveryType = this.page.locator('#inputType');
  readonly deliveryDate = this.page.locator('#date-input');
  readonly location = this.page.locator('#inputLocation');
  readonly country = this.page.locator('#inputCountry');
  readonly city = this.page.locator('#inputCity');
  readonly street = this.page.locator('#inputStreet');
  readonly house = this.page.locator('#inputHouse');
  readonly flat = this.page.locator('#inputFlat');
  readonly saveButton = this.page.locator('#save-delivery');
  readonly cancelButton = this.page.locator('#back-to-order-details-page');
  readonly titleLocator = this.page.locator('#title h2.fw-bold');

  // Datepicker
  readonly dateInputField = this.pageContainer.locator('#date-input');
  readonly dateInputIcon = this.pageContainer.locator('span.d-p-icon');
  readonly datepicker = this.page.locator('.datepicker');
  readonly datepickerSwitcherToMonths = this.datepicker.locator('.datepicker-days .datepicker-switch');
  readonly datepickerSwitcherToYears = this.datepicker.locator('.datepicker-months .datepicker-switch');
  readonly datepickerYear = (year: string) => this.datepicker.locator('.year', { hasText: year });
  readonly datepickerMonth = (month: DATE_PICKER_MONTHS) => this.datepicker.locator('.month', { hasText: month });
  readonly datepickerDay = (day: string) => this.datepicker.locator(`td.day:not(.disabled):not(.old):not(.new):has-text('${day}')`);

  uniqueElement = this.deliveryType;
  abstract expectedTitle: string;

  @logStep('Select delivery type')
  async selectDeliveryType(type: string) {
    await this.deliveryType.selectOption(type);
  }

  private async fillDateInput(date: string) {
    const parsedDate = new Date(date);
    const day = parsedDate.getDate().toString();
    const month = Object.values(DATE_PICKER_MONTHS)[parsedDate.getMonth()];
    const year = parsedDate.getFullYear().toString();

    await this.dateInputIcon.click();
    await this.datepickerSwitcherToMonths.click();
    await this.datepickerSwitcherToYears.click();

    await this.datepickerYear(year).click();
    await this.datepickerMonth(month).click();
    await this.page.waitForSelector('.datepicker-days', {
      state: 'visible',
      timeout: 5000,
    });

    await this.datepickerDay(day).click();
  }

  @logStep('Fill delivery form (date + address)')
  async fillAddress(address: IAddress & { finalDate: string }, deliveryType: DELIVERY) {
    if (address.finalDate) {
      await this.fillDateInput(address.finalDate);
    }

    if (deliveryType === DELIVERY.DELIVERY) {
      if (address.location === LOCATION.OTHER) {
        if (await this.location.isVisible()) {
          await this.location.selectOption({ label: address.location });
        }

        if (address.country) {
          await this.country.selectOption({ label: address.country });
        }
        if (address.city) await this.city.fill(address.city);
        if (address.street) await this.street.fill(address.street);
        if (address.house !== undefined) {
          await this.house.fill(address.house.toString());
        }
        if (address.flat !== undefined) {
          await this.flat.fill(address.flat.toString());
        }
      }

      if (address.location === LOCATION.HOME) {
        if (await this.location.isVisible()) {
          await this.location.selectOption({ label: address.location });
        }
      }
    }

    if (deliveryType === DELIVERY.PICKUP) {
      if (address.country) {
        await this.country.selectOption({ label: address.country });
      }

      if (address.city) await this.city.fill(address.city);
      if (address.street) await this.street.fill(address.street);
      if (address.house !== undefined) {
        await this.house.fill(address.house.toString());
      }
      if (address.flat !== undefined) {
        await this.flat.fill(address.flat.toString());
      }
    }
  }

  @logStep('Click Save Delivery button')
  async saveDelivery() {
    await this.saveButton.click();
    await this.waitForSpinner();
  }

  @logStep('Click Cancel button')
  async cancel() {
    await this.cancelButton.click();
    await this.waitForSpinner();
  }
}
