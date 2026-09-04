# SmartStudy AI

A Class 1 adaptive-learning application with a React web app and a Laravel API backed by MySQL.

## MVP features
- React + TypeScript child learning UI
- Separate Student and Teacher portals with dedicated role logins
- Reference Learning Charts with audio recitals and practice progress tracking:
  - 🔢 **Multiplication Tables 2–10** (interactive equation rows & auto-spoken recitals)
  - 🕉️ **Marathi Swar & 14khadi (चौदाखडी)** (vowels, matras, transliteration, and audio)
  - 🪷 **Marathi Vyanjan (व्यंजने - क ते ज्ञ)** (36 consonants with phonics, example words, and recitals)
  - 🔤 **English Alphabet (Aa–Zz)** (big and small pairs, phonics, vowel filters)
- Laravel 10 REST API backed by MySQL
- Schema migrations, seeder data, and chart progress tracking
- Exercise generation endpoint
- Attempt recording and mastery calculation
- Mistake/misconception analysis and intervention suggestions
- School worksheet ingestion API contract (stub for vision/LLM integration)

## Quick Start (Running with Laragon)

### Requirements on Windows
- **Laragon** with PHP 8.1+ & MySQL running
- **Node.js 20+**

> Ensure MySQL is running: Open Laragon and click **Start All** (default database: `smartstudy`, port: `3306`, user: `root`, password: empty).

---

### Option 1: 1-Click Launcher (Easiest)

Double-click [`start-app.bat`](./start-app.bat) in the project root (or run `.\start-app.bat` in your terminal).

**What it does:**
- Automatically locates your Laragon PHP installation (`C:\laragon\bin\php\...`).
- Launches the Laravel API backend on [http://127.0.0.1:8000](http://127.0.0.1:8000).
- Launches the React frontend on [http://localhost:5173](http://localhost:5173).
- Opens the application in your default web browser.

---

### Option 2: Using Laragon's Built-In "Terminal"

Laragon's **Terminal** button automatically pre-configures `php`, `composer`, `mysql`, and `node` in your path:

1. In Laragon, click **Start All**, then click **Terminal**.
2. **Terminal 1 (Backend API)**:
   ```bash
   cd apps/api-laravel
   php artisan serve --port=8000
   ```
3. **Terminal 2 (Frontend Web)**:
   ```bash
   cd apps/web
   npm run dev
   ```

---

### Option 3: From Standard VS Code / PowerShell

If running in a standard PowerShell session where `php` is not globally registered in Windows PATH:

- **Backend (Terminal 1)**:
  ```powershell
  cd apps\api-laravel
  & "C:\laragon\bin\php\php-8.1.10-Win32-vs16-x64\php.exe" artisan serve --host=127.0.0.1 --port=8000
  ```
- **Frontend (Terminal 2)**:
  ```powershell
  npm run dev:web
  ```

---

### Key URLs & Demo Logins
- **Web App**: [http://localhost:5173](http://localhost:5173)
- **API Health**: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)
- **Learning Charts API**: [http://127.0.0.1:8000/api/learning-charts](http://127.0.0.1:8000/api/learning-charts)

| Role | Login Identifier | Password / ID |
| :--- | :--- | :--- |
| **Teacher** | `teacher@smartstudy.ai` | `password123` |
| **Student** | Username: `demo_child` | Or select Demo Child in UI |

---

### Database Setup & Migrations

To run or re-run database migrations and curriculum/chart seeders:

From `apps/api-laravel` (in Laragon Terminal):
```bash
php artisan migrate --seed
```

Or from root via PowerShell:
```powershell
& "C:\laragon\bin\php\php-8.1.10-Win32-vs16-x64\php.exe" apps/api-laravel/artisan migrate --seed
```

The MVP works without an LLM: deterministic exercise generation and mistake analysis are included. Add an Ollama-compatible model later through the AI adapter.

## Architecture
- `packages/learning-engine`: mastery and mistake logic
- `packages/exercise-engine`: deterministic Class 1 exercise generation
- `packages/ai`: future Ollama/vision adapter
- `database`: legacy PostgreSQL schema and seed
- `apps/api-laravel`: current Laravel REST API
- `apps/api`: legacy Node.js REST API
- `apps/web`: child-first React UI

## Optional Podman MySQL

Podman can replace Laragon's MySQL service:

```powershell
podman machine start
podman compose up -d mysql
```

Do not run Laragon MySQL and Podman MySQL on port `3306` at the same time.

## Legacy Node API

The original Node/PostgreSQL API remains in `apps/api` for reference. It runs on port `3000` and is not required for the current React/Laravel setup.
