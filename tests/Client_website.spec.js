const { test, expect } = require('@playwright/test');

test('E2E Automation for Client Website', async ({ page }) => {
    // Navigate to the site
  await page.goto('https://rahulshettyacademy.com/client');
  await page.waitForLoadState('networkidle');

  // Login to the application
  const emailID = 'vikneshraj1302@gmail.com';
  const password = 'Test@123';
  await page.locator("//input[@id='userEmail']").fill(emailID);
  await page.locator("//input[@id='userPassword']").fill(password);
  await page.locator("//input[@id='login']").click();

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Optional wait if elements load late

  // Identify the product card and click on the "View" button for "ADIDAS ORIGINAL"
  const cards = page.locator("//div[@class='card-body']");
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    let title = await cards.nth(i).locator("h5").textContent();
    console.log(title);
    if (title.trim() === "ADIDAS ORIGINAL") {
      await cards.nth(i).locator("text=View").click(); // or just .locator("button") if there's only one
      break;
    }
  }

  // Wait for product page or modal to load
  await page.waitForTimeout(1000);

  // Verify the product name and amount
  const productName = await page.locator("//p[text()='Addias Originals']").textContent();
  expect(productName.trim()).toBe("Addias Originals");
  const amount = await page.locator("//h3[text()='$ 31500']").textContent();
  const tirmmedAmount = amount.trim();

  // Add to cart
  await page.locator(".btn.btn-primary").click();

  // Open the Cart
  await page.locator("//button[@routerlink='/dashboard/cart']").click();
  await page.waitForTimeout(3000); // Optional wait if elements load late

  const cartPage = page.locator("div[class='heading cf'] h1");
  await expect(cartPage).toHaveText("My Cart");

  const amountOfTheProduct = await page.locator("//div[@class='prodTotal cartSection']/p").textContent();
  expect(amountOfTheProduct.trim()).toEqual(tirmmedAmount);

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
  const emailIDInCheckout = await page.locator("label[type='text']").textContent();
  expect(emailIDInCheckout.trim()).toEqual(emailID);

  await page.locator("//input[@placeholder='Select Country']").pressSequentially("ind");
  const results = await page.locator(".ta-results");
  await results.waitFor({ state: 'visible' });
  const optionCount = await results.locator("button").count();
  for (let i = 0; i < optionCount; i++) {
    const text = await results.locator("button").nth(i).textContent();
    if (text.trim() === "India") {
      await results.locator("button").nth(i).click();
      break;
    }
  }

  // Click on the Place Order button
  await page.locator("//a[.='Place Order ']").click();

  // Verify the success message
  const successMessage = await page.locator(".hero-primary").textContent();
  expect(successMessage.trim()).toEqual("Thankyou for the order.");

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