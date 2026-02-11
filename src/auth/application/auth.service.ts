import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

type AuthUser = {
  id: string;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Minimal auth for assessment:
   * - Default credentials: admin/admin
   * - Override with AUTH_USERNAME + AUTH_PASSWORD (plaintext)
   * - Or provide AUTH_PASSWORD_HASH (bcrypt) to avoid storing plaintext
   */
  async login(args: { username: string; password: string }): Promise<{
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
  }> {
    const user = await this.validateUser(args);
    const expiresInSeconds = Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 3600);

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
    const expectedUsername = process.env.AUTH_USERNAME ?? 'admin';
    const expectedPassword = process.env.AUTH_PASSWORD ?? 'admin';
    const expectedPasswordHash = process.env.AUTH_PASSWORD_HASH;

    if (args.username !== expectedUsername) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (expectedPasswordHash) {
      const ok = await bcrypt.compare(args.password, expectedPasswordHash);
      if (!ok) throw new UnauthorizedException('Invalid credentials');
    } else {
      if (args.password !== expectedPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    return { id: 'user-1', username: expectedUsername };
  }
}

