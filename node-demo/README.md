# Copilot Training Demo Project — Node.js / TypeScript

A small Express + TypeScript service used by the trainer for live demos during the morning of the Copilot training session.

## PostgreSQL Configuration

The database migration uses PostgreSQL through Prisma. PostgreSQL 14 or newer is recommended for local development, testing, and deployment.

Create separate databases for development and tests:

```text
node_demo       # local development
node_demo_test  # automated tests
```

Set these environment variables in a local `.env` file or in the process environment. `.env` files are ignored by Git.

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/node_demo
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/node_demo_test
```

When `NODE_ENV=test`, the application uses only `TEST_DATABASE_URL` and never falls back to `DATABASE_URL`. If `TEST_DATABASE_URL` is not set, configuration defaults to the dedicated local `node_demo_test` database.

For deployment, provide `DATABASE_URL` through the platform's secret or environment-variable configuration. Do not commit connection strings or credentials. The Prisma schema and migration commands will be added in the next migration phase.
