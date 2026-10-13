# 🚂 Deploying TechResolve AI to Railway

This guide walks you through deploying **TechResolve AI** to [Railway](https://railway.com) in just a few clicks.

TechResolve AI is fully containerized and production-ready with a multi-stage `Dockerfile`. When deployed, Railway compiles both the **React 19 Frontend** and the **FastAPI Backend** into a single container that runs on one port—eliminating all CORS problems!

---

## 🌟 Method 1: Deploy via GitHub (Recommended & Simplest)

This is the standard, 100% automated method with continuous deployment on every git push.

### Step 1: Push your code to GitHub

If you haven't already created a GitHub repository for this project:

1. Go to [github.com/new](https://github.com/new) and create a new repository named `techresolve-ai` (Public or Private).
2. Open PowerShell in this project folder and run:

```powershell
# Link your remote GitHub repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/techresolve-ai.git

# Push the main branch
git push -u origin main
```

---

### Step 2: Create a New Project on Railway

1. Go to [railway.com](https://railway.com) and log in (or create a free account with GitHub).
2. Click **"+ New Project"** in the top right corner.
3. Select **"Deploy from GitHub repo"**.
4. Choose your `techresolve-ai` repository.
5. Click **"Deploy Now"**.

> 💡 **Automatic Detection**: Railway will automatically detect the root `Dockerfile` and `railway.json`. It will compile the React frontend, set up Python 3.12, install all dependencies, and launch FastAPI!

---

### Step 3: Generate a Public Domain

By default, Railway services do not have a public web URL until you generate one:

1. Click on your deployed **TechResolve AI** card in your Railway project canvas.
2. Go to the **"Settings"** tab.
3. Scroll down to the **"Networking"** section.
4. Click **"Generate Domain"** (or add your custom domain).
5. Railway will provide a link like:
   `https://techresolve-ai-production-xxxx.up.railway.app`
6. Click the link to open your live application! 🎉

---

### Step 4: (Optional) Configure Environment Variables

In your Railway project service, go to the **"Variables"** tab and add any of these optional settings:

| Variable | Recommended Value | Description |
|---|---|---|
| `GEMINI_API_KEY` | `AIzaSy...` | *(Optional)* Your Google Gemini API key for live AI diagnostics. If omitted, the built-in rule engine operates automatically. |
| `GEMINI_MODEL` | `gemini-2.5-flash` | *(Optional)* Gemini model name. |
| `SECRET_KEY` | Any random 32+ char string | *(Optional)* Custom key for signing JWT tokens. |

*(Note: `PORT` is automatically injected by Railway—you don't need to configure it!)*

---

### Step 5: (Optional) Persist Data Across Redeployments

TechResolve AI works out of the box with SQLite. If you want user sessions and history to persist permanently across new code redeploys, you have two options:

#### Option A: Attach a Railway Volume (Retains SQLite file)
1. In your Railway service settings, go to the **"Volumes"** section.
2. Click **"Add Volume"**.
3. Set the Mount Path to: `/app/backend`.
4. Click Save. Now `techresolve.db` and uploaded screenshots survive all redeploys!

#### Option B: Add a Railway PostgreSQL Database
1. In your Railway project, click **"+ Create"** -> **"Database"** -> **"Add PostgreSQL"**.
2. Railway will automatically populate the `DATABASE_URL` variable in your project.
3. TechResolve AI automatically detects PostgreSQL and connects without any code changes!

---

## 💻 Method 2: Deploy directly via Railway CLI

If you prefer deploying straight from your terminal without connecting GitHub:

### Step 1: Install Railway CLI
```powershell
npm install -g @railway/cli
```

### Step 2: Login to Railway
```powershell
railway login
```
*(This opens a browser tab for you to authenticate).*

### Step 3: Initialize and Link Project
```powershell
railway init
```
*(Choose "Create new project" and name it `techresolve-ai`).*

### Step 4: Deploy
```powershell
railway up
```

### Step 5: Generate a Public URL
```powershell
railway domain
```
Railway will print your live URL. You can also view logs live at any time with:
```powershell
railway logs
```

---

## 🔍 Verification & Health Checks

Once deployed, you can verify your service health at:
- **Web App**: `https://your-domain.up.railway.app`
- **Health Check API**: `https://your-domain.up.railway.app/api/health`
- **Interactive API Docs**: `https://your-domain.up.railway.app/docs`
- **CMD Helper Library**: Accessible directly from the top navigation bar!
