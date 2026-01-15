import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmploymentType, JobStatus, JobTier } from '@borg/db';

export class JobListItemDto {
  @ApiProperty({
    description: 'Job ID',
    format: 'uuid',
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
    description: 'Job status',
    enum: JobStatus,
    enumName: 'JobStatus',
  })
  status!: JobStatus;

  @ApiProperty({
    description: 'Job tier',
    enum: JobTier,
    enumName: 'JobTier',
  })
  tier!: JobTier;

  @ApiProperty({
    description: 'Employment type',
    enum: EmploymentType,
    enumName: 'EmploymentType',
  })
  employmentType!: EmploymentType;

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
  })
  viewCount!: number;

  @ApiProperty({
    description: 'Creation timestamp',
    format: 'date-time',
  })
  createdAt!: Date;
}

export class JobListResponseDto {
  @ApiProperty({
    description: 'List of jobs',
    type: [JobListItemDto],
  })
  data!: JobListItemDto[];

  @ApiProperty({
    description: 'Total number of jobs',
    example: 15,
  })
  total!: number;
}
