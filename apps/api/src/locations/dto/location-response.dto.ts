import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationType } from '@job-board/db';

export class LocationResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    enum: LocationType,
    example: LocationType.CITY,
  })
  type!: LocationType;

  @ApiProperty({
    example: 'new-york',
  })
  slug!: string;

  @ApiProperty({
    example: 'New York',
  })
  name!: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Parent location ID',
  })
  parentId!: string | null;

  @ApiPropertyOptional({
    type: () => LocationResponseDto,
    description: 'Parent location',
  })
  parent?: LocationResponseDto;

  @ApiPropertyOptional({
    type: [LocationResponseDto],
    description: 'Child locations',
  })
  children?: LocationResponseDto[];

  @ApiProperty({
    description: 'Number of active jobs in this location',
    example: 42,
  })
  jobCount?: number;
}

export class LocationListResponseDto {
  @ApiProperty({
    type: [LocationResponseDto],
  })
  data!: LocationResponseDto[];

  @ApiProperty()
  total!: number;
}

export class LocationTreeResponseDto {
  @ApiProperty({
    type: [LocationResponseDto],
    description: 'Hierarchical tree of locations',
  })
  data!: LocationResponseDto[];
}
