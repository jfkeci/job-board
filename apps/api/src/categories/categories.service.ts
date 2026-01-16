import { Injectable } from '@nestjs/common';

import { Category, DatabaseService } from '@job-board/db';

import { CategoryResponseDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Get all categories for a tenant
   * Returns global categories (tenantId = null) if no tenant-specific categories exist
   */
  async findAll(
    tenantId?: string,
    language = 'en',
  ): Promise<CategoryResponseDto[]> {
    // Find categories for the specific tenant or global categories
    const categories = await this.db.categories.find({
      where: tenantId ? [{ tenantId }, { tenantId: undefined }] : {},
      relations: ['translations'],
      order: { slug: 'ASC' },
    });

    return categories.map((category) => this.mapToResponse(category, language));
  }

  /**
   * Map Category entity to response DTO
   */
  private mapToResponse(
    category: Category,
    language: string,
  ): CategoryResponseDto {
    // Find translation for the requested language, fallback to 'en' or first available
    const translation =
      category.translations?.find((t) => t.language === language) ||
      category.translations?.find((t) => t.language === 'en') ||
      category.translations?.[0];

    return {
      id: category.id,
      slug: category.slug,
      name: translation?.name || category.slug, // Fallback to slug if no translation
      parentId: category.parentId,
      createdAt: category.createdAt,
    };
  }
}
