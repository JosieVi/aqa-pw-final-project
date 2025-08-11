import { APIRequestContext } from '@playwright/test';
import { CustomersApiService } from 'api/services/customers.api-service';
import { ProductsApiService } from 'api/services/product.api-service';
import { OrdersAPIService } from 'api/services/orders.api-service';
import { SignInApiService } from 'api/services/signIn.api-service';

export class DataDisposalUtils {
  private ordersApiService: OrdersAPIService;
  private customersApiService: CustomersApiService;
  private productsApiService: ProductsApiService;
  private signInApiService: SignInApiService;

  constructor(context: APIRequestContext) {
    this.ordersApiService = new OrdersAPIService(context);
    this.productsApiService = new ProductsApiService(context);
    this.customersApiService = new CustomersApiService(context);
    this.signInApiService = new SignInApiService(context);
  }

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

  async clearOrders(orderIds: string[] | string) {
    orderIds = await this.normalizeIds(orderIds);
    if (!orderIds.length) return;
    console.log(` Deleting ${orderIds} orderIds`);
    const authToken = await this.getToken();

    for (const orderId of orderIds) {
      try {
        await this.ordersApiService.deleteOrder(orderId, authToken);
      } catch (error) {
        console.error(` The order ${orderId} was not deleted}`, error);
      }
    }
  }

  async clearProducts(productsIds: string[] | string) {
    productsIds = await this.normalizeIds(productsIds);
    if (!productsIds.length) return;
    console.log(` Deleting ${productsIds} productsIds`);
    const authToken = await this.getToken();

    for (const productId of productsIds) {
      try {
        await this.productsApiService.delete(productId, authToken);
      } catch (error) {
        console.error(` The product ${productId} was not deleted}`, error);
      }
    }
  }

  async clearCustomers(customerIds: string[] | string) {
    customerIds = await this.normalizeIds(customerIds);
    if (!customerIds.length) return;
    console.log(` Deleting ${customerIds} customersIds`);
    const authToken = await this.getToken();

    for (const customerId of customerIds) {
      try {
        await this.customersApiService.deleteCustomer(customerId, authToken);
      } catch (error) {
        console.error(` The customer ${customerId} was not deleted}`, error);
      }
    }
  }

  async tearDown(orderIds: string[], productsIds: string[], customersIds: string[]) {
    await this.clearOrders(orderIds);
    await this.clearProducts(productsIds);
    await this.clearCustomers(customersIds);
  }

  async partialTearDown(productsIds: string[], customersIds: string[]) {
    await this.clearProducts(productsIds);
    await this.clearCustomers(customersIds);
  }

  async normalizeIds(input: string | string[]): Promise<string[]> {
    return (Array.isArray(input) ? input : [input]).filter((id) => id.trim());
  }
}
