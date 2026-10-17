import argon2 from "argon2";

const options = { type: argon2.argon2id } as const;

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, options);
}

let dummyHash: Promise<string> | undefined;

/**
 * Verifies a password. When no account matches, it still checks against a
 * dummy hash so response timing doesn't reveal whether an email exists.
 */
export async function verifyPassword(hash: string | undefined, password: string): Promise<boolean> {
  if (!hash) {
    dummyHash ??= argon2.hash("not-a-real-password-placeholder", options);
    await argon2.verify(await dummyHash, password).catch(() => false);
    return false;
  }
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}
