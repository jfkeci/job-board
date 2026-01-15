import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category unique identifier',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Category slug',
    example: 'engineering',
  })
  slug!: string;

  @ApiProperty({
    description: 'Category name (from translation)',
    example: 'Engineering',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Parent category ID (for nested categories)',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  parentId!: string | null;

  @ApiProperty({
    description: 'Category creation date',
    example: '2025-01-15T10:30:00.000Z',
  })
  createdAt!: Date;
}
