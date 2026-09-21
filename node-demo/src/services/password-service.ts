import bcrypt from 'bcrypt';

const saltRounds = 12;

/**
 * Hashes a plaintext password for storage.
 *
 * @param password The plaintext password to hash.
 * @returns The bcrypt password hash.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Checks a plaintext password against a stored bcrypt hash.
 *
 * @param password The plaintext password to verify.
 * @param passwordHash The stored bcrypt hash.
 * @returns Whether the password matches the hash.
 */
export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}