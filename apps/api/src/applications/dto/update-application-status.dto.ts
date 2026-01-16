import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApplicationStatus } from '@job-board/db';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: 'New application status',
    enum: ApplicationStatus,
    example: ApplicationStatus.REVIEWED,
  })
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;

  @ApiPropertyOptional({
    description: 'Internal notes about the application',
    example: 'Strong candidate, schedule interview',
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}
