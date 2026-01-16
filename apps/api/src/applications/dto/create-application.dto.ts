import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'Applicant email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Applicant first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({
    description: 'Applicant last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @ApiPropertyOptional({
    description: 'Applicant phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Cover letter',
    example: 'I am excited to apply for this position...',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  coverLetter?: string;

  @ApiPropertyOptional({
    description: 'LinkedIn profile URL',
    example: 'https://linkedin.com/in/johndoe',
  })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @ApiPropertyOptional({
    description: 'Portfolio URL',
    example: 'https://johndoe.com',
  })
  @IsOptional()
  @IsUrl()
  portfolioUrl?: string;
}
