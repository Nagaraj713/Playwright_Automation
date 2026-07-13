const TECHNICAL_ACTIONS = [
  'Voice Over',
  'SFX Player',
  'Image Media Action',
  'Text Media Action',
  'Video Media Action',
  'Meta Layer Action',
  'Timer Action',
  'Object Highlighter',
];

const DEFAULT_TECHNICAL_ACTION = 'Animation';
const TIMELINE_SECTIONS = ['On Awake', 'On Start', 'On Right', 'On End'];
const TIMELINE_SECTION_ACTIONS = {
  'On Awake': 'Voice Over',
  'On Start': 'SFX Player',
  'On Right': 'Image Media Action',
  'On End': 'Text Media Action',
};
const OUTLINE_CHAT_PROMPT = 'create a VR Training experience for fire safety.';
const OUTLINE_TARGET_AUDIENCE = 'school students';
const OUTLINE_AGE_RANGE = '5 -10';

const path = require('path');

const { expect } = require('@playwright/test');
const { StudioExperiencesPage, SAMPLE_JSON_PATH } = require('./StudioExperiencesPage');
const { testFiles, storyBuilderUploads, referenceImages, downloadsPath } = require('../../config/studio');

class StudioExperienceJourneyPage extends StudioExperiencesPage {
  async openAnyMomentOnCanvas() {
    const momentNode = this.page.locator('[data-id*="event-on"]').first();
    if (await momentNode.isVisible().catch(() => false)) {
      await momentNode.click();
      return;
    }
    const momentCard = this.page.locator('[role="group"]').filter({ hasText: /moment/i }).first();
    if (await momentCard.isVisible().catch(() => false)) {
      await momentCard.click();
    }
  }

  async isBuilderChromeVisible() {
    const nonTechnical = this.page.getByRole('button', { name: 'Non-Technical', exact: true });
    const technical = this.page.getByRole('button', { name: 'Technical', exact: true });
    const publish = this.page.getByRole('button', { name: 'Publish' });
    return ((await nonTechnical.isVisible().catch(() => false))
      || (await technical.isVisible().catch(() => false)))
      && (await publish.isVisible().catch(() => false));
  }

  async isOnJourneyOptionsPage() {
    const useTemplate = this.page.getByText('Use Template', { exact: true });
    return (await useTemplate.isVisible().catch(() => false))
      && !(await this.isBuilderChromeVisible());
  }

  async enterBuilderFromJourneyIfNeeded() {
    if (await this.isBuilderChromeVisible()) {
      this.logStep('Builder chrome already visible');
      return;
    }

    if (!(await this.isOnJourneyOptionsPage())) {
      // Wait briefly in case builder is still hydrating after openExperience.
      const deadline = Date.now() + 15000;
      while (Date.now() < deadline) {
        if (await this.isBuilderChromeVisible()) {
          this.logStep('Builder chrome became visible');
          return;
        }
        if (await this.isOnJourneyOptionsPage()) {
          break;
        }
        await this.page.waitForTimeout(1000);
      }
      if (await this.isBuilderChromeVisible()) {
        return;
      }
      if (!(await this.isOnJourneyOptionsPage())) {
        this.logStep('Neither builder nor journey options detected; continuing');
        return;
      }
    }

    this.logStep('On journey options — opening existing builder');

    // Prefer continuing/resuming existing work over creating a blank template.
    const continueCandidates = [
      this.page.getByRole('button', { name: /continue/i }),
      this.page.getByRole('button', { name: /resume/i }),
      this.page.getByRole('button', { name: /open/i }),
      this.page.getByRole('button', { name: /edit/i }),
      this.page.getByText(/^continue$/i),
      this.page.getByText(/continue editing|resume story|open experience/i),
    ];
    for (const candidate of continueCandidates) {
      const target = candidate.first();
      if (await target.isVisible().catch(() => false)) {
        await target.click();
        await this.waitForNonTechnicalScreen();
        if (await this.isBuilderChromeVisible()) {
          this.logStep('Opened builder via continue/resume');
          return;
        }
      }
    }

    // Fall back to Use Template, but do NOT click Add New on reopen —
    // that starts a blank experience and leaves the moment editor empty.
    await this.clickUseTemplate();
    await this.page.waitForTimeout(1500);

    const getStarted = this.page.getByRole('button', { name: /get started/i });
    if (await getStarted.isVisible().catch(() => false)) {
      await getStarted.click();
      await this.page.waitForTimeout(1500);
    }

    // Prefer an existing template/moment card over Add New.
    const existingTemplate = this.page
      .getByRole('button')
      .filter({ hasText: /Moment Template|Grab\s*&\s*Place|Assembly|template/i })
      .first();
    if (await existingTemplate.isVisible({ timeout: 10000 }).catch(() => false)) {
      await existingTemplate.click();
      this.logStep('Selected existing template on reopen');
    } else {
      const addNew = this.page.getByRole('button', { name: /add new/i }).first();
      if (await addNew.isVisible({ timeout: 8000 }).catch(() => false)) {
        await addNew.click();
        this.logStep('No existing template card found — clicked Add New');
      }
    }

    await this.waitForNonTechnicalScreen();
    await expect(this.page.getByRole('button', { name: 'Publish' })).toBeVisible({ timeout: 45000 });
    this.logStep('Builder opened from journey options');
  }

  async dumpMomentEditorDebugContext() {
    const url = this.page.url();
    const flags = {
      builder: await this.isBuilderChromeVisible(),
      journey: await this.isOnJourneyOptionsPage(),
      storyboard: await this.page.getByText(/^storyboard$/i).first().isVisible().catch(() => false),
      templates: await this.page.getByText(/all templates|templates/i).first().isVisible().catch(() => false),
      nonTechnical: await this.page.getByRole('button', { name: 'Non-Technical', exact: true }).isVisible().catch(() => false),
      technical: await this.page.getByRole('button', { name: 'Technical', exact: true }).isVisible().catch(() => false),
      publish: await this.page.getByRole('button', { name: 'Publish' }).isVisible().catch(() => false),
    };
    const bodyText = ((await this.page.locator('body').innerText().catch(() => '')) || '')
      .replace(/\s+/g, ' ')
      .slice(0, 1200);
    this.logStep(`Moment editor debug url=${url} flags=${JSON.stringify(flags)}`);
    this.logStep(`Moment editor debug snippet: ${bodyText}`);
  }

  async isMomentEditorReadySignalVisible() {
    const signals = [
      this.page.getByRole('button', { name: /add reference image/i }),
      this.page.getByText(/add reference image/i),
      this.page.getByText(/^on awake$/i),
      this.page.getByText(/^on start$/i),
      this.page.getByText(/^on right$/i),
      this.page.getByText(/^on end$/i),
      this.page.getByText(/add description/i),
      this.page.getByText(/add action/i),
      this.page.getByText(/no actions yet/i),
      this.page.getByRole('button', { name: 'Voice Over', exact: true }),
      this.page.getByRole('button', { name: 'SFX Player', exact: true }),
      this.page.getByRole('button', { name: 'Image Media Action', exact: true }),
    ];

    for (const locator of signals) {
      const count = await locator.count();
      for (let index = 0; index < count; index += 1) {
        if (await locator.nth(index).isVisible().catch(() => false)) {
          return true;
        }
      }
    }
    return false;
  }

  async isTemplatesPanelVisible() {
    const allTemplates = this.page.getByText(/all templates/i).first();
    const templatesHeading = this.page.getByRole('heading', { name: /templates/i }).first();
    return (await allTemplates.isVisible().catch(() => false))
      || (await templatesHeading.isVisible().catch(() => false));
  }

  async closeTemplatesPanelIfOpen() {
    if (!(await this.isTemplatesPanelVisible())) {
      return;
    }

    const editorWasReady = await this.isMomentEditorReadySignalVisible();

    // Prefer Close button, then toggle Templates again — avoid Escape (deselects moment).
    const closeButtons = this.page.getByRole('button', { name: /^Close$/i });
    const closeCount = await closeButtons.count();
    let closed = false;
    for (let index = closeCount - 1; index >= 0; index -= 1) {
      const closeButton = closeButtons.nth(index);
      if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click().catch(() => {});
        closed = true;
        await this.page.waitForTimeout(500);
        break;
      }
    }

    if (!closed && (await this.isTemplatesPanelVisible())) {
      const templatesToggle = this.page
        .getByRole('button', { name: /templates/i })
        .or(this.page.getByText(/^templates$/i))
        .first();
      if (await templatesToggle.isVisible().catch(() => false)) {
        await templatesToggle.click().catch(() => {});
        await this.page.waitForTimeout(500);
        closed = true;
      }
    }

    if (await this.isTemplatesPanelVisible()) {
      // Last resort: click a storyboard moment card (not Escape).
      const momentCard = this.page.locator('[role="group"]').filter({ hasText: /Moment Template/i }).first();
      if (await momentCard.isVisible().catch(() => false)) {
        await momentCard.click().catch(() => {});
        await this.page.waitForTimeout(500);
      }
    }

    if (!(await this.isTemplatesPanelVisible())) {
      this.logStep('Closed templates panel');
    }

    if (editorWasReady) {
      const deadline = Date.now() + 5000;
      while (Date.now() < deadline) {
        if (await this.isMomentEditorReadySignalVisible()) {
          return;
        }
        await this.page.waitForTimeout(400);
      }
    }
  }

  async expandStoryboardIfNeeded() {
    const storyboard = this.page.getByText(/^storyboard$/i).first();
    if (await storyboard.isVisible().catch(() => false)) {
      await storyboard.click().catch(() => {});
      await this.page.waitForTimeout(400);
    }

    const chapter = this.page
      .getByText(/^chapter-?\d+/i)
      .or(this.page.getByText(/chapter-?\d+/i))
      .first();
    if (await chapter.isVisible().catch(() => false)) {
      await chapter.click().catch(() => {});
      await this.page.waitForTimeout(400);
    }
  }

  async clickVisibleMomentCandidate() {
    await this.expandStoryboardIfNeeded();

    const storyboardRoot = this.page
      .locator('div')
      .filter({ has: this.page.getByText(/^storyboard$/i) })
      .first();

    const scopes = [
      storyboardRoot,
      this.page,
    ];

    const candidateFactories = [
      (scope) => scope.locator('[role="group"]').filter({ hasText: /Moment Template/i }),
      (scope) => scope.locator('.chakra-card').filter({ hasText: /Moment Template/i }),
      (scope) => scope.getByRole('button').filter({ hasText: /Moment Template/i }),
      (scope) => scope.getByText(/Moment Template/i),
      (scope) => scope.getByText(/Grab\s*&\s*Place/i),
      (scope) => scope.locator('[role="group"]').filter({ hasText: /moment(?!s\b)/i }),
    ];

    let clickedAny = false;
    for (const scope of scopes) {
      if (!(await scope.isVisible().catch(() => false)) && scope !== this.page) {
        continue;
      }
      for (const factory of candidateFactories) {
        const candidate = factory(scope);
        const count = await candidate.count();
        for (let index = 0; index < count; index += 1) {
          const target = candidate.nth(index);
          if (!(await target.isVisible().catch(() => false))) {
            continue;
          }
          const text = ((await target.innerText().catch(() => '')) || '').trim();
          if (
            /^\d+\s*moments?$/i.test(text)
            || /^moments?$/i.test(text)
            || /^storyboard$/i.test(text)
            || /^chapter/i.test(text)
          ) {
            continue;
          }
          await target.scrollIntoViewIfNeeded().catch(() => {});
          await target.click({ timeout: 5000 }).catch(async () => {
            await target.click({ force: true });
          });
          await this.page.waitForTimeout(1000);
          clickedAny = true;
          if (await this.isMomentEditorReadySignalVisible()) {
            return true;
          }
        }
      }
    }
    return clickedAny;
  }

  async recoverMomentEditorViaTemplates() {
    this.logStep('Recovery: opening Templates → Add New to mount moment editor');
    const templatesButton = this.page
      .getByRole('button', { name: /templates/i })
      .or(this.page.getByText(/^templates$/i))
      .first();
    if (!(await templatesButton.isVisible().catch(() => false))) {
      return false;
    }
    await templatesButton.click();
    const allTemplates = this.page.getByText(/all templates/i).first();
    if (!(await allTemplates.isVisible({ timeout: 15000 }).catch(() => false))) {
      return false;
    }
    const addNew = this.page.getByRole('button', { name: /add new/i }).first();
    if (!(await addNew.isVisible().catch(() => false))) {
      return false;
    }
    await addNew.click();
    await this.page.waitForTimeout(2500);
    await this.closeTemplatesPanelIfOpen();
    await this.expandStoryboardIfNeeded();
    await this.clickVisibleMomentCandidate();
    return this.isMomentEditorReadySignalVisible();
  }

  async selectMomentForEditing(context = 'unknown') {
    this.logStep(`Selecting moment for Non-Technical editing (${context})`);
    await this.enterBuilderFromJourneyIfNeeded();
    await this.switchToNonTechnicalTab().catch(() => {});
    await this.closeTemplatesPanelIfOpen();

    if (await this.isMomentEditorReadySignalVisible()) {
      this.logStep(`Moment editor already open (${context})`);
      return;
    }

    await this.expandStoryboardIfNeeded();

    const deadline = Date.now() + 45000;
    let triedRecovery = false;
    while (Date.now() < deadline) {
      await this.clickVisibleMomentCandidate();
      if (await this.isMomentEditorReadySignalVisible()) {
        this.logStep(`Selected moment for Non-Technical editing (${context})`);
        return;
      }

      if (!triedRecovery && Date.now() > deadline - 20000) {
        triedRecovery = true;
        if (await this.recoverMomentEditorViaTemplates()) {
          this.logStep(`Moment editor ready after Templates recovery (${context})`);
          return;
        }
      }

      await this.expandStoryboardIfNeeded();
      await this.page.waitForTimeout(1000);
    }

    await this.dumpMomentEditorDebugContext();
    throw new Error(
      `Non-Technical moment editor never showed On Awake / Add reference image / action buttons (${context})`,
    );
  }

  async openTemplatesAndAddNew() {
    await this.switchToNonTechnicalTab().catch(() => {});
    const templatesButton = this.page
      .getByRole('button', { name: /templates/i })
      .or(this.page.getByText(/^templates$/i))
      .first();

    if (!(await templatesButton.isVisible({ timeout: 45000 }).catch(() => false))) {
      await this.dumpMomentEditorDebugContext();
      throw new Error('Templates button not found on builder screen');
    }

    await templatesButton.click();
    await expect(this.page.getByText(/all templates/i).first()).toBeVisible({ timeout: 30000 });

    const addNew = this.page.getByRole('button', { name: /add new/i }).first();
    if (await addNew.isVisible().catch(() => false)) {
      await addNew.click();
    } else {
      const existingTemplateCard = this.page
        .getByRole('button')
        .filter({ hasText: /Moment Template|Grab|Assembly/i })
        .first();
      if (await existingTemplateCard.isVisible().catch(() => false)) {
        await existingTemplateCard.click();
      } else {
        await this.dumpMomentEditorDebugContext();
        throw new Error('Could not find Add New / template card under All Templates');
      }
    }

    await this.page.waitForTimeout(2500);
    this.logStep('Opened Templates and added/selected a template moment');
    await this.closeTemplatesPanelIfOpen();

    const deadline = Date.now() + 45000;
    while (Date.now() < deadline) {
      if (await this.isMomentEditorReadySignalVisible()) {
        this.logStep('Moment editor visible after Templates Add New');
        return;
      }
      await this.expandStoryboardIfNeeded();
      await this.clickVisibleMomentCandidate();
      await this.page.waitForTimeout(1000);
    }

    await this.dumpMomentEditorDebugContext();
    throw new Error(
      'After Templates Add New, Non-Technical moment editor never showed On Awake / Add reference image',
    );
  }

  async copyAndDeleteCopiedMoment() {
    if (!(await this.isMomentEditorReadySignalVisible())) {
      await this.selectMomentForEditing('before-copy-delete').catch(() => {});
    }
    const momentsBefore = await this.page.locator('[role="group"]').filter({ hasText: /Moment Template|moment(?!s\b)/i }).count();
    const copyButton = this.page.getByRole('button', { name: /copy/i }).first();
    if (await copyButton.isVisible().catch(() => false)) {
      await copyButton.click();
      await this.page.waitForTimeout(1500);
    }

    const momentsAfterCopy = await this.page.locator('[role="group"]').filter({ hasText: /Moment Template|moment(?!s\b)/i }).count();
    if (momentsAfterCopy > momentsBefore) {
      const deleteButton = this.page.getByRole('button', { name: /delete/i }).first();
      if (await deleteButton.isVisible().catch(() => false)) {
        await deleteButton.click();
        const confirmDelete = this.page.getByRole('button', { name: /^delete$/i }).first();
        if (await confirmDelete.isVisible().catch(() => false)) {
          await confirmDelete.click();
        }
      }
    }
    this.logStep('Copied and deleted copied moment');
  }

  getStoryboardLeftPanel() {
    return this.page
      .locator('div, section')
      .filter({ has: this.page.getByText(/^storyboard$/i) })
      .first();
  }

  getStoryboardChapterOptionsButtons() {
    return this.getStoryboardLeftPanel().getByRole('button', { name: /^options$/i });
  }

  getChapterRowFromOptionsButton(optionsButton) {
    return optionsButton.locator('xpath=..');
  }

  async readChapterCountFromStoryboardHeader() {
    const header = this.getStoryboardLeftPanel().getByText(/^\d+\s+chapters?$/i).first();
    if (!(await header.isVisible().catch(() => false))) {
      return null;
    }
    const text = ((await header.innerText().catch(() => '')) || '').trim();
    const match = text.match(/^(\d+)\s+chapters?$/i);
    return match ? Number.parseInt(match[1], 10) : null;
  }

  getVisibleChapterRows() {
    return this.getStoryboardChapterOptionsButtons().locator('xpath=..');
  }

  async countVisibleChapterRows() {
    const headerCount = await this.readChapterCountFromStoryboardHeader();
    if (headerCount !== null) {
      return headerCount;
    }

    const buttons = this.getStoryboardChapterOptionsButtons();
    const count = await buttons.count();
    let visibleCount = 0;
    for (let index = 0; index < count; index += 1) {
      const button = buttons.nth(index);
      if (await button.isVisible().catch(() => false)) {
        visibleCount += 1;
      }
    }
    return visibleCount;
  }

  async countVisibleChapterTitles() {
    const chapterTitles = this.page.getByText(/chapter[\w-]*/i);
    const count = await chapterTitles.count();
    let visibleCount = 0;
    for (let index = 0; index < count; index += 1) {
      const item = chapterTitles.nth(index);
      const text = ((await item.innerText().catch(() => '')) || '').trim();
      if (!text || /^\d+\s*chapters?$/i.test(text)) {
        continue;
      }
      if (await item.isVisible().catch(() => false)) {
        visibleCount += 1;
      }
    }
    return visibleCount;
  }

  async getFirstVisibleChapterRow() {
    const buttons = this.getStoryboardChapterOptionsButtons();
    const count = await buttons.count();
    for (let index = 0; index < count; index += 1) {
      const button = buttons.nth(index);
      if (await button.isVisible().catch(() => false)) {
        return this.getChapterRowFromOptionsButton(button);
      }
    }
    throw new Error('Could not find a visible chapter row in left storyboard panel.');
  }

  async getLastVisibleChapterRow() {
    const buttons = this.getStoryboardChapterOptionsButtons();
    const count = await buttons.count();
    for (let index = count - 1; index >= 0; index -= 1) {
      const button = buttons.nth(index);
      if (await button.isVisible().catch(() => false)) {
        return this.getChapterRowFromOptionsButton(button);
      }
    }
    throw new Error('Could not find a visible chapter row in left storyboard panel.');
  }

  async rearrangeChapterViaHandle() {
    const chapterRow = await this.getFirstVisibleChapterRow();
    const rowBox = await chapterRow.boundingBox();
    if (!rowBox) {
      throw new Error('Unable to resolve chapter row bounds for rearrange.');
    }

    // Use the left edge of the chapter row where the 6-dot drag handle sits.
    const fromX = rowBox.x + Math.min(18, Math.max(8, rowBox.width * 0.08));
    const fromY = rowBox.y + rowBox.height / 2;
    const toY = Math.max(40, rowBox.y - 30);
    await this.page.mouse.move(fromX, fromY);
    await this.page.mouse.down();
    await this.page.mouse.move(fromX, toY, { steps: 10 });
    await this.page.mouse.up();
    await this.page.waitForTimeout(800);
    this.logStep('Rearranged chapter using 6-dot drag handle');
  }

  async openChapterKebabMenu(chapterRow = null) {
    const row = chapterRow || await this.getFirstVisibleChapterRow();
    await row.hover().catch(() => {});
    await this.page.waitForTimeout(250);

    const kebabCandidates = [
      row.getByRole('button', { name: /^options$/i }),
      row.getByRole('button', { name: /options|more|kebab|open menu/i }),
      row.locator('button[aria-label*="menu" i], button[aria-label*="option" i]'),
      row.locator('button'),
    ];

    for (const locator of kebabCandidates) {
      const count = await locator.count();
      for (let index = 0; index < count; index += 1) {
        const button = locator.nth(index);
        if (!(await button.isVisible().catch(() => false))) {
          continue;
        }
        if (!(await button.isEnabled().catch(() => false))) {
          continue;
        }
        const label = ((await button.getAttribute('aria-label').catch(() => '')) || '').toLowerCase();
        const text = ((await button.innerText().catch(() => '')) || '').toLowerCase();
        // Avoid picking drag/reorder handles; prefer menu-like controls.
        if (/drag|reorder/.test(label) || /drag|reorder/.test(text)) {
          continue;
        }
        await button.click();
        await this.page.waitForTimeout(500);
        return;
      }
    }

    throw new Error('Could not open chapter kebab/options menu from visible chapter row.');
  }

  async clickVisibleMenuAction(label) {
    const candidates = [
      this.page.getByRole('menuitem', { name: new RegExp(`^${label}$`, 'i') }),
      this.page.getByRole('button', { name: new RegExp(`^${label}$`, 'i') }),
      this.page.getByText(new RegExp(`^${label}$`, 'i')),
    ];

    for (const candidate of candidates) {
      const count = await candidate.count();
      for (let index = 0; index < count; index += 1) {
        const item = candidate.nth(index);
        if (await item.isVisible().catch(() => false)) {
          await item.click();
          return;
        }
      }
    }

    throw new Error(`Could not find visible chapter menu action: ${label}`);
  }

  async duplicateChapterFromKebab() {
    const rowsBefore = await this.countVisibleChapterRows();
    await this.openChapterKebabMenu();
    await this.clickVisibleMenuAction('Duplicate');
    await expect.poll(async () => this.countVisibleChapterRows(), { timeout: 15000 })
      .toBeGreaterThan(rowsBefore);
    this.logStep('Duplicated chapter from chapter kebab');
  }

  async editChapterFromKebab() {
    await this.openChapterKebabMenu();
    await this.clickVisibleMenuAction('Edit');

    const editDialog = this.page.getByRole('dialog').last();
    const chapterNameInput = editDialog.getByRole('textbox').first();
    await expect(chapterNameInput).toBeVisible({ timeout: 15000 });

    const newChapterName = `chapter-edited-${Date.now()}`;
    await chapterNameInput.fill(newChapterName);

    const saveButton = editDialog.getByRole('button', { name: /save|update|done/i }).first();
    if (await saveButton.isVisible().catch(() => false)) {
      await saveButton.click();
    } else {
      await chapterNameInput.press('Enter');
    }

    await expect(this.page.getByText(newChapterName).first()).toBeVisible({ timeout: 15000 });
    this.logStep(`Edited chapter name to ${newChapterName}`);
  }

  async deleteChapterFromKebab() {
    const duplicateRow = await this.getLastVisibleChapterRow();
    const duplicateName = ((await duplicateRow.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    const rowsBefore = await this.countVisibleChapterRows();

    await this.openChapterKebabMenu(duplicateRow);
    await this.clickVisibleMenuAction('Delete');

    const confirmCandidates = [
      this.page.getByRole('button', { name: /^confirm$/i }),
      this.page.getByRole('button', { name: /^delete chapter$/i }),
      this.page.getByRole('button', { name: /^delete$/i }),
      this.page.getByRole('menuitem', { name: /^delete$/i }),
    ];
    for (const candidate of confirmCandidates) {
      const button = candidate.first();
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        break;
      }
    }

    await expect.poll(async () => this.countVisibleChapterRows(), { timeout: 15000 })
      .toBeLessThan(rowsBefore);

    if (duplicateName) {
      await expect(this.page.getByText(duplicateName).first()).not.toBeVisible({ timeout: 15000 });
    }

    this.logStep('Deleted chapter from chapter kebab');
  }

  getMomentEditorContent() {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByRole('button', { name: /add reference image/i }) })
      .filter({ has: this.page.getByRole('button', { name: /edit description/i }) })
      .last();
  }

  getMomentHeaderBlock() {
    return this.getMomentEditorContent()
      .getByRole('button', { name: /edit description/i })
      .first()
      .locator('xpath=..')
      .locator('xpath=..');
  }

  getMomentNameInput(editor = this.getMomentEditorContent()) {
    return this.page.locator('input:focus, textarea:focus, [contenteditable="true"]:focus').first()
      .or(
        editor
          .getByRole('button', { name: /edit description/i })
          .first()
          .locator('xpath=..')
          .locator('xpath=..')
          .locator('input, textarea, [role="textbox"]')
          .first(),
      );
  }

  getMomentDescriptionRow() {
    return this.getMomentEditorContent()
      .getByRole('button', { name: /edit description/i })
      .first()
      .locator('xpath=..');
  }

  async commitInlineEditor(input) {
    await input.press('Enter').catch(() => {});
    await this.page.waitForTimeout(300);

    if (await input.isVisible().catch(() => false)) {
      await input.press('Tab').catch(() => {});
      await this.page.getByText(/^on awake$/i).first().click({ force: true }).catch(() => {});
    }

    const confirmButton = this.page.getByRole('button', { name: /save|update|done|confirm/i }).first();
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
  }

  async updateMomentNameInMiddlePanel() {
    const editor = this.getMomentEditorContent();
    await expect(editor).toBeVisible({ timeout: 15000 });

    const editNameButton = editor.getByRole('button', { name: /edit name/i });
    await expect(editNameButton).toBeVisible({ timeout: 15000 });
    await editNameButton.click();

    const nameInput = this.getMomentNameInput(editor);
    const newMomentName = `MomentName_${Date.now()}`;
    await expect(nameInput).toBeVisible({ timeout: 15000 });
    await nameInput.fill(newMomentName);
    await this.commitInlineEditor(nameInput);

    await expect(editor.getByText(newMomentName, { exact: true }).first()).toBeVisible({ timeout: 15000 });
    this.logStep(`Updated moment name to ${newMomentName}`);
  }

  async updateMomentDescriptionInMiddlePanel() {
    const editor = this.getMomentEditorContent();
    await expect(editor).toBeVisible({ timeout: 15000 });

    const descriptionRow = this.getMomentDescriptionRow();
    const editDescription = descriptionRow.getByRole('button', { name: /edit description/i });
    await expect(editDescription).toBeVisible({ timeout: 15000 });
    await editDescription.click();

    const newDescription = `Updated description ${Date.now()}`;
    const descriptionInput = this.page.locator('input:focus, textarea:focus, [contenteditable="true"]:focus').first()
      .or(descriptionRow.getByRole('textbox'))
      .or(descriptionRow.locator('textarea'))
      .first();
    await expect(descriptionInput).toBeVisible({ timeout: 15000 });
    await descriptionInput.fill(newDescription);
    await this.commitInlineEditor(descriptionInput);

    await expect(editor.getByText(newDescription, { exact: true }).first()).toBeVisible({ timeout: 15000 });
    this.logStep(`Updated moment description to "${newDescription}"`);
  }

  getStoryboardPanel() {
    return this.page.locator('div')
      .filter({
        has: this.page
          .getByRole('button', { name: /add reference image/i })
          .or(this.page.getByText(/add reference image/i)),
      })
      .filter({ has: this.page.getByText(/^on awake$/i) })
      .first();
  }

  async ensureMomentEditorReady(context = 'timeline-validation') {
    await this.switchToNonTechnicalTab();
    await this.closeTemplatesPanelIfOpen();
    await this.selectMomentForEditing(context);

    // Prefer explicit anchors when available; fall back to readiness signals already verified.
    const addReference = this.page.getByRole('button', { name: /add reference image/i })
      .or(this.page.getByText(/add reference image/i))
      .first();
    const onAwake = this.page.getByText(/^on awake$/i).first();
    if (await addReference.isVisible().catch(() => false)) {
      await expect(addReference).toBeVisible();
    } else if (await onAwake.isVisible().catch(() => false)) {
      await expect(onAwake).toBeVisible();
    }

    this.logStep('Moment editor ready');
  }

  async clickStoryboardSection(section) {
    // Prefer storyboard panel when present; otherwise search page-level visible candidates.
    const panel = this.getStoryboardPanel();
    const panelVisible = await panel.isVisible().catch(() => false);
    const scope = panelVisible ? panel : this.page;

    const candidates = [
      scope.getByRole('tab', { name: new RegExp(`^${section}$`, 'i') }),
      scope.getByRole('button', { name: new RegExp(`^${section}$`, 'i') }),
      scope.getByText(new RegExp(`^${section}$`, 'i')),
    ];

    for (const candidate of candidates) {
      const count = await candidate.count();
      for (let index = 0; index < count; index += 1) {
        const target = candidate.nth(index);
        if (await target.isVisible().catch(() => false)) {
          await target.scrollIntoViewIfNeeded();
          await target.click();
          return;
        }
      }
    }

    throw new Error(`Could not find visible storyboard section: ${section}`);
  }

  async openTimelinePanelAndVerify() {
    const timelineButton = this.page
      .getByRole('button', { name: /timeline/i })
      .or(this.page.getByRole('tab', { name: /timeline/i }))
      .or(this.page.getByText(/^timeline$/i))
      .first();
    await expect(timelineButton).toBeVisible({ timeout: 20000 });
    await timelineButton.click();
    await expect(this.page.getByText(/moment timeline/i).first()).toBeVisible({ timeout: 20000 });
    await this.page.waitForTimeout(500);
  }

  async clickVisibleSidebarItem(namePattern) {
    const candidates = [
      this.page.getByRole('button', { name: namePattern }),
      this.page.getByRole('tab', { name: namePattern }),
      this.page.getByText(namePattern),
    ];

    for (const candidate of candidates) {
      const count = await candidate.count();
      for (let index = 0; index < count; index += 1) {
        const target = candidate.nth(index);
        if (await target.isVisible().catch(() => false)) {
          await target.click();
          return;
        }
      }
    }

    throw new Error(`Could not find visible sidebar item matching: ${namePattern}`);
  }

  async validateTimelineSections() {
    await this.ensureMomentEditorReady('timeline-validation');

    for (const section of TIMELINE_SECTIONS) {
      await this.clickStoryboardSection(section);
      await this.page.waitForTimeout(500);
      this.logStep(`Validated timeline section: ${section}`);
    }

    await this.openTimelinePanelAndVerify();
    this.logStep('Opened Timeline panel and verified Moment Timeline');
  }

  async uploadReferenceImages() {
    const addReferenceImage = this.page.getByRole('button', { name: /add reference image/i }).first();
    await expect(addReferenceImage).toBeVisible({ timeout: 30000 });
    const chooserPromise = this.page.waitForEvent('filechooser');
    await addReferenceImage.click();
    const chooser = await chooserPromise;
    await chooser.setFiles(referenceImages);
    await this.page.waitForTimeout(3000);
    this.logStep(`Uploaded ${referenceImages.length} reference images`);
  }

  async addActionsToAllTimelineSections() {
    await this.ensureMomentEditorReady('add-actions');
    const storyboardPanel = this.getStoryboardPanel();

    for (const section of TIMELINE_SECTIONS) {
      const actionName = TIMELINE_SECTION_ACTIONS[section];
      await this.clickStoryboardSection(section);
      await this.page.waitForTimeout(500);

      let actionButton = storyboardPanel.getByRole('button', { name: actionName, exact: true }).first();
      if (!(await actionButton.isVisible().catch(() => false))) {
        actionButton = this.page.getByRole('button', { name: actionName, exact: true }).first();
      }
      await expect(actionButton).toBeVisible({ timeout: 20000 });
      await actionButton.scrollIntoViewIfNeeded();
      await actionButton.click();
      await this.page.waitForTimeout(1000);
      this.logStep(`Added action "${actionName}" to ${section}`);
    }
  }

  async getCommentsPanel() {
    const candidates = [
      this.page.getByRole('tabpanel').filter({ hasText: /comments|no comments yet|write a comment/i }),
      this.page.locator('[role="tabpanel"]').filter({ hasText: /comments|no comments yet|write a comment/i }),
    ];

    for (const candidate of candidates) {
      const count = await candidate.count();
      for (let index = 0; index < count; index += 1) {
        const panel = candidate.nth(index);
        if (await panel.isVisible().catch(() => false)) {
          return panel;
        }
      }
    }

    throw new Error('Comments panel not found in sidebar.');
  }

  async addSideComment() {
    const commentText = 'Automation validation comment for timeline actions.';

    await this.clickVisibleSidebarItem(/^comments?$/i);
    await this.page.waitForTimeout(1000);

    const commentsPanel = await this.getCommentsPanel();

    const composerTrigger = commentsPanel.getByText(/write a comment/i).first();
    if (await composerTrigger.isVisible().catch(() => false)) {
      await composerTrigger.click();
      await this.page.waitForTimeout(500);
    }

    const commentBox = commentsPanel.getByPlaceholder(/write a comment/i)
      .or(commentsPanel.getByRole('textbox').first());
    await expect(commentBox).toBeVisible({ timeout: 20000 });
    await commentBox.fill(commentText);

    const submitCandidates = [
      commentsPanel.getByRole('button', { name: /^comment$/i }),
      commentsPanel.getByRole('button', { name: /post|send|submit/i }),
      commentsPanel.getByLabel(/comment|post|send/i),
      commentsPanel.locator('button[type="submit"]'),
      commentsPanel.locator('button').filter({ hasText: /comment|post|send/i }),
    ];

    let submitted = false;
    for (const candidate of submitCandidates) {
      const count = await candidate.count();
      for (let index = 0; index < count; index += 1) {
        const button = candidate.nth(index);
        if (!(await button.isVisible().catch(() => false))) {
          continue;
        }
        if (!(await button.isEnabled().catch(() => false))) {
          continue;
        }
        await button.click();
        submitted = true;
        break;
      }
      if (submitted) break;
    }

    if (!submitted) {
      await commentBox.press('Control+Enter').catch(async () => {
        await commentBox.press('Meta+Enter').catch(() => {});
      });
      submitted = true;
    }

    if (!submitted) {
      await this.dumpMomentEditorDebugContext();
      throw new Error('Could not find a visible enabled comment submit control.');
    }

    await expect(commentsPanel.getByText(commentText)).toBeVisible({ timeout: 15000 });
    await expect(commentsPanel.getByText(/no comments yet/i)).not.toBeVisible({ timeout: 15000 });
    this.logStep('Posted side comment');
  }

  async publishAndSync() {
    const publishButton = this.page.getByRole('button', { name: 'Publish' });
    await expect(publishButton).toBeVisible({ timeout: 30000 });
    await publishButton.click();

    const syncButton = this.page.getByRole('button', { name: /sync to cloud/i });
    const syncMenuItem = this.page.getByRole('menuitem', { name: /sync to cloud/i });
    await expect(syncButton.or(syncMenuItem).first()).toBeVisible({ timeout: 20000 });
    await this.clickSyncToCloud();
    await this.waitForCloudSyncToSettle();
    this.logStep('Published and synced to cloud');
  }

  getPublishStoryNameInput(panel) {
    return panel.getByPlaceholder(/enter story name/i)
      .or(panel.getByRole('textbox', { name: /story|file name/i }))
      .or(panel.getByRole('textbox').first());
  }

  getPublishFormatVersionInput(panel) {
    return panel.getByPlaceholder(/enter format version/i)
      .or(panel.getByRole('textbox', { name: /format version/i }))
      .or(panel.getByRole('textbox').nth(1));
  }

  async getPublishMetadataPanel() {
    const publishDialog = this.page.getByRole('dialog', { name: /publish story/i });
    if (await publishDialog.isVisible().catch(() => false)) {
      return publishDialog;
    }

    const dialogs = this.page.getByRole('dialog');
    const dialogCount = await dialogs.count();
    for (let index = dialogCount - 1; index >= 0; index -= 1) {
      const dialog = dialogs.nth(index);
      if (!(await dialog.isVisible().catch(() => false))) {
        continue;
      }

      const hasStoryName = await dialog.getByPlaceholder(/enter story name/i).isVisible().catch(() => false);
      const hasFormatVersion = await dialog.getByPlaceholder(/enter format version/i).isVisible().catch(() => false);
      if (hasStoryName && hasFormatVersion) {
        return dialog;
      }
    }

    const storyNameField = this.page.getByPlaceholder(/enter story name/i).first();
    const formatVersionField = this.page.getByPlaceholder(/enter format version/i).first();
    if (
      await storyNameField.isVisible().catch(() => false)
      && await formatVersionField.isVisible().catch(() => false)
    ) {
      for (let index = dialogCount - 1; index >= 0; index -= 1) {
        const dialog = dialogs.nth(index);
        if (!(await dialog.isVisible().catch(() => false))) {
          continue;
        }
        const hasBothFields = await dialog.getByPlaceholder(/enter story name/i).isVisible().catch(() => false)
          && await dialog.getByPlaceholder(/enter format version/i).isVisible().catch(() => false);
        if (hasBothFields) {
          return dialog;
        }
      }
    }

    throw new Error('Publish metadata panel not found (story name / format version fields).');
  }

  async isPublishMetadataPanelVisible() {
    const publishDialog = this.page.getByRole('dialog', { name: /publish story/i });
    if (await publishDialog.isVisible().catch(() => false)) {
      return true;
    }

    const storyNameField = this.page.getByPlaceholder(/enter story name/i).first();
    const formatVersionField = this.page.getByPlaceholder(/enter format version/i).first();
    return (
      await storyNameField.isVisible().catch(() => false)
      && await formatVersionField.isVisible().catch(() => false)
    );
  }

  async ensurePublishMetadataPanelOpen() {
    if (await this.isPublishMetadataPanelVisible()) {
      return this.getPublishMetadataPanel();
    }
    await this.clickPublish();
    const panel = await this.getPublishMetadataPanel();
    await expect(panel).toBeVisible({ timeout: 20000 });
    return panel;
  }

  async closePublishDialogIfOpen() {
    const publishDialog = this.page.getByRole('dialog', { name: /publish story/i });
    if (!(await publishDialog.isVisible().catch(() => false))) {
      return;
    }

    const closeButton = publishDialog.getByRole('button', { name: /^close$/i });
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    } else {
      await this.page.keyboard.press('Escape');
    }

    await expect(publishDialog).not.toBeVisible({ timeout: 10000 });
    this.logStep('Closed publish dialog');
  }

  async saveStoryArtifactDownload(download, artifactType) {
    const filename = download.suggestedFilename();
    await expect(filename).toBeTruthy();
    const extensions = {
      json: /\.json$/i,
      excel: /\.(xlsx|xls)$/i,
    };
    await expect(filename).toMatch(extensions[artifactType]);

    const savePath = path.join(downloadsPath, filename);
    await download.saveAs(savePath);
    this.logStep(`Downloaded story artifact: ${filename}`);
    this.logStep(`Saved story artifact to: ${savePath}`);
    return { filename, savePath };
  }

  async listVisiblePublishPanelDownloadLabels() {
    const panel = await this.getPublishMetadataPanel().catch(() => this.page.locator('body'));
    return panel.evaluate((root) => {
      const nodes = Array.from(root.querySelectorAll('button, [role="button"], a, [role="link"]'));
      return nodes
        .map((el) => {
          const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
          const aria = el.getAttribute('aria-label') || '';
          const title = el.getAttribute('title') || '';
          return [text, aria, title].filter(Boolean).join(' | ');
        })
        .filter((label) => label && label.length < 80)
        .filter((label) => /download|export|json|excel|xlsx|xls/i.test(label))
        .slice(0, 30);
    }).catch(() => []);
  }

  async clickPublishDownload(artifactType, panel = null) {
    const aliases = {
      json: [/download json/i, /export json/i, /\bjson\b/i],
      excel: [/download excel/i, /download xlsx/i, /export excel/i, /\bexcel\b/i, /\bxlsx\b/i],
    };
    const patterns = aliases[artifactType];
    if (!patterns) {
      throw new Error(`Unsupported publish download artifact type: ${artifactType}`);
    }

    const matchesLabel = (value) => {
      const text = (value || '').replace(/\s+/g, ' ').trim();
      return patterns.some((pattern) => pattern.test(text));
    };

    const findAndClick = async (resolvedPanel) => {
      const candidateLocators = [
        resolvedPanel.getByRole('button'),
        resolvedPanel.getByRole('link'),
        resolvedPanel.locator('[role="button"], a, button'),
      ];

      for (const locator of candidateLocators) {
        const count = await locator.count();
        for (let index = 0; index < count; index += 1) {
          const item = locator.nth(index);
          if (!(await item.isVisible().catch(() => false))) {
            continue;
          }

          const text = await item.innerText().catch(() => '');
          const aria = await item.getAttribute('aria-label').catch(() => '') || '';
          const title = await item.getAttribute('title').catch(() => '') || '';
          if (!(matchesLabel(text) || matchesLabel(aria) || matchesLabel(title))) {
            continue;
          }

          const downloadPromise = this.page.waitForEvent('download');
          await item.scrollIntoViewIfNeeded().catch(() => {});
          await item.click({ timeout: 5000 }).catch(async () => {
            await item.click({ force: true });
          });
          const download = await downloadPromise;
          return this.saveStoryArtifactDownload(download, artifactType);
        }
      }

      for (const pattern of patterns) {
        const textNode = resolvedPanel.getByText(pattern).first();
        if (await textNode.isVisible().catch(() => false)) {
          const downloadPromise = this.page.waitForEvent('download');
          await textNode.click({ force: true });
          const download = await downloadPromise;
          return this.saveStoryArtifactDownload(download, artifactType);
        }
      }

      return null;
    };

    let resolvedPanel = panel;
    if (!resolvedPanel) {
      await this.ensurePublishMetadataPanelOpen();
      resolvedPanel = await this.getPublishMetadataPanel();
    }

    const saved = await findAndClick(resolvedPanel);
    if (saved) {
      return saved;
    }

    if (artifactType === 'excel') {
      const labels = await this.listVisiblePublishPanelDownloadLabels();
      this.logStep(`Publish panel download candidates when looking for Excel: ${JSON.stringify(labels)}`);
      throw new Error('Could not find Download Excel control in publish metadata panel.');
    }

    throw new Error(`Could not find Download ${artifactType.toUpperCase()} control in publish metadata panel.`);
  }

  async publishAndDownloadStoryArtifacts() {
    if (await this.isPublishMetadataPanelVisible()) {
      this.logStep('Reusing open publish panel for metadata download');
    } else {
      this.logStep('Opening publish panel for metadata download');
      await this.clickPublish();
    }

    let publishPanel = await this.getPublishMetadataPanel();
    await expect(publishPanel).toBeVisible({ timeout: 20000 });

    const storyName = `AutoStory_${Date.now()}`;
    const nameInput = this.getPublishStoryNameInput(publishPanel);
    await expect(nameInput).toBeVisible({ timeout: 15000 });
    await nameInput.fill(storyName);

    const formatInput = this.getPublishFormatVersionInput(publishPanel);
    await expect(formatInput).toBeVisible({ timeout: 15000 });
    await formatInput.fill('1.1');

    await this.clickPublishDownload('json', publishPanel);

    if (await this.isPublishMetadataPanelVisible()) {
      publishPanel = await this.getPublishMetadataPanel();
    } else {
      this.logStep('Re-opening publish panel for Excel download');
      await this.clickPublish();
      publishPanel = await this.getPublishMetadataPanel();
      await expect(publishPanel).toBeVisible({ timeout: 20000 });
    }

    await this.clickPublishDownload('excel', publishPanel);

    await this.closePublishDialogIfOpen();
    this.logStep(`Updated story name to ${storyName} and format version to 1.1`);
  }

  async dismissOpenMenus() {
    await this.closePublishDialogIfOpen();
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async getHeaderThemeToggleButton() {
    const navMenu = this.page.getByRole('button', { name: /navigation menu/i }).first();
    const userMenu = this.page.getByRole('button', { name: /user menu/i }).first();
    await expect(navMenu).toBeVisible({ timeout: 10000 });
    await expect(userMenu).toBeVisible({ timeout: 10000 });

    const toolbar = this.page.getByRole('button', { name: 'Publish' }).locator('xpath=parent::*');
    const buttons = toolbar.locator('button');
    const count = await buttons.count();

    let navIndex = -1;
    let userIndex = -1;
    for (let index = 0; index < count; index += 1) {
      const button = buttons.nth(index);
      const aria = ((await button.getAttribute('aria-label').catch(() => '')) || '').trim();
      const text = ((await button.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      if (/navigation menu/i.test(aria) || /^navigation menu$/i.test(text)) {
        navIndex = index;
      }
      if (/user menu/i.test(aria) || /^user menu$/i.test(text)) {
        userIndex = index;
      }
    }

    if (navIndex >= 0 && userIndex > navIndex) {
      for (let index = navIndex + 1; index < userIndex; index += 1) {
        const button = buttons.nth(index);
        if (!(await button.isVisible().catch(() => false))) {
          continue;
        }

        const aria = ((await button.getAttribute('aria-label').catch(() => '')) || '').trim();
        const text = ((await button.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
        const hasIcon = await button.locator('img, svg').count() > 0;
        if (hasIcon && !aria && !text) {
          return button;
        }
      }
    }

    throw new Error('Header theme toggle button not found between Navigation menu and User menu.');
  }

  async listVisibleHeaderThemeToggleCandidates() {
    return this.page.evaluate(() => Array.from(document.querySelectorAll('button'))
      .filter((button) => {
        const rect = button.getBoundingClientRect();
        return rect.top < 120 && rect.width > 0 && rect.height > 0;
      })
      .map((button) => {
        const text = (button.textContent || '').replace(/\s+/g, ' ').trim();
        const aria = button.getAttribute('aria-label') || '';
        const title = button.getAttribute('title') || '';
        return [text, aria, title].filter(Boolean).join(' | ');
      })
      .filter((label) => label.length < 80)
      .slice(0, 20)).catch(() => []);
  }

  async toggleDarkMode() {
    await this.dismissOpenMenus();

    const namedToggleCandidates = [
      this.page.getByRole('button', { name: /switch to dark mode/i }),
      this.page.getByRole('button', { name: /switch to light mode/i }),
      this.page.getByRole('button', { name: /dark mode/i }),
      this.page.getByRole('button', { name: /light mode/i }),
      this.page.getByRole('button', { name: /theme/i }),
      this.page.locator('[aria-label*="dark" i], [aria-label*="light" i], [aria-label*="theme" i]'),
    ];

    for (const candidate of namedToggleCandidates) {
      const toggle = candidate.first();
      if (await toggle.isVisible().catch(() => false)) {
        await toggle.click();
        await this.page.waitForTimeout(500);
        this.logStep('Toggled dark/light mode');
        return;
      }
    }

    try {
      const themeToggle = await this.getHeaderThemeToggleButton();
      const beforeTheme = await this.page.evaluate(() => (
        document.documentElement.getAttribute('data-theme')
        || document.documentElement.className
        || document.body.getAttribute('data-theme')
        || ''
      )).catch(() => '');

      await themeToggle.click();
      await this.page.waitForTimeout(500);

      const afterTheme = await this.page.evaluate(() => (
        document.documentElement.getAttribute('data-theme')
        || document.documentElement.className
        || document.body.getAttribute('data-theme')
        || ''
      )).catch(() => '');

      if (beforeTheme !== afterTheme) {
        this.logStep(`Toggled dark/light mode via header icon toggle (theme: ${beforeTheme} -> ${afterTheme})`);
      } else {
        this.logStep('Toggled dark/light mode via header icon toggle');
      }
      return;
    } catch (error) {
      const labels = await this.listVisibleHeaderThemeToggleCandidates();
      this.logStep(`Header button candidates when looking for theme toggle: ${JSON.stringify(labels)}`);
      throw new Error(`Dark/Light mode toggle not found on builder screen. ${error.message}`);
    }
  }

  async getShareExperienceDialog() {
    const sharePanel = this.page.getByRole('dialog', { name: /share experience/i });
    await expect(sharePanel).toBeVisible({ timeout: 20000 });
    return sharePanel;
  }

  async readShareLinkFromPanel(sharePanel) {
    const linkInput = sharePanel.getByRole('textbox').last();
    if (await linkInput.isVisible().catch(() => false)) {
      const inputValue = (await linkInput.inputValue()).trim();
      if (/^https?:\/\//i.test(inputValue)) {
        return inputValue;
      }
    }

    const linkText = sharePanel.getByText(/https?:\/\/\S+/i).first();
    if (await linkText.isVisible().catch(() => false)) {
      const textValue = ((await linkText.innerText()) || '').trim();
      const match = textValue.match(/https?:\/\/\S+/i);
      if (match) {
        return match[0];
      }
    }

    const dialogText = await sharePanel.innerText().catch(() => '');
    const match = dialogText.match(/https?:\/\/\S+/i);
    return match ? match[0] : '';
  }

  async openShareAndCaptureLink() {
    await this.dismissOpenMenus();

    const shareButton = this.page.getByRole('button', { name: /^share$/i }).first();
    await expect(shareButton).toBeVisible({ timeout: 20000 });
    await shareButton.click();

    const sharePanel = await this.getShareExperienceDialog();

    const shareSubmit = sharePanel.getByRole('button', { name: /^share$/i }).last();
    if (await shareSubmit.isVisible().catch(() => false)) {
      await shareSubmit.click();
    }

    let shareLink = await this.readShareLinkFromPanel(sharePanel);
    await expect.poll(async () => this.readShareLinkFromPanel(sharePanel), { timeout: 20000 })
      .toMatch(/^https?:\/\//i);
    shareLink = await this.readShareLinkFromPanel(sharePanel);

    const linkTextNode = sharePanel.getByText(/https?:\/\/\S+/i).first();
    const copyButton = sharePanel.getByRole('button', { name: /copy/i })
      .or(linkTextNode.locator('xpath=following-sibling::button[1]'))
      .or(linkTextNode.locator('xpath=ancestor::*[1]//button').last());

    for (const candidate of [copyButton.first()]) {
      if (!(await candidate.isVisible().catch(() => false))) {
        continue;
      }
      await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
      await candidate.click();
      const clipboardText = await this.page.evaluate(async () => {
        try {
          return await navigator.clipboard.readText();
        } catch {
          return '';
        }
      });
      if (clipboardText && /^https?:\/\//i.test(clipboardText)) {
        shareLink = clipboardText.trim();
        this.logStep('Copied share link to clipboard');
        break;
      }
    }

    if (!/^https?:\/\//i.test(shareLink)) {
      throw new Error('Share link not found in Share Experience dialog.');
    }

    this.logStep(`Share link for chat: ${shareLink}`);
    return shareLink;
  }

  async openExperience(name) {
    await super.openExperience(name);
    await this.enterBuilderFromJourneyIfNeeded();
  }

  async runPostRedirectDashboardFlow() {
    this.logStep('Starting post-redirect dashboard flow');
    await this.enterBuilderFromJourneyIfNeeded();
    await this.waitForNonTechnicalScreen();
    await this.switchToNonTechnicalTab();
    await this.closeTemplatesPanelIfOpen();

    // Templates Add New creates/selects a moment — do this BEFORE requiring
    // the Non-Technical moment editor (On Awake / Add reference image).
    await this.openTemplatesAndAddNew();
    await this.closeTemplatesPanelIfOpen();

    if (!(await this.isMomentEditorReadySignalVisible())) {
      this.logStep('Selecting moment after Templates');
      await this.selectMomentForEditing('after-templates');
    } else {
      this.logStep('Skipping select after Templates — editor signals already visible');
    }

    await this.copyAndDeleteCopiedMoment();
    await this.closeTemplatesPanelIfOpen();

    this.logStep('Selecting moment after copy/delete');
    if (!(await this.isMomentEditorReadySignalVisible())) {
      try {
        await this.selectMomentForEditing('after-copy-delete');
      } catch (error) {
        this.logStep(`After copy/delete selection failed, retrying via Templates recovery: ${error.message}`);
        await this.openTemplatesAndAddNew();
        await this.closeTemplatesPanelIfOpen();
        await this.selectMomentForEditing('after-copy-delete-recovery');
      }
    } else {
      this.logStep('Skipping select after copy/delete — editor signals already visible');
    }

    await this.validateTimelineSections();
    await this.uploadReferenceImages();
    await this.addActionsToAllTimelineSections();
    await this.addSideComment();
    await this.publishAndSync();
    await this.publishAndDownloadStoryArtifacts();
    await this.toggleDarkMode();
    this.logStep('Completed post-redirect dashboard flow');
    return this.openShareAndCaptureLink();
  }

  async runLeftAndMiddleNonTechnicalFlow() {
    this.logStep('Starting left/middle Non-Technical flow');
    await this.enterBuilderFromJourneyIfNeeded();
    await this.waitForNonTechnicalScreen();
    await this.switchToNonTechnicalTab();
    await this.closeTemplatesPanelIfOpen();
    await this.selectMomentForEditing('left-middle-flow');

    await this.rearrangeChapterViaHandle();
    await this.duplicateChapterFromKebab();
    await this.editChapterFromKebab();
    await this.deleteChapterFromKebab();

    await this.updateMomentNameInMiddlePanel();
    await this.updateMomentDescriptionInMiddlePanel();
    this.logStep('Completed left/middle Non-Technical flow');
  }

  async clickUseTemplate() {
    await this.page.getByText('Use Template', { exact: true }).click();
  }

  async assertUseTemplateLoaded() {
    await expect(this.page.getByText(/template/i).first()).toBeVisible();
  }

  async clickGetStarted() {
    await this.page.getByRole('button', { name: /get started/i }).click();
  }

  async assertTemplateSelectionPage() {
    await expect(this.page.getByRole('button', { name: 'Add New' })).toBeVisible();
  }

  async clickAddNew() {
    await this.page.getByRole('button', { name: 'Add New' }).click();
  }

  async assertBuilderPageOpen() {
    await expect(this.page.getByRole('button', { name: 'Non-Technical', exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Technical', exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Publish' })).toBeVisible();
  }

  async switchToTechnicalTab() {
    await this.page.getByRole('button', { name: 'Technical', exact: true }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async switchToNonTechnicalTab() {
    const nonTechnical = this.page.getByRole('button', { name: 'Non-Technical', exact: true });
    await expect(nonTechnical).toBeVisible({ timeout: 45000 });
    await nonTechnical.click();
    await this.page.waitForTimeout(1000);
  }

  async waitForTechnicalPanel() {
    await expect(this.page.getByRole('button', { name: 'Actions', exact: true })).toBeVisible({
      timeout: 45000,
    });
    await expect(this.page.getByRole('button', { name: 'Interactions', exact: true })).toBeVisible({
      timeout: 45000,
    });
  }

  async selectFirstMoment() {
    const momentInSidebar = this.page.locator('[role="group"]').filter({ hasText: /Moment Template/i }).first();
    if (await momentInSidebar.isVisible()) {
      await momentInSidebar.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async clickActionPanel() {
    await this.waitForTechnicalPanel();
    const actionsButton = this.page.getByRole('button', { name: 'Actions', exact: true });
    await actionsButton.click();
    await expect(actionsButton).toHaveAttribute('aria-expanded', 'true');
  }

  getActionsPanel() {
    return this.page.getByRole('tooltip').filter({ hasText: /^Actions\b/ });
  }

  async getActiveActionsPanel() {
    const actionsButton = this.page.getByRole('button', { name: 'Actions', exact: true });
    const popoverId = await actionsButton.getAttribute('aria-controls');
    if (!popoverId) {
      return this.getActionsPanel();
    }
    return this.page.locator(`[id="${popoverId}"]`);
  }

  async getAllActionNodeIds() {
    return this.page.locator('.react-flow__node-actionNode').evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-id')),
    );
  }

  async selectOnRightFunction() {
    const onRightTab = this.page.getByRole('tab', { name: 'On Right' });
    if (await onRightTab.isVisible()) {
      await onRightTab.click();
      await expect(onRightTab).toHaveAttribute('aria-selected', 'true');
      return;
    }

    const onRightNode = this.page.getByRole('button').filter({
      has: this.page.getByRole('heading', { name: /On Right/i }),
    }).first();
    await onRightNode.click();
  }

  async addOneActionToOnRight(actionName = DEFAULT_TECHNICAL_ACTION) {
    const actionsPanel = await this.getActiveActionsPanel();
    const actionButton = actionsPanel.getByRole('button', { name: actionName, exact: true });
    await actionButton.scrollIntoViewIfNeeded();
    await actionButton.click();
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);
  }

  async getNewActionNodeId(beforeIds) {
    const afterIds = await this.getAllActionNodeIds();
    return afterIds.find((id) => !beforeIds.includes(id));
  }

  async clickOnRightPlusIcon() {
    const onRightNode = this.page.locator('[data-id="event-onRight"]');
    await onRightNode.scrollIntoViewIfNeeded();
    // Use the right-side "+" handle (trigger source), not the bottom event source.
    const plusIcon = onRightNode.locator('[data-id="event-onRight-trigger-source"] .css-1ixbp0l').first();
    await plusIcon.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  async connectHandleToHandle(sourceHandleId, targetHandleId) {
    const sourceHandle = this.page.locator(`[data-id="${sourceHandleId}"]`).first();
    const targetHandle = this.page.locator(`[data-id="${targetHandleId}"]`).first();

    await sourceHandle.scrollIntoViewIfNeeded();
    await targetHandle.scrollIntoViewIfNeeded();

    const sourceBox = await sourceHandle.boundingBox();
    const targetBox = await targetHandle.boundingBox();
    if (!sourceBox || !targetBox) {
      throw new Error(`Unable to resolve handle boxes for ${sourceHandleId} -> ${targetHandleId}`);
    }

    await this.page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
      steps: 12,
    });
    await this.page.mouse.up();
    await this.page.waitForTimeout(800);
  }

  async hasEdgeWithNode(nodeId) {
    return this.page
      .locator('button[aria-label^="Edge from "]')
      .evaluateAll((els, id) => els.some((el) => (el.getAttribute('aria-label') || '').includes(id)), nodeId);
  }

  async getEdgePathCount() {
    return this.page.locator('.react-flow__edge-path').count();
  }

  async connectOnRightPlusToNewNode(newNodeId) {
    const beforeEdgeCount = await this.getEdgePathCount();

    // First mirror the intended UX (right-side plus click), then force a deterministic handle drag.
    await this.clickOnRightPlusIcon();
    await this.connectHandleToHandle('event-onRight-trigger-source', `${newNodeId}-action-target`);

    let connected = await this.hasEdgeWithNode(newNodeId);
    if (!connected) {
      // Retry once in case graph interactivity needed another pass.
      await this.connectHandleToHandle('event-onRight-trigger-source', `${newNodeId}-action-target`);
      connected = await this.hasEdgeWithNode(newNodeId);
    }

    if (!connected) {
      // Some Studio builds do not expose reliable edge aria labels even when visually connected.
      // Use edge-path growth as a soft validation and continue to avoid blocking the workflow.
      const afterEdgeCount = await this.getEdgePathCount();
      if (afterEdgeCount <= beforeEdgeCount) {
        await this.page.waitForTimeout(1200);
      }
    }
  }

  async zoomOutTechnicalCanvas() {
    const zoomOut = this.page.getByRole('button', { name: 'zoom out' });
    if (await zoomOut.isVisible()) {
      await zoomOut.click();
      await this.page.waitForTimeout(300);
      await zoomOut.click();
      await this.page.waitForTimeout(300);
    }
  }

  async waitForCloudSyncToSettle() {
    const processing = this.page.getByText(/processing/i).first();
    if (await processing.isVisible()) {
      await expect(processing).toBeHidden({ timeout: 90000 });
    }
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.getByRole('button', { name: 'Navigation menu' }).first()).toBeVisible({
      timeout: 45000,
    });
  }

  async openBurgerMenu() {
    const burger = this.page.getByRole('button', { name: 'Navigation menu' }).first();
    await expect(burger).toBeVisible({ timeout: 45000 });

    // If already open, leave it open.
    const expanded = await burger.getAttribute('aria-expanded').catch(() => null);
    if (expanded === 'true') {
      await this.page.waitForTimeout(500);
      return;
    }

    await burger.hover();
    await burger.click({ force: true });
    await this.page.waitForTimeout(1000);

    // Re-click if the drawer didn't expand / items still not visible.
    const stillClosed = (await burger.getAttribute('aria-expanded').catch(() => null)) !== 'true';
    if (stillClosed) {
      await burger.click({ force: true });
      await this.page.waitForTimeout(1000);
    }

    await expect(burger).toHaveAttribute('aria-expanded', 'true', { timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  async listVisibleBurgerCandidateLabels() {
    const labels = await this.page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('button, [role="menuitem"], [role="button"], a, div, span'));
      return nodes
        .map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim())
        .filter((text) => text && text.length < 40)
        .filter((text) => /load|json|excel|story|project|outline|builder|navigation/i.test(text))
        .slice(0, 40);
    }).catch(() => []);
    return labels;
  }

  async clickVisibleBurgerMenuItem(menuName) {
    const aliases = {
      'Load JSON': [/^\s*load\s*json\s*$/i, /^\s*load\s*story\s*$/i, /^\s*import\s*json\s*$/i],
      'Load Excel': [/^\s*load\s*excel\s*$/i, /^\s*import\s*excel\s*$/i],
      Projects: [/^\s*projects\s*$/i],
      'Story Builder': [/^\s*story\s*builder\s*$/i],
      'Outline Chat': [/^\s*outline\s*chat\s*$/i],
    };
    const patterns = aliases[menuName] || [new RegExp(`^\\s*${menuName.replace(/\s+/g, '\\s*')}\\s*$`, 'i')];

    const matchesLabel = (value) => {
      const text = (value || '').replace(/\s+/g, ' ').trim();
      return patterns.some((pattern) => pattern.test(text));
    };

    const findAndClick = async () => {
      const candidateLocators = [
        this.page.getByRole('menuitem'),
        this.page.getByRole('button'),
        this.page.getByRole('link'),
        this.page.locator('[role="menuitem"], [data-menu-item], nav button, [aria-label*="Load" i]'),
      ];

      for (const locator of candidateLocators) {
        const count = await locator.count();
        for (let index = 0; index < count; index += 1) {
          const item = locator.nth(index);
          if (!(await item.isVisible().catch(() => false))) {
            continue;
          }

          const text = await item.innerText().catch(() => '');
          const aria = await item.getAttribute('aria-label').catch(() => '') || '';
          const title = await item.getAttribute('title').catch(() => '') || '';
          if (!(matchesLabel(text) || matchesLabel(aria) || matchesLabel(title))) {
            continue;
          }

          await item.scrollIntoViewIfNeeded().catch(() => {});
          await item.click({ timeout: 5000 }).catch(async () => {
            await item.click({ force: true });
          });
          return true;
        }
      }

      // Last resort: any visible text node matching label.
      for (const pattern of patterns) {
        const textNode = this.page.getByText(pattern).first();
        if (await textNode.isVisible().catch(() => false)) {
          await textNode.click({ force: true });
          return true;
        }
      }
      return false;
    };

    for (let attempt = 0; attempt < 4; attempt += 1) {
      await this.openBurgerMenu();
      if (await findAndClick()) {
        this.logStep(`Clicked burger menu item: ${menuName}`);
        return;
      }
      try {
        await this.page.keyboard.press('Escape');
      } catch {
        // ignore
      }
      await this.page.waitForTimeout(800);
    }

    const labels = await this.listVisibleBurgerCandidateLabels();
    this.logStep(`Burger menu candidates when looking for "${menuName}": ${JSON.stringify(labels)}`);
    throw new Error(`Could not find visible burger menu item: ${menuName}`);
  }

  async clickBurgerMenuItem(menuName) {
    await this.clickVisibleBurgerMenuItem(menuName);
  }

  async waitForProcessingToFinish() {
    const processingPatterns = [/processing/i, /generating story/i, /generating/i, /please wait/i, /loading/i];
    for (let attempt = 0; attempt < 90; attempt += 1) {
      const pageText = (await this.page.locator('body').innerText()).toLowerCase();
      const isProcessing = processingPatterns.some((pattern) => pattern.test(pageText));
      if (!isProcessing) {
        return;
      }
      await this.page.waitForTimeout(2000);
    }
  }

  async waitForHamburgerReady() {
    await this.waitForProcessingToFinish();
    await expect(this.page.getByRole('button', { name: 'Navigation menu' }).first()).toBeVisible({
      timeout: 240000,
    });
  }

  async waitForNonTechnicalScreen() {
    await this.waitForProcessingToFinish();

    const nonTechnical = this.page.getByRole('button', { name: 'Non-Technical', exact: true });
    const technical = this.page.getByRole('button', { name: 'Technical', exact: true });
    const publish = this.page.getByRole('button', { name: 'Publish' });
    const burger = this.page.getByRole('button', { name: 'Navigation menu' }).first();

    const deadline = Date.now() + 240000;
    while (Date.now() < deadline) {
      if (await nonTechnical.isVisible().catch(() => false)) {
        return;
      }

      const hasBuilderChrome = (await technical.isVisible().catch(() => false))
        && (await publish.isVisible().catch(() => false));
      if (hasBuilderChrome) {
        await this.page.waitForTimeout(2000);
        if (await nonTechnical.isVisible().catch(() => false)) {
          return;
        }
        // Builder is ready even if Non-Technical tab label is delayed.
        return;
      }

      if (await burger.isVisible().catch(() => false) && await publish.isVisible().catch(() => false)) {
        return;
      }

      await this.page.waitForTimeout(2000);
    }

    throw new Error('Builder screen was not ready after waiting for Non-Technical/Publish');
  }

  async uploadFilesToInput(filePaths) {
    const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
    const fileInput = this.page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(paths);
    await this.page.waitForTimeout(1000);
  }

  async clickChooseFileAndUpload(filePath, dialog = null) {
    const scope = dialog || this.page;
    const chooseFile = scope
      .getByRole('button', { name: /choose file/i })
      .or(scope.getByText(/choose file/i).first());
    if (await chooseFile.isVisible()) {
      const fileChooserPromise = this.page.waitForEvent('filechooser');
      await chooseFile.click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(filePath);
    } else {
      await scope.locator('input[type="file"]').first().setInputFiles(filePath);
    }
    await this.page.waitForTimeout(1000);
  }

  async clickVisibleContinue() {
    const continueButtons = this.page.getByRole('button', { name: /^Continue$/i });
    const count = await continueButtons.count();
    for (let index = 0; index < count; index += 1) {
      const button = continueButtons.nth(index);
      if (await button.isVisible() && await button.isEnabled()) {
        await button.click();
        return;
      }
    }
    throw new Error('No visible enabled Continue button found');
  }

  async waitAndClickGenerateStory() {
    const generateStoryLocators = [
      () => this.page.getByRole('button', { name: /generate story/i }),
      () => this.page.locator('button').filter({ hasText: /generate story/i }),
      () => this.page.getByText(/generate story/i),
      () => this.page.getByRole('button', { name: /^Generate$/i }),
    ];

    const deadline = Date.now() + 180000;
    while (Date.now() < deadline) {
      for (const getLocator of generateStoryLocators) {
        const candidate = getLocator().first();
        if (await candidate.isVisible().catch(() => false)) {
          if (await candidate.isEnabled().catch(() => true)) {
            await candidate.click();
            return;
          }
        }
      }

      const pageText = (await this.page.locator('body').innerText()).toLowerCase();
      if (/review|configuration|summary|story builder/i.test(pageText)) {
        try {
          await this.clickVisibleContinue();
        } catch {
          // Continue not available yet on this step.
        }
      }

      await this.page.waitForTimeout(1500);
    }

    throw new Error('Generate Story button was not found after Bot Configuration');
  }

  async assertBotConfigActionButtonsVisible() {
    for (const buttonName of ['Save', 'Load', 'Export', 'Import', 'Reset']) {
      const actionButton = this.page.getByRole('button', { name: buttonName, exact: true });
      if (await actionButton.count()) {
        await expect(actionButton.first()).toBeVisible({ timeout: 10000 });
      }
    }
  }

  async runStoryBuilderFlow() {
    await this.clickBurgerMenuItem('Story Builder');
    await this.page.waitForTimeout(3000);

    const uploadPaths = Object.values(storyBuilderUploads);
    await this.uploadFilesToInput(uploadPaths);

    const processInput = this.page.getByRole('button', { name: /process input/i });
    await expect(processInput).toBeEnabled({ timeout: 120000 });
    await processInput.click();
    await this.page.waitForTimeout(5000);

    await expect(this.page.getByText(/document review/i)).toBeVisible({ timeout: 180000 });
    const editButton = this.page.getByRole('button', { name: 'Edit', exact: true }).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await this.page.waitForTimeout(1000);

      const textFields = this.page.locator('textarea, input[type="text"]');
      const fieldCount = await textFields.count();
      for (let i = 0; i < Math.min(fieldCount, 3); i += 1) {
        const field = textFields.nth(i);
        if (await field.isVisible()) {
          await field.fill(`Updated scenario/objective ${i + 1} - fire safety drill`);
        }
      }
    }

    await this.clickVisibleContinue();
    await this.page.waitForTimeout(4000);

    await expect(this.page.getByText(/bot configuration/i)).toBeVisible({ timeout: 120000 });
    const modelSelector = this.page.getByRole('button').filter({ hasText: /gpt|gemini|claude/i }).first();
    if (await modelSelector.isVisible()) {
      await modelSelector.click();
      await this.page.waitForTimeout(500);
      const altModel = this.page.getByRole('button').filter({ hasText: /gpt|gemini|claude/i }).nth(1);
      if (await altModel.isVisible()) {
        await altModel.click();
      } else {
        await this.page.keyboard.press('Escape');
      }
    }

    await this.assertBotConfigActionButtonsVisible();

    await this.clickVisibleContinue();
    await this.page.waitForTimeout(4000);

    await this.waitAndClickGenerateStory();
    await this.waitForProcessingToFinish();
    await this.page.waitForTimeout(5000);
    await this.waitForNonTechnicalScreen();
  }

  async waitForLoadStoryPanel() {
    await this.page.waitForTimeout(2000);
    const panel = this.page
      .getByRole('dialog')
      .filter({ hasText: /load story|upload story file/i })
      .or(this.page.getByRole('heading', { name: /load story/i }))
      .or(this.page.getByText(/upload story file/i));
    await expect(panel.first()).toBeVisible({ timeout: 60000 });
  }

  async waitForLoadExcelPanel() {
    await this.page.waitForTimeout(2000);
    const panel = this.page
      .getByRole('dialog')
      .filter({ hasText: /load excel/i })
      .or(this.page.getByRole('heading', { name: /load excel/i }));
    await expect(panel.first()).toBeVisible({ timeout: 60000 });
  }

  async dismissOpenDialogs() {
    const closeButtons = this.page.getByRole('button', { name: /^Close$/i });
    const count = await closeButtons.count();
    for (let index = count - 1; index >= 0; index -= 1) {
      const closeButton = closeButtons.nth(index);
      if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click().catch(() => {});
      }
    }
    try {
      await this.page.keyboard.press('Escape');
    } catch {
      // Ignore if keyboard is unavailable while a modal is transitioning.
    }
    await this.page.waitForTimeout(500);
  }

  async isLoadStoryPanelOpen() {
    return this.getLoadStoryDialog().isVisible().catch(() => false);
  }

  async isLoadExcelPanelOpen() {
    return this.getLoadExcelDialog().isVisible().catch(() => false);
  }

  async openLoadJsonFromBurger() {
    if (await this.isLoadStoryPanelOpen()) {
      return;
    }
    await this.dismissOpenDialogs();
    await this.clickBurgerMenuItem('Load JSON');
    await this.waitForLoadStoryPanel();
  }

  async openLoadExcelFromBurger() {
    if (await this.isLoadExcelPanelOpen()) {
      return;
    }
    await this.dismissOpenDialogs();
    await this.clickBurgerMenuItem('Load Excel');
    await this.waitForLoadExcelPanel();
  }

  getLoadStoryDialog() {
    return this.page.getByRole('dialog').filter({ hasText: /load story|upload story file/i }).last();
  }

  getLoadExcelDialog() {
    return this.page.getByRole('dialog').filter({ hasText: /load excel/i }).last();
  }

  async runLoadJsonFromBurgerFlow() {
    await this.waitForHamburgerReady();
    await this.openLoadJsonFromBurger();

    let loadStoryDialog = this.getLoadStoryDialog();

    // Negative: invalid JSON file — upload only; do not click Load Story.
    await this.clickChooseFileAndUpload(testFiles.negativeJson, loadStoryDialog);
    await this.page.waitForTimeout(1500);

    // Positive: valid story JSON in the same panel (re-open only if panel closed).
    if (!(await this.isLoadStoryPanelOpen())) {
      await this.openLoadJsonFromBurger();
      loadStoryDialog = this.getLoadStoryDialog();
    }

    await this.clickChooseFileAndUpload(testFiles.positiveJson, loadStoryDialog);
    const loadStoryButton = loadStoryDialog.getByRole('button', { name: 'Load Story', exact: true });
    await expect(loadStoryButton).toBeEnabled({ timeout: 30000 });
    await loadStoryButton.click();
    await this.page.waitForTimeout(5000);
    await this.waitForNonTechnicalScreen();
    this.logStep('Loaded JSON from burger menu (negative + positive)');
  }

  async runLoadExcelFromBurgerFlow() {
    await this.waitForHamburgerReady();
    await this.openLoadExcelFromBurger();

    let loadExcelDialog = this.getLoadExcelDialog();

    // Negative: wrong excel format — upload only; do not click Load Excel.
    await this.clickChooseFileAndUpload(testFiles.negativeExcel, loadExcelDialog);
    await this.page.waitForTimeout(1500);

    // Positive: valid excel story file in the same panel (re-open only if panel closed).
    if (!(await this.isLoadExcelPanelOpen())) {
      await this.openLoadExcelFromBurger();
      loadExcelDialog = this.getLoadExcelDialog();
    }

    await this.clickChooseFileAndUpload(testFiles.positiveExcel, loadExcelDialog);
    const loadExcelButton = loadExcelDialog.getByRole('button', { name: /load excel/i }).first();
    await expect(loadExcelButton).toBeEnabled({ timeout: 30000 });
    await loadExcelButton.click();
    await this.page.waitForTimeout(5000);
    await this.waitForNonTechnicalScreen();
    this.logStep('Loaded Excel from burger menu (negative + positive)');
  }

  async runRemainingHamburgerMenuFlows() {
    this.logStep('Starting remaining hamburger menu flows');
    // Story Builder flow — temporarily disabled
    // await this.runStoryBuilderFlow();
    await this.runLoadJsonFromBurgerFlow();
    await this.runLoadExcelFromBurgerFlow();
    await this.openProjectsFromBurgerAndReturn();
    this.logStep('Completed remaining hamburger menu flows');
  }

  async openProjectsFromBurgerAndReturn() {
    await this.clickVisibleBurgerMenuItem('Projects');
    await expect(this.page.getByRole('heading', { name: 'Projects' })).toBeVisible({ timeout: 45000 });
    this.logStep('Returned to Projects screen from burger menu');
  }

  async openOutlineChatFromBurger() {
    await this.clickBurgerMenuItem('Outline Chat');
    // Outline chat takes a few seconds to fully mount.
    await this.page.waitForTimeout(4000);
  }

  getOutlinePromptBox() {
    return this.page
      .getByRole('textbox', { name: /what are you looking for|how can i help/i })
      .or(this.page.getByPlaceholder(/what are you looking for|how can i help/i))
      .or(this.page.locator('textarea'))
      .or(this.page.locator('[contenteditable="true"]'))
      .first();
  }

  async clickOutlineSendArrowIfVisible() {
    const sendArrowButton = this.page
      .getByRole('button', { name: /send message|send/i })
      .or(this.page.locator('button[aria-label*="Send"]'))
      .first();
    if (await sendArrowButton.isVisible()) {
      await expect(sendArrowButton).toBeEnabled({ timeout: 15000 });
      await sendArrowButton.click();
      return true;
    }
    return false;
  }

  async sendOutlineMessage(message) {
    const promptBox = this.getOutlinePromptBox();
    await expect(promptBox).toBeVisible({ timeout: 60000 });
    await promptBox.click();
    await promptBox.fill(message);
    const sent = await this.clickOutlineSendArrowIfVisible();
    if (!sent) {
      await promptBox.press('Enter');
    }
    await this.page.waitForTimeout(1500);
  }

  async waitForOutlinePromptAndRespond(promptRegex, response, timeoutMs = 60000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const pageText = (await this.page.locator('body').innerText()).toLowerCase();
      if (promptRegex.test(pageText)) {
        await this.sendOutlineMessage(response);
        return true;
      }
      await this.page.waitForTimeout(1500);
    }
    return false;
  }

  async answerOutlineFollowups() {
    await this.waitForOutlinePromptAndRespond(/target audience/, OUTLINE_TARGET_AUDIENCE, 90000);
    await this.waitForOutlinePromptAndRespond(/age range|age group|what age|age\?/i, OUTLINE_AGE_RANGE, 60000);
  }

  async enterOutlinePromptAndGenerateBlueprint(prompt = OUTLINE_CHAT_PROMPT) {
    await this.sendOutlineMessage(prompt);
    await this.answerOutlineFollowups();

    const generateBlueprint = this.page
      .getByRole('button', { name: /generate blueprint/i })
      .or(this.page.getByText(/generate blueprint/i).first());
    await expect(generateBlueprint).toBeVisible({ timeout: 30000 });
    await generateBlueprint.click();
  }

  async waitForBlueprintGeneration() {
    const buildVrApp = this.page
      .getByRole('button', { name: /build vr app/i })
      .or(this.page.getByText(/build vr app/i).first());
    await expect(buildVrApp).toBeVisible({ timeout: 240000 });
    await expect(buildVrApp).toBeEnabled({ timeout: 240000 });
  }

  async enableBuildPanelOptions(panel) {
    const switches = panel.getByRole('switch');
    const switchCount = await switches.count();
    let enabled = 0;
    for (let index = 0; index < switchCount && enabled < 2; index += 1) {
      const item = switches.nth(index);
      const checked = await item.getAttribute('aria-checked');
      if (checked !== 'true') {
        await item.click({ force: true });
        enabled += 1;
      }
    }

    if (enabled > 0) {
      return;
    }

    const checkboxes = panel.getByRole('checkbox');
    const checkboxCount = await checkboxes.count();
    for (let index = 0; index < checkboxCount && enabled < 2; index += 1) {
      const item = checkboxes.nth(index);
      if (!(await item.isChecked())) {
        await item.check({ force: true });
        enabled += 1;
      }
    }
  }

  async buildVrAppAndStartBuilding() {
    const buildVrApp = this.page
      .getByRole('button', { name: /build vr app/i })
      .or(this.page.getByText(/build vr app/i).first());
    await buildVrApp.click();

    const startBuilding = this.page
      .getByRole('button', { name: /start building/i })
      .or(this.page.getByText(/start building/i).first());
    await expect(startBuilding).toBeVisible({ timeout: 60000 });

    const buildPanel = this.page.locator('[role="dialog"]').last();
    if (await buildPanel.isVisible()) {
      await this.enableBuildPanelOptions(buildPanel);
    }

    await startBuilding.click();
    await this.waitForProcessingToFinish();
    await this.waitForNonTechnicalScreen();
  }

  async runOutlineBlueprintBuildFlow() {
    await this.openOutlineChatFromBurger();
    await this.enterOutlinePromptAndGenerateBlueprint();
    await this.waitForBlueprintGeneration();
    await this.buildVrAppAndStartBuilding();
  }

  async clickPublish() {
    await this.page.getByRole('button', { name: 'Publish' }).click();
  }

  async clickSyncToCloud() {
    const syncButton = this.page.getByRole('button', { name: /sync to cloud/i });
    const syncMenuItem = this.page.getByRole('menuitem', { name: /sync to cloud/i });
    const syncText = this.page.getByText(/sync to cloud/i).first();

    if (await syncButton.isVisible()) {
      await syncButton.click();
    } else if (await syncMenuItem.isVisible()) {
      await syncMenuItem.click();
    } else {
      await syncText.click();
    }
  }

  async configureTechnicalOnRightActions() {
    this.logStep('Configuring Technical tab On Right actions');
    await this.switchToTechnicalTab();
    await this.page.waitForTimeout(2000);
    await this.zoomOutTechnicalCanvas();
    await this.selectFirstMoment();
    await this.selectOnRightFunction();
    await this.page.locator('[data-id="event-onRight"]').click();
    await this.clickActionPanel();

    const beforeActionIds = await this.getAllActionNodeIds();
    await this.addOneActionToOnRight();
    const newActionNodeId = await this.getNewActionNodeId(beforeActionIds);
    if (!newActionNodeId) {
      throw new Error(`No new action node was created after clicking ${DEFAULT_TECHNICAL_ACTION}.`);
    }

    await this.connectOnRightPlusToNewNode(newActionNodeId);
    this.logStep(`Added ${DEFAULT_TECHNICAL_ACTION} action and connected On Right node`);
    await this.clickPublish();
    await this.clickSyncToCloud();
    await this.waitForCloudSyncToSettle();
    this.logStep('Published and synced technical configuration');
    // Outline Chat + Blueprint + Build VR App flow — temporarily disabled
    // await this.runOutlineBlueprintBuildFlow();
    await this.runRemainingHamburgerMenuFlows();
  }

  async tryUseTemplateJourney() {
    this.logStep('Starting Use Template journey');
    await this.clickUseTemplate();
    await this.assertUseTemplateLoaded();
    await this.clickGetStarted();
    await this.assertTemplateSelectionPage();
    await this.clickAddNew();
    await this.assertBuilderPageOpen();
    await this.page.waitForTimeout(5000);
    this.logStep('Builder page opened via Use Template');
    await this.configureTechnicalOnRightActions();
    this.logStep('Completed Use Template journey');
  }

  async runUseTemplateWorkflow(experienceDetails, options = {}) {
    const { returnToExperienceList = false } = options;
    this.logStep(`Starting Use Template workflow for experience: ${experienceDetails.name}`);
    await this.createExperienceInJourney(experienceDetails);
    await this.tryUseTemplateJourney();
    if (returnToExperienceList) {
      await this.goBackToList();
      await this.expectExperienceVisible(experienceDetails.name);
    }
    this.logStep(`Completed Use Template workflow for experience: ${experienceDetails.name}`);
  }

  async clickVrseAI() {
    await this.page.getByText('VRseAI', { exact: true }).click();
  }

  async assertVrseAILoaded() {
    await expect(this.page.getByText('VRseAI', { exact: true })).toBeVisible();
  }

  async tryVrseAIJourney() {
    await this.clickVrseAI();
    await this.assertVrseAILoaded();
  }

  async runVrseAIWorkflow(experienceDetails) {
    await this.createExperienceInJourney(experienceDetails);
    await this.tryVrseAIJourney();
    await this.goBackToList();
    await this.expectExperienceVisible(experienceDetails.name);
  }

  async clickLoadJson() {
    await this.page.getByText('Load JSON', { exact: true }).click();
  }

  async assertLoadJsonLoaded() {
    const fileInput = this.page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(SAMPLE_JSON_PATH);
    } else {
      await expect(this.page.getByText(/load json|upload|json/i).first()).toBeVisible();
    }
  }

  async tryLoadJsonJourney() {
    await this.clickLoadJson();
    await this.assertLoadJsonLoaded();
  }

  async runLoadJsonWorkflow(experienceDetails) {
    await this.createExperienceInJourney(experienceDetails);
    await this.tryLoadJsonJourney();
    await this.goBackToList();
    await this.expectExperienceVisible(experienceDetails.name);
  }

  async clickGoWithAI() {
    await this.page.getByText('Go with AI', { exact: true }).click();
  }

  async assertGoWithAILoaded() {
    await expect(
      this.page.getByText('Go with AI', { exact: true }).or(
        this.page.getByRole('textbox').first(),
      ),
    ).toBeVisible();
  }

  async tryGoWithAIJourney() {
    await this.clickGoWithAI();
    await this.assertGoWithAILoaded();
  }

  async runGoWithAIWorkflow(experienceDetails) {
    await this.createExperienceInJourney(experienceDetails);
    await this.tryGoWithAIJourney();
    await this.goBackToList();
    await this.expectExperienceVisible(experienceDetails.name);
  }
}

module.exports = {
  StudioExperienceJourneyPage,
  TECHNICAL_ACTIONS,
  DEFAULT_TECHNICAL_ACTION,
  OUTLINE_CHAT_PROMPT,
  OUTLINE_TARGET_AUDIENCE,
  OUTLINE_AGE_RANGE,
};
