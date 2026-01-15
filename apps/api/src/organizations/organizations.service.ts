import { Injectable } from '@nestjs/common';

import { ApiExceptions } from '@borg/backend-lib';
import { DatabaseService, Organization, UserRole } from '@borg/db';

import { RequestUser } from '../auth/interfaces';
import {
  CreateOrganizationDto,
  OrganizationResponseDto,
  UpdateOrganizationDto,
} from './dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create a new organization
   * The creating user becomes the organization admin
   */
  async create(
    dto: CreateOrganizationDto,
    user: RequestUser,
  ): Promise<OrganizationResponseDto> {
    // Check if user already has an organization
    const existingUser = await this.db.users.findOne({
      where: { id: user.id },
    });

    if (existingUser?.organizationId) {
      throw ApiExceptions.conflict('Organization');
    }

    // Generate unique slug
    const baseSlug = this.generateSlug(dto.name);
    const slug = await this.ensureUniqueSlug(baseSlug, user.tenantId);

    // Create organization
    const organization = this.db.organizations.create({
      tenantId: user.tenantId,
      name: dto.name,
      slug,
      description: dto.description || null,
      website: dto.website || null,
      industry: dto.industry || null,
      size: dto.size || null,
      isVerified: false,
    });

    const savedOrganization = await this.db.organizations.save(organization);

    // Update user to be organization admin
    await this.db.users.update(user.id, {
      organizationId: savedOrganization.id,
      role: UserRole.CLIENT_ADMIN,
    });

    return this.mapToResponse(savedOrganization);
  }

  /**
   * Get organization by ID
   */
  async findOne(id: string, user: RequestUser): Promise<OrganizationResponseDto> {
    const organization = await this.db.organizations.findOne({
      where: { id },
    });

    if (!organization) {
      throw ApiExceptions.organizationNotFound();
    }

    // Verify user has access
    await this.verifyReadAccess(organization, user);

    return this.mapToResponse(organization);
  }

  /**
   * Update organization
   */
  async update(
    id: string,
    dto: UpdateOrganizationDto,
    user: RequestUser,
  ): Promise<OrganizationResponseDto> {
    const organization = await this.db.organizations.findOne({
      where: { id },
    });

    if (!organization) {
      throw ApiExceptions.organizationNotFound();
    }

    // Verify user has write access
    await this.verifyWriteAccess(organization, user);

    // Update fields
    if (dto.name !== undefined) {
      organization.name = dto.name;
      // Regenerate slug if name changed
      const baseSlug = this.generateSlug(dto.name);
      organization.slug = await this.ensureUniqueSlug(
        baseSlug,
        organization.tenantId,
        organization.id,
      );
    }

    if (dto.description !== undefined) {
      organization.description = dto.description || null;
    }

    if (dto.website !== undefined) {
      organization.website = dto.website || null;
    }

    if (dto.industry !== undefined) {
      organization.industry = dto.industry || null;
    }

    if (dto.size !== undefined) {
      organization.size = dto.size || null;
    }

    const updatedOrganization = await this.db.organizations.save(organization);

    return this.mapToResponse(updatedOrganization);
  }

  /**
   * Delete organization
   */
  async remove(id: string, user: RequestUser): Promise<void> {
    const organization = await this.db.organizations.findOne({
      where: { id },
    });

    if (!organization) {
      throw ApiExceptions.organizationNotFound();
    }

    // Verify user has write access
    await this.verifyWriteAccess(organization, user);

    // Remove organization
    await this.db.organizations.remove(organization);
  }

  /**
   * Generate URL-friendly slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Ensure slug is unique within tenant, appending number if needed
   */
  private async ensureUniqueSlug(
    baseSlug: string,
    tenantId: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.db.organizations.findOne({
        where: { slug, tenantId },
      });

      if (!existing || existing.id === excludeId) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Verify user has read access to organization
   */
  private async verifyReadAccess(
    organization: Organization,
    user: RequestUser,
  ): Promise<void> {
    // Platform admins can read any organization
    if (user.role === UserRole.ADMIN) {
      return;
    }

    // Must be in same tenant
    if (organization.tenantId !== user.tenantId) {
      throw ApiExceptions.organizationNotFound();
    }

    // For now, any authenticated user in the same tenant can view organizations
    // This can be restricted later if needed
  }

  /**
   * Verify user has write access to organization
   */
  private async verifyWriteAccess(
    organization: Organization,
    user: RequestUser,
  ): Promise<void> {
    // Platform admins can modify any organization
    if (user.role === UserRole.ADMIN) {
      return;
    }

    // Must be organization admin
    const currentUser = await this.db.users.findOne({
      where: { id: user.id },
    });

    if (!currentUser) {
      throw ApiExceptions.organizationAccessDenied();
    }

    const isOrgAdmin =
      currentUser.organizationId === organization.id &&
      currentUser.role === UserRole.CLIENT_ADMIN;

    if (!isOrgAdmin) {
      throw ApiExceptions.organizationAccessDenied();
    }
  }

  /**
   * Map Organization entity to response DTO
   */
  private mapToResponse(organization: Organization): OrganizationResponseDto {
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      description: organization.description,
      website: organization.website,
      logoFileId: organization.logoFileId,
      industry: organization.industry,
      size: organization.size,
      isVerified: organization.isVerified,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  }
}
