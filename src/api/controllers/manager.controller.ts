import { apiConfig } from 'config/api-config';
import { ICreateManagerPayload, ICreateManagerResponse } from 'types/manager.types';
import { logStep } from 'utils/reporter.utils';
import { BaseController } from './base.controller';

export class ManagersController extends BaseController {
  @logStep('POST/users via API (Create Manager)')
  async create(data: ICreateManagerPayload, token: string) {
    return await this.request.send<ICreateManagerResponse>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.USERS,
      method: 'post',
      data,
    });
  }

  @logStep('DELETE/users via API (Delete Manager)')
  async delete(id: string, token: string) {
    return await this.request.send<null>({
      ...this.getAuthorizedOptions(token),
      url: apiConfig.ENDPOINTS.USER_BY_ID(id),
      method: 'delete',
    });
  }
}
