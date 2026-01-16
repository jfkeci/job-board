import { Injectable } from '@nestjs/common';
import { ApiExceptions } from '@job-board/backend-lib';
import {
  Category,
  CategoryTranslation,
  DatabaseService,
  Job,
  JobStatus,
  JobTier,
  Location,
  Organization,
  PromotionType,
  SearchQuery,
} from '@job-board/db';

import {
  FeaturedJobsResponseDto,
  JobSearchDto,
  PublicCategoryDto,
  PublicJobListItemDto,
  PublicJobResponseDto,
  PublicJobSearchResponseDto,
  PublicLocationDto,
  PublicOrganizationDto,
} from './dto';

@Injectable()
export class PublicJobsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Search jobs with filters
   */
  async search(
    tenantId: string,
    dto: JobSearchDto,
    language: string = 'en',
    trackingInfo?: {
      userId?: string;
      sessionId?: string;
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<PublicJobSearchResponseDto> {
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const offset = (page - 1) * limit;

    const qb = this.db.jobs
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'org')
      .leftJoinAndSelect('job.category', 'cat')
      .leftJoinAndSelect(
        'cat.translations',
        'catTrans',
        'catTrans.language = :language',
        { language },
      )
      .leftJoinAndSelect('job.location', 'loc')
      .where('job.tenantId = :tenantId', { tenantId })
      .andWhere('job.status = :status', { status: JobStatus.ACTIVE })
      .andWhere('job.expiresAt > :now', { now: new Date() });

    // Text search
    if (dto.q) {
      qb.andWhere(
        '(job.title ILIKE :q OR job.description ILIKE :q OR org.name ILIKE :q)',
        { q: `%${dto.q}%` },
      );
    }

    // Filters
    if (dto.categoryId) {
      qb.andWhere('job.categoryId = :categoryId', {
        categoryId: dto.categoryId,
      });
    }

    if (dto.locationId) {
      qb.andWhere('job.locationId = :locationId', {
        locationId: dto.locationId,
      });
    }

    if (dto.employmentType) {
      qb.andWhere('job.employmentType = :employmentType', {
        employmentType: dto.employmentType,
      });
    }

    if (dto.remoteOption) {
      qb.andWhere('job.remoteOption = :remoteOption', {
        remoteOption: dto.remoteOption,
      });
    }

    if (dto.experienceLevel) {
      qb.andWhere('job.experienceLevel = :experienceLevel', {
        experienceLevel: dto.experienceLevel,
      });
    }

    if (dto.salaryMin !== undefined) {
      qb.andWhere('job.salaryMax >= :salaryMin OR job.salaryMax IS NULL', {
        salaryMin: dto.salaryMin,
      });
    }

    if (dto.salaryMax !== undefined) {
      qb.andWhere('job.salaryMin <= :salaryMax OR job.salaryMin IS NULL', {
        salaryMax: dto.salaryMax,
      });
    }

    // Sorting - prioritize premium/featured jobs
    qb.addOrderBy(
      `CASE WHEN job.tier = '${JobTier.PREMIUM}' THEN 0 WHEN job.tier = '${JobTier.STANDARD}' THEN 1 ELSE 2 END`,
      'ASC',
    );
    qb.addOrderBy(
      `CASE WHEN '${PromotionType.TOP_POSITION}' = ANY(job.promotions) THEN 0 ELSE 1 END`,
      'ASC',
    );

    // Apply user sorting
    const sortColumn =
      dto.sortBy === 'salary' ? 'job.salaryMax' : `job.${dto.sortBy}`;
    qb.addOrderBy(sortColumn, dto.sortOrder?.toUpperCase() as 'ASC' | 'DESC');

    // Get total count
    const total = await qb.getCount();

    // Apply pagination
    qb.skip(offset).take(limit);

    const jobs = await qb.getMany();

    // Track the search (async, don't await)
    if (trackingInfo) {
      this.trackSearch(tenantId, dto, total, trackingInfo).catch(() => {
        // Silent fail for tracking
      });
    }

    return {
      data: jobs.map((job) => this.mapToListItem(job, language)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Track a search query
   */
  private async trackSearch(
    tenantId: string,
    dto: JobSearchDto,
    resultCount: number,
    info: {
      userId?: string;
      sessionId?: string;
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<void> {
    await this.db.searchQueries.save({
      tenantId,
      userId: info.userId || null,
      sessionId: info.sessionId || null,
      queryText: dto.q || null,
      categoryId: dto.categoryId || null,
      locationId: dto.locationId || null,
      employmentType: dto.employmentType || null,
      remoteOption: dto.remoteOption || null,
      experienceLevel: dto.experienceLevel || null,
      salaryMin: dto.salaryMin || null,
      salaryMax: dto.salaryMax || null,
      resultCount,
      ipAddress: info.ipAddress || null,
      userAgent: info.userAgent || null,
    });
  }

  /**
   * Get featured and recent jobs for homepage
   */
  async getFeatured(
    tenantId: string,
    language: string = 'en',
  ): Promise<FeaturedJobsResponseDto> {
    const now = new Date();

    // Get featured jobs (PREMIUM tier or with FEATURED promotion)
    const featured = await this.db.jobs
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'org')
      .leftJoinAndSelect('job.category', 'cat')
      .leftJoinAndSelect(
        'cat.translations',
        'catTrans',
        'catTrans.language = :language',
        { language },
      )
      .leftJoinAndSelect('job.location', 'loc')
      .where('job.tenantId = :tenantId', { tenantId })
      .andWhere('job.status = :status', { status: JobStatus.ACTIVE })
      .andWhere('job.expiresAt > :now', { now })
      .andWhere(
        "(job.tier = :premium OR :featured = ANY(string_to_array(job.promotions, ',')))",
        { premium: JobTier.PREMIUM, featured: PromotionType.FEATURED },
      )
      .orderBy('job.publishedAt', 'DESC')
      .limit(6)
      .getMany();

    // Get recent jobs (exclude already featured)
    const featuredIds = featured.map((j) => j.id);
    const recentQb = this.db.jobs
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'org')
      .leftJoinAndSelect('job.category', 'cat')
      .leftJoinAndSelect(
        'cat.translations',
        'catTrans',
        'catTrans.language = :language',
        { language },
      )
      .leftJoinAndSelect('job.location', 'loc')
      .where('job.tenantId = :tenantId', { tenantId })
      .andWhere('job.status = :status', { status: JobStatus.ACTIVE })
      .andWhere('job.expiresAt > :now', { now })
      .orderBy('job.publishedAt', 'DESC')
      .limit(12);

    if (featuredIds.length > 0) {
      recentQb.andWhere('job.id NOT IN (:...featuredIds)', { featuredIds });
    }

    const recent = await recentQb.getMany();

    return {
      featured: featured.map((j) => this.mapToListItem(j, language)),
      recent: recent.map((j) => this.mapToListItem(j, language)),
    };
  }

  /**
   * Get job by ID or slug (public view)
   */
  async findOne(
    tenantId: string,
    idOrSlug: string,
    language: string = 'en',
  ): Promise<PublicJobResponseDto> {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug,
      );

    const qb = this.db.jobs
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'org')
      .leftJoinAndSelect('job.category', 'cat')
      .leftJoinAndSelect(
        'cat.translations',
        'catTrans',
        'catTrans.language = :language',
        { language },
      )
      .leftJoinAndSelect('job.location', 'loc')
      .where('job.tenantId = :tenantId', { tenantId })
      .andWhere('job.status = :status', { status: JobStatus.ACTIVE });

    if (isUuid) {
      qb.andWhere('job.id = :id', { id: idOrSlug });
    } else {
      qb.andWhere('job.slug = :slug', { slug: idOrSlug });
    }

    const job = await qb.getOne();

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    return this.mapToFullResponse(job, language);
  }

  /**
   * Track job view (increment view count and optionally log detailed view)
   */
  async trackView(
    tenantId: string,
    jobId: string,
    userId?: string,
  ): Promise<void> {
    const job = await this.db.jobs.findOne({
      where: { id: jobId, tenantId, status: JobStatus.ACTIVE },
    });

    if (!job) {
      return; // Silent fail for tracking
    }

    // Increment view count
    await this.db.jobs.increment({ id: jobId }, 'viewCount', 1);

    // Log detailed view for registered users
    if (userId) {
      // Check if user already viewed recently (within 24 hours)
      const recentView = await this.db.jobViews.findOne({
        where: { jobId, userId },
        order: { viewedAt: 'DESC' },
      });

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (!recentView || recentView.viewedAt < oneDayAgo) {
        await this.db.jobViews.save({
          jobId,
          userId,
          viewedAt: new Date(),
        });
      }
    }
  }

  /**
   * Get similar jobs
   */
  async getSimilar(
    tenantId: string,
    jobId: string,
    language: string = 'en',
    limit: number = 4,
  ): Promise<PublicJobListItemDto[]> {
    const job = await this.db.jobs.findOne({ where: { id: jobId } });

    if (!job) {
      return [];
    }

    const qb = this.db.jobs
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'org')
      .leftJoinAndSelect('job.category', 'cat')
      .leftJoinAndSelect(
        'cat.translations',
        'catTrans',
        'catTrans.language = :language',
        { language },
      )
      .leftJoinAndSelect('job.location', 'loc')
      .where('job.tenantId = :tenantId', { tenantId })
      .andWhere('job.status = :status', { status: JobStatus.ACTIVE })
      .andWhere('job.expiresAt > :now', { now: new Date() })
      .andWhere('job.id != :jobId', { jobId })
      .andWhere('job.categoryId = :categoryId', { categoryId: job.categoryId })
      .orderBy('job.publishedAt', 'DESC')
      .limit(limit);

    const similar = await qb.getMany();

    return similar.map((j) => this.mapToListItem(j, language));
  }

  // ==================== Private Helpers ====================

  private mapToListItem(job: Job, language: string): PublicJobListItemDto {
    return {
      id: job.id,
      title: job.title,
      slug: job.slug,
      organization: this.mapOrganization(job.organization),
      category: job.category ? this.mapCategory(job.category, language) : null,
      location: job.location ? this.mapLocation(job.location) : null,
      employmentType: job.employmentType,
      remoteOption: job.remoteOption,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: job.salaryCurrency,
      tier: job.tier,
      promotions: job.promotions || [],
      publishedAt: job.publishedAt!,
    };
  }

  private mapToFullResponse(job: Job, language: string): PublicJobResponseDto {
    return {
      id: job.id,
      title: job.title,
      slug: job.slug,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      organization: this.mapOrganization(job.organization),
      category: job.category ? this.mapCategory(job.category, language) : null,
      location: job.location ? this.mapLocation(job.location) : null,
      employmentType: job.employmentType,
      remoteOption: job.remoteOption,
      experienceLevel: job.experienceLevel,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: job.salaryCurrency,
      salaryPeriod: job.salaryPeriod,
      tier: job.tier,
      promotions: job.promotions || [],
      viewCount: job.viewCount,
      publishedAt: job.publishedAt!,
      expiresAt: job.expiresAt!,
    };
  }

  private mapOrganization(org: Organization): PublicOrganizationDto {
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      logoUrl: null, // TODO: implement file URL generation
      industry: org.industry,
    };
  }

  private mapCategory(category: Category, language: string): PublicCategoryDto {
    const translation = (category as any).translations?.find(
      (t: CategoryTranslation) => t.language === language,
    );
    return {
      id: category.id,
      slug: category.slug,
      name: translation?.name || category.slug,
    };
  }

  private mapLocation(location: Location): PublicLocationDto {
    return {
      id: location.id,
      slug: location.slug,
      name: location.name,
    };
  }
}
