# TechResolve AI 🛠️
> **Intelligent, Beginner-Friendly IT Troubleshooting Assistant**  
> *"Never make the user figure everything out alone. Explain what is happening, show what to do next, and wait for the user's result before moving forward."*

---

## 🌟 Overview

**TechResolve AI** is a full-stack IT troubleshooting application built for students, office workers, beginners, and anyone dealing with technology issues without overwhelming technical jargon. It acts as a patient, encouraging, and experienced IT technician guiding users through problems one simple step at a time.

### Key Capabilities

- **Laptops & Computers**: Sudden shutdowns, battery dying when unplugged, loud fans, overheating.
- **Windows Battery Diagnostics**: Built-in parser for `powercfg /batteryreport` extracting Design Capacity, Full Charge Capacity, Cycle Count, and calculating wear % in plain English.
- **Internet & Network**: Wi-Fi connected with no internet, DNS cache flushing, IP stack resets.
- **System Performance**: Slow startup, 100% disk/CPU diagnosis, startup app cleanup.
- **Software & Applications**: Apps crashing or refusing to open, frozen background tasks, admin rights.
- **Printers & Devices**: Printer offline, Print Spooler restart, queue unblocking.
- **Programming & Databases**: Port already in use (`EADDRINUSE`), connection refused, environment issues.
- **Mode Switching**: Toggle between **Beginner Mode** (plain everyday English) and **IT Professional Mode** (CLI commands, stack traces, and system internals) at any time.
- **Screenshot & File Assistance**: Upload error screenshots, battery reports, or system logs with an automated privacy check.
- **Interactive Knowledge Base**: Library of IT guides with a 1-click **"Guide Me Interactively"** button that turns any article into a live step-by-step wizard.
- **Saved Reports & History**: Dashboard with session tracking, statuses (*Not Started*, *In Progress*, *Solved*, *Needs Further Help*), and printable diagnostic summaries.

---

## 🏗️ Architecture

```
TechResolve AI/
├── backend/                  # FastAPI & Python backend
│   ├── app/
│   │   ├── ai/               # Gemini Cloud AI & Expert Diagnostic Trees
│   │   ├── routes/           # REST endpoints (auth, sessions, upload, knowledge, settings)
│   │   ├── services/         # Diagnostic Engine, Battery Parser, Knowledge Base
│   │   ├── models.py         # SQLAlchemy models (User, Session, Message, Upload, Article)
│   │   ├── schemas.py        # Pydantic V2 schemas (strict 6-part wizard format)
│   │   ├── database.py       # SQLite / PostgreSQL DB connection
│   │   ├── config.py         # Environment settings
│   │   └── main.py           # FastAPI entry point
│   ├── tests/                # Automated pytest suite (100% passing)
│   ├── requirements.txt      # Python dependencies
│   └── run.py                # Backend development launcher
├── frontend/                 # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/       # Navbar, HomeView, WizardView, DashboardView, KnowledgeView, SettingsView, AuthModal
│   │   ├── api.ts            # Typed API client
│   │   ├── types.ts          # Comprehensive TypeScript interfaces
│   │   ├── App.tsx           # State management & views
│   │   └── index.css         # Tailwind styles & theme variables
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+** (tested on Python 3.13)
- **Node.js 18+** & **npm**

### 2. Backend Setup
```bash
# In the project root directory
cd backend

# Install dependencies (already pre-installed in this environment)
pip install -r requirements.txt

# Run the backend server (runs on http://127.0.0.1:8000)
python run.py
```

### 3. Frontend Setup
```bash
# In a new terminal window
cd frontend

# Install dependencies
npm install

# Run Vite development server (runs on http://localhost:5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Running Automated Tests

TechResolve AI includes a comprehensive automated test suite covering:
- Authentication & JWT security
- Windows battery report HTML & text parser
- Step-by-step diagnostic reasoning engine
- Knowledge base search & article execution
- File upload handling

Run the tests anytime from the `backend/` folder:

```bash
cd backend
python -m pytest tests/ -v
```

All 8 tests pass cleanly.

---

## ⚙️ Environment Variables (Optional)

Create a `.env` file in `backend/`:

```env
# Security
SECRET_KEY=your-production-secret-key-here

# Database (defaults to SQLite, supports PostgreSQL in production)
DATABASE_URL=sqlite:///./techresolve.db
# Or PostgreSQL:
# DATABASE_URL=postgresql://username:password@localhost:5432/techresolve

# Google Gemini API Key (Optional)
# If omitted, TechResolve AI seamlessly uses its built-in Expert Rule-Based Diagnostic Engine!
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-flash
```

---

## 🛡️ Safety & Privacy Standards

1. **No Destructive Operations**: Dangerous commands that format disks or wipe directories are never suggested.
2. **Lithium-Ion Safety**: If swollen, smoking, or bulging batteries are reported, users are immediately alerted to disconnect the charger and seek certified repair.
3. **Privacy First**: Pre-upload reminders prompt users to check for personal keys or passwords.
