# PostgreSQL and Prisma Migration

Status: **Phase 1 complete**  
Owner:  
Last updated: 2026-09-21

## Goal

Replace the controller-owned in-memory `Map` stores with PostgreSQL accessed through Prisma while preserving the current HTTP contracts where possible.

This is a development/demo cutover. It does not require zero-downtime deployment, dual writes, or migration of durable legacy data.

## Decisions

- [x] Use one Prisma `User` model for authentication and profile data.
- [x] Require a registered user before creating a profile.
- [x] Hard-delete users from `DELETE /users/:id`.
- [x] Use a real PostgreSQL database for tests.
- [x] Keep bcrypt password hashing through the existing password service.
- [x] Preserve current response shapes and status codes unless the registration prerequisite requires a documented change.
- [ ] Decide whether duplicate `POST /users` returns `409` or updates the existing profile. Recommended: return `409`.
- [ ] Decide whether `displayName` is required at registration or only at profile creation. Recommended: keep it required for `POST /users` and unchanged for registration.

## Phase 1: Database Contract and Prerequisites

Status: **Complete**

- [x] Add `@prisma/client` as a runtime dependency.
- [x] Add `prisma` as a development dependency.
- [x] Add `DATABASE_URL` to `src/config.ts`; keep all `process.env` access there.
- [x] Define the local, test, and deployment PostgreSQL connection requirements.
- [x] Add a dedicated test database or isolated test schema.
- [x] Ensure test configuration cannot accidentally point to the development database.

Acceptance criteria:

- The app has a validated `DATABASE_URL` configuration path.
- Dependencies install successfully.
- Local and test database setup is documented.

## Phase 2: Prisma Schema and Migration

Status: **Not started**

- [ ] Create `prisma/schema.prisma` with the PostgreSQL provider.
- [ ] Define the `User` model with:
  - [ ] UUID `id`.
  - [ ] Unique `email`.
  - [ ] `passwordHash`.
  - [ ] `displayName`.
  - [ ] `createdAt`.
  - [ ] Prisma-managed `updatedAt` if needed by update behavior.
- [ ] Preserve ISO timestamp output behavior at the API boundary.
- [ ] Run `prisma validate`.
- [ ] Run `prisma generate`.
- [ ] Create the initial migration.
- [ ] Verify the migration applies with `prisma migrate deploy`.

Acceptance criteria:

- The schema validates successfully.
- The generated client is available to TypeScript.
- The initial migration creates the expected table and unique email constraint.

## Phase 3: Prisma Client Boundary

Status: **Not started**

- [ ] Create `src/lib/prisma.ts`.
- [ ] Export one shared `PrismaClient` instance.
- [ ] Avoid creating a client per request.
- [ ] Follow the repository's native ESM and strict TypeScript conventions.
- [ ] Add graceful shutdown handling only if it fits the existing app lifecycle.

Acceptance criteria:

- Database access uses one shared client boundary.
- No route or controller creates its own Prisma client.

## Phase 4: Data Access Services

Status: **Not started**

- [ ] Create a user service or repository for database operations.
- [ ] Add lookup by email.
- [ ] Add lookup by ID.
- [ ] Add user creation.
- [ ] Add profile listing.
- [ ] Add profile update.
- [ ] Add hard deletion.
- [ ] Keep services independent of Express `Request` and `Response` objects.
- [ ] Prevent `passwordHash` from crossing the response boundary.
- [ ] Preserve UUID and timestamp mapping.

Acceptance criteria:

- Controllers orchestrate HTTP behavior without owning database queries.
- Data-access operations are independently testable.

## Phase 5: Authentication Migration

Status: **Not started**

- [ ] Replace the `users` `Map` in `auth-controller.ts`.
- [ ] Implement registration with Prisma user creation.
- [ ] Map unique email conflicts to HTTP `409`.
- [ ] Preserve `201` registration response shape: `{ id, email }`.
- [ ] Implement login with lookup by email.
- [ ] Verify passwords through `verifyPassword`.
- [ ] Preserve generic `401 { error: 'invalid credentials' }` behavior.
- [ ] Preserve existing structured logging without logging passwords or hashes.

Acceptance criteria:

- Registration persists users in PostgreSQL.
- Duplicate registration returns `409`.
- Valid login returns `200`.
- Invalid email and invalid password produce the same generic `401` response.

## Phase 6: Profile Migration

Status: **Not started**

- [ ] Replace the `profiles` `Map` in `user-controller.ts`.
- [ ] Require a registered user before `POST /users` succeeds.
- [ ] Implement profile creation against the `User` row.
- [ ] Preserve `201` profile response shape.
- [ ] Implement list with `GET /users`.
- [ ] Implement lookup with `GET /users/:id`.
- [ ] Implement update with `PUT /users/:id`.
- [ ] Implement hard deletion with `DELETE /users/:id`.
- [ ] Preserve existing `404` behavior and error envelopes.
- [ ] Return only public user/profile fields.

Acceptance criteria:

- All profile routes operate against PostgreSQL.
- Unregistered profile creation is rejected according to the selected contract.
- Missing records return the existing `404` behavior.
- Deletion removes the database row.

## Phase 7: Error Handling

Status: **Not started**

- [ ] Add narrow Prisma error mapping for unique constraint violations.
- [ ] Add record-not-found mapping where needed.
- [ ] Map connection or unexpected database failures to the existing internal error response.
- [ ] Do not expose SQL, connection strings, or Prisma internals.
- [ ] Do not swallow errors in controllers.

Acceptance criteria:

- Expected database conflicts map to stable API responses.
- Unexpected database failures do not leak implementation details.

## Phase 8: Tests

Status: **Not started**

- [ ] Add `auth-controller.test.ts`.
- [ ] Cover successful registration.
- [ ] Cover duplicate email registration.
- [ ] Cover successful login.
- [ ] Cover invalid email login.
- [ ] Cover invalid password login.
- [ ] Cover missing credentials.
- [ ] Adapt `user-controller.test.ts` to PostgreSQL fixtures.
- [ ] Cover profile creation for a registered user.
- [ ] Cover rejection for an unregistered user.
- [ ] Cover list, get, update, and delete.
- [ ] Cover missing records.
- [ ] Cover duplicate profile creation after the duplicate behavior decision.
- [ ] Reset database state between tests.
- [ ] Add focused service/repository tests where they provide useful boundary coverage.
- [ ] Keep existing password-service tests passing.

Acceptance criteria:

- Tests use the dedicated PostgreSQL test database.
- Tests are isolated and repeatable.
- Controller tests assert HTTP status, payload, and error behavior rather than implementation details.

## Phase 9: Scripts and Documentation

Status: **Not started**

- [ ] Add repeatable Prisma scripts to `package.json`.
- [ ] Document environment variables in `README.md`.
- [ ] Document local PostgreSQL startup.
- [ ] Document migration and deployment commands.
- [ ] Document test database setup and cleanup.
- [ ] Document the one-user-model and registration prerequisite decisions.

Acceptance criteria:

- A new developer can install dependencies, configure PostgreSQL, migrate the schema, run tests, and start the service from the documented instructions.

## Verification Gates

- [ ] `npx prisma validate`
- [ ] `npx prisma generate`
- [ ] `npx prisma migrate deploy` against a disposable database
- [ ] Focused auth tests
- [ ] Focused user/profile tests
- [ ] `npm test -- --run`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Manual register smoke test
- [ ] Manual login smoke test
- [ ] Manual profile CRUD smoke test
- [ ] Manual duplicate email and invalid credential checks
- [ ] Final inspection confirms no controller-owned Maps remain
- [ ] Final inspection confirms no `passwordHash` is returned
- [ ] Final inspection confirms no direct `process.env` access outside `src/config.ts`
- [ ] Final inspection confirms Prisma is not instantiated per request

## Expected Files

Modify:

- `package.json`
- `README.md`
- `src/config.ts`
- `src/controllers/auth-controller.ts`
- `src/controllers/user-controller.ts`
- `src/controllers/user-controller.test.ts`

Create:

- `prisma/schema.prisma`
- `prisma/migrations/`
- `src/lib/prisma.ts`
- `src/services/user-service.ts` or repository modules
- `src/controllers/auth-controller.test.ts`
- Additional focused service/repository tests as needed

## Progress Log

| Date | Status | Notes |
|---|---|---|
| 2026-09-21 | Planned | Migration scope and architecture decisions recorded. Implementation has not started. |
| 2026-09-21 | Phase 1 complete | Installed Prisma dependencies, added validated database configuration, documented separate local/test/deployment requirements, and protected test mode from using the development database. |
