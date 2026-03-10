import { RequestApi } from 'api/apiClients/request';
import { apiConfig } from 'config/api-config';
import { IRequestOptions } from 'types/api.types';
import { APIRequestContext } from '@playwright/test';

export abstract class BaseController {
  protected request: RequestApi;

  constructor(context: APIRequestContext) {
    this.request = new RequestApi(context);
  }

  protected get defaultOptions(): Omit<IRequestOptions, 'url' | 'method'> {
    return {
      baseURL: apiConfig.BASE_URL,
      headers: { 'content-type': 'application/json' },
    };
  }

  protected getAuthorizedOptions(token: string): Omit<IRequestOptions, 'url' | 'method'> {
    return {
      ...this.defaultOptions,
      headers: {
        ...this.defaultOptions.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
