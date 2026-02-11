import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/auth.service';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('Missing required environment variable: JWT_SECRET');
        }
        const rawExpires = config.get<string>('JWT_EXPIRES_IN_SECONDS');
        const expiresIn = rawExpires ? Number(rawExpires) : 3600;
        if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
          throw new Error(
            'JWT_EXPIRES_IN_SECONDS must be a positive number',
          );
        }
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

