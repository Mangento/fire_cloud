# 🚀 Quick GitHub Deployment

## Step-by-Step Guide (5 minutes)

### 1️⃣ Create GitHub Repository

Go to https://github.com/new and create a new repository. **Don't** initialize with README.

### 2️⃣ Push Your Code

```powershell
# In your project folder (F:\upsun1)
git init
git add .
git commit -m "Initial commit: Postfix mailer"

# Add your GitHub repository (replace with your URL)
git remote add origin https://github.com/YOUR-USERNAME/postfix-mailer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3️⃣ Set Up GitHub Secrets (For Auto-Deployment)

#### Firebase Deployment Secret

```powershell
# Generate Firebase token
firebase login:ci
```

Copy the token, then:

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `FIREBASE_TOKEN`
4. Value: [paste your token]
5. Click **Add secret**

#### Upsun Deployment Secret (Optional)

1. Add another secret
2. Name: `UPSUN_CLI_TOKEN`
3. Value: [your Upsun API token from `upsun auth:api-token-login`]

### 4️⃣ Enable GitHub Actions

1. Go to your repo → **Actions** tab
2. You'll see "Deploy Postfix Mailer" workflow
3. It's now enabled and will run on every push!

### 5️⃣ Make a Change and Watch

```powershell
# Make a small change
echo "# Deployed via GitHub" >> README-GITHUB.md

# Commit and push
git add .
git commit -m "Test deployment"
git push
```

Go to **Actions** tab and watch your deployment! 🎉

## 🎯 What Happens Automatically

Every time you push to GitHub:

1. ✅ Code is tested on Node.js 18 & 20
2. ✅ Linter checks code quality
3. 🚀 Deploys to Firebase (if token is set)
4. 🚀 Deploys to Upsun (if token is set)

## 📝 Quick Commands

### Clone on Another Machine

```powershell
git clone https://github.com/YOUR-USERNAME/postfix-mailer.git
cd postfix-mailer
npm install
cd functions && npm install && cd ..
npm start
```

### Update Deployed Version

```powershell
# Make your changes, then:
git add .
git commit -m "Your change description"
git push
# GitHub Actions automatically deploys!
```

### Manual Deploy from GitHub

```powershell
# Clone repo
git clone https://github.com/YOUR-USERNAME/postfix-mailer.git
cd postfix-mailer

# Deploy to Firebase
firebase deploy

# Or deploy to Upsun
git remote add upsun YOUR-UPSUN-GIT-URL
git push upsun main
```

## 🔍 Check Deployment Status

1. Go to your repo → **Actions** tab
2. Click on the latest workflow run
3. See detailed logs of each step

## ✨ That's It!

Your Postfix mailer is now on GitHub with automatic deployment! 🎊

For more details, see [GITHUB-DEPLOY.md](GITHUB-DEPLOY.md)
