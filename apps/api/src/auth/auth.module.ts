import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigModule, ConfigService } from '@job-board/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { SessionService } from './session.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenService } from './token.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.jwtSecret,
        signOptions: {
          // Default expiry, can be overridden per-sign
          expiresIn: 900, // 15 minutes in seconds
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    SessionService,
    JwtStrategy,
    // Register JwtAuthGuard globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Register RolesGuard globally (runs after JwtAuthGuard)
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService, TokenService, SessionService],
})
export class AuthModule {}
