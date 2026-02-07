# GitHub Deployment Guide

## 🚀 Deploy to GitHub

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Don't initialize with README (since you already have project files)

### Step 2: Initialize Git and Push

```powershell
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Postfix mailer with Firebase and Upsun support"

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Set Up GitHub Secrets

For automated deployment using GitHub Actions, you need to add secrets:

#### For Firebase Deployment

1. Generate Firebase token locally:
```powershell
firebase login:ci
```

2. Copy the token that's displayed

3. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

4. Click **New repository secret** and add:
   - Name: `FIREBASE_TOKEN`
   - Value: [paste the token from step 1]

#### For Upsun Deployment

1. Generate Upsun CLI token:
```powershell
# Login to Upsun
upsun login

# Create API token
upsun auth:api-token-login
```

2. Add to GitHub secrets:
   - Name: `UPSUN_CLI_TOKEN`
   - Value: [your Upsun API token]

3. Add Upsun remote (if not done):
```powershell
# Get your Upsun git URL
upsun project:info

# Add as remote
git remote add upsun YOUR-UPSUN-GIT-URL
```

### Step 4: Configure SMTP Secrets (Optional)

For testing in GitHub Actions, you can add SMTP configuration as secrets:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

### Step 5: Enable GitHub Actions

1. Go to your repository → **Actions** tab
2. You should see the workflow "Deploy Postfix Mailer"
3. It will run automatically on every push to `main` branch

## 📋 What GitHub Actions Will Do

The workflow (`.github/workflows/deploy.yml`) will:

### ✅ On Every Push/PR:
- Run tests with Node.js 18 and 20
- Install dependencies
- Run linter

### 🚀 On Push to main branch:
- **Deploy to Firebase** (if `FIREBASE_TOKEN` is configured)
  - Deploy Cloud Functions
  - Deploy Hosting
  
- **Deploy to Upsun** (if `UPSUN_CLI_TOKEN` is configured)
  - Push to Upsun platform
  - Automatic deployment

## 🔧 Manual Deployment from GitHub

### Deploy to Firebase Manually

```powershell
# Clone repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME

# Install dependencies
npm install
cd functions
npm install
cd ..

# Deploy
firebase deploy
```

### Deploy to Upsun Manually

```powershell
# Add Upsun remote
git remote add upsun YOUR-UPSUN-GIT-URL

# Push to Upsun
git push upsun main
```

## 🌐 GitHub Pages (Optional)

If you want to host the static web UI on GitHub Pages:

1. Go to repository **Settings** → **Pages**
2. Source: Deploy from a branch
3. Branch: `main`, folder: `/public`
4. Save

Note: This will only host the static HTML. For the email sending functionality, you still need Firebase Functions or Upsun backend.

## 🔄 Continuous Deployment Workflow

```
┌─────────────────┐
│  Push to GitHub │
│   (main branch) │
└────────┬────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌────────────────┐    ┌────────────────┐
│ GitHub Actions │    │ GitHub Actions │
│ Test & Lint    │    │ Deploy Jobs    │
└────────┬───────┘    └────────┬───────┘
         │                     │
         ▼                     ├─────────────┐
    ✅ Tests Pass              │             │
                               ▼             ▼
                      ┌─────────────┐  ┌──────────┐
                      │  Firebase   │  │  Upsun   │
                      │ Deployment  │  │Deployment│
                      └─────────────┘  └──────────┘
```

## 📝 Customize Deployment

### Deploy Only to Firebase

Edit `.github/workflows/deploy.yml` and remove the `deploy-upsun` job.

### Deploy Only to Upsun

Edit `.github/workflows/deploy.yml` and remove the `deploy-firebase` job.

### Deploy on Tags Only

Change the workflow trigger:

```yaml
on:
  push:
    tags:
      - 'v*'
```

## 🐛 Troubleshooting

### GitHub Actions Fails

1. Check the Actions tab for error logs
2. Verify secrets are set correctly
3. Ensure Firebase token is valid: `firebase login:ci`

### Firebase Deployment Fails

```powershell
# Test locally first
firebase deploy

# Check Firebase project
firebase projects:list

# Regenerate token
firebase login:ci
```

### Upsun Deployment Fails

```powershell
# Verify Upsun remote
git remote -v

# Test Upsun CLI
upsun projects

# Check project access
upsun project:info
```

## 🔐 Security Best Practices

1. **Never commit secrets** to the repository
   - `.env` files are in `.gitignore`
   - Use GitHub Secrets for sensitive data

2. **Use environment-specific configs**
   - Separate Firebase projects for dev/prod
   - Different Upsun environments

3. **Review pull requests** before merging
   - GitHub Actions runs tests on PRs
   - Deployment only happens on main branch

## 📊 Monitoring Deployments

### Firebase

View logs:
```powershell
firebase functions:log
```

Or check [Firebase Console](https://console.firebase.google.com/project/cloud-cd92d/functions)

### Upsun

View deployments:
```powershell
upsun activity:list
upsun log app
```

Or check Upsun dashboard

## 🎯 Next Steps

1. ✅ Push code to GitHub
2. ✅ Add required secrets
3. ✅ Watch GitHub Actions deploy automatically
4. ✅ Test your deployed application
5. ✅ Set up branch protection rules (optional)
6. ✅ Configure webhooks for notifications (optional)

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase CI/CD](https://firebase.google.com/docs/hosting/github-integration)
- [Upsun Git Integration](https://docs.upsun.com/development/git.html)
