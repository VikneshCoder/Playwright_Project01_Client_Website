const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/client');
  await page.waitForLoadState('networkidle');
  const title = await page.title()
  console.log(title); // Log the title to the console
  expect(title).toBe("Let's Shop");   // Verify the title of the page

  // Login to the application
  await page.locator("//input[@id='userEmail']").fill('vikneshraj1302@gmail.com');
  await page.locator("//input[@id='userPassword']").fill('Test@123');
  await page.locator("//input[@id='login']").click();

  // Verify that we are in the home page
  await page.waitForLoadState('networkidle');
  const home = await page.locator("//section[@id='sidebar']//p[1]").textContent();
  console.log(home); // Log the home text to the console
  expect(home).toContain("Home"); // Verify that the home text contains "Home"

});

