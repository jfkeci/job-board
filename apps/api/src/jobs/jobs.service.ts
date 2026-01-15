import { Injectable } from '@nestjs/common';
import { ApiExceptions } from '@borg/backend-lib';
import { DatabaseService, Job, JobStatus, UserRole } from '@borg/db';

import { RequestUser } from '../auth/interfaces';
import {
  CreateJobDto,
  UpdateJobDto,
  PublishJobDto,
  JobResponseDto,
  JobListItemDto,
} from './dto';

@Injectable()
export class JobsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create a new job draft
   */
  async create(dto: CreateJobDto, user: RequestUser): Promise<JobResponseDto> {
    // Get user with organization
    const dbUser = await this.db.users.findOne({
      where: { id: user.id },
    });

    if (!dbUser?.organizationId) {
      throw ApiExceptions.organizationAccessDenied();
    }

    // Generate unique slug
    const baseSlug = this.generateSlug(dto.title);
    const slug = await this.ensureUniqueSlug(baseSlug, user.tenantId);

    // Create job with DRAFT status
    const job = await this.db.jobs.save({
      ...dto,
      slug,
      tenantId: user.tenantId,
      organizationId: dbUser.organizationId,
      status: JobStatus.DRAFT,
      salaryCurrency: dto.salaryCurrency || 'EUR',
    });

    return this.mapToResponse(job);
  }

  /**
   * List all jobs for user's organization
   */
  async findAll(user: RequestUser): Promise<{ data: JobListItemDto[]; total: number }> {
    // Get user with organization
    const dbUser = await this.db.users.findOne({
      where: { id: user.id },
    });

    if (!dbUser?.organizationId) {
      return { data: [], total: 0 };
    }

    const [jobs, total] = await this.db.jobs.findAndCount({
      where: {
        organizationId: dbUser.organizationId,
        tenantId: user.tenantId,
      },
      order: { createdAt: 'DESC' },
    });

    return {
      data: jobs.map(this.mapToListItem),
      total,
    };
  }

  /**
   * Get single job by ID
   */
  async findOne(id: string, user: RequestUser): Promise<JobResponseDto> {
    const job = await this.db.jobs.findOne({
      where: { id, tenantId: user.tenantId },
    });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    await this.verifyJobAccess(job, user);

    return this.mapToResponse(job);
  }

  /**
   * Update job (only DRAFT or ACTIVE status)
   */
  async update(
    id: string,
    dto: UpdateJobDto,
    user: RequestUser,
  ): Promise<JobResponseDto> {
    const job = await this.db.jobs.findOne({
      where: { id, tenantId: user.tenantId },
    });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    await this.verifyJobAccess(job, user);

    // Only DRAFT and ACTIVE jobs can be edited
    this.assertStatus(
      job,
      [JobStatus.DRAFT, JobStatus.ACTIVE],
      'Job cannot be edited in current status',
    );

    // If title changed, regenerate slug
    const updateData: Partial<Job> = { ...dto };
    if (dto.title && dto.title !== job.title) {
      const baseSlug = this.generateSlug(dto.title);
      updateData.slug = await this.ensureUniqueSlug(baseSlug, user.tenantId, id);
    }

    await this.db.jobs.update(id, updateData);

    const updatedJob = await this.db.jobs.findOneOrFail({ where: { id } });
    return this.mapToResponse(updatedJob);
  }

  /**
   * Delete job (only DRAFT status)
   */
  async remove(id: string, user: RequestUser): Promise<void> {
    const job = await this.db.jobs.findOne({
      where: { id, tenantId: user.tenantId },
    });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    await this.verifyJobAccess(job, user);

    // Only DRAFT jobs can be deleted
    this.assertStatus(
      job,
      [JobStatus.DRAFT],
      'Only draft jobs can be deleted',
    );

    await this.db.jobs.delete(id);
  }

  /**
   * Publish job (DRAFT → ACTIVE)
   * MVP: Skip payment and go directly to ACTIVE
   */
  async publish(
    id: string,
    dto: PublishJobDto,
    user: RequestUser,
  ): Promise<JobResponseDto> {
    const job = await this.db.jobs.findOne({
      where: { id, tenantId: user.tenantId },
    });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    await this.verifyJobAccess(job, user);

    // Only DRAFT jobs can be published
    this.assertStatus(
      job,
      [JobStatus.DRAFT],
      'Only draft jobs can be published',
    );

    // Validate required fields
    if (!job.title || !job.description || !job.categoryId) {
      throw ApiExceptions.validationFailed([
        { field: 'job', code: 'VALIDATION_FIELD_REQUIRED', message: 'Job must have title, description, and category' },
      ]);
    }

    // Set publish data
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await this.db.jobs.update(id, {
      tier: dto.tier,
      promotions: dto.promotions || [],
      status: JobStatus.ACTIVE,
      publishedAt: now,
      expiresAt,
    });

    const updatedJob = await this.db.jobs.findOneOrFail({ where: { id } });
    return this.mapToResponse(updatedJob);
  }

  /**
   * Close job listing (ACTIVE → CLOSED)
   */
  async close(id: string, user: RequestUser): Promise<JobResponseDto> {
    const job = await this.db.jobs.findOne({
      where: { id, tenantId: user.tenantId },
    });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    await this.verifyJobAccess(job, user);

    // Only ACTIVE jobs can be closed
    this.assertStatus(
      job,
      [JobStatus.ACTIVE],
      'Only active jobs can be closed',
    );

    await this.db.jobs.update(id, {
      status: JobStatus.CLOSED,
    });

    const updatedJob = await this.db.jobs.findOneOrFail({ where: { id } });
    return this.mapToResponse(updatedJob);
  }

  /**
   * Extend job expiration (adds 30 days)
   */
  async extend(id: string, user: RequestUser): Promise<JobResponseDto> {
    const job = await this.db.jobs.findOne({
      where: { id, tenantId: user.tenantId },
    });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    await this.verifyJobAccess(job, user);

    // Only ACTIVE or EXPIRED jobs can be extended
    this.assertStatus(
      job,
      [JobStatus.ACTIVE, JobStatus.EXPIRED],
      'Only active or expired jobs can be extended',
    );

    const now = new Date();
    let newExpiresAt: Date;

    if (job.status === JobStatus.EXPIRED || !job.expiresAt || job.expiresAt < now) {
      // Expired: extend from now
      newExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else {
      // Active: extend from current expiry
      newExpiresAt = new Date(job.expiresAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    await this.db.jobs.update(id, {
      status: JobStatus.ACTIVE,
      expiresAt: newExpiresAt,
    });

    const updatedJob = await this.db.jobs.findOneOrFail({ where: { id } });
    return this.mapToResponse(updatedJob);
  }

  // ==================== Private Helpers ====================

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
  }

  private async ensureUniqueSlug(
    baseSlug: string,
    tenantId: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = baseSlug;
    let counter = 0;

    while (true) {
      const query = this.db.jobs
        .createQueryBuilder('job')
        .where('job.slug = :slug', { slug })
        .andWhere('job.tenantId = :tenantId', { tenantId });

      if (excludeId) {
        query.andWhere('job.id != :excludeId', { excludeId });
      }

      const existing = await query.getOne();

      if (!existing) {
        return slug;
      }

      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  private async verifyJobAccess(job: Job, user: RequestUser): Promise<void> {
    // Platform admin can access any job
    if (user.role === UserRole.ADMIN) {
      return;
    }

    // Get user's organization
    const dbUser = await this.db.users.findOne({
      where: { id: user.id },
    });

    if (!dbUser?.organizationId || dbUser.organizationId !== job.organizationId) {
      throw ApiExceptions.organizationAccessDenied();
    }
  }

  private assertStatus(
    job: Job,
    allowedStatuses: JobStatus[],
    message: string,
  ): void {
    if (!allowedStatuses.includes(job.status)) {
      throw ApiExceptions.conflict(message);
    }
  }

  private mapToResponse(job: Job): JobResponseDto {
    return {
      id: job.id,
      title: job.title,
      slug: job.slug,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      categoryId: job.categoryId,
      locationId: job.locationId,
      employmentType: job.employmentType,
      remoteOption: job.remoteOption,
      experienceLevel: job.experienceLevel,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: job.salaryCurrency,
      salaryPeriod: job.salaryPeriod,
      tier: job.tier,
      promotions: job.promotions || [],
      status: job.status,
      publishedAt: job.publishedAt,
      expiresAt: job.expiresAt,
      viewCount: job.viewCount,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }

  private mapToListItem(job: Job): JobListItemDto {
    return {
      id: job.id,
      title: job.title,
      slug: job.slug,
      status: job.status,
      tier: job.tier,
      employmentType: job.employmentType,
      publishedAt: job.publishedAt,
      expiresAt: job.expiresAt,
      viewCount: job.viewCount,
      createdAt: job.createdAt,
    };
  }
}
