import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocationType } from '@job-board/db';

import { ApiErrorResponseDto } from '@/common/dto/api-error-response.dto';

import { Public } from '../auth/decorators';
import { LocationsService } from './locations.service';
import {
  LocationListResponseDto,
  LocationResponseDto,
  LocationTreeResponseDto,
} from './dto';

// Default tenant ID for development
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

@ApiTags('Locations')
@Public()
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * Get all locations (flat list)
   */
  @Get()
  @ApiOperation({
    summary: 'Get all locations',
    description: 'Get all locations for the current tenant.',
  })
  @ApiHeader({
    name: 'X-Tenant-Id',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: LocationType,
    description: 'Filter by location type',
  })
  @ApiResponse({
    status: 200,
    description: 'List of locations',
    type: LocationListResponseDto,
  })
  async findAll(
    @Headers('X-Tenant-Id') tenantId?: string,
    @Query('type') type?: LocationType,
  ): Promise<LocationListResponseDto> {
    return this.locationsService.findAll(tenantId || DEFAULT_TENANT_ID, type);
  }

  /**
   * Get locations as hierarchical tree
   */
  @Get('tree')
  @ApiOperation({
    summary: 'Get location tree',
    description: 'Get locations as a hierarchical tree structure.',
  })
  @ApiHeader({
    name: 'X-Tenant-Id',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Location tree',
    type: LocationTreeResponseDto,
  })
  async getTree(
    @Headers('X-Tenant-Id') tenantId?: string,
  ): Promise<LocationTreeResponseDto> {
    const data = await this.locationsService.getTree(
      tenantId || DEFAULT_TENANT_ID,
    );
    return { data };
  }

  /**
   * Get locations with job counts
   */
  @Get('with-counts')
  @ApiOperation({
    summary: 'Get locations with job counts',
    description:
      'Get locations with the number of active jobs in each location.',
  })
  @ApiHeader({
    name: 'X-Tenant-Id',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: LocationType,
    description: 'Filter by location type',
  })
  @ApiResponse({
    status: 200,
    description: 'Locations with job counts',
    type: [LocationResponseDto],
  })
  async findWithJobCounts(
    @Headers('X-Tenant-Id') tenantId?: string,
    @Query('type') type?: LocationType,
  ): Promise<LocationResponseDto[]> {
    return this.locationsService.findWithJobCounts(
      tenantId || DEFAULT_TENANT_ID,
      type,
    );
  }

  /**
   * Get single location
   */
  @Get(':idOrSlug')
  @ApiOperation({
    summary: 'Get location by ID or slug',
    description: 'Get a single location with its parent and children.',
  })
  @ApiParam({
    name: 'idOrSlug',
    description: 'Location ID (UUID) or slug',
  })
  @ApiHeader({
    name: 'X-Tenant-Id',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Location details',
    type: LocationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Location not found',
    type: ApiErrorResponseDto,
  })
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Headers('X-Tenant-Id') tenantId?: string,
  ): Promise<LocationResponseDto | null> {
    return this.locationsService.findOne(
      tenantId || DEFAULT_TENANT_ID,
      idOrSlug,
    );
  }
}
