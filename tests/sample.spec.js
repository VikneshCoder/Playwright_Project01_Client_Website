const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('https://www.youtube.com/watch?v=__vH5uFaZOE');
  const title = await page.title();
});
