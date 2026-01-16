import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EmploymentType, ExperienceLevel, RemoteOption } from '@job-board/db';

export class JobSearchDto {
  @ApiPropertyOptional({
    description: 'Search query for title, description, or organization name',
    example: 'software engineer',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Category ID',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Location ID',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional({
    description: 'Employment type filter',
    enum: EmploymentType,
  })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({
    description: 'Remote work option filter',
    enum: RemoteOption,
  })
  @IsOptional()
  @IsEnum(RemoteOption)
  remoteOption?: RemoteOption;

  @ApiPropertyOptional({
    description: 'Experience level filter',
    enum: ExperienceLevel,
  })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiPropertyOptional({
    description: 'Minimum salary filter',
    example: 50000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum salary filter',
    example: 100000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  salaryMax?: number;

  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['createdAt', 'publishedAt', 'salary'],
    default: 'publishedAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'publishedAt' | 'salary' = 'publishedAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
