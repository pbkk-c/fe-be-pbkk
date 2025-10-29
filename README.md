# 📰 AI News Analyzer Platform

## Project Overview

This is a full-stack news platform built with **Next.js** and **Supabase**, featuring a dedicated **AI News Analyzer** component. The application allows users to submit news URLs for real-time analysis, classifying content into **Facts**, **Opinions**, and potential **Hoaxes** using the **Gemini 2.5 Flash** model.

The architecture is split into two fully decoupled services:

1.  **Next.js Application (Vercel):** The frontend and database-saving backend.
2.  **Python Analysis Service (Hugging Face):** The external, specialized backend for AI inference and web scraping.

### 🏛️ Architecture Breakdown

| Component | Technology | Location | Role |
| :--- | :--- | :--- | :--- |
| **Frontend/Main App** | **Next.js** (TypeScript) | **Vercel** | Handles UI, routing, and proxies analysis requests. |
| **Database/Auth** | **Supabase** (PostgreSQL) | External | Stores user data and managed by the Next.js API. |
| **AI Analysis Service** | **Python (Flask, Playwright)** | **Hugging Face Spaces** | Runs resource-intensive web scraping and Gemini 2.5 Flash analysis. |

---

## 🚀 Getting Started (Local Development Guide)

This guide covers setting up the **Next.js frontend/backend proxy** locally. The AI Analysis Service is assumed to be deployed and running externally on Hugging Face Spaces.

### Prerequisites

Ensure you have the following installed:

1.  **Node.js** (v18 or higher) & **npm**
2.  **Python** (v3.10 or higher) - *Optional, only needed for local development of the Python service.*

### Step 1: Clone the Repository and Install Node Dependencies

Open your terminal and execute the following commands:

```bash
# 1. Clone the repository
git clone [https://github.com/pbkk-c/fe-be-pbkk.git](https://github.com/pbkk-c/fe-be-pbkk.git)
cd fe-be-pbkk # Navigate to the repository directory

# 2. Install Node.js dependencies
npm install
```

### Step 2: Configure Environment Variables
Create a file named .env (or .env.local) in the root directory of the project and populate it with the required connection details.

| Variable | Example Value | Notes |
|-----------|----------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `<Your Supabase Project URL>` | [Client] Public URL for client-side authentication. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<Your Supabase Anon Key>` | [Client] Public key for client-side authentication. |
| `DATABASE_URL` | `postgresql://postgres...@<host>:6543/postgres` | [Server] Prisma connection string. Must use the port 6543 connection pooler. |
| `ANALYSIS_SERVICE_URL` | `https://xoxonn-ai-news-analyzer-api.hf.space/analyze` | [Server] **CRITICAL:** The live, public URL of your Hugging Face API. |
| `GEMINI_API_KEY` | `<Your_Gemini_Key>` | [Server] Required for local testing or debugging. |


### Step 3: Run the Application
Since the AI microservice is already running externally on Hugging Face, you only need one terminal locally:

# Start the Next.js development server
```bash
npm run dev
```
