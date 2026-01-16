import { Injectable } from '@nestjs/common';
import {
  DatabaseService,
  JobStatus,
  Location,
  LocationType,
} from '@job-board/db';

import { LocationResponseDto } from './dto';

@Injectable()
export class LocationsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Get all locations for a tenant (flat list)
   */
  async findAll(
    tenantId: string,
    type?: LocationType,
  ): Promise<{ data: LocationResponseDto[]; total: number }> {
    const qb = this.db.locations
      .createQueryBuilder('loc')
      .leftJoin('loc.parent', 'parent')
      .addSelect(['parent.id', 'parent.name', 'parent.slug', 'parent.type'])
      .where('loc.tenantId = :tenantId', { tenantId })
      .orderBy('loc.name', 'ASC');

    if (type) {
      qb.andWhere('loc.type = :type', { type });
    }

    const [locations, total] = await qb.getManyAndCount();

    return {
      data: locations.map((loc) => this.mapToResponse(loc)),
      total,
    };
  }

  /**
   * Get location tree (hierarchical)
   */
  async getTree(tenantId: string): Promise<LocationResponseDto[]> {
    // Get all top-level locations (no parent)
    const topLevel = await this.db.locations.find({
      where: { tenantId, parentId: null as any },
      relations: ['children', 'children.children'],
      order: { name: 'ASC' },
    });

    return topLevel.map((loc) => this.mapToTreeResponse(loc));
  }

  /**
   * Get locations with job counts
   */
  async findWithJobCounts(
    tenantId: string,
    type?: LocationType,
  ): Promise<LocationResponseDto[]> {
    const qb = this.db.locations
      .createQueryBuilder('loc')
      .leftJoin(
        (subQuery) =>
          subQuery
            .select('job.locationId', 'locationId')
            .addSelect('COUNT(*)', 'count')
            .from('jobs', 'job')
            .where('job.status = :status', { status: JobStatus.ACTIVE })
            .andWhere('job.expiresAt > :now', { now: new Date() })
            .groupBy('job.locationId'),
        'jobCounts',
        'jobCounts.locationId = loc.id',
      )
      .addSelect('COALESCE(jobCounts.count, 0)', 'jobCount')
      .where('loc.tenantId = :tenantId', { tenantId })
      .orderBy('loc.name', 'ASC');

    if (type) {
      qb.andWhere('loc.type = :type', { type });
    }

    const results = await qb.getRawAndEntities();

    return results.entities.map((loc, idx) => ({
      ...this.mapToResponse(loc),
      jobCount: parseInt(results.raw[idx].jobCount, 10) || 0,
    }));
  }

  /**
   * Get single location by ID or slug
   */
  async findOne(
    tenantId: string,
    idOrSlug: string,
  ): Promise<LocationResponseDto | null> {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug,
      );

    const qb = this.db.locations
      .createQueryBuilder('loc')
      .leftJoinAndSelect('loc.parent', 'parent')
      .leftJoinAndSelect('loc.children', 'children')
      .where('loc.tenantId = :tenantId', { tenantId });

    if (isUuid) {
      qb.andWhere('loc.id = :id', { id: idOrSlug });
    } else {
      qb.andWhere('loc.slug = :slug', { slug: idOrSlug });
    }

    const location = await qb.getOne();

    if (!location) {
      return null;
    }

    return this.mapToResponse(location, true);
  }

  // ==================== Private Helpers ====================

  private mapToResponse(
    location: Location,
    includeRelations = false,
  ): LocationResponseDto {
    const response: LocationResponseDto = {
      id: location.id,
      type: location.type,
      slug: location.slug,
      name: location.name,
      parentId: location.parentId,
    };

    if (includeRelations) {
      if (location.parent) {
        response.parent = this.mapToResponse(location.parent);
      }
      if (location.children?.length) {
        response.children = location.children.map((c) => this.mapToResponse(c));
      }
    }

    return response;
  }

  private mapToTreeResponse(location: Location): LocationResponseDto {
    return {
      id: location.id,
      type: location.type,
      slug: location.slug,
      name: location.name,
      parentId: location.parentId,
      children: location.children?.map((c) => this.mapToTreeResponse(c)) || [],
    };
  }
}
