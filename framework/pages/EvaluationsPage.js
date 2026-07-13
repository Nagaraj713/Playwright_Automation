const { BasePage } = require('./BasePage');
const { ExportHelper } = require('../components/ExportHelper');
const { TableTools } = require('../components/TableTools');
const { testData } = require('../config/environment');

class EvaluationsPage extends BasePage {
  constructor(page) {
    super(page);
    this.export = new ExportHelper(page);
    this.table = new TableTools(page);
  }

  async open() {
    await this.navigateViaSidebar('Evaluations');
  }

  async exportPdfFromEvaluations() {
    await this.export.exportAsPdf();
    await this.export.clearNotificationsAndOpenExport();
    return this.export.downloadViaPopup(1);
  }

  async exportExcelFromEvaluations() {
    await this.export.exportAsExcel();
    await this.export.openCompletedExportNotification();
    return this.export.downloadViaDownloadEvent(1);
  }

  async viewIncompleteSession() {
    await this.page.getByRole('cell', { name: 'MCQ Mode' }).first().click();
    await this.page.getByRole('button', { name: 'Identifying objects' }).click();
    await this.page.getByRole('button', { name: 'Close' }).click();
  }

  async viewCompletedSession() {
    await this.page.getByRole('cell', { name: 'MCQ Mode' }).nth(3).click();
    await this.page.getByRole('button', { name: 'Identifying objects 30 / 30' }).click();
    await this.page.getByRole('button', { name: 'Close' }).click();
  }

  async runTableAndExportWorkflow() {
    await this.table.toggleFullScreen();
    await this.table.cancelBulkDeleteForRow(testData.evaluationBulkDeleteRow);
    await this.table.toggleFilters();
    await this.table.openColumnsPanel();
    await this.table.toggleColumn('Toggle visibility Name');
    await this.table.toggleColumn('Toggle visibility User');
    await this.table.toggleColumn('Toggle visibility Module');
    await this.table.toggleColumn('Player Mode');
    await this.table.toggleColumn('Session Time');
    await this.table.toggleColumn('Duration');
    await this.table.toggleColumn('Score');
    await this.table.toggleColumn('status');
    await this.table.toggleColumn('Group');
    await this.table.hideAllThenShow([
      'Toggle visibility Name',
      'Toggle visibility User',
      'Toggle visibility Module',
      'Toggle visibility Player Mode',
      'Toggle visibility Session Time',
      'Toggle visibility Duration',
      'Toggle visibility Score',
      'Toggle visibility status',
      'Toggle visibility Group',
    ]);
    await this.table.resetOrder();
    await this.table.closeBackdrop();
    await this.export.exportAsPdf();
    await this.export.clearNotificationsAndOpenExport();
    await this.export.downloadDirect(0);
  }
}

module.exports = { EvaluationsPage };
