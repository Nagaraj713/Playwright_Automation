const { expect } = require('@playwright/test');
const { StudioBasePage } = require('./StudioBasePage');

class StudioModulesPage extends StudioBasePage {
  async open() {
    const modulesHeading = this.page.getByRole('heading', { name: 'Modules', exact: true });
    if (await modulesHeading.isVisible()) {
      return;
    }
    await this.page.getByRole('navigation', { name: 'breadcrumb' }).getByText('Modules', { exact: true }).click();
    await expect(modulesHeading).toBeVisible();
  }

  async searchModule(name) {
    const search = this.page.getByPlaceholder('Search modules...');
    if (await search.isVisible()) {
      await search.fill(name);
    }
  }

  moduleCard(name) {
    return this.page.locator('.chakra-card').filter({
      has: this.page.getByRole('img', { name }),
    });
  }

  async expectModuleVisible(name) {
    await this.searchModule(name);
    await expect(this.moduleCard(name)).toBeVisible();
  }

  async openModuleMenu(name) {
    await this.searchModule(name);
    await this.moduleCard(name).getByRole('button', { name: 'More options' }).click();
  }

  async selectModuleType(dialog, type) {
    await dialog.getByText(type, { exact: true }).click();
  }

  async createModule({ name, description, type = 'Training' }) {
    await this.page.getByRole('button', { name: 'Create Module', exact: true }).first().click();
    const dialog = this.dialog();
    await dialog.getByPlaceholder('Enter a descriptive name for').fill(name);
    await dialog.getByRole('textbox', { name: 'Describe what this module is' }).fill(description);
    await this.selectModuleType(dialog, type);
    await dialog.getByRole('button', { name: 'Create Module' }).click();
    await expect(this.page.getByText('Module created')).toBeVisible({ timeout: 30000 });
    await expect(dialog).toBeHidden({ timeout: 30000 });
    await expect(
      this.page.getByRole('navigation', { name: 'breadcrumb' }).getByText(name, { exact: true }),
    ).toBeVisible();
    this.logStep(`Created module: ${name}`);
  }

  async editModule(currentName, { name, description, type }) {
    await this.open();
    await this.openModuleMenu(currentName);
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    const dialog = this.dialog();
    await dialog.getByPlaceholder('Enter a descriptive name for').fill(name);
    if (description) {
      await dialog.getByRole('textbox', { name: 'Describe what this module is' }).fill(description);
    }
    if (type) {
      await this.selectModuleType(dialog, type);
    }
    await dialog.getByRole('button', { name: 'Update Module' }).click();
    await expect(dialog).toBeHidden();
    await this.expectModuleVisible(name);
    if (type) {
      await expect(this.moduleCard(name).getByText(type, { exact: true })).toBeVisible();
    }
    this.logStep(`Updated module: ${currentName} → ${name}`);
  }

  async deleteModule(name) {
    await this.open();
    await this.openModuleMenu(name);
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
    await this.page.getByRole('button', { name: 'Delete module' }).click();
    await expect(this.page.getByRole('heading', { name: 'Modules', exact: true })).toBeVisible();
    await this.searchModule(name);
    await expect(this.moduleCard(name)).toHaveCount(0);
    this.logStep(`Deleted module: ${name}`);
  }

  async openModule(name) {
    await this.open();

    const emptyState = this.page.getByRole('heading', { name: /no modules yet/i });
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (await emptyState.isVisible().catch(() => false)) {
        await this.page.reload({ waitUntil: 'domcontentloaded' });
        await expect(this.page.getByRole('heading', { name: 'Modules', exact: true })).toBeVisible({
          timeout: 30000,
        });
        await this.page.waitForTimeout(1500);
        continue;
      }

      await this.searchModule(name);
      const card = this.moduleCard(name);
      if (await card.isVisible({ timeout: 10000 }).catch(() => false)) {
        await card.click();
        await expect(this.page.getByRole('heading', { name: 'Experiences', exact: true })).toBeVisible({
          timeout: 30000,
        });
        this.logStep(`Opened module: ${name}`);
        return;
      }

      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await expect(this.page.getByRole('heading', { name: 'Modules', exact: true })).toBeVisible({
        timeout: 30000,
      });
      await this.page.waitForTimeout(1500);
    }

    throw new Error(`Could not open module "${name}" — modules list remained empty or module card not found.`);
  }
}

module.exports = { StudioModulesPage };
