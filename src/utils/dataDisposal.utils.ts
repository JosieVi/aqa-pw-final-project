import { CustomersApiService } from 'api/services/customer.api-service';
import { ProductsApiService } from 'api/services/product.api-service';
import { OrdersAPIService } from 'api/services/order.api-service';
import { SignInApiService } from 'api/services/signIn.api-service';
import { ManagersApiService } from 'api/services/manager.api-services';

export class DataDisposalUtils {
  private trackedOrders: string[] = [];
  private trackedProducts: string[] = [];
  private trackedCustomers: string[] = [];
  private trackedManagers: string[] = [];

  constructor(
    private ordersApiService: OrdersAPIService,
    private customersApiService: CustomersApiService,
    private productsApiService: ProductsApiService,
    private signInApiService: SignInApiService,
    private managersApiService: ManagersApiService,
  ) {}

  private token = '';

  private async prepareToken(): Promise<string> {
    if (!this.token) {
      this.token = await this.signInApiService.loginAsLocalUser();
    }
    return this.token;
  }

  private async getToken(token?: string): Promise<string> {
    return token ?? (await this.prepareToken());
  }

  trackOrder(id: string) {
    if (id) this.trackedOrders.push(id);
  }

  removeOrder(id: string) {
    if (id) this.trackedOrders = this.trackedOrders.filter((orderId) => orderId !== id);
  }

  trackProduct(id: string) {
    if (id) this.trackedProducts.push(id);
  }

  removeProduct(id: string) {
    if (id) this.trackedProducts = this.trackedProducts.filter((productId) => productId !== id);
  }

  trackCustomer(id: string) {
    if (id) this.trackedCustomers.push(id);
  }

  removeCustomer(id: string) {
    if (id) this.trackedCustomers = this.trackedCustomers.filter((customerId) => customerId !== id);
  }

  trackManager(id: string) {
    if (id) this.trackedManagers.push(id);
  }

  removeManager(id: string) {
    if (id) this.trackedManagers = this.trackedManagers.filter((managerId) => managerId !== id);
  }

  async clearOrders(orderIds: string[] | string = this.trackedOrders) {
    const idsToProcess = await this.normalizeIds(orderIds);
    if (!idsToProcess.length) return;
    console.log(` Deleting orderIds: ${idsToProcess.join(', ')}`);
    const authToken = await this.getToken();

    for (const orderId of idsToProcess) {
      try {
        await this.ordersApiService.deleteOrder(orderId, authToken);
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`Order with ID ${orderId} was not found (already deleted or never existed). Skipping.`);
        } else console.error(` The order ${orderId} was not deleted`, error);
      }
    }
    if (orderIds === this.trackedOrders) this.trackedOrders = [];
  }

  async clearProducts(productsIds: string[] | string = this.trackedProducts) {
    const idsToProcess = await this.normalizeIds(productsIds);
    if (!idsToProcess.length) return;
    console.log(` Deleting productsIds: ${idsToProcess.join(', ')}`);
    const authToken = await this.getToken();

    for (const productId of idsToProcess) {
      try {
        await this.productsApiService.delete(productId, authToken);
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`Product with ID ${productId} was not found (already deleted or never existed). Skipping.`);
        } else {
          console.error(` The product ${productId} was not deleted`, error);
        }
      }
    }
    if (productsIds === this.trackedProducts) this.trackedProducts = [];
  }

  async clearCustomers(customerIds: string[] | string = this.trackedCustomers) {
    const idsToProcess = await this.normalizeIds(customerIds);
    if (!idsToProcess.length) return;
    console.log(` Deleting customersIds: ${idsToProcess.join(', ')}`);
    const authToken = await this.getToken();

    for (const customerId of idsToProcess) {
      try {
        await this.customersApiService.deleteCustomer(customerId, authToken);
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`Customer with ID ${customerId} was not found (already deleted or never existed). Skipping.`);
        } else console.error(` The customer ${customerId} was not deleted`, error);
      }
    }
    if (customerIds === this.trackedCustomers) this.trackedCustomers = [];
  }

  async clearManagers(managerIds: string[] | string = this.trackedManagers) {
    const idsToProcess = await this.normalizeIds(managerIds);
    if (!idsToProcess.length) return;
    console.log(` Deleting managersIds: ${idsToProcess.join(', ')}`);
    const authToken = await this.getToken();
    for (const managerId of idsToProcess) {
      try {
        await this.managersApiService.deleteManager(managerId, authToken);
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`Manager with ID ${managerId} was not found (already deleted or never existed). Skipping.`);
        } else console.error(` The manager ${managerId} was not deleted`, error);
      }
    }
    if (managerIds === this.trackedManagers) this.trackedManagers = [];
  }

  async tearDown() {
    await this.clearOrders();
    await this.clearProducts();
    await this.clearCustomers();
    await this.clearManagers();
  }

  async partialTearDown() {
    await this.clearProducts();
    await this.clearCustomers();
    await this.clearManagers();
  }

  async normalizeIds(input: string | string[]): Promise<string[]> {
    return (Array.isArray(input) ? input : [input]).filter((id) => id.trim());
  }
}
