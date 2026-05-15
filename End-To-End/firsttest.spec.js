const {test, expect} = require('@playwright/test')

//Always create a test block
// test('Open youtube', async ({page}) => {
//      await page.goto('https://www.youtube.com/')
//      await expect(page).toHaveTitle('YouTube')
//      await page.screenshot({path: 'youtube.png', fullPage: true})
   
// })

// test ('Open google', async ({page}) => {
//     await page.goto('https://www.google.com/')
//     await expect(page).toHaveTitle('Google')
//     await page.screenshot({path: 'google.png', fullPage: true})
// })

test('Login Flow : Incorrect Username', async ({ page }) => {
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByLabel('Username').fill('admin1@autovrse.in');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Continue' }).click();
  console.log('Login Flow : Incorrect Username test executed successfully');
});

test('Login Flow : Incorrect Password', async ({ page }) => {
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByLabel('Username').fill('admin@autovrse.in');
  await page.getByLabel('Password').fill('wrongpassword');
  await page.getByRole('button', { name: 'Continue' }).click();
  console.log('Login Flow : Incorrect Password test executed successfully');
});

test('Generate Report', async ({ page }) => {
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByLabel('Username').fill('admin@autovrse.in');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Generate report' }).click();
  console.log('Generate Report test executed successfully');
});


test ('end to end', async ({page}) => {

await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByLabel('Username').fill('admin@autovrse.in');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.pause();
});

  test('test', async ({ page }) => {
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('admin@autovrse.in');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('tab', { name: 'Domain Analytics' }).click();

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
});