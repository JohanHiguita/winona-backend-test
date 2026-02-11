export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getJwtSecret(): string {
  return requireEnv('JWT_SECRET');
}

export function getJwtExpiresInSeconds(): number {
  const raw = process.env.JWT_EXPIRES_IN_SECONDS;
  if (!raw) return 3600;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('JWT_EXPIRES_IN_SECONDS must be a positive number');
  }
  return value;
}

export function getAuthCredentials(): {
  username: string;
  password?: string;
  passwordHash?: string;
} {
  const username = requireEnv('AUTH_USERNAME');
  const password = process.env.AUTH_PASSWORD;
  const passwordHash = process.env.AUTH_PASSWORD_HASH;

  if (!password && !passwordHash) {
    throw new Error(
      'AUTH_PASSWORD or AUTH_PASSWORD_HASH must be provided for authentication',
    );
  }

  return { username, password, passwordHash };
}
