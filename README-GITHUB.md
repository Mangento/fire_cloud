# Postfix Mailer

A Node.js-based email service using Postfix/SMTP with support for Firebase Cloud Functions and Upsun hosting. Features comprehensive logging, data validation, and automatic host detection.

[![Deploy to Firebase](https://img.shields.io/badge/Deploy-Firebase-orange)](https://firebase.google.com)
[![Deploy to Upsun](https://img.shields.io/badge/Deploy-Upsun-blue)](https://upsun.com)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

## 🌟 Features

- ✉️ **Email Sending** - Send emails via Postfix/SMTP using nodemailer
- 📝 **Comprehensive Logging** - Structured logging with request tracking
- ✅ **Data Validation** - Input validation using Joi schema
- 🖥️ **Automatic Host Detection** - Detects system, client, and cloud environment
- 🔒 **Error Handling** - Robust error handling with detailed messages
- 🌐 **Web Interface** - Clean UI for sending emails
- 📊 **Health Check** - Built-in health check endpoint
- 🚀 **Dual Deployment** - Works on both Firebase and Upsun

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install
cd functions && npm install && cd ..

# Set environment variables
$env:SMTP_HOST="smtp.gmail.com"
$env:SMTP_PORT="587"
$env:SMTP_USER="your-email@gmail.com"
$env:SMTP_PASS="your-app-password"

# Start server
npm start
```

Visit: http://localhost:8080

### Deploy to Firebase

```bash
firebase deploy
```

### Deploy to Upsun

```bash
git push upsun main
```

### Deploy to GitHub

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

See [GITHUB-DEPLOY.md](GITHUB-DEPLOY.md) for GitHub deployment with CI/CD.

## 📡 API Endpoints

### POST `/api/send-email`

Send an email with validation and logging.

**Request:**
```json
{
  "to": "recipient@example.com",
  "subject": "Hello",
  "text": "Plain text content",
  "html": "<p>HTML content</p>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "requestId": "req_1234567890_abc123",
  "messageId": "<abc@mail.com>",
  "hostInfo": { ... },
  "duration": 245
}
```

### GET `/api/health`

Health check with automatic host detection.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-07T12:00:00.000Z",
  "hostInfo": {
    "platform": "win32",
    "environment": {
      "provider": "Unknown"
    }
  },
  "service": "postfix-mailer",
  "version": "1.0.0"
}
```

## 📁 Project Structure

```
postfix-mailer/
├── functions/
│   ├── index.js              # Main email service
│   └── utils/
│       ├── validator.js      # Email validation
│       ├── hostDetector.js   # Host detection
│       └── logger.js         # Structured logging
├── public/
│   └── index.html           # Web interface
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions
├── server.js                # Express server (Upsun)
├── .platform.app.yaml       # Upsun config
├── firebase.json            # Firebase config
└── .firebaserc             # Firebase project

```

## 🔧 Configuration

### Environment Variables

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

### For Firebase

```bash
firebase functions:config:set smtp.host="smtp.gmail.com"
firebase functions:config:set smtp.port="587"
firebase functions:config:set smtp.user="your-email"
firebase functions:config:set smtp.pass="your-password"
```

### For Upsun

```bash
upsun variable:create --name SMTP_HOST --value "smtp.gmail.com"
upsun variable:create --name SMTP_PORT --value "587"
upsun variable:create --name SMTP_USER --value "your-email" --sensitive true
upsun variable:create --name SMTP_PASS --value "your-password" --sensitive true
```

## 📚 Documentation

- [Getting Started](GETTING-STARTED.md) - Complete setup guide
- [GitHub Deployment](GITHUB-DEPLOY.md) - Deploy to GitHub with CI/CD
- [Upsun Deployment](UPSUN-DEPLOY.md) - Deploy to Upsun
- [Testing Guide](TESTING.md) - How to test the application
- [API Examples](API-EXAMPLES.md) - API usage examples

## 🎯 Key Features Explained

### Automatic Host Detection

The mailer automatically detects where it's running:

- **Local**: Shows system information
- **Upsun**: Detects platform project, app name, branch
- **Firebase**: Detects function name, GCP project
- **Vercel/Netlify**: Also supported

### Comprehensive Logging

Every request generates structured logs:

```json
{
  "timestamp": "2026-02-07T10:30:00.000Z",
  "level": "INFO",
  "message": "Email sent successfully",
  "messageId": "<abc@xyz.com>",
  "duration": "245ms"
}
```

### Invalid Data Handling

Automatic validation with detailed errors:

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

## 🔐 Security

- ✅ Input validation on all requests
- ✅ CORS protection
- ✅ Environment variables for sensitive data
- ✅ No credentials in code
- ✅ Request ID tracking

## 🧪 Testing

```powershell
# Test health check
Invoke-RestMethod -Uri "http://localhost:8080/api/health"

# Test email sending
$body = @{
    to = "test@example.com"
    subject = "Test"
    text = "Hello!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/send-email" `
    -Method Post -Body $body -ContentType "application/json"
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

ISC

## 🙏 Support

For issues and questions:
- Check the [documentation](GETTING-STARTED.md)
- Review [API examples](API-EXAMPLES.md)
- Open an issue on GitHub

## 🚀 Deployment Status

When deployed with GitHub Actions, you'll see automatic deployments to:

- Firebase: `https://cloud-cd92d.web.app`
- Upsun: `https://[your-upsun-url]`

---

Made with ❤️ using Node.js, Firebase, and Upsun
