import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';

import { ConfigService } from '@job-board/config';
import { DatabaseService, User } from '@job-board/db';

import { JwtPayload } from './interfaces';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly db: DatabaseService,
  ) {}

  /**
   * Generate access token (JWT)
   */
  generateAccessToken(user: User, sessionId: string): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      sessionId,
    };

    return this.jwtService.sign(payload as object, {
      expiresIn: this.getAccessTokenExpirySeconds(),
    });
  }

  /**
   * Generate refresh token (random string, stored hashed)
   */
  generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  /**
   * Hash refresh token for storage
   */
  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Store refresh token in database (hashed)
   */
  async storeRefreshToken(sessionId: string, token: string): Promise<void> {
    const hashedToken = this.hashRefreshToken(token);
    const expiresAt = this.calculateExpiry(this.config.jwtRefreshTokenExpiry);

    await this.db.refreshTokens.save({
      sessionId,
      token: hashedToken,
      expiresAt,
    });
  }

  /**
   * Validate and retrieve refresh token
   * Returns the session ID if valid, null if invalid
   */
  async validateRefreshToken(token: string): Promise<string | null> {
    const hashedToken = this.hashRefreshToken(token);

    const refreshToken = await this.db.refreshTokens.findOne({
      where: { token: hashedToken },
    });

    if (!refreshToken) {
      return null;
    }

    if (refreshToken.expiresAt < new Date()) {
      // Clean up expired token
      await this.db.refreshTokens.delete(refreshToken.id);
      return null;
    }

    return refreshToken.sessionId;
  }

  /**
   * Rotate refresh token (delete old, create new)
   */
  async rotateRefreshToken(
    sessionId: string,
    oldToken: string,
  ): Promise<string> {
    const hashedOldToken = this.hashRefreshToken(oldToken);

    // Delete old token
    await this.db.refreshTokens.delete({ token: hashedOldToken });

    // Generate and store new token
    const newToken = this.generateRefreshToken();
    await this.storeRefreshToken(sessionId, newToken);

    return newToken;
  }

  /**
   * Delete refresh token by session ID
   */
  async deleteRefreshToken(sessionId: string): Promise<void> {
    await this.db.refreshTokens.delete({ sessionId });
  }

  /**
   * Get access token expiry in seconds
   */
  getAccessTokenExpirySeconds(): number {
    return this.parseExpiryToSeconds(this.config.jwtAccessTokenExpiry);
  }

  /**
   * Calculate expiry date from duration string (e.g., "15m", "7d")
   */
  private calculateExpiry(duration: string): Date {
    const seconds = this.parseExpiryToSeconds(duration);
    return new Date(Date.now() + seconds * 1000);
  }

  /**
   * Parse expiry string to seconds
   */
  private parseExpiryToSeconds(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        throw new Error(`Unknown time unit: ${unit}`);
    }
  }
}
