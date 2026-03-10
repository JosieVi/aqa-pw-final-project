import { apiConfig } from 'config/api-config';
import { ILoginResponseBody, IResponseFields } from 'types/api.types';
import { IAPICredentials } from 'types/signIn.types';
import { logStep } from 'utils/reporter.utils';
import { BaseController } from './base.controller';

export class SignInController extends BaseController {
  @logStep('Sign in via API')
  async signIn(body: IAPICredentials) {
    return await this.request.send<ILoginResponseBody>({
      ...this.defaultOptions,
      url: apiConfig.ENDPOINTS.LOGIN,
      method: 'post',
      data: body,
    });
  }

  @logStep('Sign out via API')
  async signOut(token: string) {
    return await this.request.send<IResponseFields>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.LOGOUT,
      method: 'post',
    });
  }
}
