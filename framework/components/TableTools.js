/** Shared MUI data-table toolbar actions used across Pulse pages. */
class TableTools {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async toggleFilters() {
    await this.page.getByRole('button', { name: 'Show/Hide filters' }).click();
    await this.page.getByRole('button', { name: 'Show/Hide filters' }).click();
  }

  async toggleFullScreen() {
    await this.page.getByRole('button', { name: 'Toggle full screen' }).click();
    await this.page.getByLabel('Toggle full screen').click();
  }

  columnsMenu() {
    return this.page.getByRole('menu');
  }

  async toggleColumn(name) {
    const checkbox = this.columnsMenu().getByRole('checkbox', { name });
    await checkbox.click();
    await checkbox.click();
  }

  async openColumnsPanel() {
    await this.page.getByRole('button', { name: 'Show/Hide columns' }).click();
    await this.columnsMenu().waitFor({ state: 'visible' });
  }

  async hideAllThenShow(columns) {
    const menu = this.columnsMenu();
    await menu.getByRole('button', { name: 'Hide all' }).click();
    for (const column of columns) {
      await menu.getByRole('checkbox', { name: column }).check();
    }
  }

  async resetOrder(buttonName = 'Reset order') {
    await this.columnsMenu().getByRole('button', { name: buttonName }).click();
  }

  async closeBackdrop() {
    await this.page.locator('.MuiBackdrop-root').click();
  }

  async cancelBulkDeleteForRow(rowName) {
    const row = this.page.getByRole('row', { name: rowName });
    await row.getByRole('checkbox').check();
    await this.page.getByRole('button', { name: 'Bulk delete' }).click();
    await this.page.getByRole('button', { name: 'No' }).click();
    await row.getByRole('checkbox').uncheck();
  }

  async dragColumnAbove(sourceMenuItem, targetMenuItem) {
    await this.openColumnsPanel();
    await this.page.waitForTimeout(1000);

    const sourceBtn = this.page
      .getByRole('menuitem', { name: sourceMenuItem })
      .getByLabel('Move');
    const targetItem = this.page.getByRole('menuitem', { name: targetMenuItem });

    const sourceBox = await sourceBtn.boundingBox();
    const targetBox = await targetItem.boundingBox();

    const startX = sourceBox.x + sourceBox.width / 2;
    const startY = sourceBox.y + sourceBox.height / 2;
    const endX = targetBox.x + targetBox.width / 2;
    const endY = targetBox.y;

    await this.page.mouse.move(startX, startY);
    await this.page.waitForTimeout(500);
    await this.page.mouse.down();
    await this.page.waitForTimeout(800);

    const totalSteps = 50;
    for (let i = 1; i <= totalSteps; i++) {
      const x = startX + (endX - startX) * (i / totalSteps);
      const y = startY + (endY - startY) * (i / totalSteps);
      await this.page.mouse.move(x, y);
      await this.page.waitForTimeout(20);
    }

    await this.page.waitForTimeout(500);
    await this.page.mouse.up();
    await this.page.waitForTimeout(1000);
  }
}

module.exports = { TableTools };
