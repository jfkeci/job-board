import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserRole } from '@job-board/db';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'New user role',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role!: UserRole;
}

export class UpdateOrganizationVerificationDto {
  @ApiProperty({
    description: 'Verification status',
  })
  @IsBoolean()
  isVerified!: boolean;
}

export class UpdateTenantDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  defaultLanguage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  slug!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty({
    description: 'Translations by language code',
    example: { en: 'Engineering', hr: 'Inženjerstvo' },
  })
  translations!: Record<string, string>;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @ApiPropertyOptional({ description: 'Translations by language code' })
  @IsOptional()
  translations?: Record<string, string>;
}

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  slug!: string;

  @ApiProperty({ enum: ['CITY', 'REGION', 'REMOTE'] })
  @IsString()
  type!: string;

  @ApiProperty({ format: 'uuid' })
  @IsString()
  tenantId!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateLocationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;
}
