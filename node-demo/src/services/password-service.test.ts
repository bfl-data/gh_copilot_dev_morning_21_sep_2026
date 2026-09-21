import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password-service.js';

describe('password service', () => {
  it('hashes a password that can be verified', async () => {
    const passwordHash = await hashPassword('correct horse battery staple');

    await expect(verifyPassword('correct horse battery staple', passwordHash)).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const passwordHash = await hashPassword('correct horse battery staple');

    await expect(verifyPassword('wrong password', passwordHash)).resolves.toBe(false);
  });

  it('does not return the plaintext password as the hash', async () => {
    const password = 'correct horse battery staple';

    await expect(hashPassword(password)).resolves.not.toBe(password);
  });
});