import { expect } from '@playwright/test';
import { SalesPortalPage } from 'ui/pages/salesPortal.page';

export class OrderDetailsReceivedProductsSection extends SalesPortalPage {
  // Локаторы раздела "Received Products" для заказа в статусе "Draft"
  readonly productsContainer = this.page.locator('#products-section');
  readonly title = this.productsContainer.getByRole('heading', {
    name: 'Requested Products',
  });
  readonly editProductsPencilButton = this.productsContainer.locator('#edit-products-pencil');

  readonly productsAccordionSection = this.productsContainer.locator('#products-accordion-section');
  readonly allProductAccordionHeaders = this.productsAccordionSection.locator('.accordion-header');
  productAccordionHeaderButtonByName = (productName: string) =>
    this.productsAccordionSection.locator('button.accordion-button', {
      hasText: productName,
    });
  productDetailsPanelByName = (productName: string) => {
    const productHeaders = this.productsAccordionSection.locator(`div.accordion-header:has(button:has-text("${productName}"))`);
    return productHeaders.locator('+ .accordion-collapse .accordion-body');
  };
  readonly allReceivedStatusSpans = this.productsAccordionSection.locator('span.received-label');
  receivedStatusSpanTextByProductName = (productName: string) => {
    const productHeaders = this.productsAccordionSection.locator(`div.accordion-header:has(button:has-text("${productName}"))`);
    return productHeaders.locator('span.received-label');
  };

  // Локаторы раздела "Received Products" для заказа в статусе "In Process"
  readonly receiveButton = this.productsContainer.locator('#start-receiving-products');

  // Локаторы раздела "Received Products" после нажатия кнопки "Receive"
  readonly cancelReceivingButton = this.productsContainer.locator('#cancel-receiving');
  readonly saveReceivedProductsButton = this.productsContainer.locator('#save-received-products');

  readonly selectAllCheckbox = this.productsContainer.locator('#selectAll');
  productReceivedCheckboxByName = (productName: string) => {
    const productHeaders = this.productsAccordionSection.locator(`div.accordion-header:has(button:has-text("${productName}"))`);
    return productHeaders.locator('div.received-label input.form-check-input[type="checkbox"][name="product"]');
  };
  readonly allReceivedCheckboxesLabels = this.productsAccordionSection.locator('div.received-label label.form-check-label');
  receivedCheckboxLabelTextByProductName = (productName: string) => {
    const productHeaders = this.productsAccordionSection.locator(`div.accordion-header:has(button:has-text("${productName}"))`);
    return productHeaders.locator('div.received-label label.form-check-label[for^="check"]');
  };

  uniqueElement = this.title;

  // Методы для взаимодействия с элементами раздела "Received Products" для заказа в статусе "Draft"
  async getTitle() {
    return await this.title.innerText();
  }

  async clickEditProductsPencilButton() {
    await this.editProductsPencilButton.click();
  }

  async getProductsAccordionCount() {
    return await this.allProductAccordionHeaders.count();
  }

  async clickProductAccordionHeaderButton(productName: string, index: number = 0) {
    await this.productAccordionHeaderButtonByName(productName).nth(index).click();
  }

  async isProductAccordionExpanded(productName: string, index: number = 0) {
    const button = this.productAccordionHeaderButtonByName(productName).nth(index);
    await expect(button).toBeVisible();
    return (await button.getAttribute('aria-expanded')) === 'true';
  }

  async isProductAccordionCollapsed(productName: string, index: number = 0) {
    const button = this.productAccordionHeaderButtonByName(productName).nth(index);
    await expect(button).toBeVisible();
    return (await button.getAttribute('aria-expanded')) === 'false';
  }

  async getProductDetailsAsObject(productName: string, index: number = 0) {
    const detailsPanel = this.productDetailsPanelByName(productName).nth(index);
    await expect(detailsPanel).toBeVisible();

    const detailElements = await detailsPanel.locator('div.c-details').all();

    const productDetails: Record<string, string> = {};
    for (const detailElement of detailElements) {
      const keyLocator = detailElement.locator('span.s-span').first();
      const valueLocator = detailElement.locator('span.s-span').nth(1);

      const keyText = await keyLocator.innerText();
      const valueText = await valueLocator.innerText();

      if (keyText && valueText) {
        productDetails[keyText] = valueText;
      }
    }
    return productDetails;
  }

  async getAllProductReceivedStatusTexts() {
    return await this.allReceivedStatusSpans.allInnerTexts();
  }

  async getProductReceivedStatusText(productName: string, index: number = 0) {
    const statusSpan = this.receivedStatusSpanTextByProductName(productName).nth(index);
    await expect(statusSpan).toBeVisible();
    return await statusSpan.innerText();
  }

  // Методы для взаимодействия с элементами раздела "Received Products" для заказа в статусе "In Process"
  async clickReceiveButton() {
    await this.receiveButton.click();
  }

  // Методы для взаимодействия с элементами раздела "Received Products" после нажатия кнопки "Receive"
  async clickCancelReceivingButton() {
    await this.cancelReceivingButton.click();
  }

  async clickSaveReceivedProductsButton() {
    await this.saveReceivedProductsButton.click();
  }

  async clickSelectAllCheckbox() {
    await this.selectAllCheckbox.click();
  }

  async setProductReceivedCheckbox(productName: string, checkState: boolean, index: number = 0) {
    const checkbox = this.productReceivedCheckboxByName(productName).nth(index);
    await expect(checkbox).toBeVisible();
    await (checkState ? checkbox.check() : checkbox.uncheck());
  }

  async isProductReceivedCheckboxChecked(productName: string, index: number = 0) {
    const checkbox = this.productReceivedCheckboxByName(productName).nth(index);
    await expect(checkbox).toBeVisible();
    return await checkbox.isChecked();
  }

  async getProductReceivedLabelText(productName: string, index: number = 0) {
    const label = this.receivedCheckboxLabelTextByProductName(productName).nth(index);
    await expect(label).toBeVisible();
    return await label.innerText();
  }

  async isSelectAllCheckboxChecked() {
    return await this.selectAllCheckbox.isChecked();
  }
  async getAllProductNames() {
    const texts = await this.allProductAccordionHeaders.locator('button.accordion-button').allInnerTexts();
    return texts.map((t) => t.split('\n')[0].trim());
  }
}
