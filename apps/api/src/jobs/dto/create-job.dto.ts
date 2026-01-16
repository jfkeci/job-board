import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
  Length,
} from 'class-validator';
import {
  EmploymentType,
  ExperienceLevel,
  RemoteOption,
  SalaryPeriod,
} from '@job-board/db';

export class CreateJobDto {
  @ApiProperty({
    description: 'Job title',
    example: 'Senior Software Engineer',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    description: 'Job description (Markdown supported)',
    example:
      '## About the Role\n\nWe are looking for an experienced engineer...',
    minLength: 100,
    maxLength: 50000,
  })
  @IsString()
  @MinLength(100)
  @MaxLength(50000)
  description!: string;

  @ApiPropertyOptional({
    description: 'Job requirements',
    example: '- 5+ years experience\n- TypeScript expertise',
    maxLength: 10000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  requirements?: string;

  @ApiPropertyOptional({
    description: 'Benefits offered',
    example: '- Competitive salary\n- Remote work options',
    maxLength: 10000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  benefits?: string;

  @ApiProperty({
    description: 'Category ID',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({
    description: 'Location ID (optional for remote jobs)',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiProperty({
    description: 'Employment type',
    enum: EmploymentType,
    enumName: 'EmploymentType',
    example: EmploymentType.FULL_TIME,
  })
  @IsEnum(EmploymentType)
  employmentType!: EmploymentType;

  @ApiProperty({
    description: 'Remote work option',
    enum: RemoteOption,
    enumName: 'RemoteOption',
    example: RemoteOption.HYBRID,
  })
  @IsEnum(RemoteOption)
  remoteOption!: RemoteOption;

  @ApiPropertyOptional({
    description: 'Experience level required',
    enum: ExperienceLevel,
    enumName: 'ExperienceLevel',
    example: ExperienceLevel.SENIOR,
  })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiPropertyOptional({
    description: 'Minimum salary',
    example: 60000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional({
    description: 'Maximum salary',
    example: 90000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @ApiPropertyOptional({
    description: 'Salary currency (ISO 4217)',
    example: 'EUR',
    default: 'EUR',
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  salaryCurrency?: string;

  @ApiPropertyOptional({
    description: 'Salary period',
    enum: SalaryPeriod,
    enumName: 'SalaryPeriod',
    default: SalaryPeriod.MONTHLY,
  })
  @IsOptional()
  @IsEnum(SalaryPeriod)
  salaryPeriod?: SalaryPeriod;
}
