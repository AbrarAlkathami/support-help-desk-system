# Support Helpdesk Ticketing System

A full-stack internal helpdesk system for IT and HR support requests.

The application supports three roles:

- **User** — create tickets, view/comment on own tickets, track status.
- **Moderator** — manage the shared queue, assign tickets, update status/priority, reply to tickets.
- **Admin** — manage users/categories, view all tickets, perform admin actions, and view metrics.

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy 2.x async
- SQLite
- Alembic
- PyJWT
- pwdlib / Argon2
- pytest

### Frontend

- Next.js + TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- TanStack Table
- React Hook Form + Zod

## Project Structure

```text
support-help-desk-system/
├── backend/
├── frontend/
├── docs/
│   └── API.md
└── README.md
```

## Backend Setup

```bash
cd backend
poetry install
```

Create `.env`:

```env
DATABASE_URL=sqlite+aiosqlite:///./helpdesk.db
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_ORIGIN=http://localhost:3000
```

Apply migrations:

```bash
poetry run alembic upgrade head
```

Seed the database:

```bash
poetry run python -m backend.seed
```

Run the API:

```bash
poetry run uvicorn backend.main:app --reload --app-dir src
```

Backend:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

## Seeded Accounts

| Role      | Email            | Password        |
| --------- | ---------------- | --------------- |
| Admin     | `admin@pwc.com`  | `Admin123!`     |
| Moderator | `sam@pwc.com`    | `Moderator123!` |
| Moderator | `priya@pwc.com`  | `Moderator123!` |
| User      | `jordan@pwc.com` | `User123!`      |

## Authentication & Authorization

Authentication uses a JWT stored in an **HttpOnly cookie**.

RBAC is enforced server-side for all protected actions.

The ticket queue supports server-side:

- Pagination
- Status and priority multi-filtering
- Category and assignee filtering
- `me` / `unassigned`
- Search
- Sorting

## Tests

Run:

```bash
poetry run pytest -v
```

Tests include RBAC checks such as users being blocked from other users' tickets and moderators being blocked from admin-only actions.

## API Documentation

Detailed endpoints, payloads, query parameters, responses, and permissions are documented in:

[`docs/API.md`](docs/API.md)

## State Management

The frontend uses **TanStack Query** for server state and React local state for UI-only state.

## Out of Scope

The first version intentionally excludes:

- File attachments
- Email notifications
- SLA automation
- Full audit logging
- OAuth / enterprise SSO
