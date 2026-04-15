import { Locator } from '@playwright/test';
import { ICredentials } from 'types/signIn.types';
import { logStep } from 'utils/reporter.utils';
import { PageHolder } from './pageHolder.page';
import { BUTTON_NAMES } from 'data/uiTexts.data';

export class SignInPage extends PageHolder {
  readonly emailInput = this.page.locator('#emailinput');
  readonly passwordInput = this.page.locator('#passwordinput');
  readonly loginButton = this.page.getByRole('button', { name: BUTTON_NAMES.LOGIN });

  readonly uniqueElement: Locator = this.loginButton;

  @logStep('Fill default credentials in Sign In form')
  async fillCredentials({ email, password }: ICredentials): Promise<void> {
    if (email) {
      await this.emailInput.fill(email);
      if (password) {
        await this.passwordInput.fill(password);
      }
    }
  }

  @logStep('Click Login button')
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }
}
