import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiErrorResponseDto } from '@/common/dto/api-error-response.dto';

import { CurrentUser } from '../auth/decorators';
import { RequestUser } from '../auth/interfaces';
import {
  CreateJobDto,
  UpdateJobDto,
  PublishJobDto,
  JobResponseDto,
  JobListResponseDto,
} from './dto';
import { JobsService } from './jobs.service';

@ApiTags('Jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * Create a new job draft
   */
  @Post()
  @ApiOperation({
    summary: 'Create job draft',
    description:
      "Creates a new job listing in DRAFT status for the user's organization.",
  })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({
    status: 201,
    description: 'Job created successfully',
    type: JobResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'User has no organization',
    type: ApiErrorResponseDto,
  })
  async create(
    @Body() dto: CreateJobDto,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {
    return this.jobsService.create(dto, user);
  }

  /**
   * List all jobs for user's organization
   */
  @Get()
  @ApiOperation({
    summary: 'List organization jobs',
    description: "Returns all jobs for the authenticated user's organization.",
  })
  @ApiResponse({
    status: 200,
    description: 'Jobs list',
    type: JobListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  async findAll(@CurrentUser() user: RequestUser): Promise<JobListResponseDto> {
    return this.jobsService.findAll(user);
  }

  /**
   * Get job by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get job by ID',
    description: 'Returns a single job if the user has access.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Job ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Job found',
    type: JobResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
    type: ApiErrorResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {
    return this.jobsService.findOne(id, user);
  }

  /**
   * Update job
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update job',
    description: 'Updates a job listing. Only DRAFT and ACTIVE jobs can be edited.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Job ID',
  })
  @ApiBody({ type: UpdateJobDto })
  @ApiResponse({
    status: 200,
    description: 'Job updated',
    type: JobResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Job cannot be edited in current status',
    type: ApiErrorResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobDto,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {
    return this.jobsService.update(id, dto, user);
  }

  /**
   * Delete job
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete job',
    description: 'Deletes a job listing. Only DRAFT jobs can be deleted.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Job ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Job deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Only draft jobs can be deleted',
    type: ApiErrorResponseDto,
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    return this.jobsService.remove(id, user);
  }

  /**
   * Publish job
   */
  @Post(':id/publish')
  @ApiOperation({
    summary: 'Publish job',
    description:
      'Publishes a draft job. Sets tier and optional promotions. Job becomes ACTIVE with 30-day expiry.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Job ID',
  })
  @ApiBody({ type: PublishJobDto })
  @ApiResponse({
    status: 200,
    description: 'Job published',
    type: JobResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or missing required fields',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Job is not in draft status',
    type: ApiErrorResponseDto,
  })
  async publish(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PublishJobDto,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {
    return this.jobsService.publish(id, dto, user);
  }

  /**
   * Close job listing
   */
  @Post(':id/close')
  @ApiOperation({
    summary: 'Close job listing',
    description: 'Closes an active job listing. Use when position is filled.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Job ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Job closed',
    type: JobResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Job is not active',
    type: ApiErrorResponseDto,
  })
  async close(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {
    return this.jobsService.close(id, user);
  }

  /**
   * Extend job expiration
   */
  @Post(':id/extend')
  @ApiOperation({
    summary: 'Extend job expiration',
    description:
      'Extends job listing by 30 days. Can be used on ACTIVE or EXPIRED jobs.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Job ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Job extended',
    type: JobResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Job cannot be extended in current status',
    type: ApiErrorResponseDto,
  })
  async extend(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {
    return this.jobsService.extend(id, user);
  }
}
