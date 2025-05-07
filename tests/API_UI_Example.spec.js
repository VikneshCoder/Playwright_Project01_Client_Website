import { test, request } from '@playwright/test';
import Utilitis from '../tests/utilis/Utilitis.js';

const loginPayload = {
    userEmail: "vikneshraj1302@gmail.com",   // This object so for key do not need quotes
    userPassword: "Test@123"
};

const orderPayload = {
        orders: [
            {
                country: "Cambodia",
                productOrderedId: "67a8df56c0d3e6622a297ccd"
            }
        ]
    };

let response;

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const orderResult = new Utilitis(apiContext, loginPayload);
    response = await orderResult.getOrderId(orderPayload);

});

test('API and UI Integration', async ({ page }) => {
    // Set the token in localStorage
    await page.addInitScript((token) => {
        window.localStorage.setItem('token', token);
    }, response.token);

    // Navigate to the client page
    await page.goto('https://rahulshettyacademy.com/client');
    await page.waitForLoadState('domcontentloaded');

    // Navigate to the Orders page
    await page.locator(".btn.btn-custom[routerlink='/dashboard/myorders']").click();
    const rows = page.locator("tbody tr");
    await page.locator("tbody").waitFor();

    // Verify the order ID in the Orders page
    for (let i = 0; i < await rows.count(); i++) {
        const ids = await rows.nth(i).locator("th").textContent();
        if (response.orderId.includes(ids)) {
            console.log("Order ID found in the table: " + ids.trim());
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
});
