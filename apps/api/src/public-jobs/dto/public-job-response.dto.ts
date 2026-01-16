import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EmploymentType,
  ExperienceLevel,
  JobStatus,
  JobTier,
  PromotionType,
  RemoteOption,
  SalaryPeriod,
} from '@job-board/db';

export class PublicOrganizationDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'TechCorp Inc.' })
  name!: string;

  @ApiProperty({ example: 'techcorp-inc' })
  slug!: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  logoUrl!: string | null;

  @ApiPropertyOptional({ example: 'Technology' })
  industry!: string | null;
}

export class PublicCategoryDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'software-engineering' })
  slug!: string;

  @ApiProperty({ example: 'Software Engineering' })
  name!: string;
}

export class PublicLocationDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'new-york' })
  slug!: string;

  @ApiProperty({ example: 'New York, NY' })
  name!: string;
}

export class PublicJobResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Senior Software Engineer' })
  title!: string;

  @ApiProperty({ example: 'senior-software-engineer' })
  slug!: string;

  @ApiProperty({ description: 'Job description (HTML)' })
  description!: string;

  @ApiPropertyOptional({ description: 'Job requirements' })
  requirements!: string | null;

  @ApiPropertyOptional({ description: 'Benefits and perks' })
  benefits!: string | null;

  @ApiProperty({ type: PublicOrganizationDto })
  organization!: PublicOrganizationDto;

  @ApiPropertyOptional({ type: PublicCategoryDto })
  category!: PublicCategoryDto | null;

  @ApiPropertyOptional({ type: PublicLocationDto })
  location!: PublicLocationDto | null;

  @ApiProperty({ enum: EmploymentType })
  employmentType!: EmploymentType;

  @ApiProperty({ enum: RemoteOption })
  remoteOption!: RemoteOption;

  @ApiPropertyOptional({ enum: ExperienceLevel })
  experienceLevel!: ExperienceLevel | null;

  @ApiPropertyOptional({ example: 80000 })
  salaryMin!: number | null;

  @ApiPropertyOptional({ example: 120000 })
  salaryMax!: number | null;

  @ApiProperty({ example: 'USD' })
  salaryCurrency!: string;

  @ApiPropertyOptional({ enum: SalaryPeriod })
  salaryPeriod!: SalaryPeriod | null;

  @ApiProperty({ enum: JobTier })
  tier!: JobTier;

  @ApiProperty({ type: [String], enum: PromotionType })
  promotions!: PromotionType[];

  @ApiProperty({ description: 'Number of views' })
  viewCount!: number;

  @ApiProperty({ format: 'date-time' })
  publishedAt!: Date;

  @ApiProperty({ format: 'date-time' })
  expiresAt!: Date;
}

export class PublicJobListItemDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ type: PublicOrganizationDto })
  organization!: PublicOrganizationDto;

  @ApiPropertyOptional({ type: PublicCategoryDto })
  category!: PublicCategoryDto | null;

  @ApiPropertyOptional({ type: PublicLocationDto })
  location!: PublicLocationDto | null;

  @ApiProperty({ enum: EmploymentType })
  employmentType!: EmploymentType;

  @ApiProperty({ enum: RemoteOption })
  remoteOption!: RemoteOption;

  @ApiPropertyOptional()
  salaryMin!: number | null;

  @ApiPropertyOptional()
  salaryMax!: number | null;

  @ApiProperty()
  salaryCurrency!: string;

  @ApiProperty({ enum: JobTier })
  tier!: JobTier;

  @ApiProperty({ type: [String], enum: PromotionType })
  promotions!: PromotionType[];

  @ApiProperty({ format: 'date-time' })
  publishedAt!: Date;
}

export class PublicJobSearchResponseDto {
  @ApiProperty({ type: [PublicJobListItemDto] })
  data!: PublicJobListItemDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  totalPages!: number;
}

export class FeaturedJobsResponseDto {
  @ApiProperty({ type: [PublicJobListItemDto] })
  featured!: PublicJobListItemDto[];

  @ApiProperty({ type: [PublicJobListItemDto] })
  recent!: PublicJobListItemDto[];
}
