import { logStep } from 'utils/reporter.utils';
import { BaseModal } from './baseModal.page';

export class ManagmentOrderModal extends BaseModal {
  readonly modalTitle = this.page.locator('h5.modal-title');
  readonly productsList = this.page.locator('select[name="Product"]');
  readonly addProductButton = this.page.locator('#add-product-btn');
  readonly totalPrice = this.page.locator('#total-price-order-modal');
  readonly deleteProductButtons = this.page.locator('.del-btn-modal');

  uniqueElement = this.modalTitle;

  @logStep('Get modal title')
  async getModalTitle() {
    return await this.uniqueElement.innerText();
  }

  @logStep('Select product in order')
  async selectProduct(productName: string, productIndex: number = 0) {
    // Выбираем продукт по индексу (по умолчанию первый)
    await this.productsList.nth(productIndex).selectOption({ value: productName });
  }

  @logStep('Select product in specific position')
  async selectProductAtPosition(productName: string, position = 0) {
    // position начинается с 1 для лучшей читаемости в тестах
    await this.productsList.nth(position - 1).selectOption({ label: productName });
  }

  @logStep('Click Add Product button')
  async clickAddProduct() {
    await this.addProductButton.click();
  }

  @logStep('Get total price')
  async getTotalPrice(): Promise<number> {
    const priceText = await this.totalPrice.innerText();
    return parseFloat(priceText.replace(/[^\d.]/g, ''));
  }

  @logStep('Delete product by index')
  async removeProduct(index: number = 0) {
    await this.deleteProductButtons.nth(index).click();
  }
}
