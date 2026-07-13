const { BasePage } = require('./BasePage');
const { TableTools } = require('../components/TableTools');
const { testData, credentials } = require('../config/environment');

class UsersPage extends BasePage {
  constructor(page) {
    super(page);
    this.table = new TableTools(page);
  }

  async openDirect() {
    await this.goto(this.routes.users);
    await this.page.waitForSelector('button[aria-label], button', { timeout: 1000 });
  }

  async openViaSidebar() {
    await this.navigateViaSidebar('Users');
    await this.page.waitForLoadState('networkidle');
    await this.wait(1000);
  }

  async createSuperAdmin({ name, username, password }) {
    await this.page.getByRole('button', { name: 'Add Super Admin' }).click();
    await this.page.waitForSelector('div[role="dialog"]');
    await this.dialog().locator('input[name="name"]').fill(name);
    await this.dialog().locator('input[name="username"]').fill(username);
    await this.dialog().locator('input[name="password"]').fill(password);
    await this.page.getByRole('button', { name: 'Create User' }).click();
    await this.wait(1500);
  }

  async createAdmin({ name, username, password, groups = [] }) {
    await this.page.getByRole('button', { name: 'Add Admin' }).click();
    await this.page.waitForSelector('div[role="dialog"]');
    await this.dialog().locator('input[name="name"]').fill(name);
    await this.dialog().locator('input[name="username"]').fill(username);
    await this.dialog().locator('input[name="password"]').fill(password);

    for (const group of groups) {
      await this.dialog().getByRole('combobox').click();
      await this.wait(500);
      await this.page.keyboard.type(group);
      await this.wait(1000);
      await this.page.locator('ul[role="listbox"] li').filter({ hasText: group }).first().click();
    }

    await this.page.getByRole('button', { name: 'Create User' }).click();
    await this.wait(1500);
  }

  async deleteUserByRowText(rowText) {
    const row = this.page.locator('tr').filter({ hasText: rowText });
    await row.locator('button').last().click();
    await this.wait(500);
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
    await this.wait(1500);
  }

  async createTrainee({ displayName, employeeCode, groups = [] }) {
    await this.page.getByRole('button', { name: 'Add Trainee' }).click();
    await this.wait(2000);
    await this.page.getByRole('textbox', { name: 'Display Name' }).fill(displayName);

    if (groups.length) {
      await this.page.getByRole('combobox', { name: 'Groups' }).click();
      await this.wait(500);
      for (const group of groups) {
        await this.page.evaluate((groupName) => {
          const options = [...document.querySelectorAll('li')];
          options.find((el) => el.textContent.trim() === groupName)?.click();
        }, group);
        await this.wait(300);
      }
      await this.page.keyboard.press('Escape');
      await this.wait(500);
    }

    await this.page.getByRole('textbox', { name: 'Employee Code' }).fill(employeeCode);
    await this.page.getByRole('button', { name: 'Create User' }).click();
    await this.wait(3000);
  }

  async deleteFirstTableUser() {
    await this.page.locator('table tbody tr').first().locator('button').click();
    await this.wait(1000);
    await this.page.getByText('Delete').click();
    await this.wait(2000);
  }

  async runAdminCrudWorkflow() {
    await this.createSuperAdmin({ name: 'QA2', username: 'Q', password: 'w' });
    console.log('✅ Super Admin (QA2) created successfully');

    await this.createAdmin({
      name: 'Automated',
      username: 'Claude',
      password: 'w',
      groups: ['QA1', 'group1'],
    });
    console.log('✅ Admin (Automated/Claude) created successfully');

    await this.deleteUserByRowText('Automated');
    console.log('✅ Admin user (Automated) deleted successfully');

    await this.deleteUserByRowText('QA2');
    console.log('✅ Super Admin user (QA2) deleted successfully');
    console.log('\n🎉 All tasks completed successfully!');
  }

  async runTraineeWorkflow() {
    await this.createTrainee({
      displayName: 'q',
      employeeCode: '1',
      groups: ['QA1', 'Senior QA'],
    });
    await this.deleteFirstTableUser();
    console.log('✅ Trainee created and deleted successfully!');
  }

  async runTableToolsForUser(testRow = testData.usersRow) {
    await this.page.getByRole('row', { name: testRow }).getByRole('checkbox').check();
    await this.page.getByRole('button', { name: 'Bulk delete' }).click();
    await this.page.getByRole('button', { name: 'No' }).click();
    await this.page.getByRole('row', { name: testRow }).getByRole('checkbox').uncheck();

    await this.table.toggleFilters();
    await this.table.toggleFullScreen();
    await this.table.openColumnsPanel();
    for (const col of [
      'Toggle visibility Name',
      'Toggle visibility Username',
      'Toggle visibility Role',
      'Toggle visibility Group',
    ]) {
      await this.table.toggleColumn(col);
    }
    await this.table.closeBackdrop();
  }

  async assignModulesToUser(testRow = testData.usersRow) {
    await this.page.getByRole('row', { name: testRow }).getByRole('checkbox').check();
    await this.page.getByRole('button', { name: 'Assign Modules' }).click();
    await this.page.getByRole('button', { name: 'Close' }).click();
    await this.page.getByRole('button', { name: 'Assign Modules' }).click();
    await this.page.getByRole('button', { name: 'QA_Test_1 Created on: 4/16/' }).click();
    await this.page.getByRole('button', { name: 'Test QA 1 Created on: 4/16/' }).click();
    await this.page
      .locator('div:nth-child(10) > .MuiButtonBase-root > .PrivateSwitchBase-input')
      .check();
    await this.page.getByRole('button', { name: 'Assign Modules' }).click();
  }

  async verifyAssignedModulesOnModulesPage() {
    await this.navigateViaSidebar('Modules');
    for (const rowIndex of [8, 9]) {
      await this.page
        .locator(
          `tr:nth-child(${rowIndex}) > .MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeMedium.css-2eatx8 > .MuiButtonBase-root`
        )
        .click();
      await this.page.getByText('Assigned Entities').click();
      await this.page.getByRole('tab', { name: 'User Special Access' }).click();
      await this.page.getByRole('button', { name: 'Close' }).click();
    }
  }

  async editUserDetails(testRow = testData.usersRow) {
    await this.openViaSidebar();
    await this.page.getByRole('row', { name: testRow }).getByLabel('Row Actions').click();
    await this.page.getByRole('menuitem', { name: 'Edit', exact: true }).click();

    await this.page.getByRole('textbox', { name: 'Display Name' }).fill('test456 edited');
    await this.page.getByRole('textbox', { name: 'Employee Code' }).fill('1234546');

    await this.page.getByRole('button', { name: 'Open' }).click();
    await this.page.getByRole('option', { name: 'group22', exact: true }).click();
    await this.page.getByTitle('Close').click();

    await this.page.getByRole('button', { name: 'Open' }).click();
    await this.page.getByRole('option', { name: 'group4' }).click();
    await this.page.getByTitle('Close').click();
    await this.page.getByRole('button', { name: 'Save Changes' }).click();
  }

  async editUserPasswordOnNextPage() {
    await this.page.getByRole('button', { name: 'Go to next page' }).click();
    await this.page
      .getByRole('row', { name: 'Toggle select row TestUser' })
      .getByLabel('Row Actions')
      .click();
    await this.page.getByRole('menuitem', { name: 'Edit Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill('1');
    await this.page.getByRole('button', { name: 'Save Changes' }).click();
  }

  async reloginAndOpenViaSidebar() {
    await this.goto(this.routes.login);
    await this.page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.openViaSidebar();
  }

  async runFullUsersWorkflow() {
    await this.runAdminCrudWorkflow();
    await this.reloginAndOpenViaSidebar();
    await this.runTraineeWorkflow();
    await this.runTableToolsForUser();
    await this.assignModulesToUser();
    await this.verifyAssignedModulesOnModulesPage();
    await this.editUserDetails();
    await this.editUserPasswordOnNextPage();
  }
}

module.exports = { UsersPage };
