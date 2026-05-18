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
    await page.getByRole('link', { name: 'Modules' }).click();
      await page.getByRole('button', { name: 'Show/Hide columns' }).click();
  await page.waitForTimeout(1000);
   const projectBtn = page.getByRole('menuitem', { name: 'Move Toggle visibility Project Name' }).getByLabel('Move');
  const nameItem = page.getByRole('menuitem', { name: 'Move Toggle visibility Name' });

  const projectBox = await projectBtn.boundingBox();
  const nameBox = await nameItem.boundingBox();

  const startX = projectBox.x + projectBox.width / 2;
  const startY = projectBox.y + projectBox.height / 2;
  const endX = nameBox.x + nameBox.width / 2;
  const endY = nameBox.y; // top edge of Name row

  // ─── Perform the drag with long hold + slow steps ─────────────
  await page.mouse.move(startX, startY);
  await page.waitForTimeout(500);
  await page.mouse.down();
  await page.waitForTimeout(800); // ✅ Key: hold 800ms before moving to trigger drag mode

  // Move in 50 tiny incremental steps
  const totalSteps = 50;
  for (let i = 1; i <= totalSteps; i++) {
    const x = startX + (endX - startX) * (i / totalSteps);
    const y = startY + (endY - startY) * (i / totalSteps);
    await page.mouse.move(x, y);
    await page.waitForTimeout(20); // ✅ Key: 20ms delay between each step
  }

  await page.waitForTimeout(500);
  await page.mouse.up();
  await page.waitForTimeout(1000);
 
  await page.getByRole('button', { name: 'Reset Order' }).click();
   await page.locator('.MuiBackdrop-root').click();
});

