import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '@job-board/db';

export class ApplicationResponseDto {
  @ApiProperty({
    description: 'Application ID',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Job ID',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  jobId!: string;

  @ApiPropertyOptional({
    description: 'User ID (if logged in)',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  userId!: string | null;

  @ApiProperty({
    description: 'Applicant email',
    example: 'john.doe@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Applicant first name',
    example: 'John',
  })
  firstName!: string;

  @ApiProperty({
    description: 'Applicant last name',
    example: 'Doe',
  })
  lastName!: string;

  @ApiPropertyOptional({
    description: 'Applicant phone',
    example: '+1234567890',
  })
  phone!: string | null;

  @ApiPropertyOptional({
    description: 'Cover letter',
  })
  coverLetter!: string | null;

  @ApiPropertyOptional({
    description: 'LinkedIn URL',
    example: 'https://linkedin.com/in/johndoe',
  })
  linkedinUrl!: string | null;

  @ApiPropertyOptional({
    description: 'Portfolio URL',
    example: 'https://johndoe.com',
  })
  portfolioUrl!: string | null;

  @ApiProperty({
    description: 'Application status',
    enum: ApplicationStatus,
    example: ApplicationStatus.PENDING,
  })
  status!: ApplicationStatus;

  @ApiPropertyOptional({
    description: 'Internal notes (only visible to organization)',
  })
  notes!: string | null;

  @ApiProperty({
    description: 'Tracking token for anonymous status checking',
    example: 'abc123xyz',
  })
  trackingToken!: string;

  @ApiProperty({
    description: 'Application submitted at',
    format: 'date-time',
    example: '2026-01-15T10:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last updated at',
    format: 'date-time',
    example: '2026-01-15T10:00:00.000Z',
  })
  updatedAt!: Date;
}

export class ApplicationListItemDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  jobId!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiPropertyOptional()
  phone!: string | null;

  @ApiProperty({ enum: ApplicationStatus })
  status!: ApplicationStatus;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}

export class ApplicationListResponseDto {
  @ApiProperty({ type: [ApplicationListItemDto] })
  data!: ApplicationListItemDto[];

  @ApiProperty({ description: 'Total count' })
  total!: number;
}

export class ApplicationStatusResponseDto {
  @ApiProperty({
    description: 'Application status',
    enum: ApplicationStatus,
    example: ApplicationStatus.PENDING,
  })
  status!: ApplicationStatus;

  @ApiProperty({
    description: 'Job title',
    example: 'Senior Software Engineer',
  })
  jobTitle!: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'TechCorp Inc.',
  })
  organizationName!: string;

  @ApiProperty({
    description: 'Application submitted at',
    format: 'date-time',
  })
  submittedAt!: Date;
}
