import { expect } from '@playwright/test';

class Utilitis {
    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    // Fetch token from the login endpoint
    async getToken() {
        const apiResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: this.loginPayload,
        });
        const apiResponseJson = await apiResponse.json();
        const token = apiResponseJson.token;
        expect(apiResponse.ok()).toBeTruthy();
        return token;
    }

    // Fetch the order ID by making the order request
    async getOrderId(orderPayload) {
        const token = await this.getToken();  // Ensure we get the token before making the order request

        // Now, use the token to create the order
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayload,
            headers: {
                'Authorization': token,  // Use the token in the headers
            },
        });

        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson);
        const orderId = orderResponseJson.orders[0];  // Access the correct property for orderId
        return { token, orderId };  // Return both token and orderId in an object
    }
}

export default Utilitis;
