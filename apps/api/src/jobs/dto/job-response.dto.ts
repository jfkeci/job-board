import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EmploymentType,
  ExperienceLevel,
  JobStatus,
  JobTier,
  PromotionType,
  RemoteOption,
  SalaryPeriod,
} from '@borg/db';

export class JobResponseDto {
  @ApiProperty({
    description: 'Job ID',
    format: 'uuid',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  id!: string;

  @ApiProperty({
    description: 'Job title',
    example: 'Senior Software Engineer',
  })
  title!: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'senior-software-engineer',
  })
  slug!: string;

  @ApiProperty({
    description: 'Job description',
    example: '## About the Role\n\nWe are looking for...',
  })
  description!: string;

  @ApiPropertyOptional({
    description: 'Job requirements',
    nullable: true,
  })
  requirements!: string | null;

  @ApiPropertyOptional({
    description: 'Benefits offered',
    nullable: true,
  })
  benefits!: string | null;

  @ApiProperty({
    description: 'Category ID',
    format: 'uuid',
  })
  categoryId!: string;

  @ApiPropertyOptional({
    description: 'Location ID',
    format: 'uuid',
    nullable: true,
  })
  locationId!: string | null;

  @ApiProperty({
    description: 'Employment type',
    enum: EmploymentType,
    enumName: 'EmploymentType',
  })
  employmentType!: EmploymentType;

  @ApiProperty({
    description: 'Remote work option',
    enum: RemoteOption,
    enumName: 'RemoteOption',
  })
  remoteOption!: RemoteOption;

  @ApiPropertyOptional({
    description: 'Experience level',
    enum: ExperienceLevel,
    enumName: 'ExperienceLevel',
    nullable: true,
  })
  experienceLevel!: ExperienceLevel | null;

  @ApiPropertyOptional({
    description: 'Minimum salary',
    nullable: true,
  })
  salaryMin!: number | null;

  @ApiPropertyOptional({
    description: 'Maximum salary',
    nullable: true,
  })
  salaryMax!: number | null;

  @ApiProperty({
    description: 'Salary currency',
    example: 'EUR',
  })
  salaryCurrency!: string;

  @ApiProperty({
    description: 'Salary period',
    enum: SalaryPeriod,
    enumName: 'SalaryPeriod',
  })
  salaryPeriod!: SalaryPeriod;

  @ApiProperty({
    description: 'Job tier',
    enum: JobTier,
    enumName: 'JobTier',
  })
  tier!: JobTier;

  @ApiProperty({
    description: 'Social media promotions',
    enum: PromotionType,
    enumName: 'PromotionType',
    isArray: true,
  })
  promotions!: PromotionType[];

  @ApiProperty({
    description: 'Job status',
    enum: JobStatus,
    enumName: 'JobStatus',
  })
  status!: JobStatus;

  @ApiPropertyOptional({
    description: 'Date when job was published',
    format: 'date-time',
    nullable: true,
  })
  publishedAt!: Date | null;

  @ApiPropertyOptional({
    description: 'Date when job expires',
    format: 'date-time',
    nullable: true,
  })
  expiresAt!: Date | null;

  @ApiProperty({
    description: 'Number of views',
    example: 0,
  })
  viewCount!: number;

  @ApiProperty({
    description: 'Creation timestamp',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    format: 'date-time',
  })
  updatedAt!: Date;
}
