import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@job-board/config';
import { ApiExceptions } from '@job-board/backend-lib';
import {
  Category,
  CategoryTranslation,
  DatabaseService,
  Job,
  JobStatus,
  Location,
  LocationType,
  Organization,
  Tenant,
  User,
  UserRole,
} from '@job-board/db';

import { RequestUser } from '../auth/interfaces';
import {
  AdminCategoryDto,
  AdminLocationDto,
  AdminOrganizationDto,
  AdminStatsDto,
  AdminTenantDto,
  AdminUserDto,
  CreateCategoryDto,
  CreateLocationDto,
  ImpersonationTokenDto,
  PaginatedResponseDto,
  PaginationDto,
  UpdateCategoryDto,
  UpdateLocationDto,
  UpdateOrganizationVerificationDto,
  UpdateTenantDto,
  UpdateUserRoleDto,
} from './dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ==================== Stats ====================

  async getStats(): Promise<AdminStatsDto> {
    const [
      totalUsers,
      totalOrganizations,
      totalJobs,
      activeJobs,
      totalApplications,
      totalTenants,
    ] = await Promise.all([
      this.db.users.count(),
      this.db.organizations.count(),
      this.db.jobs.count(),
      this.db.jobs.count({ where: { status: JobStatus.ACTIVE } }),
      this.db.applications.count(),
      this.db.tenants.count(),
    ]);

    // Get today's views and searches
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayViews = await this.db.jobViews
      .createQueryBuilder('view')
      .where('view.viewedAt >= :today', { today })
      .getCount();

    const todaySearches = await this.db.searchQueries
      .createQueryBuilder('search')
      .where('search.createdAt >= :today', { today })
      .getCount();

    return {
      totalUsers,
      totalOrganizations,
      totalJobs,
      activeJobs,
      totalApplications,
      totalTenants,
      todayViews,
      todaySearches,
    };
  }

  // ==================== Users ====================

  async listUsers(
    dto: PaginationDto,
  ): Promise<PaginatedResponseDto<AdminUserDto>> {
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const offset = (page - 1) * limit;

    const qb = this.db.users
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .orderBy('user.createdAt', 'DESC');

    if (dto.q) {
      qb.where('user.email ILIKE :q', { q: `%${dto.q}%` });
    }

    const total = await qb.getCount();
    const users = await qb.skip(offset).take(limit).getMany();

    return {
      data: users.map((u) => this.mapUser(u)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUser(id: string): Promise<AdminUserDto> {
    const user = await this.db.users.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw ApiExceptions.userNotFound();
    }

    return this.mapUser(user);
  }

  async updateUserRole(
    id: string,
    dto: UpdateUserRoleDto,
  ): Promise<AdminUserDto> {
    const user = await this.db.users.findOne({ where: { id } });

    if (!user) {
      throw ApiExceptions.userNotFound();
    }

    await this.db.users.update(id, { role: dto.role });

    const updated = await this.db.users.findOne({
      where: { id },
      relations: ['profile'],
    });

    return this.mapUser(updated!);
  }

  // ==================== Organizations ====================

  async listOrganizations(
    dto: PaginationDto,
  ): Promise<PaginatedResponseDto<AdminOrganizationDto>> {
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const offset = (page - 1) * limit;

    const qb = this.db.organizations
      .createQueryBuilder('org')
      .loadRelationCountAndMap('org.jobCount', 'org.jobs')
      .orderBy('org.createdAt', 'DESC');

    if (dto.q) {
      qb.where('org.name ILIKE :q', { q: `%${dto.q}%` });
    }

    const total = await qb.getCount();
    const organizations = await qb.skip(offset).take(limit).getMany();

    // Get user counts
    const orgIds = organizations.map((o) => o.id);
    const userCounts = await this.db.users
      .createQueryBuilder('user')
      .select('user.organizationId', 'organizationId')
      .addSelect('COUNT(*)', 'count')
      .where('user.organizationId IN (:...orgIds)', {
        orgIds: orgIds.length ? orgIds : [''],
      })
      .groupBy('user.organizationId')
      .getRawMany<{ organizationId: string; count: string }>();

    const userCountMap = new Map(
      userCounts.map((uc) => [uc.organizationId, parseInt(uc.count, 10)]),
    );

    return {
      data: organizations.map((o) => ({
        ...this.mapOrganization(o),
        userCount: userCountMap.get(o.id) || 0,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrganization(id: string): Promise<AdminOrganizationDto> {
    const org = await this.db.organizations.findOne({ where: { id } });

    if (!org) {
      throw ApiExceptions.organizationNotFound();
    }

    const [jobCount, userCount] = await Promise.all([
      this.db.jobs.count({ where: { organizationId: id } }),
      this.db.users.count({ where: { organizationId: id } }),
    ]);

    return {
      ...this.mapOrganization(org),
      jobCount,
      userCount,
    };
  }

  async updateOrganizationVerification(
    id: string,
    dto: UpdateOrganizationVerificationDto,
  ): Promise<AdminOrganizationDto> {
    const org = await this.db.organizations.findOne({ where: { id } });

    if (!org) {
      throw ApiExceptions.organizationNotFound();
    }

    await this.db.organizations.update(id, { isVerified: dto.isVerified });

    return this.getOrganization(id);
  }

  // ==================== Tenants ====================

  async listTenants(): Promise<AdminTenantDto[]> {
    const tenants = await this.db.tenants.find({
      order: { createdAt: 'DESC' },
    });

    const results = await Promise.all(
      tenants.map(async (t) => {
        const [userCount, organizationCount, jobCount] = await Promise.all([
          this.db.users.count({ where: { tenantId: t.id } }),
          this.db.organizations.count({ where: { tenantId: t.id } }),
          this.db.jobs.count({ where: { tenantId: t.id } }),
        ]);

        return {
          ...this.mapTenant(t),
          userCount,
          organizationCount,
          jobCount,
        };
      }),
    );

    return results;
  }

  async getTenant(id: string): Promise<AdminTenantDto> {
    const tenant = await this.db.tenants.findOne({ where: { id } });

    if (!tenant) {
      throw ApiExceptions.tenantNotFound();
    }

    const [userCount, organizationCount, jobCount] = await Promise.all([
      this.db.users.count({ where: { tenantId: id } }),
      this.db.organizations.count({ where: { tenantId: id } }),
      this.db.jobs.count({ where: { tenantId: id } }),
    ]);

    return {
      ...this.mapTenant(tenant),
      userCount,
      organizationCount,
      jobCount,
    };
  }

  async updateTenant(
    id: string,
    dto: UpdateTenantDto,
  ): Promise<AdminTenantDto> {
    const tenant = await this.db.tenants.findOne({ where: { id } });

    if (!tenant) {
      throw ApiExceptions.tenantNotFound();
    }

    await this.db.tenants.update(id, dto);

    return this.getTenant(id);
  }

  // ==================== Categories ====================

  async listCategories(): Promise<AdminCategoryDto[]> {
    const categories = await this.db.categories.find({
      relations: ['translations'],
      order: { createdAt: 'DESC' },
    });

    const results = await Promise.all(
      categories.map(async (c) => {
        const jobCount = await this.db.jobs.count({
          where: { categoryId: c.id },
        });
        return this.mapCategory(c, jobCount);
      }),
    );

    return results;
  }

  async createCategory(dto: CreateCategoryDto): Promise<AdminCategoryDto> {
    const category = await this.db.categories.save({
      slug: dto.slug,
      parentId: dto.parentId || null,
      tenantId: dto.tenantId || null,
    });

    // Save translations
    const translations = Object.entries(dto.translations).map(
      ([language, name]) => ({
        categoryId: category.id,
        language,
        name,
      }),
    );

    await this.db.categoryTranslations.save(translations);

    const saved = await this.db.categories.findOne({
      where: { id: category.id },
      relations: ['translations'],
    });

    return this.mapCategory(saved!, 0);
  }

  async updateCategory(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<AdminCategoryDto> {
    const category = await this.db.categories.findOne({
      where: { id },
      relations: ['translations'],
    });

    if (!category) {
      throw ApiExceptions.categoryNotFound();
    }

    if (dto.slug) {
      await this.db.categories.update(id, { slug: dto.slug });
    }

    if (dto.translations) {
      // Delete existing translations
      await this.db.categoryTranslations.delete({ categoryId: id });

      // Save new translations
      const translations = Object.entries(dto.translations).map(
        ([language, name]) => ({
          categoryId: id,
          language,
          name,
        }),
      );

      await this.db.categoryTranslations.save(translations);
    }

    const updated = await this.db.categories.findOne({
      where: { id },
      relations: ['translations'],
    });

    const jobCount = await this.db.jobs.count({ where: { categoryId: id } });

    return this.mapCategory(updated!, jobCount);
  }

  async deleteCategory(id: string): Promise<void> {
    const jobCount = await this.db.jobs.count({ where: { categoryId: id } });

    if (jobCount > 0) {
      throw ApiExceptions.conflict(
        'Cannot delete category with associated jobs',
      );
    }

    await this.db.categoryTranslations.delete({ categoryId: id });
    await this.db.categories.delete(id);
  }

  // ==================== Locations ====================

  async listLocations(tenantId?: string): Promise<AdminLocationDto[]> {
    const qb = this.db.locations
      .createQueryBuilder('loc')
      .orderBy('loc.name', 'ASC');

    if (tenantId) {
      qb.where('loc.tenantId = :tenantId', { tenantId });
    }

    const locations = await qb.getMany();

    const results = await Promise.all(
      locations.map(async (l) => {
        const jobCount = await this.db.jobs.count({
          where: { locationId: l.id },
        });
        return this.mapLocation(l, jobCount);
      }),
    );

    return results;
  }

  async createLocation(dto: CreateLocationDto): Promise<AdminLocationDto> {
    const location = await this.db.locations.save({
      name: dto.name,
      slug: dto.slug,
      type: dto.type as LocationType,
      tenantId: dto.tenantId,
      parentId: dto.parentId || null,
    });

    return this.mapLocation(location, 0);
  }

  async updateLocation(
    id: string,
    dto: UpdateLocationDto,
  ): Promise<AdminLocationDto> {
    const location = await this.db.locations.findOne({ where: { id } });

    if (!location) {
      throw ApiExceptions.notFound('Location');
    }

    await this.db.locations.update(id, dto);

    const updated = await this.db.locations.findOneOrFail({ where: { id } });
    const jobCount = await this.db.jobs.count({ where: { locationId: id } });

    return this.mapLocation(updated, jobCount);
  }

  async deleteLocation(id: string): Promise<void> {
    const jobCount = await this.db.jobs.count({ where: { locationId: id } });

    if (jobCount > 0) {
      throw ApiExceptions.conflict(
        'Cannot delete location with associated jobs',
      );
    }

    await this.db.locations.delete(id);
  }

  // ==================== Impersonation ====================

  async impersonateUser(
    targetUserId: string,
    admin: RequestUser,
  ): Promise<ImpersonationTokenDto> {
    const targetUser = await this.db.users.findOne({
      where: { id: targetUserId },
      relations: ['profile'],
    });

    if (!targetUser) {
      throw ApiExceptions.userNotFound();
    }

    // Create impersonation session
    const session = await this.db.sessions.save({
      userId: targetUser.id,
      userAgent: `Impersonation by admin ${admin.id}`,
      ipAddress: 'admin-impersonation',
      deviceType: 'admin',
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // Generate tokens
    const payload = {
      sub: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      tenantId: targetUser.tenantId,
      sessionId: session.id,
      impersonatedBy: admin.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(
      { sub: targetUser.id, sessionId: session.id },
      { expiresIn: '1h' },
    );

    // Save refresh token
    await this.db.refreshTokens.save({
      sessionId: session.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    // Determine redirect URL based on user role
    const isClient = [UserRole.CLIENT, UserRole.CLIENT_ADMIN].includes(
      targetUser.role,
    );
    const redirectUrl = isClient
      ? `${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3002'}/overview`
      : `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/`;

    return {
      accessToken,
      refreshToken,
      redirectUrl,
    };
  }

  // ==================== Private Helpers ====================

  private mapUser(user: User): AdminUserDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      organizationId: user.organizationId,
      firstName: user.profile?.firstName || null,
      lastName: user.profile?.lastName || null,
      createdAt: user.createdAt,
    };
  }

  private mapOrganization(
    org: Organization,
  ): Omit<AdminOrganizationDto, 'userCount'> {
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description,
      website: org.website,
      industry: org.industry,
      size: org.size,
      isVerified: org.isVerified,
      tenantId: org.tenantId,
      jobCount: (org as any).jobCount || 0,
      createdAt: org.createdAt,
    };
  }

  private mapTenant(
    tenant: Tenant,
  ): Omit<AdminTenantDto, 'userCount' | 'organizationCount' | 'jobCount'> {
    return {
      id: tenant.id,
      code: tenant.code,
      name: tenant.name,
      domain: tenant.domain,
      defaultLanguage: tenant.defaultLanguage,
      supportedLanguages: tenant.supportedLanguages || [],
      currency: tenant.currency,
      timezone: tenant.timezone,
      isActive: tenant.isActive,
      createdAt: tenant.createdAt,
    };
  }

  private mapCategory(category: Category, jobCount: number): AdminCategoryDto {
    const translations: Record<string, string> = {};
    (category.translations || []).forEach((t: CategoryTranslation) => {
      translations[t.language] = t.name;
    });

    return {
      id: category.id,
      slug: category.slug,
      parentId: category.parentId,
      tenantId: category.tenantId,
      jobCount,
      translations,
      createdAt: category.createdAt,
    };
  }

  private mapLocation(location: Location, jobCount: number): AdminLocationDto {
    return {
      id: location.id,
      name: location.name,
      slug: location.slug,
      type: location.type,
      parentId: location.parentId,
      tenantId: location.tenantId,
      jobCount,
      createdAt: location.createdAt,
    };
  }
}
