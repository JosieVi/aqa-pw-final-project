import { ManagersController } from 'api/controllers/manager.controller';
import { generateManagerData } from 'data/managers/generateManager.data';
import { STATUS_CODES } from 'data/statusCodes';
import { ICreateManagerPayload, IManager } from 'types/manager.types';
import { logStep } from 'utils/reporter.utils';
import { validateResponse } from 'utils/validations/responseValidation';

export class ManagersApiService {
  constructor(private readonly controller: ManagersController) {}

  @logStep('Create Manager via API')
  async createManager(token: string, customData?: Partial<ICreateManagerPayload>): Promise<IManager> {
    const body = generateManagerData(customData);
    const response = await this.controller.create(body, token);
    validateResponse(response, STATUS_CODES.CREATED, true, null);
    return response.body.User;
  }

  async deleteManager(managerId: string, token: string): Promise<void> {
    const response = await this.controller.delete(managerId, token);
    validateResponse(response, STATUS_CODES.DELETED);
  }
}
