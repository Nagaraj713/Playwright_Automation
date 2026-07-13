const { BasePage } = require('./BasePage');

class SchedulesPage extends BasePage {
  async open() {
    await this.navigateViaSidebar('Schedules');
    await this.wait(4000);
  }

  async viewScheduleDetails() {
    await this.page.getByRole('cell', { name: 'check march' }).getByRole('paragraph').click();
    await this.page.getByRole('button', { name: 'Go back to schedules list' }).click();

    await this.page.getByRole('cell', { name: 'QATest6 - Today Range' }).click();
    await this.page.getByRole('button', { name: 'Go back to schedules list' }).click();
  }

  async editScheduleName(fromRow, newName) {
    await this.page.getByRole('row', { name: fromRow }).getByLabel('Row Actions').click();
    await this.page.getByText('Edit').click();
    await this.page.getByRole('textbox', { name: 'Enter schedule name' }).fill(newName);
    await this.page.getByRole('button', { name: 'Save Changes' }).click();
  }

  async cancelDeleteSchedule(rowName) {
    await this.page.getByRole('row', { name: rowName }).getByLabel('Row Actions').click();
    await this.page.getByText('Delete').click();
    await this.page.getByRole('button', { name: 'No' }).click();
  }

  async createSchedule({ name, groupName, usernameSearch, userDisplayName }) {
    await this.page.getByRole('button', { name: 'Add schedule' }).click();
    await this.page.getByRole('textbox', { name: 'Enter experience name' }).fill(name);

    await this.page.getByRole('button', { name: 'Select Modules' }).click();
    await this.page.getByRole('button').nth(3).click();
    await this.page.getByRole('button', { name: 'Hide Modules' }).click();
    await this.page.getByRole('button', { name: 'Next' }).click();

    await this.page.getByLabel('Add Schedule').getByText('23').click();
    await this.page.getByText('30').nth(4).click();
    await this.page.getByRole('checkbox', { name: 'Training' }).check();
    await this.page.getByRole('checkbox', { name: 'Evaluation' }).check();
    await this.page.getByRole('button', { name: 'Next' }).click();

    await this.page.getByRole('button', { name: 'Select Groups' }).click();
    await this.page.getByText(groupName).click();
    await this.page.getByRole('button', { name: 'Hide Groups' }).click();

    await this.page.getByRole('button', { name: 'Select Users' }).click();
    await this.page.getByRole('textbox', { name: 'Search by username...' }).fill(usernameSearch);
    await this.page.getByText(userDisplayName).click();
    await this.page.getByRole('button', { name: 'Create Schedule' }).click();
    await this.wait(4000);
  }

  async confirmDeleteSchedule(rowName) {
    await this.page.getByRole('row', { name: rowName }).getByLabel('Row Actions').click();
    await this.page.getByText('Delete').click();
    await this.page.getByRole('button', { name: 'Yes' }).click();
  }

  async runCalendarPopoverInteractions() {
    await this.page.locator('span').filter({ hasText: 'check march' }).click();
    await this.closeBackdrop();
    await this.page.locator('span').filter({ hasText: 'Claude' }).click();
    await this.closeBackdrop();
    await this.page
      .locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall.css-u27xt2')
      .first()
      .click();
    await this.page.locator('button:nth-child(3)').click();
    await this.page.locator('span').filter({ hasText: 'check march' }).click();
    await this.closeBackdrop();
  }

  async runFullSchedulesWorkflow() {
    await this.viewScheduleDetails();
    await this.editScheduleName('check march 29 Groups:', 'check march 28');
    await this.cancelDeleteSchedule('check march 28 Groups:');
    await this.createSchedule({
      name: 'New Automated Schedule',
      groupName: 'qqq',
      usernameSearch: 'mt3',
      userDisplayName: 'MigrationTrainee3',
    });
    console.log('✅ New schedule created successfully');
    await this.confirmDeleteSchedule('New Automated Schedule Groups:');
    console.log('✅ Schedule deleted successfully');
    await this.runCalendarPopoverInteractions();
  }
}

module.exports = { SchedulesPage };
