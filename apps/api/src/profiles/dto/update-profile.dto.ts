import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Professional headline',
    example: 'Senior Software Engineer at TechCorp',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  headline?: string;

  @ApiPropertyOptional({
    description: 'Professional summary/bio',
    example: 'Experienced software engineer with 10+ years...',
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  summary?: string;
}
