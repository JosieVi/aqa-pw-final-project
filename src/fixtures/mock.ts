import { Page } from '@playwright/test';
import { apiConfig } from 'config/api-config';
import { STATUS_CODES } from 'data/statusCodes';
import { ordersSortField, sortDirection } from 'types/api.types';
import { ICustomerResponse } from 'types/customer.types';
import { IOrderFilteredResponse } from 'types/orders.types';
import { IProductResponse } from 'types/products.types';

export class Mock {
  constructor(private page: Page) {}

  async customers(body: ICustomerResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/customers(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async customerDetails(body: ICustomerResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + '/' + apiConfig.ENDPOINTS.CUSTOMER_BY_ID(body.Customer._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async products(body: IProductResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/products(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async productDetails(body: IProductResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(apiConfig.BASE_URL + '/' + apiConfig.ENDPOINTS.PRODUCT_BY_ID(body.Product._id), async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }

  async orders(body: IOrderFilteredResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    this.page.route(/\/api\/orders(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }
}

export interface ISortingMockOptions {
  sortField: ordersSortField;
  sortDir: sortDirection;
}
