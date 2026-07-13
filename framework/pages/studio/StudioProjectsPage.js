const { expect } = require('@playwright/test');
const { StudioBasePage } = require('./StudioBasePage');
const { credentials } = require('../../config/studio');

class StudioProjectsPage extends StudioBasePage {
  async dismissBlockingOverlays() {
    const closeButtons = this.page.getByRole('button', { name: /^close$/i });
    const count = await closeButtons.count();
    for (let index = count - 1; index >= 0; index -= 1) {
      const closeBtn = closeButtons.nth(index);
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click().catch(() => {});
      }
    }

    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(400);
  }

  async isOnLoginPage() {
    const username = this.page.getByLabel('Username');
    const password = this.page.getByLabel('Password');
    return (await username.isVisible().catch(() => false))
      && (await password.isVisible().catch(() => false));
  }

  async loginIfRedirected() {
    if (!(await this.isOnLoginPage())) {
      return;
    }
    await this.page.getByLabel('Username').fill(credentials.username);
    await this.page.getByLabel('Password').fill(credentials.password);
    await this.page.getByRole('button', { name: 'Log In' }).click();
    this.logStep('Re-authenticated after redirect to login page');
  }

  async navigateToProjectsViaBrand() {
    await this.dismissBlockingOverlays();

    const brand = this.page.getByRole('heading', { name: /vrsebuilder/i })
      .or(this.page.getByText(/^vrsebuilder$/i))
      .first();
    if (await brand.isVisible().catch(() => false)) {
      await brand.click({ timeout: 5000 }).catch(async (error) => {
        const message = `${error?.message || ''}`;
        if (/intercepts pointer events|not receiving pointer events/i.test(message)) {
          await this.dismissBlockingOverlays();
          await brand.click({ force: true, timeout: 5000 });
          return;
        }
        throw error;
      });
      await this.page.waitForTimeout(1200);
      this.logStep('Clicked VrseBuilder header to return to projects');
    }
  }

  async ensureProjectsPage() {
    const projectsHeading = this.page.getByRole('heading', { name: 'Projects', exact: true });
    if (await projectsHeading.isVisible().catch(() => false)) {
      return;
    }

    const breadcrumb = this.page.getByRole('navigation', { name: 'breadcrumb' });
    if (await breadcrumb.isVisible().catch(() => false)) {
      const projectsCrumb = breadcrumb.getByText('Projects');
      if (await projectsCrumb.isVisible().catch(() => false)) {
        await projectsCrumb.click();
        if (await projectsHeading.isVisible({ timeout: 8000 }).catch(() => false)) {
          return;
        }
      }
    }

    await this.navigateToProjectsViaBrand();
    await this.loginIfRedirected();
    if (await this.isOnLoginPage()) {
      // Retry one more time to guard against transient auth submit delay.
      await this.loginIfRedirected();
    }

    await expect(projectsHeading).toBeVisible({ timeout: 30000 });
  }

  async open() {
    await this.ensureProjectsPage();
  }

  async searchProject(name) {
    await this.page.getByPlaceholder('Search projects...').fill(name);
  }

  projectCard(name) {
    return this.page.locator('.chakra-card').filter({
      has: this.page.getByRole('img', { name }),
    });
  }

  async expectProjectVisible(name) {
    await this.searchProject(name);
    await expect(this.projectCard(name)).toBeVisible();
  }

  async openProjectMenu(name) {
    await this.searchProject(name);
    await this.projectCard(name).getByRole('button', { name: 'More options' }).click();
  }

  async createProject({ name, description }) {
    await this.page.getByRole('button', { name: 'Create Project' }).click();
    const dialog = this.page.getByRole('dialog', { name: 'Create New Project' });
    await dialog.getByLabel('Project Name').fill(name);
    await dialog.getByLabel('Description').fill(description);
    await dialog.getByRole('button', { name: 'Create Project' }).click();
    await expect(dialog).toBeHidden();
    this.logStep(`Created project: ${name}`);
  }

  async editProject(currentName, { name, description }) {
    await this.open();
    await this.openProjectMenu(currentName);
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    const dialog = this.dialog();
    await dialog.getByPlaceholder('Enter a descriptive name for').fill(name);
    if (description) {
      await dialog.getByRole('textbox', { name: 'Describe what this project is' }).fill(description);
    }
    await dialog.getByRole('button', { name: 'Update Project' }).click();
    await expect(dialog).toBeHidden();
    await this.expectProjectVisible(name);
    this.logStep(`Updated project: ${currentName} → ${name}`);
  }

  async deleteProject(name) {
    await this.open();
    await this.openProjectMenu(name);
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
    await this.page.getByRole('button', { name: 'Delete project' }).click();
    await expect(this.page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
    await this.searchProject(name);
    await expect(this.projectCard(name)).toHaveCount(0);
    this.logStep(`Deleted project: ${name}`);
  }

  async openProject(name) {
    await this.open();
    await this.searchProject(name);
    await this.projectCard(name).click();
    await expect(this.page.getByRole('heading', { name: 'Modules', exact: true })).toBeVisible();
    this.logStep(`Opened project: ${name}`);
  }
}

module.exports = { StudioProjectsPage };
