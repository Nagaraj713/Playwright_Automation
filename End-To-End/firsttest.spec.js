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
});