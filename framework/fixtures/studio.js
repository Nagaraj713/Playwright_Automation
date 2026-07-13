const base = require('@playwright/test');
const { StudioLoginPage } = require('../pages/studio');

const test = base.test.extend({
  /** Logged-in VRSE Studio session using credentials from studio config. */
  studioPage: async ({ page }, use) => {
    const loginPage = new StudioLoginPage(page);
    await loginPage.login();
    await use(page);
  },
});

module.exports = { test, expect: base.expect };
