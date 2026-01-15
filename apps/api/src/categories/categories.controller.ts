import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Get all categories
   * Categories are used for job classification
   */
  @Get()
  @ApiOperation({
    summary: 'List all categories',
    description:
      'Returns all available job categories. Categories can be tenant-specific or global.',
  })
  @ApiQuery({
    name: 'tenantId',
    required: false,
    description: 'Filter categories by tenant ID',
    type: String,
  })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'Language code for category names (default: en)',
    type: String,
    example: 'en',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [CategoryResponseDto],
  })
  async findAll(
    @Query('tenantId') tenantId?: string,
    @Query('language') language?: string,
  ): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll(tenantId, language || 'en');
  }
}
