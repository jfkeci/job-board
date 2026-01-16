import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsArray } from 'class-validator';
import { JobTier, PromotionType } from '@job-board/db';

export class PublishJobDto {
  @ApiProperty({
    description: 'Job tier for pricing',
    enum: JobTier,
    enumName: 'JobTier',
    example: JobTier.STANDARD,
  })
  @IsEnum(JobTier)
  tier!: JobTier;

  @ApiPropertyOptional({
    description: 'Social media promotions',
    enum: PromotionType,
    enumName: 'PromotionType',
    isArray: true,
    example: [PromotionType.FEATURED],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PromotionType, { each: true })
  promotions?: PromotionType[];
}
