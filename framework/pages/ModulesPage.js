const { BasePage } = require('./BasePage');
const { TableTools } = require('../components/TableTools');
const { testData } = require('../config/environment');

class ModulesPage extends BasePage {
  constructor(page) {
    super(page);
    this.table = new TableTools(page);
  }

  async open() {
    await this.navigateViaSidebar('Modules');
  }

  async assignModuleToEntities(moduleRow = testData.moduleRow) {
    await this.page.getByRole('row', { name: moduleRow }).getByRole('checkbox').check();
    await this.page.getByRole('button', { name: 'Assign Modules' }).click();

    await this.page.getByRole('textbox', { name: 'Search' }).click();
    await this.page.getByRole('button', { name: 'Senior QA Group' }).click();

    await this.page.getByRole('tab', { name: 'Department Access' }).click();
    await this.page.getByRole('textbox', { name: 'Search' }).click();

    await this.page.getByRole('tab', { name: 'User Special Access' }).click();
    await this.page
      .getByRole('button', { name: 'test1 group1 User delete' })
      .getByRole('checkbox')
      .check();

    await this.page.getByRole('tab', { name: 'Domain' }).click();
    await this.page.getByRole('textbox', { name: 'Search' }).click();
    await this.page.getByRole('button', { name: 'Senior QA Group' }).click();
    await this.page.getByRole('button', { name: 'QA Jr Group' }).click();
    await this.page.getByRole('button', { name: 'Assign' }).click();
  }

  async removeAssignedEntities(moduleRow = testData.moduleRow) {
    await this.page.getByRole('row', { name: moduleRow }).getByRole('checkbox').check();
    await this.page.getByRole('row', { name: moduleRow }).getByLabel('Row Actions').click();
    await this.page.getByText('Assigned Entities').click();

    await this.page.getByRole('textbox', { name: 'Search' }).click();
    await this.page.getByRole('textbox', { name: 'Search' }).fill('qa');
    await this.page.getByRole('button', { name: 'QA Jr Group' }).getByRole('checkbox').uncheck();
    await this.page.getByRole('button', { name: 'Senior QA Group' }).getByRole('checkbox').uncheck();
    await this.page.getByRole('button', { name: 'Assign' }).click();

    await this.page.getByRole('row', { name: moduleRow }).getByLabel('Row Actions').click();
    await this.page.getByText('Assigned Entities').click();
    await this.page.getByRole('tab', { name: 'User Special Access' }).click();
    await this.page.getByRole('textbox', { name: 'Search' }).click();
    await this.page
      .getByRole('button', { name: 'test1 group1 User delete' })
      .getByRole('checkbox')
      .uncheck();
    await this.page.getByRole('button', { name: 'Assign' }).click();
  }

  async runTableTools(moduleRow = testData.moduleRow) {
    await this.page.getByRole('row', { name: moduleRow }).getByRole('checkbox').check();
    await this.page.getByRole('button', { name: 'Bulk delete' }).click();
    await this.page.getByRole('button', { name: 'No' }).click();
    await this.page.getByRole('row', { name: moduleRow }).getByRole('checkbox').uncheck();

    await this.table.toggleFilters();
    await this.table.toggleFullScreen();
    await this.table.openColumnsPanel();
    for (const col of [
      'Toggle visibility Name',
      'Toggle visibility Project Name',
      'Toggle visibility Index',
      'Toggle visibility Tags',
      'Toggle visibility Description',
    ]) {
      await this.table.toggleColumn(col);
    }
    await this.page.getByRole('button', { name: 'Hide all' }).click();
    await this.page.getByRole('button', { name: 'Show all' }).click();
  }

  async reorderColumns() {
    await this.table.dragColumnAbove(
      'Move Toggle visibility Project Name',
      'Move Toggle visibility Name'
    );
    await this.page.getByRole('button', { name: 'Reset Order' }).click();
    await this.table.closeBackdrop();
  }

  async runAssignModuleWorkflow() {
    await this.assignModuleToEntities();
    await this.removeAssignedEntities();
    await this.runTableTools();
    await this.reorderColumns();
  }
}

module.exports = { ModulesPage };
