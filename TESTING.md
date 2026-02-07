# Testing Your Postfix Mailer

## Test Locally First

### 1. Install Dependencies

```powershell
npm install
cd functions
npm install
cd ..
```

### 2. Set Environment Variables

Create a `.env` file or set in your shell:

```powershell
$env:SMTP_HOST="localhost"
$env:SMTP_PORT="25"
$env:SMTP_SECURE="false"
$env:SMTP_FROM="noreply@example.com"
```

For Gmail testing:
```powershell
$env:SMTP_HOST="smtp.gmail.com"
$env:SMTP_PORT="587"
$env:SMTP_SECURE="true"
$env:SMTP_USER="your-email@gmail.com"
$env:SMTP_PASS="your-app-password"
$env:SMTP_FROM="your-email@gmail.com"
```

### 3. Start the Server

```powershell
npm start
```

You should see:
```
✅ Postfix Mailer server running on port 8080
🌐 Local: http://localhost:8080
📧 API Endpoint: http://localhost:8080/api/send-email
❤️  Health Check: http://localhost:8080/api/health
💻 Running locally
```

### 4. Test Health Check

Open another PowerShell window:

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/health"
```

Expected output:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-07T...",
  "hostInfo": {
    "hostname": "YOUR-PC-NAME",
    "platform": "win32",
    "environment": {
      "provider": "Unknown",
      "isUpsun": false,
      "isFirebase": false
    }
  }
}
```

### 5. Test Email Sending

#### Via Web Interface
Open browser: http://localhost:8080

#### Via PowerShell

```powershell
$body = @{
    to = "test@example.com"
    subject = "Test Email"
    text = "This is a test email from Postfix mailer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/send-email" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

Expected successful response:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "requestId": "req_...",
  "messageId": "<...@...>",
  "hostInfo": {
    "environment": {
      "provider": "Unknown"
    }
  },
  "duration": 245
}
```

### 6. Test Invalid Data Handling

```powershell
$body = @{
    to = "invalid-email"
    subject = ""
    text = ""
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/send-email" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

Expected error response:
```json
{
  "success": false,
  "error": "Invalid data provided",
  "details": [
    {
      "field": "to",
      "message": "\"to\" must be a valid email"
    }
  ]
}
```

## Test on Upsun

### 1. Deploy to Upsun

```powershell
git add .
git commit -m "Ready for deployment"
git push upsun main
```

### 2. Get Your URL

```powershell
upsun url --primary
```

### 3. Test Health Check

```powershell
$url = "YOUR-UPSUN-URL"  # Replace with actual URL
Invoke-RestMethod -Uri "$url/api/health"
```

You should see `"provider": "Upsun"` in the response:
```json
{
  "hostInfo": {
    "environment": {
      "provider": "Upsun",
      "isUpsun": true,
      "platformProject": "vgvhbpsayvcke",
      "platformApp": "postfix-mailer"
    }
  }
}
```

### 4. Test Sending Email

```powershell
$body = @{
    to = "your-email@example.com"
    subject = "Test from Upsun"
    text = "This email was sent from Upsun platform!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$url/api/send-email" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

## Test on Firebase

### 1. Deploy to Firebase

```powershell
firebase deploy
```

### 2. Test Endpoints

```powershell
$url = "https://cloud-cd92d.web.app"

# Health check
Invoke-RestMethod -Uri "$url/api/health"
```

You should see `"provider": "Firebase"` in the response.

## Automatic Detection Features

The mailer automatically detects and logs:

### ✅ Running Environment
- **Upsun**: Platform project, app name, branch, region
- **Firebase**: Function name, GCP project ID, region
- **Local**: Shows as "Unknown" provider

### ✅ System Information
- Hostname
- Platform (win32, linux, darwin)
- Architecture (x64, arm64)
- CPU count
- Memory (total, free, used)
- Uptime

### ✅ Client Information
- IP address (including X-Forwarded-For)
- User agent
- Request host and protocol

### ✅ Request Tracking
- Unique request ID for each email
- Duration tracking
- Full request/response logging

## View Logs

### Local Development
Logs appear in console with JSON format:
```json
{
  "timestamp": "2026-02-07T10:30:00.000Z",
  "level": "INFO",
  "message": "Email sent successfully",
  "messageId": "<abc@xyz.com>",
  "duration": "245ms"
}
```

### Upsun
```powershell
# Stream logs in real-time
upsun log --tail

# View app logs
upsun log app --tail
```

### Firebase
```powershell
# View function logs
firebase functions:log

# View specific function
firebase functions:log --only sendEmail
```

## Common Issues

### SMTP Connection Refused
- Check firewall settings
- Verify SMTP host and port
- Ensure SMTP service is running

### Authentication Failed
- Verify username/password
- For Gmail: use App Password, not account password
- Check if 2FA is enabled

### Invalid Data Errors
- Ensure `to` is a valid email
- `subject` and `text` are required
- Check JSON format

### Can't Access Locally
- Ensure port 8080 is not in use
- Check `npm start` completed successfully
- Try http://127.0.0.1:8080 instead of localhost

## Success Indicators

✅ **Email Sent Successfully**
- Response has `success: true`
- `messageId` is present
- Response time under 500ms (typically)

✅ **Host Detected Correctly**
- Local: `provider: "Unknown"`
- Upsun: `provider: "Upsun"` with platform details
- Firebase: `provider: "Firebase"` with function details

✅ **Logs Working**
- JSON formatted logs in console
- Request ID tracking
- Detailed metadata

## Next Steps

1. Configure your SMTP server properly
2. Test with real email addresses
3. Monitor logs for any issues
4. Set up proper error notifications
5. Configure rate limiting if needed
