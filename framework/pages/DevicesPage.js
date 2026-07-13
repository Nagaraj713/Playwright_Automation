const { BasePage } = require('./BasePage');
const { ExportHelper } = require('../components/ExportHelper');
const { testData } = require('../config/environment');

class DevicesPage extends BasePage {
  constructor(page) {
    super(page);
    this.export = new ExportHelper(page);
  }

  async open() {
    await this.navigateViaSidebar('Devices');
  }

  async viewDeviceDetails(deviceText = testData.deviceDetailText) {
    await this.page.getByText(deviceText).click();
    await this.page.evaluate(() => {
      const dialog = document.querySelector('.MuiDialogContent-root');
      if (dialog) dialog.scrollBy({ top: 800, behavior: 'smooth' });
    });
    await this.wait(1500);
    await this.page.getByRole('button', { name: 'Close' }).click();
  }

  async exportPdfViaJobs() {
    await this.export.exportAsPdf();
    return this.export.downloadFromExportJobs(0);
  }

  async runFullDevicesWorkflow() {
    await this.viewDeviceDetails();
    return this.exportPdfViaJobs();
  }
}

module.exports = { DevicesPage };
