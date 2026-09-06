# Support Helpdesk Ticketing System

A full-stack support helpdesk ticketing system built for the PwC Middle East Associate Frontend case study.

The application provides three role-specific experiences:

- **User** — creates and tracks personal support tickets
- **Moderator** — manages the shared support queue, ticket assignments, priorities, statuses, and conversations
- **Admin** — manages accounts and categories, monitors ticket metrics, and has access to the shared ticket queue

The project focuses on role-based access control, server-side ticket filtering and pagination, deliberate frontend state management, and a responsive dashboard experience.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Recharts

### Backend

- FastAPI
- Python
- SQLAlchemy
- SQLite
- Alembic
- Poetry
- JWT authentication using HttpOnly cookies

---

## Features

### User

Users can:

- Log in and keep their authenticated session across page refreshes
- Create support tickets
- View their own tickets
- Search and filter their tickets
- Track ticket status
- Open ticket details
- View ticket conversation history
- Add comments to their own tickets

Users cannot access tickets belonging to other regular users.

### Moderator

Moderators can:

- View the shared ticket queue
- Search tickets
- Filter tickets by status
- Filter tickets by priority
- Filter tickets by category
- Filter tickets by assignee
- View assigned-to-me tickets
- View unassigned tickets
- Sort tickets
- Change page size
- Navigate paginated results
- Assign and reassign tickets
- Assign tickets to themselves
- Update ticket status
- Update ticket priority
- View ticket details
- Reply to ticket conversations
- View queue summary information including:
  - Unassigned tickets
  - Assigned-to-me tickets
  - Overdue tickets

### Admin

Admins can:

- Access the shared ticket queue
- View all tickets
- Assign and reassign tickets
- Update ticket status
- Update ticket priority
- Create accounts
- Activate and deactivate accounts
- Change account roles
- Manage ticket categories
- View system metrics
- View ticket distribution by status
- View ticket distribution by category

---

## Project Structure

```text
support-help-desk-system/
├── backend/
│   ├── src/
│   │   └── backend/
│   ├── alembic/
│   ├── pyproject.toml
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js
- pnpm
- Python
- Poetry

---

## 1. Clone the Repository

```bash
git clone https://github.com/AbrarAlkathami/support-help-desk-system.git
cd support-help-desk-system
```

---

# Backend Setup

## 2. Navigate to the Backend

```bash
cd backend
```

## 3. Install Backend Dependencies

```bash
poetry install
```

## 4. Configure Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
DATABASE_URL=sqlite:///./helpdesk.db
SECRET_KEY=your-secret-key
```

Use the environment variable names and values required by your local setup.

---

## 5. Apply Database Migrations

```bash
poetry run alembic upgrade head
```

---

## 6. Seed the Database

```bash
poetry run python -m backend.seed
```

The seed script creates initial accounts, categories, and ticket data for testing.

---

## 7. Seeded Login Accounts

| Role      | Name            | Email            | Password        |
| --------- | --------------- | ---------------- | --------------- |
| Admin     | Amina Admin     | `admin@pwc.com`  | `Admin123!`     |
| Moderator | Sam Support     | `sam@pwc.com`    | `Moderator123!` |
| Moderator | Priya Agent     | `priya@pwc.com`  | `Moderator123!` |
| User      | Jordan Employee | `jordan@pwc.com` | `User123!`      |

Use these credentials to test each role-specific dashboard.

---

## 8. Start the Backend API

```bash
poetry run uvicorn backend.main:app --reload --app-dir src --port 8000
```

The API will be available at:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

Health endpoints:

```text
GET http://localhost:8000/health
GET http://localhost:8000/health/db
```

---

# Frontend Setup

## 9. Navigate to the Frontend

```bash
cd ../frontend
```

## 10. Install Frontend Dependencies

```bash
pnpm install
```

## 11. Configure Frontend Environment Variables

Create a `.env.local` file if required.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 12. Start the Frontend

```bash
pnpm dev -- --port 3001
```

Open:

```text
http://localhost:3000
```

---

# Authentication

Authentication is implemented using an HttpOnly cookie.

After a successful login, the backend sets an `access_token` cookie.

Authentication endpoints:

```text
POST /auth/login
GET  /auth/me
POST /auth/logout
```

`POST /auth/login` authenticates the user and creates the authenticated session.

`GET /auth/me` returns the currently authenticated user and allows the frontend to restore authentication after page reloads.

`POST /auth/logout` clears the authentication cookie.

The frontend sends credentials with authenticated requests so the HttpOnly cookie is included automatically.

---

# Role-Based Access Control

The application supports exactly three roles:

```text
user
moderator
admin
```

Authorization is enforced by the backend API and not only by hiding frontend controls.

## Permission Matrix

| Action                             | User | Moderator | Admin |
| ---------------------------------- | :--: | :-------: | :---: |
| Create ticket                      |  ✓   |     ✓     |   ✓   |
| View own ticket                    |  ✓   |     ✓     |   ✓   |
| View other users' tickets          |  ✗   |     ✓     |   ✓   |
| Comment on own ticket              |  ✓   |     ✓     |   ✓   |
| Comment on any ticket              |  ✗   |     ✓     |   ✓   |
| Assign/reassign ticket             |  ✗   |     ✓     |   ✓   |
| Change ticket status               |  ✗   |     ✓     |   ✓   |
| Change ticket priority             |  ✗   |     ✓     |   ✓   |
| Administrative close/delete action |  ✗   |     ✗     |   ✓   |
| Manage categories                  |  ✗   |     ✗     |   ✓   |
| Create accounts                    |  ✗   |     ✗     |   ✓   |
| Activate/deactivate accounts       |  ✗   |     ✗     |   ✓   |
| Change account roles               |  ✗   |     ✗     |   ✓   |
| View shared queue                  |  ✗   |     ✓     |   ✓   |
| View admin metrics                 |  ✗   |     ✗     |   ✓   |

The backend uses appropriate HTTP status codes such as:

```text
401 Unauthorized
403 Forbidden
404 Not Found
422 Unprocessable Entity
```

---

# State Management

Frontend state is intentionally separated based on the type of state.

## TanStack Query

TanStack Query manages server state, including:

- Authenticated/current user
- Tickets
- Ticket details
- Ticket comments
- Categories
- Moderators
- Users
- Queue summary
- Metrics
- API loading states
- API error states
- Mutations
- Cache invalidation

TanStack Query is used because this data originates from the backend and benefits from caching, synchronization, loading/error handling, and invalidation after mutations.

## Zustand

Zustand is used for shared client-side UI state.

For example, the currently selected ticket is stored in a lightweight Zustand store and shared between ticket tables and ticket detail/management dialogs.

Zustand is intentionally not used to duplicate server data already handled by TanStack Query.

## URL Search Parameters

Ticket queue state is stored in the URL for:

- Search
- Status filters
- Priority filters
- Category filter
- Assignee filter
- Pagination
- Page size
- Sorting

Example:

```text
?page=2&pageSize=20&status=open&priority=high&assignee=unassigned&search=vpn
```

This allows filtered views to:

- Survive page refreshes
- Be shared by URL
- Stay synchronized with server-side filtering
- Avoid unnecessary global state

## Local React State

React `useState` is used for state that belongs only to a single component.

Examples include:

- Local dialog state
- Temporary UI values
- Search input before debounce
- Small component-specific state

---

# Ticket Queue

The moderator and admin ticket queue is backed by the REST API.

Filtering, pagination, searching, and sorting are performed server-side against the full dataset.

The queue supports:

- Server-side pagination
- Page-size control
- Status filtering
- Priority filtering
- Category filtering
- Assignee filtering
- Assigned-to-me filtering
- Unassigned filtering
- Free-text search
- Sorting by creation date
- Sorting by priority

Example request:

```text
GET /tickets?page=1&page_size=20&status=open&status=in_progress&priority=high&priority=urgent&assignee=unassigned&search=vpn&sort_by=created_at&sort_order=desc
```

---

# Queue Summary and SLA

The moderator/admin queue includes operational summary metrics:

- Unassigned tickets
- Tickets assigned to the current moderator
- Overdue tickets

A ticket is considered overdue when it is still `open` or `in_progress` and has exceeded its resolution SLA.

| Priority | Resolution SLA |
| -------- | -------------- |
| Urgent   | 4 hours        |
| High     | 8 hours        |
| Medium   | 24 hours       |
| Low      | 48 hours       |

---

# Ticket Lifecycle

Ticket statuses:

```text
open
in_progress
resolved
closed
```

Ticket priorities:

```text
low
medium
high
urgent
```

Each ticket contains:

- Requester
- Subject
- Description
- Status
- Priority
- Category
- Optional assignee
- Creation timestamp
- Update timestamp
- Comment history

---

# API Overview

## Authentication

```text
POST /auth/login
GET  /auth/me
POST /auth/logout
```

## Tickets

```text
POST   /tickets
GET    /tickets
GET    /tickets/queue-summary
GET    /tickets/{ticket_id}
PATCH  /tickets/{ticket_id}
DELETE /tickets/{ticket_id}
POST   /tickets/{ticket_id}/comments
```

## Categories

```text
GET  /categories
POST /categories
```

## Users

```text
GET   /users
GET   /users/moderators
POST  /users
PATCH /users/{user_id}
```

## Metrics

```text
GET /metrics
```

## Health

```text
GET /health
GET /health/db
```

---

# Validation and Error Handling

Forms use React Hook Form and Zod for client-side validation.

The application provides user feedback through:

- Inline validation messages
- Loading skeletons
- Loading indicators
- Disabled buttons during pending mutations
- API error messages
- Success notifications
- Empty states
- Filtered-empty states

---

# Admin Metrics

The admin dashboard includes lightweight ticket metrics.

Metrics include:

- Total ticket count
- Tickets grouped by status
- Tickets grouped by category

Metrics are calculated by the backend and displayed on the admin dashboard.

---

# Scope and Trade-offs

The implementation focuses on the primary case-study requirements:

- Role-specific dashboards
- Authentication
- Persistent session handling
- Server-side RBAC
- REST API design
- Server-side pagination
- Server-side filtering
- Search
- Sorting
- Ticket queue UX
- State management
- Account management
- Category management
- Loading and error handling

The following stretch features were intentionally left out:

- File attachment uploads
- Real email notifications
- Automated SLA-breach notifications/actions
- Full audit trail

A flat ticket conversation history is used instead of nested threaded replies.

---

# Development Checks

Run frontend linting:

```bash
pnpm lint
```

Run a production build:

```bash
pnpm build
```

---

# Quick Evaluation Guide

1. Clone the repository:

```bash
git clone https://github.com/AbrarAlkathami/support-help-desk-system.git
cd support-help-desk-system
```

2. Set up the backend:

```bash
cd backend
poetry install
poetry run alembic upgrade head
poetry run python -m backend.seed
poetry run uvicorn backend.main:app --reload --app-dir src --port 8000
```

3. In another terminal, set up the frontend:

```bash
cd frontend
pnpm install
pnpm dev -- --port 3001
```

4. Open:

```text
http://localhost:3000
```

5. Test each role using:

```text
Admin
admin@pwc.com
Admin123!

Moderator
sam@pwc.com
Moderator123!

Moderator
priya@pwc.com
Moderator123!

User
jordan@pwc.com
User123!
```

---

# API Documentation

Interactive FastAPI documentation is available at:

```text
http://localhost:8000/docs
```

Local API base URL:

```text
http://localhost:8000
```

---

# License

This project was developed as a technical case study.
