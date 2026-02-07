# Firebase Deployment Fix Guide

## ✅ Fixed Issues

I've fixed the Firebase deployment configuration:

1. ✅ Updated `firebase.json` to use Cloud Functions v2 format
2. ✅ Added `.gcloudignore` to prevent server.js from being deployed
3. ✅ Added `Dockerfile` for Cloud Run deployment (alternative)
4. ✅ Fixed server.js to listen on 0.0.0.0 with proper error handling
5. ✅ Specified Node.js 18 runtime explicitly

## 🚀 Deploy to Firebase (Recommended)

### Step 1: Clean Previous Deployment

```powershell
# Make sure you're in the project directory
cd F:\upsun1

# Pull latest changes from GitHub (already done)
git pull
```

### Step 2: Deploy Functions Only

```powershell
# Deploy only Cloud Functions (not hosting)
firebase deploy --only functions

# Or deploy everything
firebase deploy
```

### Step 3: If Still Getting Errors

If you still get the Cloud Run error, try this:

```powershell
# Delete the backend service that was created
firebase functions:delete backend --force

# Then deploy again
firebase deploy --only functions
```

## 🐋 Alternative: Deploy as Cloud Run (Advanced)

If you prefer to use Cloud Run instead of Cloud Functions:

### Option A: Using Firebase Hosting + Cloud Run

1. Build and deploy as Cloud Run:

```powershell
# Build Docker image
gcloud builds submit --tag gcr.io/cloud-cd92d/postfix-mailer

# Deploy to Cloud Run
gcloud run deploy postfix-mailer `
  --image gcr.io/cloud-cd92d/postfix-mailer `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars SMTP_HOST=smtp.gmail.com,SMTP_PORT=587
```

2. Update firebase.json to use Cloud Run:

```json
{
  "hosting": {
    "public": "public",
    "rewrites": [{
      "source": "/api/**",
      "run": {
        "serviceId": "postfix-mailer",
        "region": "us-central1"
      }
    }]
  }
}
```

### Option B: Deploy Functions Only (Recommended)

Keep the current configuration and just deploy functions:

```powershell
firebase deploy --only functions
```

## 🔍 Check Deployment Status

### View Functions

```powershell
# List deployed functions
firebase functions:list

# View function logs
firebase functions:log
```

### Test Deployed Functions

```powershell
# Replace with your actual Firebase hosting URL
$url = "https://cloud-cd92d.web.app"

# Test health check
Invoke-RestMethod -Uri "$url/api/health"

# Test email sending
$body = @{
    to = "test@example.com"
    subject = "Test from Firebase"
    text = "Hello from Firebase Functions!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$url/api/send-email" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

## ⚙️ Configure SMTP

Before testing, set your SMTP configuration:

```powershell
# For Gmail
firebase functions:config:set `
  smtp.host="smtp.gmail.com" `
  smtp.port="587" `
  smtp.secure="true" `
  smtp.user="your-email@gmail.com" `
  smtp.pass="your-app-password" `
  smtp.from="your-email@gmail.com"

# Redeploy after config change
firebase deploy --only functions
```

## 🐛 Troubleshooting

### Error: "container failed to start"

This happens when Firebase tries to deploy as Cloud Run. Fix:

```powershell
# Check if there's a backend service
gcloud run services list --project=cloud-cd92d

# Delete it if exists
gcloud run services delete backend --region=us-central1 --project=cloud-cd92d

# Deploy functions instead
firebase deploy --only functions
```

### Error: "Function not found"

```powershell
# Check your functions
firebase functions:list

# Ensure functions/index.js exports are correct
# Should have: exports.sendEmail and exports.healthCheck
```

### Error: "Permission denied"

```powershell
# Login again
firebase login

# Select correct project
firebase use cloud-cd92d
```

## 📊 Expected Output

After successful deployment:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/cloud-cd92d/overview
Hosting URL: https://cloud-cd92d.web.app

Functions:
  sendEmail(us-central1): https://us-central1-cloud-cd92d.cloudfunctions.net/sendEmail
  healthCheck(us-central1): https://us-central1-cloud-cd92d.cloudfunctions.net/healthCheck
```

## ✅ Verify Deployment

Visit these URLs:

1. **Web Interface**: https://cloud-cd92d.web.app
2. **Health Check**: https://cloud-cd92d.web.app/api/health
3. **Direct Function**: https://us-central1-cloud-cd92d.cloudfunctions.net/healthCheck

## 🎯 Recommended Approach

**Use Cloud Functions** (current setup):
- ✅ Easier to configure
- ✅ Better Firebase integration
- ✅ Automatic scaling
- ✅ Pay only for execution time

**Use Cloud Run** (requires Docker):
- Good for complex applications
- More control over environment
- Can run locally with Docker
- Requires manual container builds

## 📝 Summary

1. **Pull latest changes**: `git pull` (already done)
2. **Configure SMTP**: `firebase functions:config:set ...`
3. **Deploy**: `firebase deploy --only functions`
4. **Test**: Visit https://cloud-cd92d.web.app/api/health

The error you encountered was because Firebase was trying to deploy server.js as a Cloud Run container. The fixes prevent this and ensure only Cloud Functions are deployed.
