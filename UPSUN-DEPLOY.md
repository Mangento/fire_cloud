# Upsun Deployment Guide

## Prerequisites

- Upsun CLI installed (`upsun` command available)
- Git repository initialized
- Upsun project created

## Quick Deploy to Upsun

### 1. Initialize Git (if not already done)

```powershell
git init
git add .
git commit -m "Initial commit - Postfix mailer"
```

### 2. Connect to Upsun Project

```powershell
# Link to your existing Upsun project
upsun project:set-remote

# Or create a new project
upsun project:create
```

### 3. Configure SMTP Settings

Add environment variables in your Upsun project:

```powershell
# Set SMTP configuration
upsun variable:create --level environment --name SMTP_HOST --value "localhost" --visible-build false
upsun variable:create --level environment --name SMTP_PORT --value "25" --visible-build false
upsun variable:create --level environment --name SMTP_SECURE --value "false" --visible-build false
upsun variable:create --level environment --name SMTP_FROM --value "noreply@yourdomain.com" --visible-build false

# If using authenticated SMTP (e.g., Gmail, SendGrid)
upsun variable:create --level environment --name SMTP_USER --value "your-user" --visible-build false --sensitive true
upsun variable:create --level environment --name SMTP_PASS --value "your-password" --visible-build false --sensitive true
```

### 4. Deploy

```powershell
# Push to deploy
git push upsun main

# Or push current branch
git push upsun HEAD:main
```

### 5. Get Your URL

```powershell
# Get the primary URL
upsun url --primary

# Open in browser
upsun url --primary --browser
```

## Environment Variable Setup

### For Gmail SMTP

```powershell
upsun variable:create --level environment --name SMTP_HOST --value "smtp.gmail.com"
upsun variable:create --level environment --name SMTP_PORT --value "587"
upsun variable:create --level environment --name SMTP_SECURE --value "true"
upsun variable:create --level environment --name SMTP_USER --value "your-email@gmail.com" --sensitive true
upsun variable:create --level environment --name SMTP_PASS --value "your-app-password" --sensitive true
upsun variable:create --level environment --name SMTP_FROM --value "your-email@gmail.com"
```

### For SendGrid

```powershell
upsun variable:create --level environment --name SMTP_HOST --value "smtp.sendgrid.net"
upsun variable:create --level environment --name SMTP_PORT --value "587"
upsun variable:create --level environment --name SMTP_USER --value "apikey"
upsun variable:create --level environment --name SMTP_PASS --value "YOUR_SENDGRID_API_KEY" --sensitive true
upsun variable:create --level environment --name SMTP_FROM --value "verified-sender@yourdomain.com"
```

## Testing Your Deployment

After deployment, test the endpoints:

```powershell
# Get your URL first
$url = upsun url --primary

# Test health check
Invoke-RestMethod -Uri "$url/api/health"

# Test sending email
$body = @{
    to = "test@example.com"
    subject = "Test from Upsun"
    text = "This email was sent from Upsun hosting!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$url/api/send-email" -Method Post -Body $body -ContentType "application/json"
```

## Viewing Logs

```powershell
# Stream logs
upsun log --tail

# View app logs
upsun log app --tail

# View error logs
upsun log error --tail
```

## Managing Your Deployment

```powershell
# List environments
upsun environments

# SSH into your app
upsun ssh

# View environment info
upsun environment:info

# Scale resources
upsun resources:set --size MEDIUM

# View activity
upsun activity:list
```

## Automatic Features on Upsun

✅ **Automatic Host Detection** - The app automatically detects it's running on Upsun and logs:
- Platform project ID
- Application name
- Branch name
- Environment name
- Region

✅ **Auto-scaling** - Upsun handles scaling automatically

✅ **HTTPS** - SSL certificates are automatically provisioned

✅ **CDN** - Built-in CDN for static assets

## Troubleshooting

### App not starting?

```powershell
# Check logs
upsun log app --tail

# SSH in and check
upsun ssh
cd /app
npm install
node server.js
```

### SMTP not working?

```powershell
# Verify environment variables
upsun ssh
echo $SMTP_HOST
echo $SMTP_PORT
```

### Need to redeploy?

```powershell
# Make changes, commit, and push
git add .
git commit -m "Update configuration"
git push upsun main
```

## Project Structure for Upsun

The `.platform.app.yaml` file configures:
- Node.js 18 runtime
- Build and deploy hooks
- Web server configuration
- Route handling for API endpoints
- Static file serving from `/public`

## Both Firebase & Upsun Support

This project supports deployment to both:

### Firebase (Cloud Functions + Hosting)
```powershell
firebase deploy
```

### Upsun (Node.js server)
```powershell
git push upsun main
```

The code automatically detects which platform it's running on and adapts accordingly!
