# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

TurboForms — a Typeform-style form builder. Users sign in, build a form with a
drag-and-drop field editor, publish it to a public URL, and view collected
responses in a dashboard. Two independent packages, no monorepo tooling (no
npm workspaces, no Turborepo, no root `package.json` — the "turbo" in the
name is not related to Turborepo):

- `client/` — React 19 + Vite SPA
- `server/` — Express 5 API on Node, Postgres via Drizzle ORM

## Tech stack

### client/
- **Build**: Vite 8 (`@vitejs/plugin-react`) — **not Next.js**
- **Routing**: `react-router-dom` v7, `createBrowserRouter`
- **Auth**: `@clerk/react` — Clerk handles sign-in/sign-up/session; there is
  no custom JWT code anywhere in the client
- **State**: `zustand`, used only for the form-builder's in-editor field
  state (`stores/useBuilderStore.ts`). Everything else is local component
  state.
- **Data fetching**: hand-rolled hooks (`useState` + `useEffect`/manual
  `mutate`) around an `axios` instance — **no react-query/tanstack-query**,
  despite one query-shaped naming convention (`useGetForms`, etc.)
- **Forms**: `react-hook-form` + `@hookform/resolvers` (zod) — but only
  actually used in `CreateFormModal`. The builder's field-properties panel
  and the public `FormRenderer` use plain controlled state, not RHF.
- **Validation**: `zod`, schemas under `src/schemas/`, mirrored (not shared)
  with server-side zod schemas
- **UI**: `radix-ui` + `shadcn` CLI conventions, `tailwindcss` v4 via the
  `@tailwindcss/vite` plugin (no `postcss.config`), `lucide-react` /
  `@tabler/icons-react` for icons, `sonner` for toasts, `vaul` for drawers,
  some Aceternity-registry components (`resizable-navbar`,
  `dotted-glow-background`) configured in `components.json`
- **Drag & drop**: `@dnd-kit/*`, used for reordering fields in the builder
- **Dark mode**: a hand-rolled `ThemeProvider`/`useTheme` (localStorage key
  `vite-ui-theme`), **not** the installed `next-themes` package — that
  dependency is present but unused for theming
- **Charts**: `recharts` is installed but unused (Analytics page is a stub)
- **Tables**: `@tanstack/react-table` is installed but unused (no table
  usage found; dashboard grids are custom components)
- No test runner is configured (no vitest/jest, no `*.test.*` files)

### server/
- **Runtime**: Node, ESM (`"type": "module"`), Express 5, TypeScript
  (`nodenext` module resolution, `strict: true`)
- **Auth**: `@clerk/express` (`clerkMiddleware` + `getAuth(req)`) — **not**
  custom JWT despite older docs claiming JWT. `requireAuth` middleware reads
  the Clerk user id into `res.locals.userId`; services then resolve/create
  the corresponding internal `users` row by `clerk_id`.
- **DB**: PostgreSQL via `drizzle-orm` (`drizzle-orm/node-postgres`) + `pg`.
  Single client in `db/index.ts`, no pooling config beyond the driver
  default. Migrations generated/applied via `drizzle-kit`
  (`npm run db:generate` / `db:migrate`), checked into `server/drizzle/`.
- **Validation**: `zod`, one `*.validation.ts` per module
- **Ordering**: `fractional-indexing` — field order is a **string key**
  (`order: varchar`), not an integer column, so field reordering never
  requires rewriting sibling rows
- No file uploads (no Multer), no Cloudinary, no image/asset handling
  anywhere in the codebase
- No Scalar/Swagger/OpenAPI setup exists in code
- Rate limiting is an **empty stub** (`middleware/rateLimiter.middleware.ts`
  contains only a comment; nothing is wired up)
- No test runner, no ESLint/Prettier config in `server/`

## Repo structure

```
client/src/
  app/dashboard/data.json # leftover shadcn dashboard-block demo fixture, unused by the app
  components/            # ui/, formBuilder/, formRenderer/, dashboard/, general/, landing/, skeleton/
  config/                 # env.ts (zod-validated import.meta.env), fieldTypes.ts (10 field types)
  hooks/                  # auth/, form/, form-field/, form-submission/ — one hook per endpoint
  lib/                    # apiError.ts, submissionFormat.ts
  pages/                  # auth/, dashboard/, form/, shared/, + top-level marketing pages
  routes/                 # Approuter.tsx, Protected.tsx
  schemas/                # zod schemas mirroring server validation
  services/               # axios calls, one file per backend module
  stores/                 # useBuilderStore.ts (zustand)

server/src/
  config/env.ts            # zod-validated process.env
  db/
    schema.ts              # barrel export of all models
    models/*.model.ts       # one file per table
    index.ts                # drizzle client
  middleware/               # auth, errorHandler, rateLimiter (stub)
  modules/
    user/ form/ form-field/ form-submission/
      *.routes.ts    → Router + requireAuth wiring
      *.controller.ts → parses req, zod safeParse, calls service, next(error)
      *.service.ts    → business logic + drizzle queries directly (no repository layer)
      *.validation.ts → zod schemas
      *.types.ts      → derived TS types
  utils/errors.ts           # AppError, ValidationError — the only two typed error classes
```

## Backend architecture pattern

Each module follows **routes → controller → service → validation**, with
services talking to Drizzle directly (no repository/DAO layer, no dependency
injection). Controllers `safeParse` with zod and call `next(error)` on
failure; `errorHandler` middleware then:
1. Returns typed `AppError`/`ValidationError` instances as-is
   (`{statusCode, json:{error: message}}`)
2. Otherwise **string-matches `err.message`** against a hardcoded list
   (e.g. `"Form not found or unauthorized"`) to pick a status code, falling
   back to 500

This means most services throw plain `new Error("...")`, and the exact
message text is load-bearing for the HTTP status returned — renaming a
thrown message without updating `errorHandler.ts` silently changes the
response code. Keep this in mind when touching error messages in any
`*.service.ts`.

## API routes (mounted in `server/src/app.ts`)

- `/api/v1/user` — `GET /me` (get-or-create the DB user from the Clerk
  session, requireAuth)
- `/api/v1/forms` — CRUD + `POST /:id/publish` / `POST /:id/unpublish` +
  public `GET /public` and `GET /slug/:slug` (owner routes require auth,
  public routes don't)
- `/api/v1/forms/:formId/fields` — field CRUD + `PATCH /reorder`
  (all requireAuth)
- `/api/v1/forms/:formId/submit` — public submission endpoint (no auth)
- `/api/v1/submissions` — `GET /form/:formId`, `GET /:submissionId`
  (requireAuth, ownership enforced by joining through `forms.user_id`)

## Database schema (5 tables)

- **users** — `id` (uuid pk), `clerk_id` (unique), `name`, `email` (unique),
  timestamps
- **forms** — `id`, `user_id` (fk→users, cascade), `title`, `description`,
  `slug` (unique), `visibility` enum `public|unlisted` (default
  `unlisted`), `is_published` (bool), `theme` (jsonb), `settings` (jsonb —
  intended for submission limit/expiry, **not enforced anywhere yet**),
  timestamps
- **form_fields** — `id`, `form_id` (fk→forms, cascade), `type` enum
  (`short_text`, `long_text`, `email`, `number`, `single_select`,
  `multi_select`, `dropdown`, `rating`, `date`, `boolean`), `label`,
  `field_key` (auto-slugified, unique-per-form, **reserved for future
  conditional logic, not consumed anywhere yet**), `placeholder`,
  `help_text`, `is_required`, `order` (fractional-indexing string, not an
  int), `options` (jsonb), `validations` (jsonb), timestamps
- **form_submissions** — `id`, `form_id` (fk, cascade), `created_at` only
  (no `updated_at`, no respondent IP/user-agent capture)
- **submission_answers** — `id`, `submission_id` (fk, cascade), `field_id`
  (fk, cascade), `value` (text — everything stored as a string;
  `multi_select` answers are JSON-stringified arrays), `created_at`

## Conventions & known quirks (read before refactoring)

- **Typos are load-bearing in a few places** — `updateFiledService` and
  "fileds" appear literally in `form-field.service.ts` identifiers; the
  properties-panel component file is named `FieldPropertiesPannel.tsx`
  (double-n). Don't silently "fix" these mid-change without also fixing all
  call sites, or do it as its own dedicated rename.
- Field ordering uses `fractional-indexing` (`generateKeyBetween`) — never
  reindex the whole list on reorder; only the moved field's `order` changes.
- The public submission flow (`form-submission` module) revalidates
  everything server-side independently of the client's zod schemas
  (required fields, per-type value shape via `answer-validator.ts`,
  duplicate/unknown field ids) — don't assume client validation is
  sufficient on its own.
- Auth token flow: `useRegisterAuthToken` (client) registers Clerk's
  `getToken` with the axios interceptor in `services/api.ts`; every request
  gets `Authorization: Bearer <clerk-token>` once that's wired. If you add a
  new authed request path, make sure this hook has run first (it's wired
  once in `main.tsx` via `AuthSync`).
- Unauthorized access to another user's submission returns the same
  "Submission not found" message as a truly missing one — intentional, to
  avoid leaking existence. Follow this pattern for any new owner-scoped
  reads.

## Environment variables

`server/src/config/env.ts` (zod-validated, throws on startup if missing):
`DATABASE_URL`, `NODE_ENV`, `PORT`, `CORS_ORIGIN`, `CLERK_PUBLISHABLE_KEY`,
`CLERK_SECRET_KEY`. No `.env.example` exists — this zod schema is the only
source of truth for required vars.

`client/src/config/env.ts` (zod-validated `import.meta.env`):
`VITE_API_BASE_URL`, `VITE_CLERK_PUBLISHABLE_KEY`.

## Commands

```bash
# server/
npm run dev          # tsc-watch + node dist/index.js
npm run build         # tsc
npm run db:generate    # drizzle-kit generate
npm run db:migrate     # drizzle-kit migrate

# client/
npm run dev      # vite
npm run build     # tsc -b && vite build
npm run lint       # eslint .
```

No test suite exists in either package — do not assume `npm test` works.

## Corrections to the old project README

The root `README.md` describes an aspirational/stale stack that does not
match the code:
- Claims **Next.js** — actual client is Vite + React Router
- Claims **JWT Authentication** — actual auth is Clerk end-to-end
- Claims **Multer** and **Cloudinary** — no file/image upload exists
  anywhere in the codebase
- Claims **Scalar OpenAPI** / **Swagger** — no API docs tooling is wired up
  in code

Treat the README as out of date; this file and `PROGRESS.md` reflect the
actual code as of this writing.
