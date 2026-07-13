const { BasePage } = require('./BasePage');
const { TableTools } = require('../components/TableTools');

class GroupsPage extends BasePage {
  constructor(page) {
    super(page);
    this.table = new TableTools(page);
  }

  async open() {
    await this.openOrganizationMenu();
    await this.navigateViaSidebar('Groups');
  }

  async openGroupCardPanel() {
    await this.page
      .locator('div:nth-child(61) > .MuiPaper-root > .MuiBox-root.css-o8w36n > .MuiButtonBase-root')
      .click();
  }

  async runCardViewPanelWorkflow() {
    await this.openGroupCardPanel();
    await this.page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-outlined').click();

    await this.page.getByRole('textbox', { name: 'Search administrators...' }).fill('qa');
    await this.page
      .locator('.MuiBox-root.css-ftn5hm > div:nth-child(2) > .MuiButtonBase-root')
      .click();
    await this.wait(4000);

    await this.page.getByRole('tab', { name: 'Trainees' }).click();
    await this.page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-outlined').click();
    await this.page.getByRole('textbox', { name: 'Search by username' }).fill('mt');
    await this.page
      .locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall.css-5p7eof')
      .first()
      .click();
    await this.wait(4000);

    await this.page.getByRole('tab', { name: 'Access Modules' }).click();
    await this.page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-outlined').click();
    await this.page.locator('.MuiBox-root > div:nth-child(3) > .MuiButtonBase-root').click();
    await this.wait(4000);

    await this.page.getByRole('button', { name: 'Edit group details' }).click();
    await this.page.getByRole('textbox', { name: 'Group Name' }).fill('Should work');
    await this.page.getByRole('textbox', { name: 'Password' }).fill('1777');
    await this.wait(5000);
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.getByRole('button', { name: 'Close details panel' }).click();
    await this.wait(4000);

    await this.openGroupCardPanel();
    await this.wait(4000);
    await this.page.getByRole('button', { name: 'Close details panel' }).click();
  }

  async createGroup({ name, password, passwordField = 'Password' }) {
    await this.page.getByRole('button', { name: 'Add Group' }).click();
    await this.page.getByRole('textbox', { name: 'Group Name' }).fill(name);
    await this.page.getByRole('textbox', { name: passwordField }).fill(password);
    await this.page.getByRole('button', { name: 'Create Group' }).click();
  }

  async runFormEditorWorkflow() {
    await this.page.getByRole('button', { name: 'Form Editor' }).click();
    await this.createGroup({ name: 'Should work', password: '1777' });

    await this.page
      .getByRole('row', { name: 'Expand Toggle select row Should work' })
      .getByLabel('Row Actions')
      .click();
    await this.page.getByRole('menuitem', { name: 'Edit', exact: true }).click();
    await this.page.getByRole('textbox', { name: 'Group Name' }).fill('sss1');
    await this.page.getByRole('button', { name: 'Save Changes' }).click();

    await this.page
      .getByRole('row', { name: 'Expand Toggle select row sss1' })
      .getByLabel('Row Actions')
      .click();
    await this.page.getByText('Edit Password').click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill('4444');
    await this.page.getByRole('button', { name: 'Save Changes' }).click();

    await this.page
      .getByRole('row', { name: 'Expand Toggle select row sss1' })
      .getByLabel('Row Actions')
      .click();
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
    await this.page.getByRole('button', { name: 'ORG CHART' }).click();
  }

  async runTableToolsWorkflow() {
    await this.createGroup({ name: 'qqq', password: 'qq', passwordField: 'Group Password' });
    await this.page.getByRole('cell', { name: 'Expand' }).first().click();
    await this.table.cancelBulkDeleteForRow('Expand Toggle select row qqq');
    await this.table.toggleFullScreen();
    await this.table.openColumnsPanel();
    await this.table.toggleColumn('Toggle visibility Name');
    await this.table.closeBackdrop();
    await this.table.toggleFilters();
    await this.table.openColumnsPanel();
    await this.table.resetOrder();
    await this.page.getByRole('button', { name: 'Hide all' }).click();
    await this.page.getByRole('button', { name: 'Hide all' }).click();
    await this.page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();
  }

  async runFullGroupsWorkflow() {
    await this.runCardViewPanelWorkflow();
    await this.runFormEditorWorkflow();
    await this.runTableToolsWorkflow();
  }
}

module.exports = { GroupsPage };
