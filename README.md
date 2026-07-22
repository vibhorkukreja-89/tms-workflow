# TMS — Support Ticket Management System

Internal support ticket app for the JS AI Capability Exercise.

**Stack:** React + TypeScript (Vite) · Node.js + Express + TypeScript · PostgreSQL · Prisma

---

## Prerequisites

- Node.js 20+ (18+ may work; 20 recommended)
- PostgreSQL 14+ running locally
- `createdb` available (or create databases via your Postgres client)

---

## Quick start (clean clone)

### 1. Clone and install

```bash
git clone <repo-url> tms-workflow
cd tms-workflow

cd backend && npm install
cd ../frontend && npm install
```

### 2. Create databases

```bash
createdb tms_dev
createdb tms_test   # optional but recommended for tests
```

### 3. Configure backend env

```bash
cd backend
cp .env.example .env
```

Edit `.env` if your Postgres credentials differ from the defaults:

```
DATABASE_URL="postgresql://postgres@localhost:5432/tms_dev"
# DATABASE_URL_TEST="postgresql://postgres@localhost:5432/tms_test"
PORT=3000
NODE_ENV=development
```

Never commit `.env` — only `.env.example` is tracked.

### 4. Migrate, generate client, seed

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

(`migrate deploy` applies committed migrations. For local iteration you can use `npm run db:migrate` instead.)

Seed loads 3 users, 6 sample tickets, and 5 comments.

### 5. Run the API

```bash
cd backend
npm run dev
```

API: http://localhost:3000  
Health: http://localhost:3000/health

### 6. Run the frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

UI: http://localhost:5173  

Vite proxies `/api/*` to `http://localhost:3000`.

---

## Scripts

### Backend (`backend/`)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (`tsx watch`) |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled `dist/server.js` |
| `npm run db:migrate` | Prisma migrate (dev) |
| `npm run db:seed` | Seed users / tickets / comments |
| `npm test` | State machine integration tests (15) |

### Frontend (`frontend/`)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run lint` | oxlint |
| `npm run preview` | Preview production build |

---

## API overview

All responses use the envelope `{ "data": T }` or `{ "error": { "code", "message" } }`.

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/tickets?search=&status=` | List + search/filter |
| POST | `/api/tickets` | Create |
| GET | `/api/tickets/:id` | Detail |
| PATCH | `/api/tickets/:id` | Update fields |
| PATCH | `/api/tickets/:id/status` | State machine (422 on invalid) |
| GET/POST | `/api/tickets/:id/comments` | List / add comments |
| GET | `/api/users` | Seeded users for assignee / author selects |

### Status transitions (enforced in backend)

```
OPEN → IN_PROGRESS | CANCELLED
IN_PROGRESS → RESOLVED | CANCELLED
RESOLVED → CLOSED
CLOSED / CANCELLED → (none)
```

---

## Tests

```bash
cd backend
# Prefer a dedicated test DB:
# export DATABASE_URL_TEST="postgresql://postgres@localhost:5432/tms_test"
npm test
```

Expect **15/15** state machine integration tests passing.

---

## Project layout

```
tms-workflow/
├── backend/                     # Express + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma        # Data model
│   │   ├── seed.ts              # Seed users / tickets / comments
│   │   └── migrations/          # Committed DB migrations
│   ├── src/
│   │   ├── server.ts            # Process entry
│   │   ├── app.ts               # Express app wiring
│   │   ├── config.ts            # Env / config
│   │   ├── db.ts                # Prisma client
│   │   ├── errors.ts            # Domain / HTTP errors
│   │   ├── middleware/          # validate, error-handler
│   │   ├── validators/          # Zod schemas (ticket, comment)
│   │   ├── routes/              # ticket, comment, user routers
│   │   ├── services/            # Business logic
│   │   ├── repositories/        # Prisma data access
│   │   └── __tests__/           # State machine integration tests
│   ├── jest.config.js
│   ├── jest.setup.js
│   └── package.json
├── frontend/                    # React + Vite UI
│   ├── public/
│   ├── src/
│   │   ├── main.tsx             # App bootstrap
│   │   ├── App.tsx              # Routes
│   │   ├── api/                 # HTTP client + tickets/users APIs
│   │   ├── pages/               # List, detail, create ticket
│   │   ├── components/          # TicketCard, StatusControl, comments, etc.
│   │   ├── hooks/               # Data / mutation hooks
│   │   ├── lib/                 # Shared helpers (status transitions)
│   │   └── types/               # Shared TS types
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

---

## Notes

- No authentication in Core — create/comment forms include a user dropdown over seeded users.
- Frontend never trusts its own validation alone; the backend re-validates all input.
- Assessment PRs were opened per phase (0–5) on the `boilerplate` branch.
