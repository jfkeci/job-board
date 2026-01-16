import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@job-board/config';
import { DatabaseService } from '@job-board/db';

import { JwtPayload, RequestUser } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly db: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  /**
   * Validates the JWT payload and returns the user object
   * Called automatically by Passport after token signature verification
   */
  async validate(payload: JwtPayload): Promise<RequestUser> {
    // Verify session still exists and is not expired
    const session = await this.db.sessions.findOne({
      where: { id: payload.sessionId },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    // Update last activity
    await this.db.sessions.update(session.id, {
      lastActivityAt: new Date(),
    });

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
      sessionId: payload.sessionId,
    };
  }
}
