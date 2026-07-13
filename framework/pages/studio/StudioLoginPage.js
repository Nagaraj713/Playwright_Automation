const { expect } = require('@playwright/test');
const { StudioBasePage } = require('./StudioBasePage');
const { credentials } = require('../../config/studio');

class StudioLoginPage extends StudioBasePage {
  async login(username = credentials.username, password = credentials.password) {
    await this.goto(this.routes.login);
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Log In' }).click();
    await expect(this.page.getByRole('button', { name: 'Create Project' })).toBeVisible();
  }
}

module.exports = { StudioLoginPage };
