import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserRole } from '@job-board/db';

export class UserProfileDto {
  @ApiProperty({ description: 'User first name', example: 'John' })
  firstName!: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  lastName!: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+385911234567',
    nullable: true,
  })
  phone!: string | null;

  @ApiPropertyOptional({
    description: 'Professional headline',
    example: 'Senior Software Developer',
    nullable: true,
  })
  headline!: string | null;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'User email address',
    format: 'email',
    example: 'john.doe@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    enumName: 'UserRole',
    example: 'USER',
  })
  role!: UserRole;

  @ApiProperty({
    description: 'Tenant ID',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  tenantId!: string;

  @ApiProperty({ description: 'Whether email is verified', example: false })
  emailVerified!: boolean;

  @ApiProperty({ description: 'User preferred language', example: 'en' })
  language!: string;

  @ApiPropertyOptional({
    description: 'Organization ID (for CLIENT/CLIENT_ADMIN users)',
    format: 'uuid',
    nullable: true,
  })
  organizationId!: string | null;

  @ApiProperty({
    description: 'Account creation timestamp',
    format: 'date-time',
    example: '2026-01-15T10:00:00.000Z',
  })
  createdAt!: Date;

  @ApiPropertyOptional({
    description: 'User profile information',
    type: UserProfileDto,
  })
  profile?: UserProfileDto;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token (short-lived, default 15 minutes)',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ...',
  })
  accessToken!: string;

  @ApiProperty({
    description:
      'Refresh token for obtaining new access tokens (long-lived, default 7 days)',
    example:
      'a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789...',
  })
  refreshToken!: string;

  @ApiProperty({
    description: 'Access token expiry time in seconds',
    example: 900,
  })
  expiresIn!: number;

  @ApiPropertyOptional({
    description:
      'User data (included on register/login, omitted on token refresh)',
    type: UserResponseDto,
  })
  user?: UserResponseDto;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Logged out successfully',
  })
  message!: string;
}
