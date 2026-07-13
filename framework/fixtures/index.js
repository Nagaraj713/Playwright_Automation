const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

/**
 * Custom Playwright test with a pre-authenticated page fixture.
 * Usage: const { test, expect } = require('../../framework/fixtures');
 */
const test = base.test.extend({
  /** Logged-in Pulse Dashboard session using credentials from config. */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await use(page);
  },
});

module.exports = { test, expect: base.expect };
