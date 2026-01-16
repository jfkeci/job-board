import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminUserDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  role!: string;

  @ApiProperty({ format: 'uuid' })
  tenantId!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  organizationId!: string | null;

  @ApiPropertyOptional()
  firstName!: string | null;

  @ApiPropertyOptional()
  lastName!: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}

export class AdminOrganizationDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional()
  description!: string | null;

  @ApiPropertyOptional()
  website!: string | null;

  @ApiPropertyOptional()
  industry!: string | null;

  @ApiPropertyOptional()
  size!: string | null;

  @ApiProperty()
  isVerified!: boolean;

  @ApiProperty({ format: 'uuid' })
  tenantId!: string;

  @ApiProperty()
  jobCount!: number;

  @ApiProperty()
  userCount!: number;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}

export class AdminTenantDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  domain!: string;

  @ApiProperty()
  defaultLanguage!: string;

  @ApiProperty({ type: [String] })
  supportedLanguages!: string[];

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  timezone!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  userCount!: number;

  @ApiProperty()
  organizationCount!: number;

  @ApiProperty()
  jobCount!: number;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}

export class AdminCategoryDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  parentId!: string | null;

  @ApiPropertyOptional({ format: 'uuid' })
  tenantId!: string | null;

  @ApiProperty()
  jobCount!: number;

  @ApiProperty({ description: 'Translations by language code' })
  translations!: Record<string, string>;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}

export class AdminLocationDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  type!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  parentId!: string | null;

  @ApiProperty({ format: 'uuid' })
  tenantId!: string;

  @ApiProperty()
  jobCount!: number;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}

export class AdminStatsDto {
  @ApiProperty()
  totalUsers!: number;

  @ApiProperty()
  totalOrganizations!: number;

  @ApiProperty()
  totalJobs!: number;

  @ApiProperty()
  activeJobs!: number;

  @ApiProperty()
  totalApplications!: number;

  @ApiProperty()
  totalTenants!: number;

  @ApiProperty()
  todayViews!: number;

  @ApiProperty()
  todaySearches!: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty()
  data!: T[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  totalPages!: number;
}

export class ImpersonationTokenDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  redirectUrl!: string;
}
