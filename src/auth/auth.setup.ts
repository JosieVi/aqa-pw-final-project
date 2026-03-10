import { test } from 'fixtures/index.fixture';
import { STORAGE_STATE } from '../../playwright.config';
import { URL } from 'url';

test('Login to Sales Portal via API', async ({ page, signInApiService, baseURL }) => {
  const token = await signInApiService.loginAsLocalUser();
  const domain = baseURL ? new URL(baseURL).hostname : 'localhost';

  await page.context().addCookies([
    {
      name: 'Authorization',
      value: token,
      domain: domain,
      path: '/',
      expires: -1,
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
  await page.context().storageState({ path: STORAGE_STATE });
});
