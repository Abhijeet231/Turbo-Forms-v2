# PROGRESS.md

Snapshot of what's actually built vs. stubbed vs. missing, based on reading
the code directly (not on any prior docs). Last verified: 2026-08-16.

## Built and working

**Auth**
- Clerk-based sign-in/sign-up (modal, from `Navbar`), session-aware routing
  via `ProtectedRoute`, Clerk token attached to API requests via an axios
  interceptor
- Backend get-or-create of a DB `users` row from the Clerk session
  (`GET /api/v1/user/me`)

**Form CRUD & publishing**
- Create / list / update / delete forms (owner-scoped)
- Publish/unpublish flow with visibility (`public`/`unlisted`) guard —
  publish requires `visibility: public` first
- Auto-generated unique slug (title + random suffix) for public URLs

**Form builder**
- Field palette with all 10 field types (`short_text`, `long_text`,
  `email`, `number`, `date`, `single_select`, `multi_select`, `dropdown`,
  `rating`, `boolean`)
- Create / update / delete fields, with optimistic UI and rollback on
  failure
- Field properties panel (label, placeholder, help text, required,
  per-type options/validation)
- Owner preview (`/dashboard/forms/:id/preview`) reusing the same
  `FormRenderer` component as the public page

**Public form & submissions**
- Public respondent page at `/f/:slug`, standalone layout
- Client + server-side validation on submit (required fields, per-type
  value checks, duplicate/unknown field rejection)
- Server returns 400 (not 500) on submission validation failures, with the
  specific message surfaced in the UI
- Submissions dashboard: form picker → response list → response detail,
  with human-readable answer formatting (`lib/submissionFormat.ts`)
- Per-form responses page (`/dashboard/forms/:id/responses`)

**Cross-cutting**
- Dark mode (custom provider, persisted via localStorage)
- Toasts (sonner), loading skeletons, empty states
- Consistent API error surfacing via `getApiErrorMessage` across all hooks

## Stubbed / not implemented

- **Sidebar "Help" button** — still no `onClick` handler, non-functional.
  ("Sign out" was wired up 2026-08-16, see "Recently fixed" below.)
- **`pages/auth/Login.tsx` / `Signup.tsx`** — dead one-line stub files, not
  registered in the router. Real auth UI is Clerk's own modal components.
- **`Dashboard.tsx` has several pre-existing unused imports** (`Sidebar`,
  `useDeleteForm`, `useGetFormsById`, `useUpdateForm`, `useEffect`, plus
  `count`/`refetch` destructured but unused) and a leftover
  `console.log(forms)`. Not touched — out of scope for the stats/stub work
  done 2026-08-16, but easy cleanup whenever someone's next in that file.
- **Form `settings` jsonb** (submission limit, expiry) — column exists on
  `forms`, nothing reads or enforces it.
- **`field_key`** on `form_fields` — generated and stored, but not consumed
  by anything (reserved for future conditional-logic/branching).
- **File/image upload** — no Multer, no Cloudinary, no upload field type,
  no theme image support despite `theme` jsonb column existing on `forms`.
- **API documentation** — no Scalar/Swagger/OpenAPI wiring in code.

## Recently fixed

- **Rate limiting (fixed 2026-08-16).** `rateLimiter.middleware.ts` was an
  empty stub; the public submit endpoint had no abuse protection. Added
  `express-rate-limit` with three tiers: `apiLimiter` (300 req/15min per IP,
  mounted globally in `app.ts` as a baseline for every route, auth or not),
  `submitLimiter` (10 req/15min per IP, on `POST /forms/:formId/submit` —
  the highest-value target since it's unauthenticated and writes to the DB),
  and `publicReadLimiter` (100 req/15min per IP, on `GET /forms/public` and
  `GET /forms/slug/:slug`). All three return `429` with the app's standard
  `{error: message}` shape. Verified via curl: the submit endpoint's 11th
  request in a window correctly returns 429 while the first 10 pass through
  to normal validation; general and public-read endpoints unaffected at
  normal request volumes.
- **Field reorder 404 (fixed 2026-08-16).** The client called
  `PATCH /api/v1/forms/:formId/fields/:fieldId/reorder`, but the server
  route (`server/src/modules/form-field/form-field.routes.ts`) only
  registered `router.patch("/reorder", reorderField)` — no `:fieldId`
  segment, so `req.params.fieldId` was `undefined` even when hit directly.
  Fixed by changing the route to `router.patch("/:fieldId/reorder",
  reorderField)`, matching what the controller already expected (and what
  its own comment described). Verified via curl: previously 404, now
  correctly reaches `requireAuth` (401 without a token). Not yet re-tested
  through the actual signed-in drag-and-drop UI — do that before
  considering it fully closed.
- **Sidebar "Sign out" button (fixed 2026-08-16).** Had no `onClick`.
  Wrapped it in Clerk's `<SignOutButton redirectUrl="/">`
  (`client/src/components/dashboard/Sidebar.tsx`), consistent with how the
  rest of the app delegates all auth UI to Clerk components (see
  `Navbar.tsx`). Not yet re-verified in a signed-in browser session — do
  that before considering it fully closed.
- **Analytics page (fixed 2026-08-16).** Was a literal `<div>Analytics</div>`.
  Now a real page: KPI row (total forms, published forms, total
  submissions) + a horizontal bar chart of submissions per form. Counts come
  from `useSubmissionCounts` (see the `DashboardStats` entry below) — an
  N+1 pattern (one request per form); fine at current scale, revisit if a
  form owner ever has dozens of forms. Typechecks and lints clean; not yet
  visually verified in a signed-in browser session.
- **Settings page (fixed 2026-08-16).** Was a literal `<div>Setting</div>`.
  Now: a theme toggle row (the one real app-level preference that already
  existed via `ThemeProvider`) plus Clerk's `<UserProfile routing="hash" />`
  for account management (name, email, password, sessions) — there's no
  backend endpoint for user settings (`PATCH /user/me` doesn't exist), so
  this delegates to Clerk the same way the rest of the app does. Typechecks
  and lints clean; not yet visually verified in a signed-in browser session.
- **`DashboardStats` hardcoded data (fixed 2026-08-16).** Was rendering
  `dummyStats` (12 forms, 3482 submissions, 8 published) with a comment
  saying as much. Extracted the counting logic both this component and
  `Analytics` need into `client/src/hooks/form-submission/useSubmissionCounts.ts`
  (fans out one `getFormSubmissions` call per form, since there's no
  aggregate endpoint) and wired both to it. `DashboardStats` now takes
  `forms`/`isLoading` as props from `Dashboard.tsx` (which already fetches
  forms) instead of fetching its own copy. Typechecks clean; the one lint
  finding (`react-hooks/set-state-in-effect` on the new hook's fetch effect)
  is the same pattern every existing fetch hook in this codebase already
  trips — see the architectural-gaps note below, not something new.

## Architectural gaps worth knowing about (not bugs, but incomplete)

- No repository/data-access layer on the backend — services query Drizzle
  directly. Fine at current size, but will need extraction if query reuse
  grows.
- Error handling relies on string-matching `err.message` in a central
  handler (`errorHandler.ts`) rather than fully typed errors. Only
  `AppError`/`ValidationError` exist. Renaming a thrown message anywhere can
  silently change the HTTP status returned.
- No automated tests anywhere in the repo (client or server) — no
  vitest/jest, no `*.test.*` files.
- No lint/format config in `server/` (client has ESLint flat config; server
  has none).
- **Client's own lint isn't actually clean.** `npx eslint src/` on `client/`
  currently reports 30 errors. Confirmed (2026-08-16) this isn't from any
  one bad file — `react-hooks/set-state-in-effect` alone fires on every
  hand-rolled data-fetching hook in `client/src/hooks/**` (they all call
  `setState`/`fetch()` synchronously inside a bare `useEffect`, which is
  exactly what "no react-query" — see CLAUDE.md — means in practice). The
  rest are pre-existing unused-var errors in `Dashboard.tsx` and a few
  `components/ui/*` files. `npm run lint` isn't wired into any CI, so this
  has never blocked anything; worth knowing if you ever do add a lint gate.
- No CI/CD config (no `.github/workflows`, no Docker).
- No `.env.example` in either package — required vars are only documented
  implicitly via each package's zod env schema.

## Naming/typo debt (intentional callout, not urgent)

- `updateFiledService` and "fileds" (server, `form-field.service.ts`)
- `FieldPropertiesPannel.tsx` (client, double-n)
- These are real identifiers in the current codebase, not typos in this
  doc — grep for the correct spelling before assuming a rename is safe.
