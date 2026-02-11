import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { getAuthCredentials, getJwtExpiresInSeconds } from '../auth.config';

type AuthUser = {
  id: string;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Minimal auth for assessment:
   * - Credentials are provided via environment variables
   * - Use AUTH_PASSWORD_HASH (bcrypt) to avoid plaintext secrets
   */
  async login(args: { username: string; password: string }): Promise<{
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
  }> {
    const user = await this.validateUser(args);
    const expiresInSeconds = getJwtExpiresInSeconds();

    const payload = { sub: user.id, username: user.username };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: expiresInSeconds,
    });

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: expiresInSeconds,
    };
  }

  private async validateUser(args: {
    username: string;
    password: string;
  }): Promise<AuthUser> {
    const { username, password, passwordHash } = getAuthCredentials();

    if (args.username !== username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (passwordHash) {
      const ok = await bcrypt.compare(args.password, passwordHash);
      if (!ok) throw new UnauthorizedException('Invalid credentials');
    } else {
      if (args.password !== password) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    return { id: 'user-1', username };
  }
}

