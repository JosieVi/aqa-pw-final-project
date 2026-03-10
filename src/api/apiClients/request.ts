import test, { APIRequestContext, APIResponse } from '@playwright/test';
import _ from 'lodash';
import { IRequestOptions, IResponse } from 'types/api.types';

export class RequestApi {
  constructor(private requestContext: APIRequestContext) {}

  async send<T extends object | null>(options: IRequestOptions): Promise<IResponse<T>> {
    return await test.step(`Send ${options.method.toUpperCase()} request to ${options.url}`, async () => {
      try {
        this.attachRequest(options);
        const response = await this.requestContext.fetch(options.baseURL + options.url, _.omit(options, ['baseURL', 'url']));
        const result = await this.transformResponse<T>(response);

        if (response.status() >= 500) throw new Error(`Server Error: ${response.status()} for ${options.url}`);

        this.attachResponse(options, result);
        return result;
      } catch (err) {
        console.error(`[API ERROR] ${(err as Error).message}`);
        throw err;
      }
    });
  }

  private async transformResponse<T extends object | null>(response: APIResponse): Promise<IResponse<T>> {
    const contentType = response.headers()['content-type'] || '';
    let body: any;

    if (contentType.includes('application/json')) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    return {
      status: response.status(),
      body: body,
      headers: response.headers(),
    };
  }

  private attachRequest(options: IRequestOptions): void {
    test.info().attach(`Request ${options.method.toUpperCase()} ${options.url}`, {
      body: JSON.stringify(
        {
          headers: options.headers,
          ...(options.data && { body: options.data }),
        },
        null,
        2,
      ),
      contentType: 'application/json',
    });
  }

  private attachResponse<T extends object | null>(options: IRequestOptions, response: IResponse<T>): void {
    test.info().attach(`Response ${response.status} ${options.method.toUpperCase()} ${options.url}`, {
      body: JSON.stringify(
        {
          headers: response.headers,
          body: response.body,
        },
        null,
        2,
      ),
      contentType: 'application/json',
    });
  }
}
