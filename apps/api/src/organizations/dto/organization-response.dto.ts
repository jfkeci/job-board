import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { OrganizationSize } from '@borg/db';

export class OrganizationResponseDto {
  @ApiProperty({
    description: 'Organization unique identifier',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corporation',
  })
  name!: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'acme-corporation',
  })
  slug!: string;

  @ApiPropertyOptional({
    description: 'Organization description',
    nullable: true,
    example: 'Leading tech company specializing in innovative solutions',
  })
  description!: string | null;

  @ApiPropertyOptional({
    description: 'Company website URL',
    nullable: true,
    example: 'https://acme.com',
  })
  website!: string | null;

  @ApiPropertyOptional({
    description: 'Logo file ID',
    format: 'uuid',
    nullable: true,
  })
  logoFileId!: string | null;

  @ApiPropertyOptional({
    description: 'Industry sector',
    nullable: true,
    example: 'Technology',
  })
  industry!: string | null;

  @ApiPropertyOptional({
    description: 'Company size',
    enum: OrganizationSize,
    enumName: 'OrganizationSize',
    nullable: true,
    example: OrganizationSize.MEDIUM,
  })
  size!: OrganizationSize | null;

  @ApiProperty({
    description: 'Whether the organization is verified by admins',
    example: false,
  })
  isVerified!: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    format: 'date-time',
    example: '2026-01-15T10:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    format: 'date-time',
    example: '2026-01-15T10:00:00.000Z',
  })
  updatedAt!: Date;
}
