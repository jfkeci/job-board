import { Injectable } from '@nestjs/common';
import { ApiExceptions } from '@job-board/backend-lib';
import { DatabaseService, UserProfile } from '@job-board/db';

import { RequestUser } from '../auth/interfaces';
import { MeResponseDto, ProfileResponseDto, UpdateProfileDto } from './dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Get current user with profile
   */
  async getMe(user: RequestUser): Promise<MeResponseDto> {
    const dbUser = await this.db.users.findOne({
      where: { id: user.id },
      relations: ['profile'],
    });

    if (!dbUser) {
      throw ApiExceptions.userNotFound();
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      profile: dbUser.profile ? this.mapToResponse(dbUser.profile) : null,
    };
  }

  /**
   * Get user profile
   */
  async getProfile(user: RequestUser): Promise<ProfileResponseDto | null> {
    const profile = await this.db.userProfiles.findOne({
      where: { userId: user.id },
    });

    return profile ? this.mapToResponse(profile) : null;
  }

  /**
   * Create or update user profile
   */
  async updateProfile(
    user: RequestUser,
    dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    let profile = await this.db.userProfiles.findOne({
      where: { userId: user.id },
    });

    if (profile) {
      // Update existing profile
      await this.db.userProfiles.update(profile.id, {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.headline !== undefined && { headline: dto.headline }),
        ...(dto.summary !== undefined && { summary: dto.summary }),
      });

      profile = await this.db.userProfiles.findOneOrFail({
        where: { id: profile.id },
      });
    } else {
      // Create new profile
      if (!dto.firstName || !dto.lastName) {
        throw ApiExceptions.validationFailed([
          {
            field: 'firstName',
            code: 'VALIDATION_FIELD_REQUIRED',
            message: 'First name is required',
          },
          {
            field: 'lastName',
            code: 'VALIDATION_FIELD_REQUIRED',
            message: 'Last name is required',
          },
        ]);
      }

      profile = await this.db.userProfiles.save({
        userId: user.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone || null,
        headline: dto.headline || null,
        summary: dto.summary || null,
      });
    }

    return this.mapToResponse(profile);
  }

  /**
   * Delete user profile (soft delete by clearing fields)
   */
  async clearProfile(user: RequestUser): Promise<void> {
    const profile = await this.db.userProfiles.findOne({
      where: { userId: user.id },
    });

    if (profile) {
      await this.db.userProfiles.update(profile.id, {
        phone: null,
        headline: null,
        summary: null,
        cvFileId: null,
      });
    }
  }

  // ==================== Private Helpers ====================

  private mapToResponse(profile: UserProfile): ProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      cvFileId: profile.cvFileId,
      headline: profile.headline,
      summary: profile.summary,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
