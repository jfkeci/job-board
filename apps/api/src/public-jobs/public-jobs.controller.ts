import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiErrorResponseDto } from '@/common/dto/api-error-response.dto';

import { CurrentUser, Public } from '../auth/decorators';
import { RequestUser } from '../auth/interfaces';
import { PublicJobsService } from './public-jobs.service';
import {
  FeaturedJobsResponseDto,
  JobSearchDto,
  PublicJobListItemDto,
  PublicJobResponseDto,
  PublicJobSearchResponseDto,
} from './dto';

// Default tenant ID for development (should come from domain in production)
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

@ApiTags('Public Jobs')
@Public()
@Controller('public/jobs')
export class PublicJobsController {
  constructor(private readonly publicJobsService: PublicJobsService) {}

  /**
   * Search jobs with filters
   */
  @Get('search')
  @ApiOperation({
    summary: 'Search jobs',
    description: 'Search active job listings with filters and pagination.',
  })
  @ApiHeader({
    name: 'X-Tenant-Id',
    description: 'Tenant ID (optional, derived from domain in production)',
    required: false,
  })
  @ApiHeader({
    name: 'Accept-Language',
    description: 'Preferred language for category names',
    required: false,
    example: 'en',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    type: PublicJobSearchResponseDto,
  })
  async search(
    @Query() dto: JobSearchDto,
    @Req() req: Request,
    @Headers('X-Tenant-Id') tenantId?: string,
    @Headers('Accept-Language') language?: string,
    @CurrentUser() user?: RequestUser,
  ): Promise<PublicJobSearchResponseDto> {
    return this.publicJobsService.search(
      tenantId || DEFAULT_TENANT_ID,
      dto,
      language?.split(',')[0] || 'en',
      {
        userId: user?.id,
        sessionId: user?.sessionId || req.cookies?.sessionId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    );
  }

  /**
   * Get featured and recent jobs for homepage
   */
  @Get('featured')
  @ApiOperation({
    summary: 'Get featured jobs',
    description:
      'Get featured (premium) and recent jobs for the homepage display.',
  })
  @ApiHeader({
    name: 'X-Tenant-Id',
    required: false,
  })
  @ApiHeader({
    name: 'Accept-Language',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Featured and recent jobs',
    type: FeaturedJobsResponseDto,
  })
  async getFeatured(
    @Headers('X-Tenant-Id') tenantId?: string,
    @Headers('Accept-Language') language?: string,
  ): Promise<FeaturedJobsResponseDto> {
    return this.publicJobsService.getFeatured(
      tenantId || DEFAULT_TENANT_ID,
      language?.split(',')[0] || 'en',
    );
  }

  /**
   * Get job details by ID or slug
   */
  @Get(':idOrSlug')
  @ApiOperation({
    summary: 'Get job details',
    description: 'Get full job details by ID or slug.',
  })
  @ApiParam({
    name: 'idOrSlug',
    description: 'Job ID (UUID) or slug',
    examples: {
      uuid: { value: '550e8400-e29b-41d4-a716-446655440000' },
      slug: { value: 'senior-software-engineer' },
    },
  })
  @ApiHeader({
    name: 'X-Tenant-Id',
    required: false,
  })
  @ApiHeader({
    name: 'Accept-Language',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Job details',
    type: PublicJobResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
    type: ApiErrorResponseDto,
  })
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Headers('X-Tenant-Id') tenantId?: string,
    @Headers('Accept-Language') language?: string,
  ): Promise<PublicJobResponseDto> {
    return this.publicJobsService.findOne(
      tenantId || DEFAULT_TENANT_ID,
      idOrSlug,
      language?.split(',')[0] || 'en',
    );
  }

  /**
   * Track job view
   */
  @Post(':id/view')
  @ApiOperation({
    summary: 'Track job view',
    description:
      'Track a job view. Call this when a user views the job details page.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Job ID',
  })
  @ApiHeader({
    name: 'X-Tenant-Id',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'View tracked',
  })
  async trackView(
    @Param('id') id: string,
    @Headers('X-Tenant-Id') tenantId?: string,
    @CurrentUser() user?: RequestUser,
  ): Promise<{ success: boolean }> {
    await this.publicJobsService.trackView(
      tenantId || DEFAULT_TENANT_ID,
      id,
      user?.id,
    );
    return { success: true };
  }

  /**
   * Get similar jobs
   */
  @Get(':id/similar')
  @ApiOperation({
    summary: 'Get similar jobs',
    description: 'Get jobs similar to the specified job based on category.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Job ID',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of similar jobs to return',
    example: 4,
  })
  @ApiHeader({
    name: 'X-Tenant-Id',
    required: false,
  })
  @ApiHeader({
    name: 'Accept-Language',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Similar jobs',
    type: [PublicJobListItemDto],
  })
  async getSimilar(
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Headers('X-Tenant-Id') tenantId?: string,
    @Headers('Accept-Language') language?: string,
  ): Promise<PublicJobListItemDto[]> {
    return this.publicJobsService.getSimilar(
      tenantId || DEFAULT_TENANT_ID,
      id,
      language?.split(',')[0] || 'en',
      limit || 4,
    );
  }
}
