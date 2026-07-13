const { test } = require('../framework/fixtures');
const {
  EvaluationsPage,
  AnalyticsPage,
  UsersPage,
  ModulesPage,
  TrainingsPage,
  DevicesPage,
  GroupsPage,
  SchedulesPage,
  SupportPage,
  LoginPage,
} = require('../framework/pages');

// ========================================
// EVALUATIONS — EXPORT
// ========================================

test('Evaluation Report Download: PDF', async ({ authenticatedPage: page }) => {
  const evaluations = new EvaluationsPage(page);
  await evaluations.open();
  await evaluations.exportPdfFromEvaluations();
});

test('Evaluation Report Download: Excel', async ({ authenticatedPage: page }) => {
  const evaluations = new EvaluationsPage(page);
  await evaluations.open();
  await evaluations.exportExcelFromEvaluations();
});

// ========================================
// ANALYTICS
// ========================================

test('Analytics Page', async ({ authenticatedPage: page }) => {
  const analytics = new AnalyticsPage(page);
  await analytics.runFullAnalyticsWorkflow();
});

test('Analytics Page Dropdowns', async ({ authenticatedPage: page }) => {
  const analytics = new AnalyticsPage(page);
  await analytics.runModuleAnalyticsDropdowns();
});

// ========================================
// USERS
// ========================================

test('Users', async ({ authenticatedPage: page }) => {
  const users = new UsersPage(page);
  await users.openDirect();
  console.log('✅ Logged in successfully');
  console.log('✅ Navigated to Users page');
  await users.runFullUsersWorkflow();
});

// ========================================
// SUPPORT
// ========================================

test('Get Support', async ({ authenticatedPage: page }) => {
  const support = new SupportPage(page);
  await support.runFullSupportWorkflow();
});

// ========================================
// MODULES
// ========================================

test('Assign Module', async ({ authenticatedPage: page }) => {
  const modules = new ModulesPage(page);
  await page.waitForTimeout(2000);
  await modules.open();
  await modules.runAssignModuleWorkflow();
});

// ========================================
// EVALUATIONS — FULL PAGE
// ========================================

test('Evaluations', async ({ authenticatedPage: page }) => {
  const evaluations = new EvaluationsPage(page);
  await evaluations.open();
  await evaluations.viewIncompleteSession();
  await evaluations.viewCompletedSession();
  await evaluations.runTableAndExportWorkflow();
});

// ========================================
// TRAININGS
// ========================================

test('Trainings', async ({ authenticatedPage: page }) => {
  const trainings = new TrainingsPage(page);
  await trainings.open();
  await trainings.runFullTrainingsWorkflow();
});

// ========================================
// DEVICES
// ========================================

test('Devices', async ({ authenticatedPage: page }) => {
  const devices = new DevicesPage(page);
  await devices.open();
  await devices.runFullDevicesWorkflow();
});

// ========================================
// SIGN OUT
// ========================================

test('Sign out', async ({ authenticatedPage: page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.openUserMenu();
});

// ========================================
// GROUPS
// ========================================

test('Groups Page', async ({ authenticatedPage: page }) => {
  const groups = new GroupsPage(page);
  await groups.open();
  await groups.runFullGroupsWorkflow();
});

// ========================================
// SCHEDULES
// ========================================

test('Schedules', async ({ authenticatedPage: page }) => {
  const schedules = new SchedulesPage(page);
  await schedules.open();
  await schedules.runFullSchedulesWorkflow();
});
