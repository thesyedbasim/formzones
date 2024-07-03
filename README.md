# FormZones

FormZones lets website owners receive form submissions directly in Discord. Skip managing servers and get instant notifications by integrating your website with FormZones.

## Features

- Receive form submissions directly in Discord
- Easy integration with your website
- Instant notifications
- Simplified server management

## Getting Started

### 1. Sign In

Sign in at [FormZones](https://formzones.vercel.app).

### 2. Get Your Discord Webhook URL

1. Go to your Discord channel settings.
2. Navigate to **Integrations** and create a new webhook.
3. Copy the webhook URL.

### 3. Set Up FormZones

1. Paste your Discord webhook URL into the FormZones setup page.
2. FormZones will generate a unique link for you to send POST API requests.

### 4. Sending Data

#### Discord API Endpoint
Send your POST API requests to the unique link provided by FormZones. The endpoint format is:
```https://formzones.vercel.app/api/discord?webhook_id=YOUR_WEBHOOK_ID&webhook_token=YOUR_WEBHOOK_TOKEN&access_token=YOUR_ACCESS_TOKEN```

When sending data using JavaScript, format your data as an array of objects with `name` and `value` properties.

#### Example

```javascript
const data = [
  { name: 'name', value: 'John Doe' },
  { name: 'email', value: 'john@example.com' },
  { name: 'message', value: 'Hello, this is a test message!' }
];

fetch('YOUR_GENERATED_LINK_HERE', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});
```

## Contribution & Support

For feedback, suggestions, or support, please open an issue or pull request on the GitHub repository.

## LICENSE

This project is licensed under the Apache License 2.0. See the [LICENSE](https://github.com/thesyedbasim/formzones/blob/main/LICENSE) file for details.
