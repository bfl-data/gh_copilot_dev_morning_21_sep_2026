---
applyTo: '**/*.{test,spec}.{ts,js}'
---

When generating or modifying test code in this repository, follow these rules exactly.

## Project-specific context
- This project is a Node.js 20+ TypeScript Express API using native ESM.
- The test runner is Vitest, not Jest.
- The app uses in-memory demo stores, Zod validation, and central error handling.
- Tests live next to source files as `*.test.ts`.
- Controllers should be tested as HTTP orchestration units, not as full end-to-end application integrations.

## Core principles
- Follow the AAA pattern: Arrange, Act, Assert.
- Keep each test focused on one behavior.
- Prefer deterministic tests with no real network, DB, or external API calls.
- Use the smallest realistic unit boundary. For this project, that is usually a controller method, utility function, or validation flow.
- Never test framework internals or implementation details that are not observable from the API contract.
- Use descriptive names in plain English without a `should` prefix.
  - Good: `it('returns 404 when the user profile does not exist', ...)`
  - Avoid: `it('should return 404 when the user profile does not exist', ...)`

## Backend API testing standards
- Assert behavior that matters to consumers:
  - HTTP status code
  - response payload shape
  - specific error codes/messages
  - validation failures
  - edge-case outcomes
- For controller tests, mock the `Request` and `Response` objects minimally and explicitly.
- When a controller calls a store or service, isolate the state for each test and reset it in `beforeEach` or `afterEach`.
- Use helper factories for common request objects and response objects instead of repeating ad hoc objects throughout the test file.
- Use `vi.fn()` for status and JSON methods, and assert with `toHaveBeenCalledWith` and `toHaveBeenCalledTimes` when appropriate.

## Validation and error-handling expectations
- For Zod validation failures, tests should assert the failure is thrown or mapped through the error handler contract as appropriate.
- For invalid input, assert the rejection or relevant error envelope, not just that a method returned `undefined`.
- Preserve the repository’s error conventions:
  - `400` for malformed or invalid input
  - `401` for invalid credentials without leaking account existence
  - `404` for missing resources
  - `409` for duplicate registration conflicts
  - `500` for unexpected internal failures
- Do not add assertions for unhandled internals. Validate the outward-facing behavior.

## In-memory state and isolation
- This repo uses process-local in-memory maps for demo data; tests must reset this state between cases.
- Do not assume persistence, DB transactions, or concurrency guarantees that are not part of the project.
- Use fresh objects and explicit setup for every test to avoid hidden shared state.
- Avoid global mutable state leaking across tests.

## Utilities and pure logic
- For utility functions, test real behavior with representative inputs and edge cases.
- Cover both success and failure cases, including empty, invalid, boundary, and error-path inputs.
- Preserve API contract and return semantics exactly; do not hide bad input behind implementation assumptions.
- Keep tests deterministic and free of timers or date-based randomness unless the code explicitly depends on them.

## Mocking rules
- Mock external boundaries only.
  - network calls
  - filesystem access
  - timers/date if required
  - other non-deterministic dependencies
- Do not mock the unit under test itself unless the test is specifically validating a contract boundary.
- Mock as little as possible while still isolating the behavior under test.
- Never assert on mock implementation details that do not affect observable behavior.

## Required coverage for generated tests
When implementing or updating tests, always include:
- Happy path
- Failure path
- Edge case

For example, a complete controller test set usually covers:
- valid request succeeds
- missing resource yields `404`
- invalid input is rejected or produces validation error
- duplicate or conflicting state yields the correct status and envelope

## Formatting and assertion style
- Use consistent Vitest APIs: `describe`, `it`, `test`, `beforeEach`, `afterEach`, `expect`, and `vi`.
- Prefer direct assertions like `toEqual`, `toStrictEqual`, `toBe`, `toBeDefined`, `toHaveBeenCalledWith`, and `rejects.toThrow`.
- Keep assertions specific and readable.
- Use clear variable names and minimal inline noise.
- Avoid snapshot-only tests for logic unless the snapshot is the actual API contract being preserved and is not a substitute for behavioral assertions.

## Hard prohibitions
- No disabled or skipped tests without explicit reason and review.
- No `console.log` or `console.error` in tests.
- No real credentials, secrets, or production-like data.
- No broad integration tests that duplicate controller-level logic.
- No tests that only confirm mock calls were made while ignoring the actual returned behavior.
- No `any` in production test code when the type can be expressed more precisely.

## Repository-specific expectations
- Test files must be located alongside their source file as `*.test.ts`.
- Use ESM imports with explicit `.js` extension patterns when importing local modules in TypeScript source/tests.
- Keep tests aligned with the repo’s strict TypeScript settings and Node 20+ runtime.
- Follow the existing controller patterns and avoid introducing unnecessary abstraction or test scaffolding when a small, direct test is clearer.

## Output for Copilot generation
When generating tests, prefer this pattern:
1. Arrange the request and state.
2. Act by invoking the controller or function.
3. Assert the status, payload, and error semantics.
4. Include one success case, one failure case, and one edge case.
5. Keep the test file readable, compact, and very close to the real contract.

This keeps the suite fast, maintainable, and aligned with enterprise Node.js testing best practices without overengineering the project.
