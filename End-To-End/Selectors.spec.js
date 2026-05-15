const { test, expect } = require('@playwright/test');

// ========================================
// TEST 1: PDF EXPORT WORKFLOW
// ========================================

test('Evaluation Report Download: PDF', async ({ page }) => {
    await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in')
    await page.getByLabel('Password').fill('admin')
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('link', { name: 'Evaluations' }).click();
    await page.getByRole('button', { name: 'Export',exact:true }).click();
    await page.getByRole('button', { name: 'Export As PDF' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: 'Clear all notifications' }).click();
    await page.getByRole('button', { name: 'Export completed - Click to' }).click();
    const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Download' }).nth(1).click();
  const page1 = await page1Promise;
 
});

// test('Evaluation Report Download: Excel', async ({ page }) => {
//     await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
//     await page.getByLabel('Username').fill('admin@autovrse.in')
//     await page.getByLabel('Password').fill('admin')
//     await page.getByRole('button', { name: 'Continue' }).click();
//     await page.getByRole('link', { name: 'Evaluations' }).click();
//     await page.getByRole('button', { name: 'Export',exact:true }).click();
//     await page.getByRole('button', { name: 'Export As Excel' }).click();
//     await page.getByRole('button', { name: 'Export completed - Click to' }).click();
//     const page1Promise = page.waitForEvent('popup');
//   await page.getByRole('button', { name: 'Download' }).nth(1).click();
//   const page1 = await page1Promise;
 
// });

// ========================================
// TEST 2: ANALYTICS PAGE DIFFERENT TABS
// ========================================

test('Analytics Page', async ({ page }) => {
    await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in')
    await page.getByLabel('Password').fill('admin')
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(5000);
    await page.getByRole('tab', { name: 'Module Analytics' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('tab', { name: 'Domain Analytics' }).click();
    await page.waitForTimeout(2000);
   await page.getByRole('tab', { name: 'Department Analytics' }).click();
   
// ========================================
// AI ANALYTICS 
// ========================================

   await page.getByRole('button', { name: 'AI Analytics' }).click();
   await page.waitForTimeout(2000);
   await page.getByRole('textbox', { name: 'Ask anything... e.g., Show me' }).click();
   await page.getByRole('textbox', { name: 'Ask anything... e.g., Show me' }).fill('I need a list of training data');
   await page.getByRole('main').getByRole('button').filter({ hasText: /^$/ }).click();

// ========================================
// CUSTOMIZE DASHBOARD
// ========================================
  await page.getByRole('link', { name: 'Analytics' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'customize Dashboard' }).click();
  await page.waitForTimeout(2000);
  await page.locator('.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.css-1i25yv0').first().click();
  await page.locator('.MuiBox-root.css-k1v68u > div:nth-child(2)').click();
  await page.locator('div').filter({ hasText: /^hello2Total count of active modules in the systemPie$/ }).first().click();
  await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeSmall.MuiButton-textSizeSmall.MuiButton-colorPrimary.css-1ytfe3k').click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
  await page.getByRole('button', { name: 'Analytics Library' }).click();
  await page.locator('.MuiBox-root.css-k1v68u > div:nth-child(2)').click();
  await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeSmall.MuiButton-textSizeSmall.MuiButton-colorPrimary.css-1ytfe3k').click();
  await page.getByRole('button', { name: 'Save New Dashboard' }).click();
  await page.getByRole('textbox', { name: 'Enter a name for your' }).fill('qqqq');
  await page.getByRole('button', { name: 'Save Dashboard' }).click();
  await page.getByRole('button').first().click();
  await page.getByRole('checkbox', { name: 'Make Private Restrict access' }).check();
  await page.getByRole('button', { name: 'Save Dashboard' }).click();
  await page.getByRole('button', { name: 'Open' }).click();
  await page.getByRole('option', { name: 'Admin', exact: true }).click();
  await page.getByRole('button', { name: 'Save Dashboard' }).click();

// ========================================
// MODULE ANALYTICS 
// ========================================
  await page.getByRole('tab', { name: 'Module Analytics' }).click();
  await page.getByRole('combobox').first().click();
  await page.waitForTimeout(500);

  // ─── Change Session Type to Training Sessions ─────────────────
  await page.getByRole('option', { name: 'Training Sessions' }).click();
  await page.waitForTimeout(1000);

  // ─── Change Module Name to Touch To Grab ─────────────────────
  await page.getByRole('combobox').nth(1).click();
  await page.waitForTimeout(500);
  await page.getByRole('option', { name: 'Touch To Grab' }).click();
  await page.waitForTimeout(1000);
  console.log('✅ Session Type: Training Sessions, Module: Touch To Grab set successfully!');

   // ─── Open Domain Name filter dropdown ─────────────────────────
 await page.getByRole('combobox', { name: 'Filter by Domain Name' }).click();
  await page.waitForTimeout(1000);

  // ─── Add group8 ───────────────────────────────────────────────
  await page.getByRole('option', { name: 'group8' }).click();
  await page.waitForTimeout(1000);
  await page.locator('.MuiBackdrop-root').click();

  // ─── Remove group8 (click again to deselect) ──────────────────
  await page.getByRole('button', { name: 'Clear filter' }).click();
  await page.getByRole('combobox', { name: 'Filter by Domain Name' }).click();
  await page.getByRole('option', { name: 'autovrse', exact: true }).click();
  await page.getByRole('option', { name: 'WebDomain', exact: true }).click();
  await page.getByRole('option', { name: 'WebDomain', exact: true }).click();
  await page.getByRole('option', { name: 'group10' }).click();
  await page.getByRole('option', { name: 'group9' }).click();
  await page.getByRole('option', { name: 'group6' }).click();
  await page.locator('.MuiBackdrop-root').click();
  await page.getByRole('button', { name: 'Clear filter' }).click();

// ========================================
// DOMAIN ANALYTICS 
// ========================================
  await page.getByRole('tab', { name: 'Domain Analytics' }).click();
  await page.waitForTimeout(1000);

  // ─── Change Session Type to Training Sessions ─────────────────
  await page.getByText('Evaluation Sessions').click();
  await page.getByRole('option', { name: 'Training Sessions' }).click();

  // ─── Change Domain Name to AutoVRse ─────────────────────
  await page.getByRole('button', { name: 'group1' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^AutoVRse$/ }).click();
  await page.getByRole('combobox', { name: 'Filter by Module Name' }).click();
  await page.locator('.MuiBackdrop-root').click();

  // ─── Checking subdomains in AutoVRse ─────────────────────
  await page.getByRole('button', { name: 'AutoVRse' }).click();
  await page.getByRole('button').nth(1).click();
  await page.locator('div').filter({ hasText: /^autovrse Department 2$/ }).nth(1).click();
 await page.getByRole('combobox', { name: 'Filter by Module Name' }).click();
  await page.locator('.MuiBackdrop-root').click();

  // ─── Since no modules are available for AutoVRse changing domain ─────────────────────
  await page.getByRole('button', { name: 'autovrse Department' }).click();
  await page.getByRole('textbox', { name: 'Search domains...' }).click();
  await page.getByRole('textbox', { name: 'Search domains...' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Search domains...' }).fill('Pla');
  await page.getByText('Platform Team', { exact: true }).click();

   // ─── Open Module Name filter dropdown ─────────────────────────
  await page.getByRole('combobox', { name: 'Filter by Module Name' }).click();
  await page.getByRole('option', { name: 'Touch To Grab' }).click();
  await page.getByRole('option', { name: 'Adhock Testing' }).click();
  await page.getByRole('option', { name: 'Multi Role Story' }).click();
  await page.getByRole('option', { name: 'Live Link Story' }).click();
  await page.getByRole('option', { name: 'Localization' }).click();
  await page.locator('.MuiBackdrop-root').click();
  await page.getByRole('button', { name: 'Clear filter' }).click();

// ========================================
// DEPARTMENT ANALYTICS 
// ========================================

});

// ========================================
// TEST 3: USERS PAGE - CREATE AND DELETE USER
// ========================================

test('Users',async ({page}) => {
  // ─────────────────────────────────────────
  // 1. LOGIN
  // ─────────────────────────────────────────
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.waitForSelector('input[name="username"]');

  await page.locator('input[name="username"]').fill('admin@autovrse.in');
  await page.locator('input[name="password"]').fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForLoadState('networkidle');

  console.log('✅ Logged in successfully');

  // ─────────────────────────────────────────
  // 2. NAVIGATE TO USERS PAGE
  // ─────────────────────────────────────────
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/users');
  await page.waitForSelector('button[aria-label], button', { timeout: 1000 });
  console.log('✅ Navigated to Users page');

  // ─────────────────────────────────────────
  // 3. CREATE SUPER ADMIN (QA2 / Q)
  // ─────────────────────────────────────────
  await page.getByRole('button', { name: 'Add Super Admin' }).click();
  await page.waitForSelector('div[role="dialog"]');

  await page.locator('div[role="dialog"] input[name="name"]').fill('QA2');
  await page.locator('div[role="dialog"] input[name="username"]').fill('Q');
  await page.locator('div[role="dialog"] input[name="password"]').fill('w');

  await page.getByRole('button', { name: 'Create User' }).click();
  await page.waitForTimeout(1500);
  console.log('✅ Super Admin (QA2) created successfully');

  // ─────────────────────────────────────────
  // 4. CREATE ADMIN (Automated / Claude)
  // ─────────────────────────────────────────
  await page.getByRole('button', { name: 'Add Admin' }).click();
  await page.waitForSelector('div[role="dialog"]');

  await page.locator('div[role="dialog"] input[name="name"]').fill('Automated');
  await page.locator('div[role="dialog"] input[name="username"]').fill('Claude');
  await page.locator('div[role="dialog"] input[name="password"]').fill('w');

  // Select Group: QA1
  await page.locator('div[role="dialog"]').getByRole('combobox').click();
  await page.waitForTimeout(500);
  await page.keyboard.type('QA1');
  await page.waitForTimeout(1000);
  await page.locator('ul[role="listbox"] li').filter({ hasText: 'QA1' }).click();

  // Select Group: group1
  await page.locator('div[role="dialog"]').getByRole('combobox').click();
  await page.waitForTimeout(500);
  await page.keyboard.type('group1');
  await page.waitForTimeout(1000);
  await page.locator('ul[role="listbox"] li').first().click(); // selects exact 'group1'

  await page.getByRole('button', { name: 'Create User' }).click();
  await page.waitForTimeout(1500);
  console.log('✅ Admin (Automated/Claude) created successfully');

  // ─────────────────────────────────────────
  // 5. CREATE Trainee 
  // ─────────────────────────────────────────
  

  // ─────────────────────────────────────────
  // 6. DELETE ADMIN USER (Automated)
  // ─────────────────────────────────────────
  const automatedRow = page.locator('tr').filter({ hasText: 'Automated' });
  await automatedRow.locator('button').last().click();
  await page.waitForTimeout(500);
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.waitForTimeout(1500);
  console.log('✅ Admin user (Automated) deleted successfully');

  // ─────────────────────────────────────────
  // 7. DELETE SUPER ADMIN USER (QA2)
  // ─────────────────────────────────────────
  const qa2Row = page.locator('tr').filter({ hasText: 'QA2' });
  await qa2Row.locator('button').last().click();
  await page.waitForTimeout(500);
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.waitForTimeout(1500);
  console.log('✅ Super Admin user (QA2) deleted successfully');

  console.log('\n🎉 All tasks completed successfully!');

  // ─── Step 1: Login ────────────────────────────────────────────
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByRole('textbox', { name: 'Username' }).fill('admin@autovrse.in');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();


  // ─── Step 2: Go to Users page ─────────────────────────────────
  await page.getByRole('link', { name: 'Users' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // ─── Step 3: Click Add Trainee ────────────────────────────────
  await page.getByRole('button', { name: 'Add Trainee' }).click();
  await page.waitForTimeout(2000);

  // ─── Step 4: Fill Display Name ────────────────────────────────
  await page.getByRole('textbox', { name: 'Display Name' }).fill('q');

  // ─── Step 5: Select Groups (QA1 and Senior QA) ───────────────
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

  // Close the dropdown
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // ─── Step 6: Fill Employee Code ───────────────────────────────
  await page.getByRole('textbox', { name: 'Employee Code' }).fill('1');

  // ─── Step 7: Create User ──────────────────────────────────────
  await page.getByRole('button', { name: 'Create User' }).click();
  await page.waitForTimeout(3000);

  // ─── Step 8: Delete the user ──────────────────────────────────
  // Click the three dots menu on the first row
  await page.locator('table tbody tr').first().locator('button').click();
  await page.waitForTimeout(1000);

  // Click Delete
  await page.getByText('Delete').click();
  await page.waitForTimeout(2000);

  console.log('✅ Trainee created and deleted successfully!');


});

// ========================================
// TEST 4: ANALYTICS PAGE DROPDOWNS
// ========================================

test('Analytics Page Dropdowns', async ({ page }) => {
    await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in')
    await page.getByLabel('Password').fill('admin')
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('link', { name: 'Analytics' }).click();
   await page.getByRole('tab', { name: 'Module Analytics' }).click();
  await page.getByText('Evaluation Sessions').click();
    await page.getByRole('option', { name: 'Training Sessions' }).click();
    await page.waitForTimeout(1000);
      await page.getByText('Training Sessions').click();
    await page.getByRole('option', { name: 'Evaluation Sessions' }).click(); 
    await page.getByRole('option', { name: 'VO editing dummy' }).click();
    await page.getByRole('option', { name: 'Cell Shooter' }).click();
    await page.getByText('FILTER BY DOMAIN NAME').click();
    await page.getByText('Demo Domain').nth(1).click();
    await page.pause();
   // await page.getByTestId('id:\:r5m\: > li:nth-child(2)').click();
    //await page.getByRole('checkbox', { name: 'Demo Domain' }).click();
    //  await page.getByRole('tab', { name: 'Domain Analytics' }).click();
    // await page.getByText('Evaluation Sessions').click();
    // await page.getByRole('option', { name: 'Training Sessions' }).click();
    // await page.getByText('group1', {exact:true}).click();

    // #\:r5m\: > li:nth-child(2)
    // #\:r5m\: > li:nth-child(3)
});

// ========================================
// TEST 5: GET SUPPORT PAGE FORM FILL AND SUBMISSION
// ========================================

test('Get Support', async ({ page }) => {
    // Setup error and console listeners to capture any errors
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

    await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in')
     await page.getByLabel('Password').fill('admin')
    await page.getByRole('button', { name: 'Continue' }).click();
    console.log('✅ Logged in successfully');
    await page.getByRole('button', { name: 'Get Support' }).click();
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');
    await page.getByRole('textbox', { name: 'Email' }).fill('john.doe@example.com');
    await page.getByRole('combobox', { name: 'Select Type Of Request' }).click();
  await page.getByRole('option', { name: 'Installation Setup' }).click();
  await page.getByRole('combobox', { name: 'Select Type Of Request' }).click();
  await page.getByRole('option', { name: 'Hardware Issues' }).click();
  await page.getByRole('button', { name: 'Open' }).first().click();
  await page.getByRole('option', { name: 'Bug Fixes' }).click();
    await page.getByRole('textbox', { name: 'Subject' }).fill('Support Request');
    await page.getByRole('textbox', { name: 'Description' }).fill('I need help with the dashboard.');
     await page.getByRole('combobox', { name: 'Select Priority Of Request' }).click();
  await page.getByRole('option', { name: 'Low' }).click();
  await page.getByRole('button', { name: 'Open' }).nth(1).click();
  await page.getByRole('option', { name: 'Medium' }).click();
  // Upload video file
  await page.getByText('browse').click();
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('div.MuiStack-root.css-1fe5hl1').click()
  ]);
  await fileChooser.setFiles('C:\\Users\\User\\Downloads\\MetaLayerAction_2.mp4');
  // Upload image file
  
    
    // Click Submit Request and capture any errors that occur
    try {
        await page.getByRole('button', { name: 'Submit Request' }).click();
        await page.waitForTimeout(2000); // Wait for response
        
        // Check for error messages on the page
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
    
    // Log any captured errors at the end
    if (pageError) {
        console.log(`❌ Final Page Error Summary: ${pageError.message}`);
    }
    if (consoleMessages.filter(m => m.type === 'error').length > 0) {
        console.log('❌ Console errors were captured during test');
    }
});

// ========================================
// TEST 7: ASSIGN MODULE TO USER
// ========================================

test('Assign Module', async ({ page }) => {
    await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('link', { name: 'Modules' }).click();
     await page.getByRole('row', { name: 'Toggle select row QA_TEST_INTERNAL_2 1776319820 Add Tag QA_TEST_INTERNAL_2 -' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Assign Modules' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
   await page.getByRole('button', { name: 'Senior QA Group' }).click();
  await page.getByRole('tab', { name: 'Department Access' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('tab', { name: 'User Special Access' }).click();
  await page.getByRole('tab', { name: 'Domain' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
    await page.getByRole('button', { name: 'Senior QA Group' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'QA Jr Group' }).click();
  await page.getByRole('button', { name: 'Assign' }).click();
});

// ========================================
// TEST 8: EVALUATIONS PAGE 
// ========================================

test('Evaluations', async ({ page }) => {
    await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('link', { name: 'Evaluations' }).click();

    //Entry which is not completed
 await page.getByRole('cell', { name: 'MCQ Mode' }).first().click();
  await page.getByRole('button', { name: 'Identifying objects' }).click();
  await page.getByRole('button', { name: 'Close' }).click(); 

    //Entry which is completed
  await page.getByRole('cell', { name: 'MCQ Mode' }).nth(3).click();
  await page.getByRole('button', { name: 'Identifying objects 30 / 30' }).click();
  await page.getByRole('button', { name: 'Close' }).click(); 
  await page.getByRole('button', { name: 'Toggle full screen' }).click();
  await page.getByLabel('Toggle full screen').click();
  await page.getByRole('row', { name: 'Toggle select row Platform Admin 1 PFadmin1 MCQ Mode Multiplayer 01/04/2026 12:21 - 01/04/2026 12:22 1 minute 16 seconds 30 / 30 Pass Platform Team Row Actions', exact: true }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Bulk delete' }).click();
  await page.getByRole('button', { name: 'No' }).click();
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();
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
  await page.getByRole('button', { name: 'Reset order' }).click();
  await page.locator('.MuiBackdrop-root').click();
      await page.getByRole('button', { name: 'Export',exact:true }).click();
    await page.getByRole('button', { name: 'Export As PDF' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: 'Clear all notifications' }).click();
    await page.getByRole('button', { name: 'Export completed - Click to' }).click();
    await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Download' }).nth(0).click();


    });

// ========================================
// TEST 9: TRAININGS PAGE
// ========================================

test('Trainings',async ({ page }) => {
await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('link', { name: 'Trainings' }).click();
   await page.waitForTimeout(2000);

//Entry which is not completed 
 // await page.getByRole('row', { name: 'Toggle select row camp8 Chromatica Bootcamp Camp8- Nupur Single Player 27/04/2026 17:35 - Pending - ongoing Row Actions', exact: true }).getByRole('checkbox').check();
  await page.getByText('Camp8- Nupur').first().click();
  await page.getByRole('button', { name: 'The Blossom Ritual -' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

//Entry which is completed
    await page.getByRole('cell', { name: 'Camp8- Nupur' }).nth(1).click();
    await page.getByRole('button', { name: 'The Dark Awakening And First Drain' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
await page.getByRole('row', { name: 'Toggle select row camp8 Chromatica Bootcamp Camp8- Nupur Single Player 27/04/2026 14:23 - 27/04/2026 15:23 1 hour 17 seconds completed Row Actions', exact: true }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Bulk delete' }).click();
  await page.getByRole('button', { name: 'No' }).click();
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();
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
    await page.getByRole('button', { name: 'Hide all' }).click();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Group' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Module' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Player Mode' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Session Time' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Duration' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility status' }).check();
   await page.getByRole('button', { name: 'Reset order' }).click();
   await page.locator('.MuiBackdrop-root').click();
      await page.getByRole('button', { name: 'Export',exact:true }).click();
    await page.getByRole('button', { name: 'Export As PDF' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: 'Clear all notifications' }).click();
    await page.getByRole('button', { name: 'Export completed - Click to' }).click();
    await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Download' }).nth(0).click();
});

// ========================================
// TEST 10: DEVICES PAGE
// ========================================

test('Devices', async ({ page }) => 
{    
    await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('link', { name: 'Devices' }).click();
    await page.getByText('Unknown DeviceID: a52f395f70active1Domains1Users').click();

    //Scroll within the dialog
    await page.evaluate(() => {
    const dialog = document.querySelector('.MuiDialogContent-root');
    if (dialog) dialog.scrollBy({ top: 800, behavior: 'smooth' });
  });
  await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Close' }).click();
        await page.getByRole('button', { name: 'Export',exact:true }).click();
    await page.getByRole('button', { name: 'Export As PDF' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'View Export Jobs' }).click();
    const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Download' }).nth(0).click();
  const page1 = await page1Promise;
});

// ========================================
// TEST 11: SIGN OUT FUNCTIONALITY
// ========================================

test('Sign out', async ({ page }) => {
    await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('banner').getByRole('img').click();
  await page.getByRole('menu').click();
});

// ========================================
// TEST 12: GROUPS PAGE
// ========================================

test('Groups Page', async ({ page }) => {
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('admin@autovrse.in');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Organization' }).click();
  await page.getByRole('link', { name: 'Groups' }).click();
  await page.locator('div:nth-child(61) > .MuiPaper-root > .MuiBox-root.css-o8w36n > .MuiButtonBase-root').click();
  await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-outlined').click();
  await page.getByRole('textbox', { name: 'Search administrators...' }).click();
  await page.getByRole('textbox', { name: 'Search administrators...' }).fill('qa');
  await page.locator('.MuiBox-root.css-ftn5hm > div:nth-child(2) > .MuiButtonBase-root').click();
  await page.waitForTimeout(4000);
  await page.getByRole('tab', { name: 'Trainees' }).click();
  await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-outlined').click();
  await page.getByRole('textbox', { name: 'Search by username' }).click();
  await page.getByRole('textbox', { name: 'Search by username' }).fill('mt');
  await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall.css-5p7eof').first().click();
  await page.waitForTimeout(4000);
  await page.getByRole('tab', { name: 'Access Modules' }).click();
  await page.locator('.MuiButtonBase-root.MuiButton-root.MuiButton-outlined').click();
  await page.locator('.MuiBox-root > div:nth-child(3) > .MuiButtonBase-root').click();
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: 'Edit group details' }).click();
   await page.getByRole('textbox', { name: 'Group Name' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).fill('Should work');
  await page.getByRole('textbox', { name: 'Password' }).fill('1777');
    await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Close details panel' }).click();
  await page.waitForTimeout(4000);
  await page.locator('div:nth-child(61) > .MuiPaper-root > .MuiBox-root.css-o8w36n > .MuiButtonBase-root').click();
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: 'Close details panel' }).click();
  // // await page.getByRole('button', { name: 'Delete group' }).click();
  // // const dialogPromise = page.waitForEvent('dialog');
  // // await page.click('your-delete-button');
  // // const dialog = await dialogPromise;
  // // expect(dialog.message()).toContain('Are you sure you want to delete this group?');
  // // await dialog.accept();

  await page.getByRole('button', { name: 'Form Editor' }).click();
  await page.getByRole('button', { name: 'Add Group' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).click();  
  await page.getByRole('textbox', { name: 'Group Name' }).fill('Should work');
  await page.getByRole('textbox', { name: 'Password' }).fill('1777');
  await page.getByRole('button', { name: 'Create Group' }).click();
  await page.getByRole('row', { name: 'Expand Toggle select row Should work' }).getByLabel('Row Actions').click();
    await page.getByRole('menuitem', { name: 'Edit', exact: true }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).fill('sss1');
   await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.getByRole('row', { name: 'Expand Toggle select row sss1' }).getByLabel('Row Actions').click();
  await page.getByText('Edit Password').click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('4444');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.getByRole('row', { name: 'Expand Toggle select row sss1' }).getByLabel('Row Actions').click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'ORG CHART' }).click();

// ========================================
// CREATE ANOTHER GROUP TO TEST DELETE AND OTHER FUNCTIONALITIES
// ========================================

  await page.getByRole('button', { name: 'Add Group' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).click();
  await page.getByRole('textbox', { name: 'Group Name' }).fill('qqq');
  await page.getByRole('textbox', { name: 'Group Password' }).click();
  await page.getByRole('textbox', { name: 'Group Password' }).fill('qq');
  await page.getByRole('button', { name: 'Create Group' }).click();
  await page.getByRole('cell', { name: 'Expand' }).first().click();
  await page.getByRole('row', { name: 'Expand Toggle select row qqq' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Bulk delete' }).click();
  await page.getByRole('button', { name: 'No' }).click();
  await page.getByRole('button', { name: 'Toggle full screen' }).click();
  await page.getByLabel('Toggle full screen').click();
  await page.getByRole('button', { name: 'Show/Hide columns' }).click();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();
  await page.locator('.MuiBackdrop-root').click();
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();
  await page.getByRole('button', { name: 'Show/Hide columns' }).click();
  await page.getByRole('button', { name: 'Reset order' }).click();
  await page.getByRole('button', { name: 'Hide all' }).click();
  await page.getByRole('button', { name: 'Hide all' }).click();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();
});

// ========================================
// TEST 13: SCHEDULES PAGE
// ========================================

test('Schedules', async ({ page }) => {
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByLabel('Username').fill('admin@autovrse.in');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Schedules' }).click();
  await page.waitForTimeout(4000);
  await page.getByRole('cell', { name: 'check march' }).getByRole('paragraph').click();
  await page.getByRole('button', { name: 'Go back to schedules list' }).click();
  await page.getByRole('cell', { name: 'QATest6 - Today Range' }).click();
  await page.getByRole('button', { name: 'Go back to schedules list' }).click();
  await page.getByRole('row', { name: 'check march 29 Groups:' }).getByLabel('Row Actions').click();
  await page.getByText('Edit').click();
  await page.getByRole('textbox', { name: 'Enter schedule name' }).click();
  await page.getByRole('textbox', { name: 'Enter schedule name' }).fill('check march 28');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.getByRole('row', { name: 'check march 28 Groups:' }).getByLabel('Row Actions').click();
  await page.getByText('Delete').click();
  await page.getByRole('button', { name: 'No' }).click();
  await page.getByRole('button', { name: 'Add schedule' }).click();
  await page.getByRole('textbox', { name: 'Enter experience name' }).click();
  await page.getByRole('textbox', { name: 'Enter experience name' }).fill('New Automated Schedule');
  await page.getByRole('button', { name: 'Select Modules' }).click();
  await page.getByRole('button').nth(3).click();
  await page.getByRole('button', { name: 'Hide Modules' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Add Schedule').getByText('23').click();
  await page.getByText('30').nth(4).click();
  await page.getByRole('checkbox', { name: 'Training' }).check();
  await page.getByRole('checkbox', { name: 'Evaluation' }).check();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Select Groups' }).click();
  await page.getByText('qqq').click();
  await page.getByRole('button', { name: 'Hide Groups' }).click();
  await page.getByRole('button', { name: 'Select Users' }).click();
  await page.getByRole('textbox', { name: 'Search by username...' }).click();
  await page.getByRole('textbox', { name: 'Search by username...' }).fill('mt3');
  await page.getByText('MigrationTrainee3').click();
  await page.getByRole('button', { name: 'Create Schedule' }).click();
  await page.waitForTimeout(4000);
  console.log('✅ New schedule created successfully');
  await page.getByRole('row', { name: 'New Automated Schedule Groups:' }).getByLabel('Row Actions').click();
  await page.getByText('Delete').click();
  await page.getByRole('button', { name: 'Yes' }).click();
  console.log('✅ Schedule deleted successfully');
    await page.locator('span').filter({ hasText: 'check march' }).click();
  await page.locator('.MuiBackdrop-root').click();
  await page.locator('span').filter({ hasText: 'Claude' }).click();
  await page.locator('.MuiBackdrop-root').click();
  await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall.css-u27xt2').first().click();
  await page.locator('button:nth-child(3)').click();
  await page.locator('span').filter({ hasText: 'check march' }).click();
  await page.locator('.MuiBackdrop-root').click();
});

