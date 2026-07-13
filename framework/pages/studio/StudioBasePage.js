const { baseUrl, routes } = require('../../config/studio');

class StudioBasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
    await this.page.goto(url);
  }

  get routes() {
    return routes;
  }

  dialog() {
    return this.page.getByRole('dialog');
  }

  logStep(message) {
    console.debug(`[Studio] ${message}`);
  }
}

module.exports = { StudioBasePage };
