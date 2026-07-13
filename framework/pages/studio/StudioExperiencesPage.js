const JOURNEY_OPTIONS = ['Use Template', 'VRseAI', 'Load JSON', 'Go with AI'];

const { expect } = require('@playwright/test');
const path = require('path');
const { StudioBasePage } = require('./StudioBasePage');

const SAMPLE_JSON_PATH = path.join(__dirname, '../../test-data/sample-experience.json');

class StudioExperiencesPage extends StudioBasePage {
  async assertJourneySurfaceVisible() {
    const backButton = this.page.getByRole('button', { name: 'Back', exact: true });
    const useTemplate = this.page.getByText('Use Template', { exact: true });
    const nonTechnical = this.page.getByRole('button', { name: 'Non-Technical', exact: true });
    const technical = this.page.getByRole('button', { name: 'Technical', exact: true });

    if (await backButton.isVisible().catch(() => false)) {
      return;
    }
    if (await useTemplate.isVisible().catch(() => false)) {
      return;
    }
    if ((await nonTechnical.isVisible().catch(() => false))
      && (await technical.isVisible().catch(() => false))) {
      return;
    }

    await expect(useTemplate.or(nonTechnical)).toBeVisible({ timeout: 45000 });
  }

  async goBackToList() {
    await this.page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'Experiences', exact: true })).toBeVisible();
  }

  async open() {
    const experiencesHeading = this.page.getByRole('heading', { name: 'Experiences', exact: true });
    if (await experiencesHeading.isVisible()) {
      return;
    }
    const backButton = this.page.getByRole('button', { name: 'Back', exact: true });
    if (await backButton.isVisible()) {
      await this.goBackToList();
      return;
    }
    const breadcrumb = this.page.getByRole('navigation', { name: 'breadcrumb' });
    const moduleCrumb = breadcrumb.locator('[aria-current="page"]');
    if (await moduleCrumb.isVisible()) {
      await moduleCrumb.click();
    }
    await expect(experiencesHeading).toBeVisible();
  }

  async searchExperience(name) {
    const search = this.page.getByPlaceholder('Search experiences...');
    if (await search.isVisible()) {
      await search.fill(name);
    }
  }

  experienceHeading() {
    return this.page.getByRole('heading', { level: 2 }).filter({ hasNotText: 'Experiences' });
  }

  experienceCard() {
    return this.page.getByRole('button', { name: 'More options' }).first().locator('..').locator('..').locator('..');
  }

  async expectExperienceVisible(name) {
    await this.searchExperience(name);
    await expect(this.experienceCard()).toBeVisible();
    await expect(this.experienceHeading().first()).toContainText(name.slice(0, 15));
  }

  async openExperienceMenu(name) {
    await this.searchExperience(name);
    await this.experienceCard().getByRole('button', { name: 'More options' }).click();
  }

  async selectExperienceType(dialog, type) {
    await dialog.getByText(type, { exact: true }).click();
  }

  async expectJourneyPageOpen() {
    await this.assertJourneySurfaceVisible();
    // Only assert options that are always shown for the current experience type.
    // All 4 options may not appear on every journey screen (e.g. Training vs Evaluation).
    const useTemplate = this.page.getByText('Use Template', { exact: true });
    if (await useTemplate.isVisible().catch(() => false)) {
      await expect(useTemplate).toBeVisible();
    }
  }

  async createExperienceInJourney({ name, description, type = 'Training' }) {
    await this.page.getByRole('button', { name: 'Create Experience', exact: true }).first().click();
    const dialog = this.dialog();
    await dialog.getByPlaceholder('Enter a descriptive name for').fill(name);
    await dialog.getByRole('textbox', { name: /Describe what this experience/i }).fill(description);
    await this.selectExperienceType(dialog, type);
    await dialog.getByRole('button', { name: 'Create Experience' }).click();
    await expect(dialog).toBeHidden();
    await expect(this.page.getByText('Experience created')).toBeVisible();
    await this.expectJourneyPageOpen();
    this.logStep(`Created experience: ${name}`);
  }

  async createExperience({ name, description, type = 'Training' }) {
    await this.createExperienceInJourney({ name, description, type });
    await this.goBackToList();
    await this.expectExperienceVisible(name);
  }

  async editExperience(currentName, { name, description, type }) {
    await this.open();
    await this.openExperienceMenu(currentName);
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    const dialog = this.dialog();
    await dialog.getByPlaceholder('Enter a descriptive name for').fill(name);
    if (description) {
      await dialog.getByRole('textbox', { name: /Describe what this experience/i }).fill(description);
    }
    if (type) {
      await this.selectExperienceType(dialog, type);
    }
    await dialog.getByRole('button', { name: 'Update Experience' }).click();
    await expect(dialog).toBeHidden();
    await this.expectExperienceVisible(name);
    if (type) {
      await expect(this.experienceCard().locator('p').filter({ hasText: type })).toBeVisible();
    }
  }

  async deleteExperience(name) {
    await this.open();
    await this.openExperienceMenu(name);
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
    await this.page.getByRole('button', { name: 'Delete experience' }).click();
    await expect(this.page.getByRole('heading', { name: 'Experiences', exact: true })).toBeVisible();
    await this.searchExperience(name);
    await expect(this.experienceHeading()).toHaveCount(0);
  }

  async openExperience(name) {
    await this.open();
    await this.searchExperience(name);
    await this.experienceCard().click();
    await this.assertJourneySurfaceVisible();
    this.logStep(`Opened experience: ${name}`);
  }
}

module.exports = { StudioExperiencesPage, JOURNEY_OPTIONS, SAMPLE_JSON_PATH };
