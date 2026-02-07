# Quick Setup Guide

Follow these steps to get your Postfix Mailer up and running:

## Step 1: Install Dependencies

```powershell
# Install root dependencies
npm install

# Install function dependencies
cd functions
npm install
cd ..
```

## Step 2: Configure Firebase Project

1. Edit `.firebaserc` and replace `your-project-id` with your actual Firebase project ID
2. If you don't have a Firebase project, create one at https://console.firebase.google.com/

## Step 3: Configure SMTP

### Option A: Using Local Postfix (if installed)

```powershell
firebase functions:config:set smtp.host="localhost" smtp.port="25" smtp.secure="false" smtp.from="noreply@yourdomain.com"
```

### Option B: Using Gmail

```powershell
firebase functions:config:set smtp.host="smtp.gmail.com" smtp.port="587" smtp.secure="true"
firebase functions:config:set smtp.user="your-email@gmail.com" smtp.pass="your-app-password"
firebase functions:config:set smtp.from="your-email@gmail.com"
```

Note: For Gmail, you need to create an "App Password" in your Google Account settings.

### Option C: Using SendGrid

```powershell
firebase functions:config:set smtp.host="smtp.sendgrid.net" smtp.port="587"
firebase functions:config:set smtp.user="apikey" smtp.pass="YOUR_SENDGRID_API_KEY"
firebase functions:config:set smtp.from="verified-sender@yourdomain.com"
```

## Step 4: Test Locally (Optional)

```powershell
# Start Firebase emulators
firebase emulators:start
```

Then visit http://localhost:5000 to test the web interface.

## Step 5: Deploy to Firebase

```powershell
# Deploy everything
firebase deploy

# Or deploy only functions
firebase deploy --only functions

# Or deploy only hosting
firebase deploy --only hosting
```

## Step 6: Get Your URL

After deployment, Firebase will provide URLs like:
- Hosting: `https://your-project-id.web.app`
- Functions: `https://us-central1-your-project-id.cloudfunctions.net/sendEmail`

## Step 7: Test Your Deployment

Visit your hosting URL to use the web interface, or test with curl:

```powershell
curl -X POST https://us-central1-your-project-id.cloudfunctions.net/sendEmail `
  -H "Content-Type: application/json" `
  -d '{\"to\":\"test@example.com\",\"subject\":\"Test\",\"text\":\"Hello!\"}'
```

## Need Help?

Check the full README.md for detailed documentation and troubleshooting.
