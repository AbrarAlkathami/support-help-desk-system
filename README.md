# Support Helpdesk Ticketing System

A full-stack internal helpdesk application for managing support tickets with role-based access for users, moderators, and admins.

## Backend Setup

### 1. Go to the backend directory

```bash
cd backend
```

### 2. Install dependencies

Make sure Poetry is installed, then run:

```bash
poetry install
```

### 3. Run the FastAPI server

```bash
poetry run uvicorn backend.main:app --reload --app-dir src
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

for setting up env varibales

```bash
cp .env.example .env
```
