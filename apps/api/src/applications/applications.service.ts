import { Injectable } from '@nestjs/common';
import { ApiExceptions } from '@job-board/backend-lib';
import {
  Application,
  ApplicationStatus,
  DatabaseService,
  Job,
  JobStatus,
  UserRole,
} from '@job-board/db';
import { randomBytes } from 'crypto';

import { RequestUser } from '../auth/interfaces';
import {
  ApplicationListItemDto,
  ApplicationResponseDto,
  ApplicationStatusResponseDto,
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Apply for a job (public endpoint)
   * Supports both logged-in and anonymous applications
   */
  async apply(
    jobId: string,
    dto: CreateApplicationDto,
    user?: RequestUser,
  ): Promise<ApplicationResponseDto> {
    // Find job and verify it's active
    const job = await this.db.jobs.findOne({
      where: { id: jobId },
      relations: ['organization'],
    });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    if (job.status === JobStatus.EXPIRED) {
      throw ApiExceptions.jobExpired();
    }

    if (job.status === JobStatus.CLOSED) {
      throw ApiExceptions.jobClosed();
    }

    if (job.status !== JobStatus.ACTIVE) {
      throw ApiExceptions.conflict('Job is not accepting applications');
    }

    // Check for duplicate application
    const existingApplication = await this.db.applications.findOne({
      where: {
        jobId,
        email: dto.email,
      },
    });

    if (existingApplication) {
      throw ApiExceptions.applicationAlreadyExists();
    }

    // Generate tracking token
    const trackingToken = this.generateTrackingToken();

    // Create application
    const application = await this.db.applications.save({
      jobId,
      userId: user?.id || null,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone || null,
      coverLetter: dto.coverLetter || null,
      linkedinUrl: dto.linkedinUrl || null,
      portfolioUrl: dto.portfolioUrl || null,
      status: ApplicationStatus.PENDING,
      trackingToken,
    });

    return this.mapToResponse(application);
  }

  /**
   * Get applications for a job (organization access required)
   */
  async findByJob(
    jobId: string,
    user: RequestUser,
  ): Promise<{ data: ApplicationListItemDto[]; total: number }> {
    // Verify job exists and user has access
    const job = await this.db.jobs.findOne({
      where: { id: jobId, tenantId: user.tenantId },
    });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    await this.verifyJobAccess(job, user);

    const [applications, total] = await this.db.applications.findAndCount({
      where: { jobId },
      order: { createdAt: 'DESC' },
    });

    return {
      data: applications.map(this.mapToListItem),
      total,
    };
  }

  /**
   * Get single application by ID (organization access required)
   */
  async findOne(
    id: string,
    user: RequestUser,
  ): Promise<ApplicationResponseDto> {
    const application = await this.db.applications.findOne({
      where: { id },
      relations: ['job'],
    });

    if (!application) {
      throw ApiExceptions.applicationNotFound();
    }

    // Verify user has access to the job
    const job = await this.db.jobs.findOne({
      where: { id: application.jobId, tenantId: user.tenantId },
    });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    await this.verifyJobAccess(job, user);

    return this.mapToResponse(application);
  }

  /**
   * Update application status (organization access required)
   */
  async updateStatus(
    id: string,
    dto: UpdateApplicationStatusDto,
    user: RequestUser,
  ): Promise<ApplicationResponseDto> {
    const application = await this.db.applications.findOne({
      where: { id },
    });

    if (!application) {
      throw ApiExceptions.applicationNotFound();
    }

    // Verify user has access to the job
    const job = await this.db.jobs.findOne({
      where: { id: application.jobId, tenantId: user.tenantId },
    });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    await this.verifyJobAccess(job, user);

    // Update application
    await this.db.applications.update(id, {
      status: dto.status,
      notes: dto.notes !== undefined ? dto.notes : application.notes,
    });

    const updated = await this.db.applications.findOneOrFail({ where: { id } });
    return this.mapToResponse(updated);
  }

  /**
   * Check application status by tracking token (public)
   */
  async checkStatus(
    trackingToken: string,
  ): Promise<ApplicationStatusResponseDto> {
    const application = await this.db.applications.findOne({
      where: { trackingToken },
      relations: ['job', 'job.organization'],
    });

    if (!application) {
      throw ApiExceptions.applicationNotFound();
    }

    return {
      status: application.status,
      jobTitle: application.job.title,
      organizationName: application.job.organization?.name || 'Unknown',
      submittedAt: application.createdAt,
    };
  }

  /**
   * Get applications for logged-in user
   */
  async findMyApplications(
    user: RequestUser,
  ): Promise<{ data: ApplicationListItemDto[]; total: number }> {
    const [applications, total] = await this.db.applications.findAndCount({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });

    return {
      data: applications.map(this.mapToListItem),
      total,
    };
  }

  /**
   * Get applications count by status for a job
   */
  async getStats(
    jobId: string,
    user: RequestUser,
  ): Promise<Record<ApplicationStatus, number>> {
    const job = await this.db.jobs.findOne({
      where: { id: jobId, tenantId: user.tenantId },
    });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    await this.verifyJobAccess(job, user);

    const results = await this.db.applications
      .createQueryBuilder('app')
      .select('app.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('app.jobId = :jobId', { jobId })
      .groupBy('app.status')
      .getRawMany<{ status: ApplicationStatus; count: string }>();

    // Initialize with zeros
    const stats: Record<ApplicationStatus, number> = {
      [ApplicationStatus.PENDING]: 0,
      [ApplicationStatus.REVIEWED]: 0,
      [ApplicationStatus.SHORTLISTED]: 0,
      [ApplicationStatus.INTERVIEW]: 0,
      [ApplicationStatus.OFFERED]: 0,
      [ApplicationStatus.HIRED]: 0,
      [ApplicationStatus.REJECTED]: 0,
    };

    // Fill in actual counts
    for (const row of results) {
      stats[row.status] = parseInt(row.count, 10);
    }

    return stats;
  }

  // ==================== Private Helpers ====================

  private generateTrackingToken(): string {
    return randomBytes(16).toString('hex');
  }

  private async verifyJobAccess(job: Job, user: RequestUser): Promise<void> {
    // Admins can access any job
    if (user.role === UserRole.ADMIN) {
      return;
    }

    // Get user's organization
    const dbUser = await this.db.users.findOne({
      where: { id: user.id },
    });

    if (
      !dbUser?.organizationId ||
      dbUser.organizationId !== job.organizationId
    ) {
      throw ApiExceptions.organizationAccessDenied();
    }
  }

  private mapToResponse(application: Application): ApplicationResponseDto {
    return {
      id: application.id,
      jobId: application.jobId,
      userId: application.userId,
      email: application.email,
      firstName: application.firstName,
      lastName: application.lastName,
      phone: application.phone,
      coverLetter: application.coverLetter,
      linkedinUrl: application.linkedinUrl,
      portfolioUrl: application.portfolioUrl,
      status: application.status,
      notes: application.notes,
      trackingToken: application.trackingToken,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }

  private mapToListItem(application: Application): ApplicationListItemDto {
    return {
      id: application.id,
      jobId: application.jobId,
      email: application.email,
      firstName: application.firstName,
      lastName: application.lastName,
      phone: application.phone,
      status: application.status,
      createdAt: application.createdAt,
    };
  }
}
