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
  CreateOrganizationDto,
  OrganizationResponseDto,
  UpdateOrganizationDto,
} from './dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  /**
   * Create a new organization
   */
  @Post()
  @ApiOperation({
    summary: 'Create organization',
    description:
      'Creates a new organization. The authenticated user becomes the organization admin (CLIENT_ADMIN role).',
  })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
    type: OrganizationResponseDto,
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
    status: 409,
    description: 'User already has an organization or slug already exists',
    type: ApiErrorResponseDto,
  })
  async create(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: RequestUser,
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.create(dto, user);
  }

  /**
   * Get organization by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get organization by ID',
    description: 'Returns the organization details for the specified ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Organization unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization found',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
    type: ApiErrorResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.findOne(id, user);
  }

  /**
   * Update organization
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update organization',
    description:
      'Updates the organization details. Only organization admins can update.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Organization unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
    type: OrganizationResponseDto,
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
    description: 'Not organization admin',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
    type: ApiErrorResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
    @CurrentUser() user: RequestUser,
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.update(id, dto, user);
  }

  /**
   * Delete organization
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete organization',
    description:
      'Deletes the organization. Only organization admins can delete.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Organization unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Organization deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Not organization admin',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
    type: ApiErrorResponseDto,
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    return this.organizationsService.remove(id, user);
  }
}
