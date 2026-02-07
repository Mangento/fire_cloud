# API Test Examples

## Using PowerShell

### 1. Health Check

```powershell
Invoke-RestMethod -Uri "https://YOUR-PROJECT-ID.web.app/api/health" -Method Get
```

### 2. Send Simple Email

```powershell
$body = @{
    to = "recipient@example.com"
    subject = "Test Email"
    text = "This is a test email"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://YOUR-PROJECT-ID.web.app/api/send-email" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### 3. Send HTML Email

```powershell
$body = @{
    to = "recipient@example.com"
    subject = "HTML Test Email"
    text = "Plain text version"
    html = "<h1>Hello!</h1><p>This is an <strong>HTML</strong> email.</p>"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://YOUR-PROJECT-ID.web.app/api/send-email" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### 4. Send to Multiple Recipients

```powershell
$body = @{
    to = @("user1@example.com", "user2@example.com")
    subject = "Bulk Email"
    text = "This goes to multiple people"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://YOUR-PROJECT-ID.web.app/api/send-email" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### 5. Test Invalid Data (should fail)

```powershell
$body = @{
    to = "invalid-email"
    subject = ""
    text = ""
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://YOUR-PROJECT-ID.web.app/api/send-email" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

## Using curl

### 1. Health Check

```bash
curl https://YOUR-PROJECT-ID.web.app/api/health
```

### 2. Send Simple Email

```bash
curl -X POST https://YOUR-PROJECT-ID.web.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "text": "This is a test email"
  }'
```

### 3. Send HTML Email

```bash
curl -X POST https://YOUR-PROJECT-ID.web.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "HTML Test Email",
    "text": "Plain text version",
    "html": "<h1>Hello!</h1><p>This is an <strong>HTML</strong> email.</p>"
  }'
```

## Using JavaScript/Fetch

```javascript
// Send email
async function sendEmail() {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: 'recipient@example.com',
      subject: 'Test from JavaScript',
      text: 'This email was sent using fetch API'
    })
  });
  
  const result = await response.json();
  console.log(result);
}

sendEmail();
```

## Using Node.js (axios)

```javascript
const axios = require('axios');

async function sendEmail() {
  try {
    const response = await axios.post('https://YOUR-PROJECT-ID.web.app/api/send-email', {
      to: 'recipient@example.com',
      subject: 'Test from Node.js',
      text: 'This email was sent using axios',
      html: '<p>With <strong>HTML</strong> support!</p>'
    });
    
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

sendEmail();
```

## Expected Responses

### Success Response

```json
{
  "success": true,
  "message": "Email sent successfully",
  "requestId": "req_1707303600000_xyz789",
  "messageId": "<abc123@mail.example.com>",
  "hostInfo": {
    "hostname": "firebase-function-instance",
    "platform": "linux",
    "environment": {
      "isFirebase": true,
      "functionName": "sendEmail"
    }
  },
  "duration": 245
}
```

### Validation Error Response

```json
{
  "success": false,
  "error": "Invalid data provided",
  "details": [
    {
      "field": "to",
      "message": "\"to\" must be a valid email"
    }
  ],
  "requestId": "req_1707303600000_xyz789"
}
```

### SMTP Error Response

```json
{
  "success": false,
  "error": "Failed to send email",
  "message": "Connection timeout",
  "requestId": "req_1707303600000_xyz789"
}
```
