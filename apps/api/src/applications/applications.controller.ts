import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApplicationStatus } from '@job-board/db';

import { ApiErrorResponseDto } from '@/common/dto/api-error-response.dto';

import { CurrentUser, Public } from '../auth/decorators';
import { RequestUser } from '../auth/interfaces';
import { ApplicationsService } from './applications.service';
import {
  ApplicationListResponseDto,
  ApplicationResponseDto,
  ApplicationStatusResponseDto,
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  /**
   * Apply for a job (anonymous or authenticated)
   */
  @Public()
  @Post('jobs/:jobId/apply')
  @ApiOperation({
    summary: 'Apply for a job',
    description:
      'Submit a job application. Can be done anonymously or as a logged-in user.',
  })
  @ApiParam({
    name: 'jobId',
    format: 'uuid',
    description: 'Job ID',
  })
  @ApiBody({ type: CreateApplicationDto })
  @ApiResponse({
    status: 201,
    description: 'Application submitted',
    type: ApplicationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Already applied or job not accepting applications',
    type: ApiErrorResponseDto,
  })
  async apply(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Body() dto: CreateApplicationDto,
    @CurrentUser() user?: RequestUser,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.apply(jobId, dto, user);
  }

  /**
   * Check application status by tracking token (public)
   */
  @Public()
  @Get('status/:token')
  @ApiOperation({
    summary: 'Check application status',
    description: 'Check the status of an application using the tracking token.',
  })
  @ApiParam({
    name: 'token',
    description: 'Tracking token received when submitting the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Application status',
    type: ApplicationStatusResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Application not found',
    type: ApiErrorResponseDto,
  })
  async checkStatus(
    @Param('token') token: string,
  ): Promise<ApplicationStatusResponseDto> {
    return this.applicationsService.checkStatus(token);
  }

  /**
   * Get my applications (authenticated users)
   */
  @ApiBearerAuth()
  @Get('my')
  @ApiOperation({
    summary: 'Get my applications',
    description: 'Get all applications submitted by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user applications',
    type: ApplicationListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  async findMyApplications(
    @CurrentUser() user: RequestUser,
  ): Promise<ApplicationListResponseDto> {
    return this.applicationsService.findMyApplications(user);
  }

  /**
   * Get applications for a job (organization access required)
   */
  @ApiBearerAuth()
  @Get('jobs/:jobId')
  @ApiOperation({
    summary: 'Get job applications',
    description:
      'Get all applications for a specific job. Requires organization access.',
  })
  @ApiParam({
    name: 'jobId',
    format: 'uuid',
    description: 'Job ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of applications',
    type: ApplicationListResponseDto,
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
  async findByJob(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<ApplicationListResponseDto> {
    return this.applicationsService.findByJob(jobId, user);
  }

  /**
   * Get application stats for a job
   */
  @ApiBearerAuth()
  @Get('jobs/:jobId/stats')
  @ApiOperation({
    summary: 'Get application statistics',
    description: 'Get application counts grouped by status for a specific job.',
  })
  @ApiParam({
    name: 'jobId',
    format: 'uuid',
    description: 'Job ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Application statistics by status',
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
  async getStats(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<Record<ApplicationStatus, number>> {
    return this.applicationsService.getStats(jobId, user);
  }

  /**
   * Get single application (organization access required)
   */
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({
    summary: 'Get application by ID',
    description: 'Get a single application. Requires organization access.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Application ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Application details',
    type: ApplicationResponseDto,
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
    description: 'Application not found',
    type: ApiErrorResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.findOne(id, user);
  }

  /**
   * Update application status (organization access required)
   */
  @ApiBearerAuth()
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update application status',
    description:
      'Update the status of an application and optionally add notes.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Application ID',
  })
  @ApiBody({ type: UpdateApplicationStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Application updated',
    type: ApplicationResponseDto,
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
    description: 'Application not found',
    type: ApiErrorResponseDto,
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser() user: RequestUser,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.updateStatus(id, dto, user);
  }
}
