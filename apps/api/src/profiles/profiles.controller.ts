import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiErrorResponseDto } from '@/common/dto/api-error-response.dto';

import { CurrentUser } from '../auth/decorators';
import { RequestUser } from '../auth/interfaces';
import { ProfilesService } from './profiles.service';
import { MeResponseDto, ProfileResponseDto, UpdateProfileDto } from './dto';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  /**
   * Get current user info with profile
   */
  @Get('me')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Get current authenticated user with their profile.',
  })
  @ApiResponse({
    status: 200,
    description: 'User info',
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  async getMe(@CurrentUser() user: RequestUser): Promise<MeResponseDto> {
    return this.profilesService.getMe(user);
  }

  /**
   * Get user profile
   */
  @Get()
  @ApiOperation({
    summary: 'Get my profile',
    description: 'Get the current user profile details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile details',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  async getProfile(
    @CurrentUser() user: RequestUser,
  ): Promise<ProfileResponseDto | null> {
    return this.profilesService.getProfile(user);
  }

  /**
   * Update user profile
   */
  @Patch()
  @ApiOperation({
    summary: 'Update profile',
    description:
      'Update user profile. Creates profile if it does not exist.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @CurrentUser() user: RequestUser,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.updateProfile(user, dto);
  }

  /**
   * Clear profile data
   */
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Clear profile',
    description: 'Clear optional profile fields (keeps name).',
  })
  @ApiResponse({
    status: 204,
    description: 'Profile cleared',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  async clearProfile(@CurrentUser() user: RequestUser): Promise<void> {
    return this.profilesService.clearProfile(user);
  }
}
