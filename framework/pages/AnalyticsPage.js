const { BasePage } = require('./BasePage');

class AnalyticsPage extends BasePage {
  async open() {
    await this.navigateViaSidebar('Analytics');
  }

  async switchTabs() {
    await this.page.getByRole('tab', { name: 'Module Analytics' }).click();
    await this.wait(2000);
    await this.page.getByRole('tab', { name: 'Domain Analytics' }).click();
    await this.wait(2000);
    await this.page.getByRole('tab', { name: 'Department Analytics' }).click();
  }

  async runAiAnalyticsQuery() {
    await this.page.getByRole('button', { name: 'AI Analytics' }).click();
    await this.wait(2000);
    await this.page.getByRole('textbox', { name: 'Ask anything... e.g., Show me' }).click();
    await this.page
      .getByRole('textbox', { name: 'Ask anything... e.g., Show me' })
      .fill('I need a list of training data');
    await this.page.getByRole('main').getByRole('button').filter({ hasText: /^$/ }).click();
  }

  async customizeDashboard() {
    await this.open();
    await this.wait(2000);
    await this.page.getByRole('button', { name: 'customize Dashboard' }).click();
    await this.wait(2000);

    await this.page
      .locator('.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.css-1i25yv0')
      .first()
      .click();
    await this.page.locator('.MuiBox-root.css-k1v68u > div:nth-child(2)').click();
    await this.page
      .locator('div')
      .filter({ hasText: /^hello2Total count of active modules in the systemPie$/ })
      .first()
      .click();
    await this.page
      .locator(
        '.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeSmall.MuiButton-textSizeSmall.MuiButton-colorPrimary.css-1ytfe3k'
      )
      .click();
    await this.page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();

    await this.page.getByRole('button', { name: 'Analytics Library' }).click();
    await this.page.locator('.MuiBox-root.css-k1v68u > div:nth-child(2)').click();
    await this.page
      .locator(
        '.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeSmall.MuiButton-textSizeSmall.MuiButton-colorPrimary.css-1ytfe3k'
      )
      .click();

    await this.page.getByRole('button', { name: 'Save New Dashboard' }).click();
    await this.page.getByRole('textbox', { name: 'Enter a name for your' }).fill('qqqq');
    await this.page.getByRole('button', { name: 'Save Dashboard' }).click();
    await this.page.getByRole('button').first().click();
    await this.page.getByRole('checkbox', { name: 'Make Private Restrict access' }).check();
    await this.page.getByRole('button', { name: 'Save Dashboard' }).click();
    await this.page.getByRole('button', { name: 'Open' }).click();
    await this.page.getByRole('option', { name: 'Admin', exact: true }).click();
    await this.page.getByRole('button', { name: 'Save Dashboard' }).click();
  }

  async runModuleAnalyticsFilters() {
    await this.page.getByRole('tab', { name: 'Module Analytics' }).click();
    await this.page.getByRole('combobox').first().click();
    await this.wait(500);
    await this.page.getByRole('option', { name: 'Training Sessions' }).click();
    await this.wait(1000);

    await this.page.getByRole('combobox').nth(1).click();
    await this.wait(500);
    await this.page.getByRole('option', { name: 'Touch To Grab' }).click();
    await this.wait(1000);
    console.log('✅ Session Type: Training Sessions, Module: Touch To Grab set successfully!');

    await this.page.getByRole('combobox', { name: 'Filter by Domain Name' }).click();
    await this.wait(1000);
    await this.page.getByRole('option', { name: 'group8' }).click();
    await this.wait(1000);
    await this.closeBackdrop();
    await this.page.getByRole('button', { name: 'Clear filter' }).click();

    await this.page.getByRole('combobox', { name: 'Filter by Domain Name' }).click();
    await this.page.getByRole('option', { name: 'autovrse', exact: true }).click();
    await this.page.getByRole('option', { name: 'WebDomain', exact: true }).click();
    await this.page.getByRole('option', { name: 'WebDomain', exact: true }).click();
    await this.page.getByRole('option', { name: 'group10' }).click();
    await this.page.getByRole('option', { name: 'group9' }).click();
    await this.page.getByRole('option', { name: 'group6' }).click();
    await this.closeBackdrop();
    await this.page.getByRole('button', { name: 'Clear filter' }).click();
  }

  async runDomainAnalyticsFilters() {
    await this.page.getByRole('tab', { name: 'Domain Analytics' }).click();
    await this.wait(1000);

    await this.page.getByText('Evaluation Sessions').click();
    await this.page.getByRole('option', { name: 'Training Sessions' }).click();

    await this.page.getByRole('button', { name: 'group1' }).click();
    await this.page.getByRole('paragraph').filter({ hasText: /^AutoVRse$/ }).click();
    await this.page.getByRole('combobox', { name: 'Filter by Module Name' }).click();
    await this.closeBackdrop();

    await this.page.getByRole('button', { name: 'AutoVRse' }).click();
    await this.page.getByRole('button').nth(1).click();
    await this.page
      .locator('div')
      .filter({ hasText: /^autovrse Department 2$/ })
      .nth(1)
      .click();
    await this.page.getByRole('combobox', { name: 'Filter by Module Name' }).click();
    await this.closeBackdrop();

    await this.page.getByRole('button', { name: 'autovrse Department' }).click();
    await this.page.getByRole('textbox', { name: 'Search domains...' }).click();
    await this.page.getByRole('textbox', { name: 'Search domains...' }).press('CapsLock');
    await this.page.getByRole('textbox', { name: 'Search domains...' }).fill('Pla');
    await this.page.getByText('Platform Team', { exact: true }).click();

    await this.page.getByRole('combobox', { name: 'Filter by Module Name' }).click();
    for (const moduleName of [
      'Touch To Grab',
      'Adhock Testing',
      'Multi Role Story',
      'Live Link Story',
      'Localization',
    ]) {
      await this.page.getByRole('option', { name: moduleName }).click();
    }
    await this.closeBackdrop();
    await this.page.getByRole('button', { name: 'Clear filter' }).click();
  }

  async runDepartmentAnalyticsFilters() {
    await this.page.getByRole('tab', { name: 'Department Analytics' }).click();
    await this.wait(1000);

    await this.page.getByText('Training Sessions').click();
    await this.page.getByRole('option', { name: 'Evaluation Sessions' }).click();

    await this.page.getByRole('button', { name: 'Select Domain' }).click();
    await this.page.getByRole('paragraph').filter({ hasText: /^AutoVRse$/ }).click();
    await this.page.getByRole('combobox').nth(1).click();
    await this.page.getByRole('option', { name: 'All Departments' }).click();

    await this.page.getByText('Filter by Module Name').click();
    for (const moduleName of [
      'MCQ Mode',
      'Moment Life Cycle Mode',
      'Load AFT Change Parts Training',
      'Test Cycle Training',
    ]) {
      await this.page.getByRole('option', { name: moduleName }).click();
    }
    await this.closeBackdrop();
    await this.page.getByRole('button', { name: 'Clear filter' }).click();

    await this.page.getByRole('button', { name: 'AutoVRse' }).click();
    await this.page.getByRole('button').nth(1).click();
    await this.page
      .locator('div')
      .filter({ hasText: /^autovrse Department$/ })
      .nth(1)
      .click();
  }

  async runFullAnalyticsWorkflow() {
    await this.wait(5000);
    await this.switchTabs();
    await this.runAiAnalyticsQuery();
    await this.customizeDashboard();
    await this.runModuleAnalyticsFilters();
    await this.runDomainAnalyticsFilters();
    await this.runDepartmentAnalyticsFilters();
  }

  async runModuleAnalyticsDropdowns() {
    await this.open();
    await this.page.getByRole('tab', { name: 'Module Analytics' }).click();

    await this.page.getByText('Evaluation Sessions').click();
    await this.page.getByRole('option', { name: 'Training Sessions' }).click();
    await this.wait(1000);
    await this.page.getByText('Training Sessions').click();
    await this.page.getByRole('option', { name: 'Evaluation Sessions' }).click();

    await this.page.getByRole('option', { name: 'VO editing dummy' }).click();
    await this.page.getByRole('option', { name: 'Cell Shooter' }).click();
    await this.page.getByText('FILTER BY DOMAIN NAME').click();
    await this.page.getByText('Demo Domain').nth(1).click();
  }
}

module.exports = { AnalyticsPage };
