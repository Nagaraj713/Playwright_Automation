const { BasePage } = require('./BasePage');
const { credentials } = require('../config/environment');

class LoginPage extends BasePage {
  async login(username = credentials.username, password = credentials.password) {
    await this.goto(this.routes.login);
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async loginViaInputs(username = credentials.username, password = credentials.password) {
    await this.goto(this.routes.login);
    await this.page.waitForSelector('input[name="username"]');
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async openUserMenu() {
    await this.page.getByRole('banner').getByRole('img').click();
    await this.page.getByRole('menu').click();
  }
}

module.exports = { LoginPage };
