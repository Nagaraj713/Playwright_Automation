const { BasePage } = require('./BasePage');
const { ExportHelper } = require('../components/ExportHelper');
const { TableTools } = require('../components/TableTools');
const { testData } = require('../config/environment');

class TrainingsPage extends BasePage {
  constructor(page) {
    super(page);
    this.export = new ExportHelper(page);
    this.table = new TableTools(page);
  }

  async open() {
    await this.navigateViaSidebar('Trainings');
    await this.wait(2000);
  }

  async viewIncompleteSession() {
    await this.page.getByText('Camp8- Nupur').first().click();
    await this.page.getByRole('button', { name: 'The Blossom Ritual -' }).click();
    await this.page.getByRole('button', { name: 'Close' }).click();
  }

  async viewCompletedSession() {
    await this.page.getByRole('cell', { name: 'Camp8- Nupur' }).nth(1).click();
    await this.page.getByRole('button', { name: 'The Dark Awakening And First Drain' }).click();
    await this.page.getByRole('button', { name: 'Close' }).click();
  }

  async runTableAndExportWorkflow() {
    await this.table.cancelBulkDeleteForRow(testData.trainingBulkDeleteRow);
    await this.table.toggleFilters();
    await this.table.openColumnsPanel();
    for (const col of [
      'Toggle visibility Name',
      'Toggle visibility Group',
      'Toggle visibility Module',
      'Player Mode',
      'Session Time',
      'Duration',
      'status',
    ]) {
      await this.table.toggleColumn(col);
    }
    await this.table.hideAllThenShow([
      'Toggle visibility Name',
      'Toggle visibility Group',
      'Toggle visibility Module',
      'Toggle visibility Player Mode',
      'Toggle visibility Session Time',
      'Toggle visibility Duration',
      'Toggle visibility status',
    ]);
    await this.table.resetOrder();
    await this.table.closeBackdrop();

    await this.export.exportAsPdf();
    await this.export.clearNotificationsAndOpenExport();
    await this.export.downloadDirect(0);
  }

  async runFullTrainingsWorkflow() {
    await this.viewIncompleteSession();
    await this.viewCompletedSession();
    await this.runTableAndExportWorkflow();
  }
}

module.exports = { TrainingsPage };
