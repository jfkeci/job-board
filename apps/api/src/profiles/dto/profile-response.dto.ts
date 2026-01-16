import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
    description: 'User ID',
  })
  userId!: string;

  @ApiProperty({
    example: 'John',
  })
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
  })
  lastName!: string;

  @ApiPropertyOptional({
    example: '+1234567890',
  })
  phone!: string | null;

  @ApiPropertyOptional({
    description: 'CV file ID',
    format: 'uuid',
  })
  cvFileId!: string | null;

  @ApiPropertyOptional({
    example: 'Senior Software Engineer at TechCorp',
  })
  headline!: string | null;

  @ApiPropertyOptional({
    example: 'Experienced software engineer with 10+ years...',
  })
  summary!: string | null;

  @ApiProperty({
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    format: 'date-time',
  })
  updatedAt!: Date;
}

export class MeResponseDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email!: string;

  @ApiProperty({
    example: 'USER',
  })
  role!: string;

  @ApiPropertyOptional({
    type: ProfileResponseDto,
  })
  profile!: ProfileResponseDto | null;
}
