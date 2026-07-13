/** Export-to-PDF/Excel flows via the notification panel. */
class ExportHelper {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async openExportMenu() {
    await this.page.getByRole('button', { name: 'Export', exact: true }).click();
  }

  async exportAsPdf() {
    await this.openExportMenu();
    await this.page.getByRole('button', { name: 'Export As PDF' }).click();
    await this.page.waitForTimeout(2000);
  }

  async exportAsExcel() {
    await this.openExportMenu();
    await this.page.getByRole('button', { name: 'Export As Excel' }).click();
  }

  async openCompletedExportNotification() {
    await this.page.getByRole('button', { name: 'Export completed - Click to' }).click();
  }

  async clearNotificationsAndOpenExport() {
    await this.page.getByRole('button', { name: '1' }).click();
    await this.page.getByRole('button', { name: 'Clear all notifications' }).click();
    await this.openCompletedExportNotification();
  }

  async downloadViaPopup(index = 1) {
    const popupPromise = this.page.waitForEvent('popup');
    await this.page.getByRole('button', { name: 'Download' }).nth(index).click();
    return popupPromise;
  }

  async downloadViaDownloadEvent(index = 1) {
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.getByRole('button', { name: 'Download' }).nth(index).click();
    return downloadPromise;
  }

  async downloadFromExportJobs(index = 0) {
    await this.page.getByRole('button', { name: 'View Export Jobs' }).click();
    const popupPromise = this.page.waitForEvent('popup');
    await this.page.getByRole('button', { name: 'Download' }).nth(index).click();
    return popupPromise;
  }

  async downloadDirect(index = 0) {
    await this.page.waitForTimeout(5000);
    await this.page.getByRole('button', { name: 'Download' }).nth(index).click();
  }
}

module.exports = { ExportHelper };
