import test, { APIRequestContext, APIResponse } from '@playwright/test';
import _ from 'lodash';
import { IRequestOptions, IResponse } from 'types/api.types';
import { logStep } from 'utils/reporter.utils';

export class RequestApi {
  constructor(private requestContext: APIRequestContext) {}
  private response: APIResponse | undefined;

  private testInfo = test.info;

  async send<T extends object | null>(options: IRequestOptions): Promise<IResponse<T>> {
    return await test.step(`Send ${options.method.toUpperCase()} request to ${options.url}`, async () => {
      try {
        this.attachRequest(options);
        this.response = await this.requestContext.fetch(options.baseURL + options.url, _.omit(options, ['baseURL', 'url']));
        if (this.response.status() >= 500) throw new Error('Request failed with status ' + this.response.status());
        const result = await this.transformResponse();
        this.attachResponse(options, result);
        return result;
      } catch (err) {
        console.log((err as Error).message);
        throw err;
      }
    });
  }

  @logStep('Transform response')
  async transformResponse() {
    let body;
    const contentType = this.response!.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      body = await this.response!.json();
    } else {
      body = await this.response!.text();
    }

    return {
      status: this.response!.status(),
      body,
      headers: this.response!.headers(),
    };
  }

  private attachRequest(options: IRequestOptions): void {
    this.testInfo().attach(`Request ${options.method.toUpperCase()} ${options.url}`, {
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
    this.testInfo().attach(`Response ${response.status} ${options.method.toUpperCase()} ${options.url}`, {
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
