import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { ConfigService } from '@borg/config';
import { DatabaseService, Session } from '@borg/db';

interface DeviceInfo {
  userAgent: string | null;
  ipAddress: string | null;
  deviceType: string | null;
}

@Injectable()
export class SessionService {
  constructor(
    private readonly config: ConfigService,
    private readonly db: DatabaseService,
  ) {}

  /**
   * Create a new session for a user
   */
  async createSession(userId: string, request: Request): Promise<Session> {
    const deviceInfo = this.extractDeviceInfo(request);
    const expiresAt = this.calculateSessionExpiry();

    const session = this.db.sessions.create({
      userId,
      userAgent: deviceInfo.userAgent,
      ipAddress: deviceInfo.ipAddress,
      deviceType: deviceInfo.deviceType,
      lastActivityAt: new Date(),
      expiresAt,
    });

    return this.db.sessions.save(session);
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    return this.db.sessions.findOne({
      where: { id: sessionId },
    });
  }

  /**
   * Update session activity timestamp
   */
  async updateActivity(sessionId: string): Promise<void> {
    await this.db.sessions.update(sessionId, {
      lastActivityAt: new Date(),
    });
  }

  /**
   * Delete session (cascades to refresh token)
   */
  async deleteSession(sessionId: string): Promise<void> {
    await this.db.sessions.delete(sessionId);
  }

  /**
   * Delete all sessions for a user
   */
  async deleteAllUserSessions(userId: string): Promise<void> {
    await this.db.sessions.delete({ userId });
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    return this.db.sessions.find({
      where: { userId },
      order: { lastActivityAt: 'DESC' },
    });
  }

  /**
   * Extract device information from request
   */
  private extractDeviceInfo(request: Request): DeviceInfo {
    const userAgent = request.headers['user-agent'] || null;
    const ipAddress = this.getClientIp(request);
    const deviceType = this.detectDeviceType(userAgent);

    return {
      userAgent,
      ipAddress,
      deviceType,
    };
  }

  /**
   * Get client IP address from request
   */
  private getClientIp(request: Request): string | null {
    // Check for forwarded IP (proxy/load balancer)
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(',')[0];
      return ips.trim();
    }

    // Check for real IP header
    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    // Fall back to socket address
    return request.socket?.remoteAddress || null;
  }

  /**
   * Detect device type from user agent
   */
  private detectDeviceType(userAgent: string | null): string | null {
    if (!userAgent) {
      return null;
    }

    const ua = userAgent.toLowerCase();

    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    }

    if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet';
    }

    return 'desktop';
  }

  /**
   * Calculate session expiry date
   */
  private calculateSessionExpiry(): Date {
    const duration = this.config.sessionExpiry;
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
