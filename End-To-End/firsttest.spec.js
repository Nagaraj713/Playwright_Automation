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
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('admin@autovrse1.in');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
  
});

test('Login Flow : Incorrect Password', async ({ page }) => {
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('admin@autovrse.in');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
  await page.getByRole('button', { name: 'Continue' }).click();
  
});

test('Generate Report', async ({ page }) => {
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/')
  await page.getByRole('button', { name: 'Generate report' }).click();
});


test ('end to end', async ({page}) => {

await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByLabel('Username').fill('admin@autovrse.in');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Continue' }).click();
await page.pause();
});