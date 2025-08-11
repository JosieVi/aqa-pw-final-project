import { USER_LOGIN, USER_PASSWORD } from 'config/environment';
import { HomePage } from 'ui/pages/home.page';
import { SignInPage } from 'ui/pages/signIn.page';
import { logStep } from 'utils/reporter.utils';
import { BaseUIService } from './base.ui-service';

export class SignInUIService extends BaseUIService {
  private signInPage = new SignInPage(this.page);
  private homePage = new HomePage(this.page);

  @logStep('Login as local user with default credentials')
  async signInAsLocalUser() {
    await this.signInPage.openPortal();
    await this.signInPage.fillCredentials({
      email: USER_LOGIN,
      password: USER_PASSWORD,
    });
    await this.signInPage.clickLogin();
    await this.homePage.waitForOpened();
    const token = (await this.page.context().cookies()).find((c) => c.name === 'Authorization')!.value;
    return token;
  }
}
