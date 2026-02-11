# Winona Backend Assessment Test

## Overview

- Company: Winona
- Candidate: Johan Higuita
- Position: Backend Engineer

This project is a NestJS API built for the Winona technical assessment. It
implements patient and prescription management, JWT authentication, and a
consistent error response format.

## Technology Stack

- NestJS
- TypeORM
- SQLite (better-sqlite3)
- JWT (Passport + @nestjs/jwt)
- Swagger (OpenAPI)

## Setup

1. `npm install`
2. Seed local data (optional):
   - `npm run seed --patients=100`
3. `npm run start:dev`

Server URL: `http://localhost:3000`  
Swagger UI: `http://localhost:3000/api`

### Authentication (JWT)

1. Login:
   - `POST /auth/login`
2. Use the token:
   - `Authorization: Bearer <token>`

Demo credentials (shown here because this is a technical assessment):

- Username: `admin`
- Password: `admin`

These credentials must be provided via environment variables. See
`.env.example` for the demo values used in this assessment.

### Database (SQLite)

The SQLite file is not committed. By default, seeding creates 100 patients.
You can pass a different value, for example:

```
npm run seed --patients=250
```

Seeding assigns 0–5 prescriptions per patient. To use a different database
path, set `DB_PATH`.

To clear patient and prescription records (tables remain):

```
npm run db:reset
```

## Testing Commands

- `npm run test`
- `npm run test:e2e`

## Example Request/Response

Login:

```
POST /auth/login
{
  "username": "admin",
  "password": "admin"
}
```

Response:

```
{
  "accessToken": "<jwt>",
  "tokenType": "Bearer",
  "expiresIn": "1h"
}
```

## AI Development Tools

- Agent 1 — Architect: architecture, technical decisions, global approach  
  Model: GPT-5.2 High
- Agent 2 — Developer: implementation (≈80% of the coding)  
  Model: GPT-5.2 Codex High
- Agent 3 — Reviewer / Debugger: review, debugging, quality improvements  
  Model: Sonnet 4.5
- Secondary architecture support: Claude.ai  
  Model: Sonnet 4.5

## Architecture

This API follows a **layered modular architecture** (presentation, application,
domain, infrastructure) with clear module boundaries and dependency inversion
through repository ports.

- `Auth` module: user registration/login, JWT issuance
- `Patients` module: CRUD for patients
- `Prescriptions` module: CRUD + list by patient
- Shared pagination DTOs and a global HTTP exception filter

## API Endpoints (summary)

Patients:

- `POST /patients`
- `GET /patients`
- `GET /patients/:id`
- `PATCH /patients/:id`
- `DELETE /patients/:id`

Prescriptions:

- `POST /prescriptions`
- `GET /prescriptions`
- `GET /prescriptions/:id`
- `PATCH /prescriptions/:id`
- `DELETE /prescriptions/:id`
- `POST /patients/:patientId/prescriptions`
- `GET /patients/:patientId/prescriptions`

Auth:

- `POST /auth/register`
- `POST /auth/login`

Swagger docs: `http://localhost:3000/api`

## Error Handling

All errors return the same shape:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [{ "field": "email", "message": "must be an email" }],
  "path": "/patients",
  "timestamp": "2026-02-10T21:15:30.123Z"
}
```
