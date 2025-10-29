# Installation and Setup Guide

This project requires two separate services to run simultaneously: the Next.js application (FE/BE) and the Python Analysis API (AI Service).

## Prerequisites

Ensure you have the following installed:

1.  **Node.js** (v18 or higher) & **npm**
2.  **Python** (v3.10 or higher)
3.  **Prisma CLI** (Installed globally or locally via `npx`)

## Step 1: Clone the Repository and Install Node Dependencies

Open your terminal and execute the following commands in your desired project directory:

```bash
# 1. Clone the repository
git clone https://github.com/pbkk-c/fe-be-pbkk.git
cd <REPO_NAME>

# 2. Install Node.js dependencies
npm install
```

## Step 2: Set up the Python AI Service Environment
The analysis service requires a dedicated environment for Flask and heavy libraries like Playwright.

```bash
# 1. Create a Python virtual environment
python -m venv venv

# 2. Activate the virtual environment:
# --- For Windows PowerShell/CMD ---
.\venv\Scripts\activate

# --- For Linux/macOS/Git Bash ---
source venv/bin/activate

# 3. Install all required Python packages (Flask, Gemini SDK, web scrapers, dotenv)
pip install newspaper3k google-genai lxml_html_clean trafilatura playwright nest_asyncio python-dotenv flask

# 4. Install the required browser binaries for Playwright
python -m playwright install chromium
```

## Step 3: Configure Environment Variables
Create a file named .env in the root directory of the project and populate it with your database and API keys.

```bash
# ----------------------------------------------
# SUPABASE FRONTEND KEYS (NEXT_PUBLIC_ accessible on client side)
# ----------------------------------------------
NEXT_PUBLIC_SUPABASE_URL="<Your Supabase Project URL>"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<Your Supabase Anon Key>"

# ----------------------------------------------
# SUPABASE BACKEND KEYS (Server-side, for Prisma)
# ----------------------------------------------
# DATABASE_URL MUST use the connection pooler port (6543)
DATABASE_URL="postgresql://postgres.<user>:<password>@<host>:6543/postgres"
DIRECT_URL="postgresql://postgres.<user>:<password>@<host>:5432/postgres"

# Optional: Supabase Service Role Key (needed for specific Supabase operations)
SUPABASE_URL="<Your Supabase Project URL>"
SUPABASE_SERVICE_ROLE_KEY="<Your Supabase Service Role Key>"

# ----------------------------------------------
# AI SERVICE CONFIGURATION
# ----------------------------------------------
GEMINI_API_KEY="<YOUR_GEMINI_API_KEY_HERE>"

# This URL tells the Next.js API route where to find the Python analysis service
ANALYSIS_SERVICE_URL="[http://127.0.0.1:5000/analyze](http://127.0.0.1:5000/analyze)"
```

## Step 4: Run the Application (Two Terminals Required)
Terminal 1: Start the Next.js Application
```bash
# Start the Next.js development server
npm run dev
```
Terminal 2: Start the Python Analysis Service
Open a separate terminal window. Navigate to the ai-service folder, activate your Python environment, and start the Flask application.
```bash
# 1. Activate the environment (if not already done in this new terminal)
source venv/bin/activate  # or .\venv\Scripts\activate on Windows

# 2. Navigate to the AI service folder
cd ai-service

# 3. Run the analysis API service on port 5000
python analyze_api.py
```
