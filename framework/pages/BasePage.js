const { baseUrl, routes } = require('../config/environment');

class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
    await this.page.goto(url);
  }

  async navigateViaSidebar(linkName) {
    await this.page.getByRole('link', { name: linkName }).click();
  }

  async openOrganizationMenu() {
    await this.page.getByRole('button', { name: 'Organization' }).click();
  }

  async closeBackdrop() {
    await this.page.locator('.MuiBackdrop-root').click();
  }

  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }

  dialog() {
    return this.page.locator('div[role="dialog"]');
  }

  get routes() {
    return routes;
  }
}

module.exports = { BasePage };
