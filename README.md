# 📰 AI News Analyzer Platform

## Project Overview

This is a full-stack news platform built with **Next.js** and **Supabase**, featuring a dedicated **AI News Analyzer** component. The application allows users to submit news URLs for real-time analysis, classifying content into **Facts**, **Opinions**, and potential **Hoaxes** using the **Gemini 2.5 Flash** model.

The architecture is split into two co-dependent services running locally :

1.  **Next.js Application:** Handles the user interface, routing, authentication, and acts as an **API proxy** for the analysis.
2.  **Python Analysis Service:** A dedicated, isolated **Flask microservice** that handles complex tasks like web scraping and AI inference.

### 🏛️ Architecture Breakdown

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend/Main App** | Next.js (TypeScript) | Handles UI, routing, user authentication, and profile management. |
| **Database/Auth** | Supabase (PostgreSQL) | Stores user data, analysis history, and persistent configurations. |
| **API Proxy** | Next.js API Routes | Receives client requests (`/api/analyze`) and proxies them to the Python Analysis Service. |
| **AI Analysis Service** | Python (Flask) | Runs the web scraping (Playwright) and the Gemini 2.5 Flash analysis logic. |

---

## 🚀 Getting Started

**⚠️ IMPORTANT:** This project requires **two separate processes** (the Next.js app and the Python service) to be running simultaneously to function.

### 1. Detailed Installation and Setup

Before running the application, you must set up both the Node.js and Python environments. This includes installing dependencies, activating the virtual environment, and installing the necessary Chromium browser for Playwright.

➡️ **For detailed, step-by-step instructions, please see the [INSTALLATION.md](INSTALLATION.md) file.**

### 2. Configuration (`.env` File)

Ensure you have created a **`.env`** file in the project root containing all required secret keys and connection URLs:

| Variable | Purpose |
| :--- | :--- |
| `GEMINI_API_KEY` | Required by the Python Analysis Service for AI inference. |
| `DATABASE_URL` | Required by Next.js/Prisma for connecting to Supabase (must use **port 6543** connection pooler). |
| `NEXT_PUBLIC_SUPABASE_*` | Required by the client for authentication and API calls. |
| `ANALYSIS_SERVICE_URL` | Required by the Next.js API to locate the Python service (`http://127.0.0.1:5000/analyze`). |

### 3. Running the Application

| Terminal | Role | Command |
| :--- | :--- | :--- |
| **Terminal 1** | **Next.js App (FE/BE)** | `npm run dev` |
| **Terminal 2** | **Python AI Service** | **Activate VENV** then: `cd ai-service && python analyze_api.py` |

---

## 📦 Core Technologies

* **Frontend:** [Next.js](https://nextjs.org/) (App Router)
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
* **AI/LLM:** Gemini 2.5 Flash
* **Analysis Backend:** Python / Flask
* **Data Extraction:** Playwright, Trafilatura, Newspaper3k

## 🤝 Contribution

[Describe how other developers can contribute to your repository, e.g., pull requests, issue reporting, etc.]

## 📄 License

[Specify the license under which your project is distributed, e.g., MIT, GPL, etc.]
