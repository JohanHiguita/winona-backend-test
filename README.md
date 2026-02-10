# Winona Backend Assessment

Small NestJS API for the Winona backend assessment. The API manages
patients and their prescriptions using TypeORM with SQLite.

## Requirements

- Node.js 18+
- npm 9+

## Setup

1. `npm install`
2. `npm run start:dev`

The server runs at `http://localhost:3000`.
Swagger UI is available at `http://localhost:3000/api`.

## API (brief)

- `POST /patients`
- `GET /patients`
- `GET /patients/:id`
- `PATCH /patients/:id`
- `DELETE /patients/:id`
- `POST /patients/:id/prescriptions`
- `GET /patients/:id/prescriptions`

## Scripts

- `npm run start:dev` run the server in watch mode
- `npm run test` run unit tests
- `npm run test:e2e` run e2e tests
