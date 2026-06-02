const { test, expect } = require('@playwright/test');

// ============================================================
//  SHARED CONSTANTS
//  Update credentials and base URL here if they change
// ============================================================

const BASE_URL  = 'https://dev-pulse-dashboard.autovrse-training.com';
const USERNAME  = 'admin@autovrse.in';
const PASSWORD  = 'admin';

// ============================================================
//  SHARED HELPER — LOGIN
//  Called at the start of every test to avoid repetition
// ============================================================

async function login(page) {
  await page.goto(`${BASE_URL}/auth/login/`);
  await page.getByLabel('Username').fill(USERNAME);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Continue' }).click();
}


// ============================================================
// TEST 1: EVALUATION REPORT — PDF EXPORT
// ============================================================

test('Evaluation Report Download: PDF', async ({ page }) => {

  // Step 1: Login and navigate to Evaluations
  await login(page);
  await page.getByRole('link', { name: 'Evaluations' }).click();

  // Step 2: Trigger PDF export
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByRole('button', { name: 'Export As PDF' }).click();
  await page.waitForTimeout(2000);

  // Step 3: Open notifications and click the completed export
  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: 'Clear all notifications' }).click();
  await page.getByRole('button', { name: 'Export completed - Click to' }).click();

  // Step 4: Download the PDF (opens in a new popup tab)
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Download' }).nth(1).click();
  const page1 = await page1Promise;

});

// test('Evaluation Report Download: Excel', async ({ page }) => {
//   await login(page);
//   await page.getByRole('link', { name: 'Evaluations' }).click();
//   await page.getByRole('button', { name: 'Export', exact: true }).click();
//   await page.getByRole('button', { name: 'Export As Excel' }).click();
//   await page.getByRole('button', { name: 'Export completed - Click to' }).click();
//   const page1Promise = page.waitForEvent('popup');
//   await page.getByRole('button', { name: 'Download' }).nth(1).click();
//   const page1 = await page1Promise;
// });


// ============================================================
// TEST 2: ANALYTICS PAGE
//   Covers: Tab switching, AI Analytics, Customize Dashboard,
//           Module / Domain / Department Analytics filters
// ============================================================

test('Analytics Page', async ({ page }) => {

  // ── Login ──────────────────────────────────────────────────
  await login(page);
  await page.waitForTimeout(5000);

  // ── Tab switching ──────────────────────────────────────────
  await page.getByRole('tab', { name: 'Module Analytics' }).click();
  await page.waitForTimeout(2000);

  await page.getByRole('tab', { name: 'Domain Analytics' }).click();
  await page.waitForTimeout(2000);

  await page.getByRole('tab', { name: 'Department Analytics' }).click();

  // ── AI Analytics ───────────────────────────────────────────
  await page.getByRole('button', { name: 'AI Analytics' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('textbox', { name: 'Ask anything... e.g., Show me' }).click();
  await page.getByRole('textbox', { name: 'Ask anything... e.g., Show me' }).fill('I need a list of training data');
  await page.getByRole('main').getByRole('button').filter({ hasText: /^$/ }).click();

  // ── Customize Dashboard ────────────────────────────────────
  await page.getByRole('link', { name: 'Analytics' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'customize Dashboard' }).click();
  await page.waitForTimeout(2000);

  // Add first widget
  await page.locator('.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.css-1i25yv0').first().click();
  await page.locator('.MuiBox-root.css-k1v68u > div:nth-child(2)').click();
  await page.locator('div').filter({ hasText: /^hello2Total count of active modules in the systemPie$/ }).first().click();
  await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeSmall.MuiButton-textSizeSmall.MuiButton-colorPrimary.css-1ytfe3k').click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();

  // Add second widget from Analytics Library
  await page.getByRole('button', { name: 'Analytics Library' }).click();
  await page.locator('.MuiBox-root.css-k1v68u > div:nth-child(2)').click();
  await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeSmall.MuiButton-textSizeSmall.MuiButton-colorPrimary.css-1ytfe3k').click();

  // Save as a new dashboard
  await page.getByRole('button', { name: 'Save New Dashboard' }).click();
  await page.getByRole('textbox', { name: 'Enter a name for your' }).fill('qqqq');
  await page.getByRole('button', { name: 'Save Dashboard' }).click();

  // Make the dashboard private
  await page.getByRole('button').first().click();
  await page.getByRole('checkbox', { name: 'Make Private Restrict access' }).check();
  await page.getByRole('button', { name: 'Save Dashboard' }).click();

  // Assign to Admin role and save
  await page.getByRole('button', { name: 'Open' }).click();
  await page.getByRole('option', { name: 'Admin', exact: true }).click();
  await page.getByRole('button', { name: 'Save Dashboard' }).click();

  // ── Module Analytics ───────────────────────────────────────
  await page.getByRole('tab', { name: 'Module Analytics' }).click();

  // Change Session Type to Training Sessions
  await page.getByRole('combobox').first().click();
  await page.waitForTimeout(500);
  await page.getByRole('option', { name: 'Training Sessions' }).click();
  await page.waitForTimeout(1000);

  // Change Module Name to Touch To Grab
  await page.getByRole('combobox').nth(1).click();
  await page.waitForTimeout(500);
  await page.getByRole('option', { name: 'Touch To Grab' }).click();
  await page.waitForTimeout(1000);
  console.log('✅ Session Type: Training Sessions, Module: Touch To Grab set successfully!');

  // Domain filter — add group8 then clear
  await page.getByRole('combobox', { name: 'Filter by Domain Name' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('option', { name: 'group8' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.MuiBackdrop-root').click();
  await page.getByRole('button', { name: 'Clear filter' }).click();

  // Domain filter — add multiple then clear
  await page.getByRole('combobox', { name: 'Filter by Domain Name' }).click();
  await page.getByRole('option', { name: 'autovrse', exact: true }).click();
  await page.getByRole('option', { name: 'WebDomain', exact: true }).click();
  await page.getByRole('option', { name: 'WebDomain', exact: true }).click(); // deselect WebDomain
  await page.getByRole('option', { name: 'group10' }).click();
  await page.getByRole('option', { name: 'group9' }).click();
  await page.getByRole('option', { name: 'group6' }).click();
  await page.locator('.MuiBackdrop-root').click();
  await page.getByRole('button', { name: 'Clear filter' }).click();

  // ── Domain Analytics ───────────────────────────────────────
  await page.getByRole('tab', { name: 'Domain Analytics' }).click();
  await page.waitForTimeout(1000);

  // Change Session Type to Training Sessions
  await page.getByText('Evaluation Sessions').click();
  await page.getByRole('option', { name: 'Training Sessions' }).click();

  // Select AutoVRse domain
  await page.getByRole('button', { name: 'group1' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^AutoVRse$/ }).click();
  await page.getByRole('combobox', { name: 'Filter by Module Name' }).click();
  await page.locator('.MuiBackdrop-root').click();

  // Check subdomains inside AutoVRse
  await page.getByRole('button', { name: 'AutoVRse' }).click();
  await page.getByRole('button').nth(1).click();
  await page.locator('div').filter({ hasText: /^autovrse Department 2$/ }).nth(1).click();
  await page.getByRole('combobox', { name: 'Filter by Module Name' }).click();
  await page.locator('.MuiBackdrop-root').click();

  // No modules available for AutoVRse — switch to Platform Team domain
  await page.getByRole('button', { name: 'autovrse Department' }).click();
  await page.getByRole('textbox', { name: 'Search domains...' }).click();
  await page.getByRole('textbox', { name: 'Search domains...' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Search domains...' }).fill('Pla');
  await page.getByText('Platform Team', { exact: true }).click();

  // Module filter — select multiple modules
  await page.getByRole('combobox', { name: 'Filter by Module Name' }).click();
  await page.getByRole('option', { name: 'Touch To Grab' }).click();
  await page.getByRole('option', { name: 'Adhock Testing' }).click();
  await page.getByRole('option', { name: 'Multi Role Story' }).click();
  await page.getByRole('option', { name: 'Live Link Story' }).click();
  await page.getByRole('option', { name: 'Localization' }).click();
  await page.locator('.MuiBackdrop-root').click();
  await page.getByRole('button', { name: 'Clear filter' }).click();

  // ── Department Analytics ───────────────────────────────────
  await page.getByRole('tab', { name: 'Department Analytics' }).click();
  await page.waitForTimeout(1000);

  // Change Session Type to Evaluation Sessions
  await page.getByText('Training Sessions').click();
  await page.getByRole('option', { name: 'Evaluation Sessions' }).click();

  // Select AutoVRse domain and All Departments
  await page.getByRole('button', { name: 'Select Domain' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^AutoVRse$/ }).click();
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'All Departments' }).click();

  // Module filter — select multiple modules
  await page.getByText('Filter by Module Name').click();
  await page.getByRole('option', { name: 'MCQ Mode' }).click();
  await page.getByRole('option', { name: 'Moment Life Cycle Mode' }).click();
  await page.getByRole('option', { name: 'Load AFT Change Parts Training' }).click();
  await page.getByRole('option', { name: 'Test Cycle Training' }).click();
  await page.locator('.MuiBackdrop-root').click();
  await page.getByRole('button', { name: 'Clear filter' }).click();

  // Navigate back through subdomain tree
  await page.getByRole('button', { name: 'AutoVRse' }).click();
  await page.getByRole('button').nth(1).click();
  await page.locator('div').filter({ hasText: /^autovrse Department$/ }).nth(1).click();

});


// ============================================================
// TEST 3: USERS PAGE
//   Covers: Create Super Admin, Create Admin, Create Trainee,
//           Delete all created users
// ============================================================

test('Users', async ({ page }) => {

  // ── Login ──────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/auth/login/`);
  await page.waitForSelector('input[name="username"]');
  await page.locator('input[name="username"]').fill(USERNAME);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForLoadState('networkidle');
  console.log('✅ Logged in successfully');

  // ── Navigate to Users page ─────────────────────────────────
  await page.goto(`${BASE_URL}/users`);
  await page.waitForSelector('button[aria-label], button', { timeout: 1000 });
  console.log('✅ Navigated to Users page');

  // ── Create Super Admin (name: QA2, username: Q) ───────────
  await page.getByRole('button', { name: 'Add Super Admin' }).click();
  await page.waitForSelector('div[role="dialog"]');
  await page.locator('div[role="dialog"] input[name="name"]').fill('QA2');
  await page.locator('div[role="dialog"] input[name="username"]').fill('Q');
  await page.locator('div[role="dialog"] input[name="password"]').fill('w');
  await page.getByRole('button', { name: 'Create User' }).click();
  await page.waitForTimeout(1500);
  console.log('✅ Super Admin (QA2) created successfully');

  // ── Create Admin (name: Automated, username: Claude) ──────
  await page.getByRole('button', { name: 'Add Admin' }).click();
  await page.waitForSelector('div[role="dialog"]');
  await page.locator('div[role="dialog"] input[name="name"]').fill('Automated');
  await page.locator('div[role="dialog"] input[name="username"]').fill('Claude');
  await page.locator('div[role="dialog"] input[name="password"]').fill('w');

  // Assign group: QA1
  await page.locator('div[role="dialog"]').getByRole('combobox').click();
  await page.waitForTimeout(500);
  await page.keyboard.type('QA1');
  await page.waitForTimeout(1000);
  await page.locator('ul[role="listbox"] li').filter({ hasText: 'QA1' }).click();

  // Assign group: group1
  await page.locator('div[role="dialog"]').getByRole('combobox').click();
  await page.waitForTimeout(500);
  await page.keyboard.type('group1');
  await page.waitForTimeout(1000);
  await page.locator('ul[role="listbox"] li').first().click();

  await page.getByRole('button', { name: 'Create User' }).click();
  await page.waitForTimeout(1500);
  console.log('✅ Admin (Automated/Claude) created successfully');

  // ── Delete Admin user (Automated) ─────────────────────────
  const automatedRow = page.locator('tr').filter({ hasText: 'Automated' });
  await automatedRow.locator('button').last().click();
  await page.waitForTimeout(500);
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.waitForTimeout(1500);
  console.log('✅ Admin user (Automated) deleted successfully');

  // ── Delete Super Admin user (QA2) ─────────────────────────
  const qa2Row = page.locator('tr').filter({ hasText: 'QA2' });
  await qa2Row.locator('button').last().click();
  await page.waitForTimeout(500);
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.waitForTimeout(1500);
  console.log('✅ Super Admin user (QA2) deleted successfully');

  console.log('\n🎉 Super Admin and Admin tests completed!');

  // ── Re-login for Trainee section ──────────────────────────
  await page.goto(`${BASE_URL}/auth/login/`);
  await page.getByRole('textbox', { name: 'Username' }).fill(USERNAME);
  await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Continue' }).click();

  // ── Navigate to Users page ─────────────────────────────────
  await page.getByRole('link', { name: 'Users' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // ── Create Trainee ─────────────────────────────────────────
  await page.getByRole('button', { name: 'Add Trainee' }).click();
  await page.waitForTimeout(2000);

  // Fill display name
  await page.getByRole('textbox', { name: 'Display Name' }).fill('q');

  // Select groups: QA1 and Senior QA
  await page.getByRole('combobox', { name: 'Groups' }).click();
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const options = [...document.querySelectorAll('li')];
    options.find(el => el.textContent.trim() === 'QA1')?.click();
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const options = [...document.querySelectorAll('li')];
    options.find(el => el.textContent.trim() === 'Senior QA')?.click();
  });
  await page.waitForTimeout(300);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Fill employee code and submit
  await page.getByRole('textbox', { name: 'Employee Code' }).fill('1');
  await page.getByRole('button', { name: 'Create User' }).click();
  await page.waitForTimeout(3000);

  // ── Delete the newly created Trainee (first row in table) ─
  await page.locator('table tbody tr').first().locator('button').click();
  await page.waitForTimeout(1000);
  await page.getByText('Delete').click();
  await page.waitForTimeout(2000);
  console.log('✅ Trainee created and deleted successfully!');

});


// ============================================================
// TEST 4: ANALYTICS PAGE DROPDOWNS
//   Note: This test has a page.pause() — it stops and waits
//         for you to manually resume from the Playwright UI
// ============================================================

test('Analytics Page Dropdowns', async ({ page }) => {

  // ── Login and navigate to Analytics ───────────────────────
  await login(page);
  await page.getByRole('link', { name: 'Analytics' }).click();

  // ── Module Analytics tab ───────────────────────────────────
  await page.getByRole('tab', { name: 'Module Analytics' }).click();

  // Switch session type: Evaluation → Training → back to Evaluation
  await page.getByText('Evaluation Sessions').click();
  await page.getByRole('option', { name: 'Training Sessions' }).click();
  await page.waitForTimeout(1000);
  await page.getByText('Training Sessions').click();
  await page.getByRole('option', { name: 'Evaluation Sessions' }).click();

  // Select modules from dropdown
  await page.getByRole('option', { name: 'VO editing dummy' }).click();
  await page.getByRole('option', { name: 'Cell Shooter' }).click();

  // Open domain name filter
  await page.getByText('FILTER BY DOMAIN NAME').click();
  await page.getByText('Demo Domain').nth(1).click();

  // ⚠️ Paused here — resume manually from Playwright inspector
  await page.pause();

  // await page.getByTestId('id:\:r5m\: > li:nth-child(2)').click();
  // await page.getByRole('checkbox', { name: 'Demo Domain' }).click();

  // ── Domain Analytics tab (commented out — enable when needed) ─
  // await page.getByRole('tab', { name: 'Domain Analytics' }).click();
  // await page.getByText('Evaluation Sessions').click();
  // await page.getByRole('option', { name: 'Training Sessions' }).click();
  // await page.getByText('group1', { exact: true }).click();

  // CSS selectors noted for reference:
  // #\:r5m\: > li:nth-child(2)
  // #\:r5m\: > li:nth-child(3)

});


// ============================================================
// TEST 5: GET SUPPORT — FORM FILL AND SUBMISSION
//   Covers: All form fields, file upload, error detection
// ============================================================

test('Get Support', async ({ page }) => {

  // ── Setup console and page error listeners ─────────────────
  let pageError = null;
  let consoleMessages = [];

  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    pageError = err;
    console.log(`❌ Page Error: ${err.message}`);
  });

  // ── Login ──────────────────────────────────────────────────
  await login(page);
  console.log('✅ Logged in successfully');

  // ── Open support form ──────────────────────────────────────
  await page.getByRole('button', { name: 'Get Support' }).click();

  // ── Fill personal details ──────────────────────────────────
  await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');
  await page.getByRole('textbox', { name: 'Email' }).fill('john.doe@example.com');

  // ── Select request type (cycles through options to verify dropdown works) ─
  await page.getByRole('combobox', { name: 'Select Type Of Request' }).click();
  await page.getByRole('option', { name: 'Installation Setup' }).click();
  await page.getByRole('combobox', { name: 'Select Type Of Request' }).click();
  await page.getByRole('option', { name: 'Hardware Issues' }).click();
  await page.getByRole('button', { name: 'Open' }).first().click();
  await page.getByRole('option', { name: 'Bug Fixes' }).click(); // final selection

  // ── Fill subject and description ───────────────────────────
  await page.getByRole('textbox', { name: 'Subject' }).fill('Support Request');
  await page.getByRole('textbox', { name: 'Description' }).fill('I need help with the dashboard.');

  // ── Select priority (cycles through options to verify dropdown works) ──
  await page.getByRole('combobox', { name: 'Select Priority Of Request' }).click();
  await page.getByRole('option', { name: 'Low' }).click();
  await page.getByRole('button', { name: 'Open' }).nth(1).click();
  await page.getByRole('option', { name: 'Medium' }).click(); // final selection

  // ── Upload video file ──────────────────────────────────────
  await page.getByText('browse').click();
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('div.MuiStack-root.css-1fe5hl1').click()
  ]);
  await fileChooser.setFiles('C:\\Users\\User\\Downloads\\MetaLayerAction_2.mp4');

  // ── Submit and capture any errors ─────────────────────────
  try {
    await page.getByRole('button', { name: 'Submit Request' }).click();
    await page.waitForTimeout(2000);

    // Check if any error messages appeared on screen
    const errorElements = await page.locator('[role="alert"], .error, .alert-danger, [class*="error"]').count();
    if (errorElements > 0) {
      const errorText = await page.locator('[role="alert"], .error, .alert-danger, [class*="error"]').first().textContent();
      console.log(`❌ Error Message Found: ${errorText}`);
    }

    console.log('✅ Support request submitted successfully');
  } catch (error) {
    console.log(`❌ Submission Error: ${error.message}`);
    throw error;
  }

  // ── Final error summary ────────────────────────────────────
  if (pageError) {
    console.log(`❌ Final Page Error Summary: ${pageError.message}`);
  }
  if (consoleMessages.filter(m => m.type === 'error').length > 0) {
    console.log('❌ Console errors were captured during test');
  }

});


// ============================================================
// TEST 6: MODULES PAGE — ASSIGN MODULE
//   Covers: Assign to groups/users, Remove entities,
//           Bulk delete (cancel), Column tools, Drag reorder
// ============================================================

// Row name constant — reused across multiple steps
const MODULE_ROW = 'Toggle select row QA_TEST_INTERNAL_2 Platform Team Test Repo 1776319820 Add Tag';

test('Assign Module', async ({ page }) => {

  // ── Login and navigate to Modules ─────────────────────────
  await login(page);
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Modules' }).click();

  // ── Assign module to groups and users ─────────────────────
  await page.getByRole('row', { name: MODULE_ROW }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Assign Modules' }).click();

  // Domain tab — assign to Senior QA Group
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('button', { name: 'Senior QA Group' }).click();

  // Department Access tab
  await page.getByRole('tab', { name: 'Department Access' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();

  // User Special Access tab — assign to test1 user
  await page.getByRole('tab', { name: 'User Special Access' }).click();
  await page.getByRole('button', { name: 'test1 group1 User delete' }).getByRole('checkbox').check();

  // Domain tab again — assign to Senior QA and QA Jr
  await page.getByRole('tab', { name: 'Domain' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('button', { name: 'Senior QA Group' }).click();
  await page.getByRole('button', { name: 'QA Jr Group' }).click();
  await page.getByRole('button', { name: 'Assign' }).click();

  // ── Remove assigned groups (Domain) ───────────────────────
  await page.getByRole('row', { name: MODULE_ROW }).getByRole('checkbox').check();
  await page.getByRole('row', { name: MODULE_ROW }).getByLabel('Row Actions').click();
  await page.getByText('Assigned Entities').click();

  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('qa');
  await page.getByRole('button', { name: 'QA Jr Group' }).getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: 'Senior QA Group' }).getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: 'Assign' }).click();

  // ── Remove assigned user (User Special Access) ─────────────
  await page.getByRole('row', { name: MODULE_ROW }).getByLabel('Row Actions').click();
  await page.getByText('Assigned Entities').click();
  await page.getByRole('tab', { name: 'User Special Access' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('button', { name: 'test1 group1 User delete' }).getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: 'Assign' }).click();

  // ── Bulk delete — cancel (do not actually delete) ──────────
  await page.getByRole('row', { name: MODULE_ROW }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Bulk delete' }).click();
  await page.getByRole('button', { name: 'No' }).click();
  await page.getByRole('row', { name: MODULE_ROW }).getByRole('checkbox').uncheck();

  // ── Show/Hide filters toggle ───────────────────────────────
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();

  // ── Full screen toggle ─────────────────────────────────────
  await page.getByRole('button', { name: 'Toggle full screen' }).click();
  await page.getByLabel('Toggle full screen').click();

  // ── Show/Hide columns — toggle each column off then on ─────
  await page.getByRole('button', { name: 'Show/Hide columns' }).click();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Project Name' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Project Name' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Index' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Index' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Tags' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Tags' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Description' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Description' }).check();
  await page.getByRole('button', { name: 'Hide all' }).click();
  await page.getByRole('button', { name: 'Show all' }).click();

  // ── Column reorder — drag Project Name above Name ──────────
  await page.getByRole('button', { name: 'Show/Hide columns' }).click();
  await page.waitForTimeout(1000);

  const projectBtn = page.getByRole('menuitem', { name: 'Move Toggle visibility Project Name' }).getByLabel('Move');
  const nameItem   = page.getByRole('menuitem', { name: 'Move Toggle visibility Name' });

  const projectBox = await projectBtn.boundingBox();
  const nameBox    = await nameItem.boundingBox();

  const startX = projectBox.x + projectBox.width / 2;
  const startY = projectBox.y + projectBox.height / 2;
  const endX   = nameBox.x + nameBox.width / 2;
  const endY   = nameBox.y; // top edge of Name row

  // Slow drag — hold 800ms then move in 50 small steps (20ms each)
  await page.mouse.move(startX, startY);
  await page.waitForTimeout(500);
  await page.mouse.down();
  await page.waitForTimeout(800);

  const totalSteps = 50;
  for (let i = 1; i <= totalSteps; i++) {
    const x = startX + (endX - startX) * (i / totalSteps);
    const y = startY + (endY - startY) * (i / totalSteps);
    await page.mouse.move(x, y);
    await page.waitForTimeout(20);
  }

  await page.waitForTimeout(500);
  await page.mouse.up();
  await page.waitForTimeout(1000);

  // Reset column order back to default
  await page.getByRole('button', { name: 'Reset Order' }).click();
  await page.locator('.MuiBackdrop-root').click();

});


// ============================================================
// TEST 7: EVALUATIONS PAGE
//   Covers: Session detail views, column tools, PDF export
// ============================================================

test('Evaluations', async ({ page }) => {

  // ── Login and navigate to Evaluations ─────────────────────
  await login(page);
  await page.getByRole('link', { name: 'Evaluations' }).click();

  // ── Open incomplete session detail ─────────────────────────
  await page.getByRole('cell', { name: 'MCQ Mode' }).first().click();
  await page.getByRole('button', { name: 'Identifying objects' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // ── Open completed session detail ─────────────────────────
  await page.getByRole('cell', { name: 'MCQ Mode' }).nth(3).click();
  await page.getByRole('button', { name: 'Identifying objects 30 / 30' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // ── Full screen toggle ─────────────────────────────────────
  await page.getByRole('button', { name: 'Toggle full screen' }).click();
  await page.getByLabel('Toggle full screen').click();

  // ── Bulk delete — cancel (do not actually delete) ──────────
  await page.getByRole('row', {
    name: 'Toggle select row Platform Admin 1 PFadmin1 MCQ Mode Multiplayer 01/04/2026 12:21 - 01/04/2026 12:22 1 minute 16 seconds 30 / 30 Pass Platform Team Row Actions',
    exact: true
  }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Bulk delete' }).click();
  await page.getByRole('button', { name: 'No' }).click();

  // ── Show/Hide filters toggle ───────────────────────────────
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();

  // ── Show/Hide columns — toggle each column off then on ─────
  await page.getByRole('button', { name: 'Show/Hide columns' }).click();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility User' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility User' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Module' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Module' }).check();
  await page.getByRole('checkbox', { name: 'Player Mode' }).uncheck();
  await page.getByRole('checkbox', { name: 'Player Mode' }).check();
  await page.getByRole('checkbox', { name: 'Session Time' }).uncheck();
  await page.getByRole('checkbox', { name: 'Session Time' }).check();
  await page.getByRole('checkbox', { name: 'Duration' }).uncheck();
  await page.getByRole('checkbox', { name: 'Duration' }).check();
  await page.getByRole('checkbox', { name: 'Score' }).uncheck();
  await page.getByRole('checkbox', { name: 'Score' }).check();
  await page.getByRole('checkbox', { name: 'status' }).uncheck();
  await page.getByRole('checkbox', { name: 'status' }).check();
  await page.getByRole('checkbox', { name: 'Group' }).uncheck();
  await page.getByRole('checkbox', { name: 'Group' }).check();

  // ── Hide all then restore each column individually ─────────
  await page.getByRole('button', { name: 'Hide all' }).click();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility User' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Module' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Player Mode' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Session Time' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Duration' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Score' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility status' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Group' }).check();

  // Reset column order and close panel
  await page.getByRole('button', { name: 'Reset order' }).click();
  await page.locator('.MuiBackdrop-root').click();

  // ── PDF Export ─────────────────────────────────────────────
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByRole('button', { name: 'Export As PDF' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: 'Clear all notifications' }).click();
  await page.getByRole('button', { name: 'Export completed - Click to' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Download' }).nth(0).click();

});


// ============================================================
// TEST 8: TRAININGS PAGE
//   Covers: Session detail views, column tools, PDF export
// ============================================================

test('Trainings', async ({ page }) => {

  // ── Login and navigate to Trainings ───────────────────────
  await login(page);
  await page.getByRole('link', { name: 'Trainings' }).click();
  await page.waitForTimeout(2000);

  // ── Open incomplete session detail ─────────────────────────
  // await page.getByRole('row', { name: 'Toggle select row camp8 Chromatica Bootcamp Camp8- Nupur Single Player 27/04/2026 17:35 - Pending - ongoing Row Actions', exact: true }).getByRole('checkbox').check();
  await page.getByText('Camp8- Nupur').first().click();
  await page.getByRole('button', { name: 'The Blossom Ritual -' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // ── Open completed session detail ─────────────────────────
  await page.getByRole('cell', { name: 'Camp8- Nupur' }).nth(1).click();
  await page.getByRole('button', { name: 'The Dark Awakening And First Drain' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // ── Bulk delete — cancel (do not actually delete) ──────────
  await page.getByRole('row', {
    name: 'Toggle select row camp8 Chromatica Bootcamp Camp8- Nupur Single Player 27/04/2026 14:23 - 27/04/2026 15:23 1 hour 17 seconds completed Row Actions',
    exact: true
  }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Bulk delete' }).click();
  await page.getByRole('button', { name: 'No' }).click();

  // ── Show/Hide filters toggle ───────────────────────────────
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();

  // ── Show/Hide columns — toggle each column off then on ─────
  await page.getByRole('button', { name: 'Show/Hide columns' }).click();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Group' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Group' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Module' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Module' }).check();
  await page.getByRole('checkbox', { name: 'Player Mode' }).uncheck();
  await page.getByRole('checkbox', { name: 'Player Mode' }).check();
  await page.getByRole('checkbox', { name: 'Session Time' }).uncheck();
  await page.getByRole('checkbox', { name: 'Session Time' }).check();
  await page.getByRole('checkbox', { name: 'Duration' }).uncheck();
  await page.getByRole('checkbox', { name: 'Duration' }).check();
  await page.getByRole('checkbox', { name: 'status' }).uncheck();
  await page.getByRole('checkbox', { name: 'status' }).check();

  // ── Hide all then restore each column individually ─────────
  await page.getByRole('button', { name: 'Hide all' }).click();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Group' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Module' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Player Mode' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Session Time' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Duration' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility status' }).check();

  // Reset column order and close panel
  await page.getByRole('button', { name: 'Reset order' }).click();
  await page.locator('.MuiBackdrop-root').click();

  // ── PDF Export ─────────────────────────────────────────────
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByRole('button', { name: 'Export As PDF' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: 'Clear all notifications' }).click();
  await page.getByRole('button', { name: 'Export completed - Click to' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Download' }).nth(0).click();

});


// ============================================================
// TEST 9: DEVICES PAGE
//   Covers: Device detail view (with scroll), PDF export
// ============================================================

test('Devices', async ({ page }) => {

  // ── Login and navigate to Devices ─────────────────────────
  await login(page);
  await page.getByRole('link', { name: 'Devices' }).click();

  // ── Open device detail dialog ──────────────────────────────
  await page.getByText('Unknown DeviceID: a52f395f70active1Domains1Users').click();

  // Scroll inside the MUI dialog to see all content
  await page.evaluate(() => {
    const dialog = document.querySelector('.MuiDialogContent-root');
    if (dialog) dialog.scrollBy({ top: 800, behavior: 'smooth' });
  });
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Close' }).click();

  // ── PDF Export (opens download in popup) ───────────────────
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByRole('button', { name: 'Export As PDF' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'View Export Jobs' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Download' }).nth(0).click();
  const page1 = await page1Promise;

});


// ============================================================
// TEST 10: SIGN OUT
//   Covers: Avatar click opens user menu
// ============================================================

test('Sign out', async ({ page }) => {

  // ── Login ──────────────────────────────────────────────────
  await login(page);

  // ── Click avatar and open the user menu ───────────────────
  await page.getByRole('banner').getByRole('img').click();
  await page.getByRole('menu').click();

});


// ============================================================
// TEST 11: GROUPS PAGE
//   Covers: Card view panel, Form Editor (create/edit/delete),
//           Org Chart, column tools, bulk delete cancel
// ============================================================

test('Groups Page', async ({ page }) => {

  // ── Login and navigate to Groups ──────────────────────────
  await login(page);
  await page.getByRole('button', { name: 'Organization' }).click();
  await page.getByRole('link', { name: 'Groups' }).click();

  // ── Card view — open group details panel ──────────────────
  await page.locator('div:nth-child(61) > .MuiPaper-root > .MuiBox-root.css-o8w36n > .MuiButtonBase-root').click();
  await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-outlined').click();

  // Admins tab — search and add admin
  await page.getByRole('textbox', { name: 'Search administrators...' }).click();
  await page.getByRole('textbox', { name: 'Search administrators...' }).fill('qa');
  await page.locator('.MuiBox-root.css-ftn5hm > div:nth-child(2) > .MuiButtonBase-root').click();
  await page.waitForTimeout(4000);

  // Trainees tab — search and add trainee
  await page.getByRole('tab', { name: 'Trainees' }).click();
  await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-outlined').click();
  await page.getByRole('textbox', { name: 'Search by username' }).click();
  await page.getByRole('textbox', { name: 'Search by username' }).fill('mt');
  await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall.css-5p7eof').first().click();
  await page.waitForTimeout(4000);

  // Access Modules tab — add a module
  await page.getByRole('tab', { name: 'Access Modules' }).click();
  await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-outlined').click();
  await page.locator('.MuiBox-root > div:nth-child(3) > .MuiButtonBase-root').click();
  await page.waitForTimeout(4000);

  // Edit group details from the panel
  await page.getByRole('button', { name: 'Edit group details' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).fill('Should work');
  await page.getByRole('textbox', { name: 'Password' }).fill('1777');
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Close details panel' }).click();
  await page.waitForTimeout(4000);

  // Re-open and close the same group panel
  await page.locator('div:nth-child(61) > .MuiPaper-root > .MuiBox-root.css-o8w36n > .MuiButtonBase-root').click();
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: 'Close details panel' }).click();

  // ── Delete group (commented out — enable when needed) ──────
  // await page.getByRole('button', { name: 'Delete group' }).click();
  // const dialogPromise = page.waitForEvent('dialog');
  // await page.click('your-delete-button');
  // const dialog = await dialogPromise;
  // expect(dialog.message()).toContain('Are you sure you want to delete this group?');
  // await dialog.accept();

  // ── Form Editor — create, rename, change password, delete ─
  await page.getByRole('button', { name: 'Form Editor' }).click();

  // Create group "Should work"
  await page.getByRole('button', { name: 'Add Group' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).fill('Should work');
  await page.getByRole('textbox', { name: 'Password' }).fill('1777');
  await page.getByRole('button', { name: 'Create Group' }).click();

  // Rename "Should work" → "sss1"
  await page.getByRole('row', { name: 'Expand Toggle select row Should work' }).getByLabel('Row Actions').click();
  await page.getByRole('menuitem', { name: 'Edit', exact: true }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).fill('sss1');
  await page.getByRole('button', { name: 'Save Changes' }).click();

  // Change password for "sss1"
  await page.getByRole('row', { name: 'Expand Toggle select row sss1' }).getByLabel('Row Actions').click();
  await page.getByText('Edit Password').click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('4444');
  await page.getByRole('button', { name: 'Save Changes' }).click();

  // Delete "sss1"
  await page.getByRole('row', { name: 'Expand Toggle select row sss1' }).getByLabel('Row Actions').click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();

  // Switch to Org Chart view
  await page.getByRole('button', { name: 'ORG CHART' }).click();

  // ── Create another group to test table tools ───────────────
  await page.getByRole('button', { name: 'Add Group' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).fill('qqq');
  await page.getByRole('textbox', { name: 'Group Password' }).click();
  await page.getByRole('textbox', { name: 'Group Password' }).fill('qq');
  await page.getByRole('button', { name: 'Create Group' }).click();

  // Expand the new group row
  await page.getByRole('cell', { name: 'Expand' }).first().click();

  // Bulk delete — cancel (do not actually delete)
  await page.getByRole('row', { name: 'Expand Toggle select row qqq' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Bulk delete' }).click();
  await page.getByRole('button', { name: 'No' }).click();

  // Full screen toggle
  await page.getByRole('button', { name: 'Toggle full screen' }).click();
  await page.getByLabel('Toggle full screen').click();

  // Column visibility toggle
  await page.getByRole('button', { name: 'Show/Hide columns' }).click();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();
  await page.locator('.MuiBackdrop-root').click();

  // Show/Hide filters toggle
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();

  // Reset and hide columns
  await page.getByRole('button', { name: 'Show/Hide columns' }).click();
  await page.getByRole('button', { name: 'Reset order' }).click();
  await page.getByRole('button', { name: 'Hide all' }).click();
  await page.getByRole('button', { name: 'Hide all' }).click();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();

});


// ============================================================
// TEST 12: SCHEDULES PAGE
//   Covers: View details, Edit name, Delete (cancel + confirm),
//           Create new schedule, Calendar popover interactions
// ============================================================

test('Schedules', async ({ page }) => {

  // ── Login and navigate to Schedules ───────────────────────
  await login(page);
  await page.getByRole('link', { name: 'Schedules' }).click();
  await page.waitForTimeout(4000);

  // ── View existing schedule details ─────────────────────────
  await page.getByRole('cell', { name: 'check march' }).getByRole('paragraph').click();
  await page.getByRole('button', { name: 'Go back to schedules list' }).click();

  await page.getByRole('cell', { name: 'QATest6 - Today Range' }).click();
  await page.getByRole('button', { name: 'Go back to schedules list' }).click();

  // ── Edit schedule name ─────────────────────────────────────
  await page.getByRole('row', { name: 'check march 29 Groups:' }).getByLabel('Row Actions').click();
  await page.getByText('Edit').click();
  await page.getByRole('textbox', { name: 'Enter schedule name' }).click();
  await page.getByRole('textbox', { name: 'Enter schedule name' }).fill('check march 28');
  await page.getByRole('button', { name: 'Save Changes' }).click();

  // ── Delete schedule — cancel (do not actually delete) ──────
  await page.getByRole('row', { name: 'check march 28 Groups:' }).getByLabel('Row Actions').click();
  await page.getByText('Delete').click();
  await page.getByRole('button', { name: 'No' }).click();

  // ── Create a new schedule ──────────────────────────────────
  await page.getByRole('button', { name: 'Add schedule' }).click();
  await page.getByRole('textbox', { name: 'Enter experience name' }).click();
  await page.getByRole('textbox', { name: 'Enter experience name' }).fill('New Automated Schedule');

  // Step 1: Select modules
  await page.getByRole('button', { name: 'Select Modules' }).click();
  await page.getByRole('button').nth(3).click();
  await page.getByRole('button', { name: 'Hide Modules' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Step 2: Set date range and session types
  await page.getByLabel('Add Schedule').getByText('23').click();
  await page.getByText('30').nth(4).click();
  await page.getByRole('checkbox', { name: 'Training' }).check();
  await page.getByRole('checkbox', { name: 'Evaluation' }).check();
  await page.getByRole('button', { name: 'Next' }).click();

  // Step 3: Assign groups and users
  await page.getByRole('button', { name: 'Select Groups' }).click();
  await page.getByText('qqq').click();
  await page.getByRole('button', { name: 'Hide Groups' }).click();

  await page.getByRole('button', { name: 'Select Users' }).click();
  await page.getByRole('textbox', { name: 'Search by username...' }).click();
  await page.getByRole('textbox', { name: 'Search by username...' }).fill('mt3');
  await page.getByText('MigrationTrainee3').click();

  // Create the schedule
  await page.getByRole('button', { name: 'Create Schedule' }).click();
  await page.waitForTimeout(4000);
  console.log('✅ New schedule created successfully');

  // ── Delete the newly created schedule (confirm delete) ────
  await page.getByRole('row', { name: 'New Automated Schedule Groups:' }).getByLabel('Row Actions').click();
  await page.getByText('Delete').click();
  await page.getByRole('button', { name: 'Yes' }).click();
  console.log('✅ Schedule deleted successfully');

  // ── Calendar popover interactions ──────────────────────────
  await page.locator('span').filter({ hasText: 'check march' }).click();
  await page.locator('.MuiBackdrop-root').click();

  await page.locator('span').filter({ hasText: 'Claude' }).click();
  await page.locator('.MuiBackdrop-root').click();

  await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall.css-u27xt2').first().click();
  await page.locator('button:nth-child(3)').click();

  await page.locator('span').filter({ hasText: 'check march' }).click();
  await page.locator('.MuiBackdrop-root').click();

});