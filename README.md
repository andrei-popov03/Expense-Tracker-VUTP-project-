**# Expense-Tracker-VUTP-project-**

A full-stack web application for tracking and analyzing personal finances, with multi-currency support. Users can record income and expenses, set monthly budget limits, manage recurring transactions, and export their financial data — all secured with JWT-based authentication.

This project was developed as a diploma thesis at the University of Telecommunications and Post, Sofia.

**Features:**
  
  Secure authentication - user registration and login with JWT tokens and PBKDF2-SHA256 password hashing
  Income & expense tracking - a unified form for adding transactions across dynamic categories
  Multi-currency support - BGN, EUR, and USD, with conversion at display time
  Monthly summary - income, expense, and balance overview for any selected month
  Budget limits - set a monthly budget with a three-state progress bar (normal / warning / over)
  Recurring transactions - templates for regular income and expenses (weekly, monthly, yearly) with manual apply
  Transaction history - six combinable filters (type, date range, category, amount range)
  Data export - download transaction history as CSV or PDF

**Tech Stack**

Frontend:
  - React 19
  - Vite
  - React Router DOM
  - jsPDF & jspdf-autotable (PDF export)

Backend:
  - Python 3 with Flask
  - SQLAlchemy (ORM)
  - Flask-JWT-Extended (authentication)
  - Flask-Migrate / Alembic (database migrations)
  - Flask-CORS

Database:
  - PostgreSQL

Tooling:
  - Docker (containerization)
  - Git & GitHub (version control)
  - Postman (API testing)
  - DBeaver (database management)

**Architecture**

The application follows a classic three-tier client–server architecture:

  - Presentation layer (client) - a React single-page application running in the browser
  - Server layer - a Flask REST API handling business logic, validation, and authentication
  - Data layer - a PostgreSQL database storing all user data

The client communicates with the server through REST requests, exchanging data in JSON format. Authentication uses JWT tokens, and the user's identity is always derived from the signed token rather than the request body, ensuring users can only access their own data.

**Getting Started**

Prerequisites: 
  - Python 3.10+
  - Node.js 18+
  - PostgreSQL 16
  - (Optional) Docker

**Backend setup**

Create and activate a virtual environment
  python -m venv env_tracker
  .\env_tracker\Scripts\Activate.ps1   for - Windows
  source env_tracker/bin/activate    for - Linux / macOS

Install dependencies
  pip install -r requirements.txt

Create a .env file (see .env.example) with:
   SECRET_KEY=...
   JWT_SECRET_KEY=...
   SQLALCHEMY_DATABASE_URI=postgresql://user:password@localhost:5432/expense_tracker

Apply database migrations
  flask db upgrade

Run the server (default: http://localhost:5000)
  flask run


**Frontend setup**

Install dependencies
  npm install

Start the development server (default: http://localhost:5173)
  npm run dev


**Running with Docker**

docker-compose up -d --build

This starts the backend, frontend, and PostgreSQL database together. Use docker-compose down to stop all services.

**Security**
  
  - Passwords are hashed with PBKDF2-SHA256 (600,000 iterations, per-password salt) - never stored as plain text
  - Authentication is handled via stateless JWT tokens
  - User identity is always extracted from the signed token, never from the request body, ensuring full data isolation
  - Sensitive configuration (secret keys, database credentials) is kept in a .env file, excluded from version control
  - All database access goes through SQLAlchemy's parameterized queries, protecting against SQL injection

**Future Improvements**
  
  - Graphical data visualization (charts and diagrams)
  - Automatic application of recurring transactions via a scheduled job
  - Dynamic exchange rates fetched from an external API (e.g. BNB or ECB)
  - Mobile application (React Native)
  - Shared family budgets

**Author**

Andrey Popov — Computer Technologies, University of Telecommunications and Post, Sofia, 2026.
