import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Request } from 'express';

import { ApiExceptions } from '@borg/backend-lib';
import { DatabaseService, User, UserRole } from '@borg/db';

import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  UserResponseDto,
} from './dto';
import { RequestUser } from './interfaces';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Register a new user
   */
  async register(dto: RegisterDto, request: Request): Promise<AuthResponseDto> {
    // Check if email already exists for this tenant
    const existingUser = await this.db.users.findOne({
      where: {
        email: dto.email,
        tenantId: dto.tenantId,
      },
    });

    if (existingUser) {
      throw ApiExceptions.userAlreadyExists();
    }

    // Hash password
    const passwordHash = await this.hashPassword(dto.password);

    // Create user
    const user = this.db.users.create({
      email: dto.email,
      passwordHash,
      tenantId: dto.tenantId,
      role: UserRole.USER,
      emailVerified: false,
      language: 'en',
    });

    const savedUser = await this.db.users.save(user);

    // Create user profile
    const profile = this.db.userProfiles.create({
      userId: savedUser.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    await this.db.userProfiles.save(profile);

    // Create session and tokens
    const session = await this.sessionService.createSession(savedUser.id, request);
    const accessToken = this.tokenService.generateAccessToken(savedUser, session.id);
    const refreshToken = this.tokenService.generateRefreshToken();
    await this.tokenService.storeRefreshToken(session.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.tokenService.getAccessTokenExpirySeconds(),
      user: this.mapUserToResponse(savedUser, {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: null,
        headline: null,
      }),
    };
  }

  /**
   * Login user
   */
  async login(dto: LoginDto, request: Request): Promise<AuthResponseDto> {
    // Find user - use generic error for security (don't reveal if email exists)
    const user = await this.db.users.findOne({
      where: {
        email: dto.email,
        tenantId: dto.tenantId,
      },
      relations: ['profile'],
    });

    if (!user || !user.passwordHash) {
      throw ApiExceptions.invalidCredentials();
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      throw ApiExceptions.invalidCredentials();
    }

    // Create session and tokens
    const session = await this.sessionService.createSession(user.id, request);
    const accessToken = this.tokenService.generateAccessToken(user, session.id);
    const refreshToken = this.tokenService.generateRefreshToken();
    await this.tokenService.storeRefreshToken(session.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.tokenService.getAccessTokenExpirySeconds(),
      user: this.mapUserToResponse(user, user.profile),
    };
  }

  /**
   * Refresh tokens
   */
  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    // Validate refresh token
    const sessionId = await this.tokenService.validateRefreshToken(refreshToken);

    if (!sessionId) {
      throw ApiExceptions.refreshTokenInvalid();
    }

    // Get session and user
    const session = await this.sessionService.getSession(sessionId);

    if (!session || session.expiresAt < new Date()) {
      throw ApiExceptions.sessionExpired();
    }

    const user = await this.db.users.findOne({
      where: { id: session.userId },
    });

    if (!user) {
      throw ApiExceptions.userNotFound();
    }

    // Rotate refresh token
    const newRefreshToken = await this.tokenService.rotateRefreshToken(
      sessionId,
      refreshToken,
    );

    // Generate new access token
    const accessToken = this.tokenService.generateAccessToken(user, sessionId);

    // Update session activity
    await this.sessionService.updateActivity(sessionId);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: this.tokenService.getAccessTokenExpirySeconds(),
    };
  }

  /**
   * Logout user (delete session)
   */
  async logout(sessionId: string): Promise<void> {
    await this.sessionService.deleteSession(sessionId);
  }

  /**
   * Get current user with profile
   */
  async getCurrentUser(requestUser: RequestUser): Promise<UserResponseDto> {
    const user = await this.db.users.findOne({
      where: { id: requestUser.id },
      relations: ['profile'],
    });

    if (!user) {
      throw ApiExceptions.userNotFound();
    }

    return this.mapUserToResponse(user, user.profile);
  }

  /**
   * Hash password with Argon2
   */
  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });
  }

  /**
   * Verify password against hash
   */
  private async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  /**
   * Map User entity to response DTO
   */
  private mapUserToResponse(
    user: User,
    profile?: {
      firstName: string;
      lastName: string;
      phone: string | null;
      headline: string | null;
    } | null,
  ): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      emailVerified: user.emailVerified,
      language: user.language,
      organizationId: user.organizationId,
      createdAt: user.createdAt,
      profile: profile
        ? {
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            headline: profile.headline,
          }
        : undefined,
    };
  }
}
