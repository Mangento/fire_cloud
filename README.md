# Postfix Mailer - Firebase Cloud Functions & Upsun

A Node.js-based email service using Postfix/SMTP with support for both Firebase Cloud Functions and Upsun hosting. Features comprehensive logging, data validation, and automatic host detection.

## 🌟 Dual Deployment Support

This application can be deployed to:
- **Firebase** - Cloud Functions + Hosting
- **Upsun/Platform.sh** - Node.js server

The code automatically detects which platform it's running on!

## 🚀 Features

- ✉️ **Email Sending**: Send emails via Postfix/SMTP using nodemailer
- 📝 **Comprehensive Logging**: Structured logging with request tracking
- ✅ **Data Validation**: Input validation using Joi schema
- 🖥️ **Automatic Host Detection**: Detects system, client, and cloud environment information
- 🔒 **Error Handling**: Robust error handling with detailed error messages
- 🌐 **Web Interface**: Clean UI for sending emails directly from browser
- 📊 **Health Check**: Built-in health check endpoint

## 📋 Prerequisites

- Node.js 18 or higher
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project
- Postfix or SMTP server configured

## 🛠️ Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install function dependencies
cd functions
npm install
cd ..
```

### 2. Configure Firebase

Update `.firebaserc` with your Firebase project ID:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 3. Configure SMTP Settings

Set Firebase Functions configuration:

```bash
firebase functions:config:set smtp.host="localhost"
firebase functions:config:set smtp.port="25"
firebase functions:config:set smtp.secure="false"
firebase functions:config:set smtp.from="noreply@example.com"

# If authentication is required
firebase functions:config:set smtp.user="your-smtp-username"
firebase functions:config:set smtp.pass="your-smtp-password"
```

For local development, create a `.env` file:

```env
SMTP_HOST=localhost
SMTP_PORT=25
SMTP_SECURE=false
SMTP_FROM=noreply@example.com
```

### 4. Login to Firebase

```bash
firebase login
```

## 🚀 Deployment

### Deploy to Firebase

```bash
firebase deploy
```

### Deploy to Upsun

```bash
git push upsun main
```

See [UPSUN-DEPLOY.md](UPSUN-DEPLOY.md) for detailed Upsun deployment instructions.

### Deploy Everything (Firebase)

```bash
firebase deploy
```

### Deploy Only Functions

```bash
firebase deploy --only functions
```

### Deploy Only Hosting

```bash
firebase deploy --only hosting
```

## 🧪 Local Testing

### Start Firebase Emulators

```bash
firebase emulators:start
```

### Test Functions Locally

```bash
cd functions
npm run serve
```

## 📡 API Usage

### Send Email Endpoint

**POST** `/api/send-email`

**Request Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text content",
  "html": "<p>HTML content</p>",
  "from": "sender@example.com"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Email sent successfully",
  "requestId": "req_1234567890_abc123",
  "messageId": "<abc123@example.com>",
  "hostInfo": {
    "hostname": "instance-1",
    "platform": "linux",
    "environment": {
      "isFirebase": true,
      "functionName": "sendEmail"
    }
  },
  "duration": 245
}
```

**Response (Error):**

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
  "requestId": "req_1234567890_abc123"
}
```

### Health Check Endpoint

**GET** `/api/health`

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2026-02-07T10:30:00.000Z",
  "hostInfo": {
    "hostname": "instance-1",
    "platform": "linux",
    "cpuCount": 2,
    "memory": {
      "total": "2.00 GB",
      "free": "1.20 GB"
    }
  },
  "service": "postfix-mailer",
  "version": "1.0.0"
}
```

## 📊 Features Explained

### 1. Logging System

The logger provides structured logging with:
- Request IDs for tracking
- Timestamps
- Log levels (INFO, WARN, ERROR, DEBUG)
- Metadata attachment

Example log:
```json
{
  "timestamp": "2026-02-07T10:30:00.000Z",
  "level": "INFO",
  "message": "Email sent successfully",
  "messageId": "<abc123@example.com>",
  "duration": "245ms"
}
```

### 2. Data Validation

Using Joi schema validation:
- Email format validation
- Required field checks
- String length limits
- Array support for multiple recipients
- Custom error messages

### 3. Automatic Host Detection

Detects and logs:
- System information (hostname, platform, architecture)
- Resource usage (CPU, memory, uptime)
- Client information (IP, user agent)
- Request details (protocol, URL)
- Cloud environment (Firebase, GCP project, function name)

### 4. Error Handling

- Invalid method handling (405)
- Validation errors (400)
- SMTP connection errors
- Server errors (500)
- Detailed error responses

## 🔧 SMTP Configuration

### Using Local Postfix

```bash
firebase functions:config:set smtp.host="localhost" smtp.port="25" smtp.secure="false"
```

### Using External SMTP (e.g., Gmail)

```bash
firebase functions:config:set smtp.host="smtp.gmail.com"
firebase functions:config:set smtp.port="587"
firebase functions:config:set smtp.secure="true"
firebase functions:config:set smtp.user="your-email@gmail.com"
firebase functions:config:set smtp.pass="your-app-password"
firebase functions:config:set smtp.from="your-email@gmail.com"
```

### Using SendGrid

```bash
firebase functions:config:set smtp.host="smtp.sendgrid.net"
firebase functions:config:set smtp.port="587"
firebase functions:config:set smtp.user="apikey"
firebase functions:config:set smtp.pass="YOUR_SENDGRID_API_KEY"
```

## 📂 Project Structure

```
postfix-mailer/
├── functions/
│   ├── index.js              # Main Cloud Functions
│   ├── package.json          # Functions dependencies
│   └── utils/
│       ├── validator.js      # Email data validation
│       ├── hostDetector.js   # Host information detection
│       └── logger.js         # Structured logging
├── public/
│   └── index.html           # Web interface
├── firebase.json            # Firebase configuration
├── .firebaserc             # Firebase project
├── package.json            # Root dependencies
└── README.md              # Documentation
```

## 🔍 Viewing Logs

### Firebase Console

Visit: https://console.firebase.google.com/project/YOUR_PROJECT/functions/logs

### Command Line

```bash
firebase functions:log
```

### Filter by Function

```bash
firebase functions:log --only sendEmail
```

## 🐛 Troubleshooting

### SMTP Connection Issues

1. Verify SMTP configuration:
```bash
firebase functions:config:get
```

2. Check firewall rules (SMTP uses port 25, 587, or 465)

3. Test SMTP locally using a simple script

### Deployment Errors

1. Ensure you're logged in:
```bash
firebase login
```

2. Check project ID:
```bash
firebase projects:list
```

3. Clear cache and reinstall:
```bash
rm -rf node_modules functions/node_modules
npm install
cd functions && npm install
```

## 📝 License

ISC

## 🤝 Support

For issues and questions, check Firebase documentation or open an issue in your repository.
