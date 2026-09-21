// The only module allowed to read `process.env`. Everything else imports
// from here, per the standards in .github/copilot-instructions.md.

/**
 * Reads an environment variable, falling back to a default.
 *
 * @param key - Environment variable name.
 * @param fallback - Value to use when the variable is unset or empty.
 * @returns The resolved value.
 */
function env(key: string, fallback: string): string {
  const value = process.env[key];
  return value === undefined || value === '' ? fallback : value;
}

const nodeEnv = env('NODE_ENV', 'development');
const databaseUrl =
  nodeEnv === 'test'
    ? env('TEST_DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/node_demo_test')
    : env('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/node_demo');

if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
  throw new Error('DATABASE_URL must be a PostgreSQL connection string');
}

export const config = {
  /** Port the Express server binds to. */
  port: Number(env('PORT', '3000')),
  /** Pino log level. */
  logLevel: env('LOG_LEVEL', 'info'),
  /** Runtime environment name. */
  nodeEnv,
  /** PostgreSQL connection string selected for the current environment. */
  databaseUrl,
} as const;
