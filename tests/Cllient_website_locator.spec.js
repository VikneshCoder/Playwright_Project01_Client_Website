const { test, expect } = require('@playwright/test');

test('E2E Automation for Client Website', async ({ page }) => {
    // Navigate to the site
  await page.goto('https://rahulshettyacademy.com/client');
  await page.waitForLoadState('networkidle');

  // Login to the application
  const emailID = 'vikneshraj1302@gmail.com';
  const password = 'Test@123';

  await page.getByPlaceholder('email@example.com').fill(emailID);
  await page.getByPlaceholder('enter your passsword').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Optional wait if elements load late

  // Identify the product card and click on the "View" button for "ADIDAS ORIGINAL"
  await page.locator(".card-body").filter({ hasText: "ADIDAS ORIGINAL" }).getByRole('button', { name: 'View' }).click();

  // Wait for product page or modal to load
  await page.waitForTimeout(1000);

  // Verify the product name and amount
  const productName = await page.getByText("ADIDAS ORIGINAL").textContent();
  expect(productName.trim()).toBe("ADIDAS ORIGINAL");
  const amount = await page.getByText("$ 31500").textContent();
  const tirmmedAmount = amount.trim();

  // Add to cart
  await page.getByRole('button', { name: 'Add to Cart' }).click();

  // Open the Cart
  await page.getByRole("listitem").getByRole("button", { name: "Cart" }).click();
  await page.waitForTimeout(3000); // Optional wait if elements load late

  // Verify the cart page
  const cartPage = page.getByText("My Cart");
  await expect(cartPage).toHaveText("My Cart");

  // Proceed to checkout
  await page.getByRole('button', { name: 'Checkout' }).click();
  const dropDown = await page.locator("//body//app-root//select[1]");
  try {
    await dropDown.selectOption({ label: "12" });
  } catch (error) {
    console.error("An error occurred while selecting the dropdown option or pausing:", error);
  }
  const dropDown2 = await page.locator("//body//app-root//select[2]");
  await dropDown2.selectOption({ label: "13" });

  // Fill in the checkout form
  await page.locator("(//input[@type='text'])[2]").fill("123");
  await page.locator("(//input[@type='text'])[3]").fill("Testing Name");
  expect (page.getByText(emailID)).toBeVisible();
  await page.getByPlaceholder("Select Country").pressSequentially("Ind");
  await page.getByRole("button",{name :"India"}).nth(1).click();

  // Click on the Place Order button
  await page.getByText("PLACE ORDER").click();

  // Verify the success message
  expect (page.getByText("Thankyou for the order.")).toBeVisible();

  // Grab the order ID
  const orderId = await page.locator("//label[@class='ng-star-inserted']").textContent();
  var trimmedOrderId = orderId.replace(/\|/g, '').trim();
  console.log("Order ID: " + trimmedOrderId);

  // Navigate to the Orders page
  await page.locator(".btn.btn-custom[routerlink='/dashboard/myorders']").click();
  const rows = page.locator("tbody tr");
  await page.locator("tbody").waitFor();

  // verify the order ID in the Orders page
  for (let i = 0; i < await rows.count(); i++) {
    var ids = await rows.nth(i).locator("th").textContent();
    if (orderId.includes(ids)) {
      console.log("Order ID found in the table: " + ids.trim());
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }

  // Checking details in the order summary
  const idOrderSummary = await page.locator(".col-text.-main").textContent();
  expect(idOrderSummary.trim()).toEqual(trimmedOrderId);

  const priceOrderSummary = await page.locator(".price").textContent();
  expect(priceOrderSummary.trim()).toEqual(tirmmedAmount.trim());

  // await page.pause(); // Pause the test to inspect the page
  });