import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

import { OrganizationSize } from '@job-board/db';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    description: 'Organization name',
    example: 'Acme Corporation',
    minLength: 2,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({
    description: 'Organization description',
    example: 'Leading tech company specializing in innovative solutions',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Company website URL',
    example: 'https://acme.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Industry sector',
    example: 'Technology',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional({
    description: 'Company size',
    enum: OrganizationSize,
    enumName: 'OrganizationSize',
    example: OrganizationSize.MEDIUM,
  })
  @IsOptional()
  @IsEnum(OrganizationSize)
  size?: OrganizationSize;
}
