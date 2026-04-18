const { test, expect } = require('@playwright/test');

test('Evaluation Report Download: PDF', async ({ page }) => {
    await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in')
    await page.getByLabel('Password').fill('admin')
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('link', { name: 'Evaluations' }).click();
    await page.getByRole('button', { name: 'Export',exact:true }).click();
    await page.getByRole('button', { name: 'Export As PDF' }).click();
    await page.getByRole('button', { name: 'Export completed - Click to' }).click();
    const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Download' }).nth(1).click();
  const page1 = await page1Promise;
 
});

test('Evaluation Report Download: Excel', async ({ page }) => {
    await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
    await page.getByLabel('Username').fill('admin@autovrse.in')
    await page.getByLabel('Password').fill('admin')
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('link', { name: 'Evaluations' }).click();
    await page.getByRole('button', { name: 'Export',exact:true }).click();
    await page.getByRole('button', { name: 'Export As Excel' }).click();
    await page.getByRole('button', { name: 'Export completed - Click to' }).click();
    const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Download' }).nth(1).click();
  const page1 = await page1Promise;
 
});

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



test('Claude automated',async ({page}) => {
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
  // 5. DELETE ADMIN USER (Automated)
  // ─────────────────────────────────────────
  const automatedRow = page.locator('tr').filter({ hasText: 'Automated' });
  await automatedRow.locator('button').last().click();
  await page.waitForTimeout(500);
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.waitForTimeout(1500);
  console.log('✅ Admin user (Automated) deleted successfully');

  // ─────────────────────────────────────────
  // 6. DELETE SUPER ADMIN USER (QA2)
  // ─────────────────────────────────────────
  const qa2Row = page.locator('tr').filter({ hasText: 'QA2' });
  await qa2Row.locator('button').last().click();
  await page.waitForTimeout(500);
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.waitForTimeout(1500);
  console.log('✅ Super Admin user (QA2) deleted successfully');

  console.log('\n🎉 All tasks completed successfully!');
});

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






