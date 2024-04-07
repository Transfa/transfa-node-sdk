# transfa-node-sdk
The Transfa Node SDK provides methods and resources for interacting with the Transfa API in TypeScript applications.

## Documentation

For more detailed information about the API, refer to the [Node API documentation](https://docs.transfapp.com/docs/category/transfa-sdks).

## Installation

You can install the SDK via npm or yarn:

For `yarn` users:

```shell
yarn add transfa-node-sdk
```

For `npm` users:

```shell
npm install transfa-node-sdk
```

## Requirements

- Node.js 16.0 or higher

## Getting Started

### Initialize Transfa Node SDK Instance

```typescript
import { TransfaAPIClient } from 'transfa-node-sdk';

const transfaClient = new TransfaAPIClient("YOUR_API_KEY", "YOUR_WEBHOOK_SECRET");
```

### Request a Payment

When making a payment request to the Transfa API, ensure to provide a unique idempotency key in the header of each request. This key helps maintain uniqueness and prevents duplicate payment objects in the database.

Example:

```typescript
transfaClient.Payment.requestPayment({
    account_alias: "60201010",
    amount: 5000,
    mode: "mtn-benin",
    webhook_url: "https://your_app_url.domain/your_webhook_endpoint/",
});
```

### Retrieve a Single Payment

```typescript
transfaClient.Payment.retrieve("your payment id");
```

### Get the Status of a Payment

```typescript
transfaClient.Payment.status("your payment id");
```

### Refund a Payment

```typescript
transfaClient.Payment.refund("your payment id");
```

### List All Payments

```typescript
transfaClient.Payment.list();
```

### Verify Webhook

To receive updates about your payments via webhook, ensure your organization supports the webhook feature and provide a webhook URL. Transfa sends data to this URL whenever there is an update regarding your payments. Before processing the payload of a webhook request, verify its authenticity using the `X-Webhook-Transfa-Signature` parameter in the request headers.

The SDK provides a `Webhook` class to handle verification. Here's an example of how to use it:

```typescript
const requestHandler = (req, res) => {
    let webhookPayload = req.body; // Get webhook payload
    webhookPayload = transfaClient.Webhook.verify(req.body, req.headers);
    if (!webhookPayload) {
        res.status(401).json({ details: "Unauthorized" });
    }
    res.json({ details: true });
}
```

Ensure to integrate this verification process into your webhook endpoint handling logic.

This documentation provides essential guidance for integrating and utilizing the Transfa Node SDK in your TypeScript applications.