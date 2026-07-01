# CareerConnect AI - Job Board Platform

CareerConnect AI is a production-grade, full-stack job board platform designed to connect talented job seekers with world-class employers using smart role-based dashboards and dynamic analytics.

---

## 🚀 Key Features

* **SaaS Design Aesthetics:** Premium typography (Outfit/Inter), light and dark mode toggles, smooth custom scrollbars, and dynamic glassmorphism components.
* **Role-Based Workflows:** Distinct candidate dashboards (application status, bookmarking, profile building) and employer workspaces (postings management, candidate shortlist actions, volume charts).
* **Automatic Local Fallbacks:**
  * **Database:** Runs PostgreSQL in production; automatically falls back to a local SQLite database for instant local development if postgres variables are empty.
  * **File Storage:** Seamlessly uploads candidates' resumes to Cloudinary when credentials are active; falls back to secure local media files if Cloudinary is not configured.
* **Security First:** Guarded React routes, JWT authentication with auto-refresh on `401`, and object-level permissions (e.g. edit/delete restricted to posters).
* **Automated Tests:** Comprehensive unit and integration coverage for API endpoints, registration rules, custom views, and React components.

---

## 🛠️ Architecture & Tech Stack

* **Backend:** Python 3.11, Django 4.x, Django REST Framework, JWT (SimpleJWT), Django Filters.
* **Frontend:** React 18, React Router v6, Axios, Tailwind CSS v3, React Hook Form, Context API.
* **Testing:** Pytest (Django API tests), Vitest & JSDOM (React Component tests).
* **Deployment:** Docker & Docker-Compose multi-stage configurations.

---

## ⚙️ Quick Start

### 1. Local Backend Setup
1. Open a command line in the `backend/` directory.
2. Initialize virtual environment and install packages:
   ```bash
   py -3.11 -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Run migrations and start development server:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py runserver
   ```
   The backend API will run on `http://localhost:8000/`.
   * **API Docs Interface:** Access `http://localhost:8000/` or `http://localhost:8000/api/docs` in your browser.

### 2. Local Frontend Setup
1. Open a command line in the `frontend/` directory.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
   The React web app will run on `http://localhost:5173/`.

### 3. Run Automated Tests
* **Backend Pytest Suite:**
  In the `backend/` folder (with activated virtual env), run:
  ```bash
  pytest tests/ -v
  ```
* **Frontend Vitest Suite:**
  In the `frontend/` folder, run:
  ```bash
  npm run test
  ```

---

## 🐋 Docker Compose Deployment (Production Configuration)

To run the complete containerized stack (PostgreSQL + Django API + React served via Nginx):
1. In the root directory, create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
2. Build and launch containers:
   ```bash
   docker-compose up --build
   ```
3. Run migrations inside the docker container:
   ```bash
   docker-compose exec backend python manage.py migrate
   ```
   The React application will be served at `http://localhost/` and the Django REST API on `http://localhost/api/`.

---

## 📍 API Reference

All routes are fully documented at `http://localhost:8000/api/docs` with payload models:

* **Authentication:**
  * `POST /api/auth/register` - Create candidate or employer account.
  * `POST /api/auth/login` - Obtain JWT Token Pair.
  * `POST /api/auth/refresh` - Refresh access tokens.
* **Jobs:**
  * `GET /api/jobs` - Search, filter, and order job listings.
  * `POST /api/jobs` - Create postings (Employers).
  * `DELETE /api/jobs/:id` - Delete postings (Job Owner).
* **Profiles:**
  * `GET /api/profile` - Unified endpoint to fetch profile data.
  * `PUT /api/profile` - Update fields (supports resume/avatar upload).
* **Applications:**
  * `POST /api/applications` - Submit resume and cover letter (Candidates).
  * `PUT /api/applications/:id` - Update status (Employers only).
* **Dashboard:**
  * `GET /api/dashboard` - Visual stat metrics and charts loader.
