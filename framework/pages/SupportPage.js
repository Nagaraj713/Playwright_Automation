const { BasePage } = require('./BasePage');
const { files } = require('../config/environment');

class SupportPage extends BasePage {
  attachErrorListeners() {
    const state = { pageError: null, consoleMessages: [] };

    this.page.on('console', (msg) => {
      state.consoleMessages.push({ type: msg.type(), text: msg.text() });
      if (msg.type() === 'error') {
        console.log(`❌ Console Error: ${msg.text()}`);
      }
    });

    this.page.on('pageerror', (err) => {
      state.pageError = err;
      console.log(`❌ Page Error: ${err.message}`);
    });

    return state;
  }

  async openForm() {
    await this.page.getByRole('button', { name: 'Get Support' }).click();
  }

  async fillSupportForm({
    fullName = 'John Doe',
    email = 'john.doe@example.com',
    subject = 'Support Request',
    description = 'I need help with the dashboard.',
    videoPath = files.supportVideo,
  } = {}) {
    await this.page.getByRole('textbox', { name: 'Full Name' }).fill(fullName);
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);

    await this.page.getByRole('combobox', { name: 'Select Type Of Request' }).click();
    await this.page.getByRole('option', { name: 'Installation Setup' }).click();
    await this.page.getByRole('combobox', { name: 'Select Type Of Request' }).click();
    await this.page.getByRole('option', { name: 'Hardware Issues' }).click();
    await this.page.getByRole('button', { name: 'Open' }).first().click();
    await this.page.getByRole('option', { name: 'Bug Fixes' }).click();

    await this.page.getByRole('textbox', { name: 'Subject' }).fill(subject);
    await this.page.getByRole('textbox', { name: 'Description' }).fill(description);

    await this.page.getByRole('combobox', { name: 'Select Priority Of Request' }).click();
    await this.page.getByRole('option', { name: 'Low' }).click();
    await this.page.getByRole('button', { name: 'Open' }).nth(1).click();
    await this.page.getByRole('option', { name: 'Medium' }).click();

    await this.page.getByText('browse').click();
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.page.locator('div.MuiStack-root.css-1fe5hl1').click(),
    ]);
    await fileChooser.setFiles(videoPath);
  }

  async submitAndReportErrors(state) {
    try {
      await this.page.getByRole('button', { name: 'Submit Request' }).click();
      await this.wait(2000);

      const errorElements = await this.page
        .locator('[role="alert"], .error, .alert-danger, [class*="error"]')
        .count();
      if (errorElements > 0) {
        const errorText = await this.page
          .locator('[role="alert"], .error, .alert-danger, [class*="error"]')
          .first()
          .textContent();
        console.log(`❌ Error Message Found: ${errorText}`);
      }

      console.log('✅ Support request submitted successfully');
    } catch (error) {
      console.log(`❌ Submission Error: ${error.message}`);
      throw error;
    }

    if (state.pageError) {
      console.log(`❌ Final Page Error Summary: ${state.pageError.message}`);
    }
    if (state.consoleMessages.filter((m) => m.type === 'error').length > 0) {
      console.log('❌ Console errors were captured during test');
    }
  }

  async runFullSupportWorkflow() {
    const state = this.attachErrorListeners();
    console.log('✅ Logged in successfully');
    await this.openForm();
    await this.fillSupportForm();
    await this.submitAndReportErrors(state);
  }
}

module.exports = { SupportPage };
