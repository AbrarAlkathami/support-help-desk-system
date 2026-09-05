# API Reference

Local base URL:

```text
http://localhost:8000
```

Authentication is cookie-based. After a successful login, the server sets an HttpOnly `access_token` cookie. Browser/frontend requests must send credentials.

## Common Status Codes

| Code  | Meaning                                  |
| ----- | ---------------------------------------- |
| `200` | Successful request                       |
| `201` | Resource created                         |
| `204` | Successful request with no response body |
| `400` | Invalid business/request data            |
| `401` | Not authenticated / invalid session      |
| `403` | Authenticated but not authorized         |
| `404` | Resource not found                       |
| `422` | Request schema validation failed         |

## Error Response

```json
{
  "error": {
    "code": "not_found",
    "message": "Ticket not found"
  }
}
```

Validation responses may include a `details` array.

---

# Authentication

## POST `/auth/login`

Authenticates a user and sets the HttpOnly session cookie.

**Access:** Public

### Request

```json
{
  "email": "jordan@pwc.com",
  "password": "User123!"
}
```

### Response — `200`

```json
{
  "id": "5fee0f9b-600f-42d5-bd37-443396ce28af",
  "name": "Jordan Employee",
  "email": "jordan@pwc.com",
  "role": "user",
  "is_active": true
}
```

The response also sets:

```text
Set-Cookie: access_token=<jwt>; HttpOnly; SameSite=Lax
```

### Errors

- `401` invalid email/password
- `403` inactive account

## GET `/auth/me`

Returns the currently authenticated user.

**Access:** Authenticated

### Response — `200`

```json
{
  "id": "5fee0f9b-600f-42d5-bd37-443396ce28af",
  "name": "Jordan Employee",
  "email": "jordan@pwc.com",
  "role": "user",
  "is_active": true
}
```

### Errors

- `401` missing/invalid/expired cookie
- `403` inactive account

## POST `/auth/logout`

Deletes the authentication cookie.

**Access:** Public/authenticated

### Response

`204 No Content`

---

# Tickets

Ticket statuses:

```text
open | in_progress | resolved | closed
```

Ticket priorities:

```text
low | medium | high | urgent
```

## POST `/tickets`

Creates a new ticket. The requester is always derived from the authenticated user; clients cannot choose `requester_id`.

**Access:** Authenticated

### Request

```json
{
  "subject": "VPN is not working",
  "description": "I cannot connect to the VPN from home.",
  "category_id": "2c831180-1e50-4540-889a-02c083c0a389"
}
```

### Response — `201`

```json
{
  "id": "0ac23287-4577-4d82-a42f-dd46fcbb9324",
  "subject": "VPN is not working",
  "description": "I cannot connect to the VPN from home.",
  "status": "open",
  "priority": "medium",
  "requester": {
    "id": "5fee0f9b-600f-42d5-bd37-443396ce28af",
    "name": "Jordan Employee"
  },
  "assignee": null,
  "category": {
    "id": "2c831180-1e50-4540-889a-02c083c0a389",
    "name": "IT - Access & VPN"
  },
  "created_at": "2026-09-04T08:00:00Z",
  "updated_at": "2026-09-04T08:00:00Z"
}
```

### Errors

- `401` unauthenticated
- `404` category does not exist
- `422` invalid request payload

## GET `/tickets`

Returns a server-filtered, sorted, paginated ticket list.

**Access:** Authenticated

Visibility is role-aware:

- `user`: only tickets requested by the current user
- `moderator`: shared ticket queue
- `admin`: all tickets

### Query Parameters

| Parameter     | Type                       | Default      | Description                      |
| ------------- | -------------------------- | ------------ | -------------------------------- |
| `page`        | integer                    | `1`          | Page number, minimum 1           |
| `page_size`   | integer                    | `10`         | Items per page, 1–100            |
| `status`      | repeated enum              | —            | Multi-select status filter       |
| `priority`    | repeated enum              | —            | Multi-select priority filter     |
| `category_id` | UUID                       | —            | Category filter                  |
| `assignee`    | UUID / `me` / `unassigned` | —            | Assignee filter                  |
| `search`      | string                     | —            | Searches subject and description |
| `sort_by`     | `created_at` / `priority`  | `created_at` | Sort field                       |
| `sort_order`  | `asc` / `desc`             | `desc`       | Sort direction                   |

### Example

```text
GET /tickets?page=1&page_size=20&status=open&status=in_progress&priority=high&priority=urgent&assignee=unassigned&search=vpn&sort_by=created_at&sort_order=desc
```

### Response — `200`

```json
{
  "items": [
    {
      "id": "0ac23287-4577-4d82-a42f-dd46fcbb9324",
      "subject": "VPN is not working",
      "description": "I cannot connect to the VPN from home.",
      "status": "open",
      "priority": "high",
      "requester": {
        "id": "5fee0f9b-600f-42d5-bd37-443396ce28af",
        "name": "Jordan Employee"
      },
      "assignee": null,
      "category": {
        "id": "2c831180-1e50-4540-889a-02c083c0a389",
        "name": "IT - Access & VPN"
      },
      "created_at": "2026-09-04T08:00:00Z",
      "updated_at": "2026-09-04T08:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}
```

## GET `/tickets/queue-summary`

Returns operational summary counts for the moderator/admin ticket queue.

**Access:** Moderator, Admin

The summary is calculated server-side across the full ticket dataset.

A ticket is considered **overdue** when it is still `open` or `in_progress` and has exceeded the resolution SLA for its priority:

| Priority | SLA      |
| -------- | -------- |
| `urgent` | 4 hours  |
| `high`   | 8 hours  |
| `medium` | 24 hours |
| `low`    | 48 hours |

### Response — `200`

````json
{
  "unassigned": 4,
  "assigned_to_me": 2,
  "overdue": 3
}

## GET `/tickets/{ticket_id}`

Returns ticket details and its flat comment history.

**Access:**

- requester of the ticket
- moderator
- admin

### Response — `200`

```json
{
  "id": "0ac23287-4577-4d82-a42f-dd46fcbb9324",
  "subject": "VPN is not working",
  "description": "I cannot connect to the VPN from home.",
  "status": "open",
  "priority": "high",
  "requester": {
    "id": "5fee0f9b-600f-42d5-bd37-443396ce28af",
    "name": "Jordan Employee"
  },
  "assignee": {
    "id": "9c7ea748-647e-4eb9-a0ca-e02bb260ce0a",
    "name": "Sam Support"
  },
  "category": {
    "id": "2c831180-1e50-4540-889a-02c083c0a389",
    "name": "IT - Access & VPN"
  },
  "created_at": "2026-09-04T08:00:00Z",
  "updated_at": "2026-09-04T08:30:00Z",
  "comments": [
    {
      "id": "ff2295e6-c802-4766-b458-7362ed2a5829",
      "ticket_id": "0ac23287-4577-4d82-a42f-dd46fcbb9324",
      "author_id": "5fee0f9b-600f-42d5-bd37-443396ce28af",
      "body": "The issue is still happening.",
      "created_at": "2026-09-04T08:15:00Z",
      "author": {
        "id": "5fee0f9b-600f-42d5-bd37-443396ce28af",
        "name": "Jordan Employee"
      }
    }
  ]
}
````

### Errors

- `401` unauthenticated
- `403` regular user attempting to access another user's ticket
- `404` ticket not found

## PATCH `/tickets/{ticket_id}`

Partially updates workflow fields.

**Access:** Moderator, Admin

### Request examples

Change priority:

```json
{
  "priority": "urgent"
}
```

Change status:

```json
{
  "status": "in_progress"
}
```

Assign to a moderator:

```json
{
  "assignee_id": "9c7ea748-647e-4eb9-a0ca-e02bb260ce0a"
}
```

Unassign:

```json
{
  "assignee_id": null
}
```

Multiple fields may be supplied in one PATCH request.

### Response — `200`

Returns the updated ticket object.

### Errors

- `400` assignee is not an active moderator / invalid business rule
- `401` unauthenticated
- `403` regular user
- `404` ticket or assignee not found

## DELETE `/tickets/{ticket_id}`

Admin-only administrative delete/close action. The implementation preserves ticket history and closes the ticket instead of hard-deleting its database row.

**Access:** Admin

### Response

`204 No Content`

### Errors

- `401` unauthenticated
- `403` non-admin
- `404` ticket not found

## POST `/tickets/{ticket_id}/comments`

Adds a comment/reply to a ticket.

**Access:**

- requester of the ticket
- moderator
- admin

### Request

```json
{
  "body": "The issue is still happening this morning."
}
```

### Response — `201`

```json
{
  "id": "ff2295e6-c802-4766-b458-7362ed2a5829",
  "ticket_id": "0ac23287-4577-4d82-a42f-dd46fcbb9324",
  "author_id": "5fee0f9b-600f-42d5-bd37-443396ce28af",
  "body": "The issue is still happening this morning.",
  "created_at": "2026-09-04T08:15:00Z"
}
```

---

# Categories

## GET `/categories`

Lists ticket categories.

**Access:** Authenticated

### Response — `200`

```json
[
  {
    "id": "2c831180-1e50-4540-889a-02c083c0a389",
    "name": "IT - Hardware"
  },
  {
    "id": "013ea924-f78f-4be1-be92-d83a86fe40c0",
    "name": "HR - Payroll"
  }
]
```

## POST `/categories`

Creates a category.

**Access:** Admin

### Request

```json
{
  "name": "Finance"
}
```

### Response — `201`

```json
{
  "id": "aac63349-ddb5-46fe-b52e-52a67bfd6f62",
  "name": "Finance"
}
```

---

# Users

## GET `/users`

Lists users/accounts.

**Access:** Admin

### Response — `200`

```json
[
  {
    "id": "5fee0f9b-600f-42d5-bd37-443396ce28af",
    "name": "Jordan Employee",
    "email": "jordan@pwc.com",
    "role": "user",
    "is_active": true
  }
]
```

## GET `/users/moderators`

Lists moderators for the ticket assignee selector.

**Access:** Moderator, Admin

### Response — `200`

```json
[
  {
    "id": "9c7ea748-647e-4eb9-a0ca-e02bb260ce0a",
    "name": "Sam Support",
    "email": "sam@pwc.com",
    "role": "moderator",
    "is_active": true
  }
]
```

## POST `/users`

Creates an account.

**Access:** Admin

### Request

```json
{
  "name": "New Support Agent",
  "email": "agent@example.com",
  "password": "Password123!",
  "role": "moderator"
}
```

### Response — `201`

Returns the created user without `password_hash`.

## PATCH `/users/{user_id}`

Changes account role and/or activation state.

**Access:** Admin

### Request examples

Deactivate:

```json
{
  "is_active": false
}
```

Change role:

```json
{
  "role": "moderator"
}
```

### Response — `200`

Returns the updated user.

---

# Metrics

## GET `/metrics`

Returns lightweight ticket metrics.

**Access:** Admin

### Response — `200`

```json
{
  "total_tickets": 30,
  "by_status": [
    { "status": "open", "count": 12 },
    { "status": "in_progress", "count": 8 },
    { "status": "resolved", "count": 7 },
    { "status": "closed", "count": 3 }
  ],
  "by_category": [
    { "category": "IT - Hardware", "count": 11 },
    { "category": "IT - Access & VPN", "count": 10 },
    { "category": "HR - Payroll", "count": 9 }
  ]
}
```

---

# Health

## GET `/health`

Application health check.

```json
{
  "status": "ok"
}
```

## GET `/health/db`

Database connectivity check.

```json
{
  "status": "ok",
  "database": "connected"
}
```
