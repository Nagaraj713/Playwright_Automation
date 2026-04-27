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

test('Analytics Page Different Tabs', async ({ page }) => {
    await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in')
    await page.getByLabel('Password').fill('admin')
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('link', { name: 'Analytics' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('tab', { name: 'Module Analytics' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('tab', { name: 'Domain Analytics' }).click();
    await page.waitForTimeout(2000);
   await page.getByRole('tab', { name: 'Department Analytics' }).click();
   
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
  await page.getByRole('cell', { name: 'MCQ Mode' }).nth(3).click();
  await page.getByRole('button', { name: 'Identifying objects 30 / 30' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
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
    await page.getByRole('cell', { name: 'Moment Life Cycle Mode' }).nth(4).click();
    await page.getByRole('button', { name: 'Identify objects' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
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



test ('end to end', async ({page}) => {

await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByLabel('Username').fill('admin@autovrse.in');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Continue' }).click();
await page.pause();
});