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
test('Users page', async ({ page }) => {
  await page.goto('https://dev-pulse-dashboard.autovrse-training.com/auth/login/');
  await page.getByLabel('Username').fill('admin@autovrse.in');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(4000);
  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('row', { name: 'Toggle select row test456 123456' }).getByRole('checkbox').check();

  // Bulk delete action
  await page.getByRole('button', { name: 'Bulk delete' }).click();
  await page.getByRole('button', { name: 'No' }).click();
    await page.getByRole('row', { name: 'Toggle select row test456 123456' }).getByRole('checkbox').uncheck();
   // Show/Hide filters
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();
  await page.getByRole('button', { name: 'Show/Hide filters' }).click();

    // Toggle full screen
   await page.getByRole('button', { name: 'Toggle full screen' }).click();
  await page.getByLabel('Toggle full screen').click();

  //Show/Hide columns
  await page.getByRole('button', { name: 'Show/Hide columns' }).click();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Name' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Username' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Username' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Role' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Role' }).check();
  await page.getByRole('checkbox', { name: 'Toggle visibility Group' }).uncheck();
  await page.getByRole('checkbox', { name: 'Toggle visibility Group' }).check();
   await page.locator('.MuiBackdrop-root').click();

   // assign modules
   await page.getByRole('row', { name: 'Toggle select row test456 123456' }).getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Assign Modules' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Assign Modules' }).click();
  await page.getByRole('button', { name: 'QA_Test_1 Created on: 4/16/' }).click();
  await page.getByRole('button', { name: 'Test QA 1 Created on: 4/16/' }).click();
  await page.locator('div:nth-child(10) > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
  await page.getByRole('button', { name: 'Assign Modules' }).click();

  //check whether modules are assigned or not
  await page.getByRole('link', { name: 'Modules' }).click();
  await page.locator('tr:nth-child(8) > .MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeMedium.css-2eatx8 > .MuiButtonBase-root').click();
  await page.getByText('Assigned Entities').click();
  await page.getByRole('tab', { name: 'User Special Access' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.locator('tr:nth-child(9) > .MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeMedium.css-2eatx8 > .MuiButtonBase-root').click();
  await page.getByText('Assigned Entities').click();
  await page.getByRole('tab', { name: 'User Special Access' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  //Edit user details
  await page.getByRole('link', { name: 'Users' }).click();
   await page.getByRole('row', { name: 'Toggle select row test456 123456' }).getByLabel('Row Actions').click();
  await page.getByRole('menuitem', { name: 'Edit', exact: true }).click();

  //name change
   await page.getByRole('textbox', { name: 'Display Name' }).click();
  await page.getByRole('textbox', { name: 'Display Name' }).fill('test456 edited');

  //employee code change
  await page.getByRole('textbox', { name: 'Employee Code' }).click();
  await page.getByRole('textbox', { name: 'Employee Code' }).fill('1234546');
 

  //adding group
   await page.getByRole('button', { name: 'Open' }).click();
  await page.getByRole('option', { name: 'group22', exact: true }).click();
  await page.getByTitle('Close').click();

// removing group
 await page.getByRole('button', { name: 'Open' }).click();
  await page.getByRole('option', { name: 'group4' }).click();
  await page.getByTitle('Close').click();
  await page.getByRole('button', { name: 'Save Changes' }).click();

  //Edit password
    await page.getByRole('button', { name: 'Go to next page' }).click();
     await page.getByRole('row', { name: 'Toggle select row TestUser' }).getByLabel('Row Actions').click();
  await page.getByRole('menuitem', { name: 'Edit Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('1');
  await page.getByRole('button', { name: 'Save Changes' }).click();
});

});

