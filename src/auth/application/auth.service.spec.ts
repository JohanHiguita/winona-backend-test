import { UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

describe('AuthService (unit)', () => {
  const makeJwtService = (partial?: Partial<JwtService>): JwtService =>
    ({
      signAsync: jest.fn().mockResolvedValue('test.jwt.token'),
      ...partial,
    }) as unknown as JwtService;

  const envSnapshot = () => ({ ...process.env });
  let baseEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    baseEnv = envSnapshot();
    process.env.AUTH_USERNAME = 'admin';
    process.env.AUTH_PASSWORD = 'admin';
    delete process.env.AUTH_PASSWORD_HASH;
    process.env.JWT_EXPIRES_IN_SECONDS = '3600';
  });

  afterEach(() => {
    process.env = baseEnv;
  });

  it('returns access token on valid credentials (plaintext)', async () => {
    const jwtService = makeJwtService();
    const service = new AuthService(jwtService);

    const res = await service.login({ username: 'admin', password: 'admin' });

    expect(res).toEqual({
      access_token: 'test.jwt.token',
      token_type: 'Bearer',
      expires_in: 3600,
    });
  });

  it('supports bcrypt hash when AUTH_PASSWORD_HASH is set', async () => {
    const jwtService = makeJwtService();
    const service = new AuthService(jwtService);

    process.env.AUTH_PASSWORD_HASH = bcrypt.hashSync('secret', 10);
    delete process.env.AUTH_PASSWORD;

    await expect(
      service.login({ username: 'admin', password: 'secret' }),
    ).resolves.toMatchObject({
      access_token: 'test.jwt.token',
      token_type: 'Bearer',
    });
  });

  it('throws UnauthorizedException on invalid credentials', async () => {
    const jwtService = makeJwtService();
    const service = new AuthService(jwtService);

    await expect(
      service.login({ username: 'admin', password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

