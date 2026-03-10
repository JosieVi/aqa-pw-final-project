import { expect, test } from '@playwright/test';
import { IResponse, IResponseFields } from 'types/api.types';

export function validateResponse<T extends IResponseFields | null>(
  response: IResponse<T>,
  status: number,
  isSuccess?: boolean | null,
  errorMessage?: string | null,
) {
  return test.step(`Validate response status: ${status}, isSuccess: ${isSuccess}, errorMessage: ${errorMessage}`, () => {
    expect.soft(response.status, `Expected status: ${status}, but got: ${response.status}`).toBe(status);

    const actualIsSuccess = response.body ? response.body.IsSuccess : undefined;
    const actualErrorMessage = response.body ? response.body.ErrorMessage : undefined;

    expect.soft(actualIsSuccess, `Expected isSuccess: ${isSuccess}, but got: ${actualIsSuccess}`).toBe(isSuccess);

    expect.soft(actualErrorMessage, `Expected errorMessage: ${errorMessage}, but got: ${actualErrorMessage}`).toBe(errorMessage);
  });
}
