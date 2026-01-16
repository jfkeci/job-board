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
import { UserRole } from '@job-board/db';

import { ApiErrorResponseDto } from '@/common/dto/api-error-response.dto';

import { CurrentUser, Roles } from '../auth/decorators';
import { RequestUser } from '../auth/interfaces';
import { AdminService } from './admin.service';
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

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== Stats ====================

  @Get('stats')
  @ApiOperation({
    summary: 'Get platform statistics',
    description: 'Get overall platform statistics. Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Platform statistics',
    type: AdminStatsDto,
  })
  async getStats(): Promise<AdminStatsDto> {
    return this.adminService.getStats();
  }

  // ==================== Users ====================

  @Get('users')
  @ApiOperation({
    summary: 'List all users',
    description: 'Get paginated list of all users. Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
  })
  async listUsers(
    @Query() dto: PaginationDto,
  ): Promise<PaginatedResponseDto<AdminUserDto>> {
    return this.adminService.listUsers(dto);
  }

  @Get('users/:id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Get user details. Admin only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: AdminUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ApiErrorResponseDto,
  })
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<AdminUserDto> {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id/role')
  @ApiOperation({
    summary: 'Update user role',
    description: 'Change user role. Admin only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: AdminUserDto,
  })
  async updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<AdminUserDto> {
    return this.adminService.updateUserRole(id, dto);
  }

  @Post('users/:id/impersonate')
  @ApiOperation({
    summary: 'Impersonate user',
    description: 'Generate tokens to log in as another user. Admin only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Impersonation tokens',
    type: ImpersonationTokenDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ApiErrorResponseDto,
  })
  async impersonateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() admin: RequestUser,
  ): Promise<ImpersonationTokenDto> {
    return this.adminService.impersonateUser(id, admin);
  }

  // ==================== Organizations ====================

  @Get('organizations')
  @ApiOperation({
    summary: 'List all organizations',
    description: 'Get paginated list of all organizations. Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of organizations',
  })
  async listOrganizations(
    @Query() dto: PaginationDto,
  ): Promise<PaginatedResponseDto<AdminOrganizationDto>> {
    return this.adminService.listOrganizations(dto);
  }

  @Get('organizations/:id')
  @ApiOperation({
    summary: 'Get organization by ID',
    description: 'Get organization details. Admin only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Organization details',
    type: AdminOrganizationDto,
  })
  async getOrganization(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AdminOrganizationDto> {
    return this.adminService.getOrganization(id);
  }

  @Patch('organizations/:id/verify')
  @ApiOperation({
    summary: 'Update organization verification',
    description: 'Verify or unverify an organization. Admin only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateOrganizationVerificationDto })
  @ApiResponse({
    status: 200,
    description: 'Organization updated',
    type: AdminOrganizationDto,
  })
  async updateOrganizationVerification(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationVerificationDto,
  ): Promise<AdminOrganizationDto> {
    return this.adminService.updateOrganizationVerification(id, dto);
  }

  // ==================== Tenants ====================

  @Get('tenants')
  @ApiOperation({
    summary: 'List all tenants',
    description: 'Get all tenants with statistics. Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tenants',
    type: [AdminTenantDto],
  })
  async listTenants(): Promise<AdminTenantDto[]> {
    return this.adminService.listTenants();
  }

  @Get('tenants/:id')
  @ApiOperation({
    summary: 'Get tenant by ID',
    description: 'Get tenant details. Admin only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Tenant details',
    type: AdminTenantDto,
  })
  async getTenant(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AdminTenantDto> {
    return this.adminService.getTenant(id);
  }

  @Patch('tenants/:id')
  @ApiOperation({
    summary: 'Update tenant',
    description: 'Update tenant settings. Admin only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateTenantDto })
  @ApiResponse({
    status: 200,
    description: 'Tenant updated',
    type: AdminTenantDto,
  })
  async updateTenant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTenantDto,
  ): Promise<AdminTenantDto> {
    return this.adminService.updateTenant(id, dto);
  }

  // ==================== Categories ====================

  @Get('categories')
  @ApiOperation({
    summary: 'List all categories',
    description: 'Get all categories with translations. Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
    type: [AdminCategoryDto],
  })
  async listCategories(): Promise<AdminCategoryDto[]> {
    return this.adminService.listCategories();
  }

  @Post('categories')
  @ApiOperation({
    summary: 'Create category',
    description: 'Create a new category with translations. Admin only.',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Category created',
    type: AdminCategoryDto,
  })
  async createCategory(
    @Body() dto: CreateCategoryDto,
  ): Promise<AdminCategoryDto> {
    return this.adminService.createCategory(dto);
  }

  @Patch('categories/:id')
  @ApiOperation({
    summary: 'Update category',
    description: 'Update category and translations. Admin only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Category updated',
    type: AdminCategoryDto,
  })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<AdminCategoryDto> {
    return this.adminService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete category',
    description: 'Delete a category. Fails if jobs are associated. Admin only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Category deleted',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete category with jobs',
    type: ApiErrorResponseDto,
  })
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.adminService.deleteCategory(id);
  }

  // ==================== Locations ====================

  @Get('locations')
  @ApiOperation({
    summary: 'List all locations',
    description: 'Get all locations. Admin only.',
  })
  @ApiQuery({ name: 'tenantId', required: false, format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'List of locations',
    type: [AdminLocationDto],
  })
  async listLocations(
    @Query('tenantId') tenantId?: string,
  ): Promise<AdminLocationDto[]> {
    return this.adminService.listLocations(tenantId);
  }

  @Post('locations')
  @ApiOperation({
    summary: 'Create location',
    description: 'Create a new location. Admin only.',
  })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({
    status: 201,
    description: 'Location created',
    type: AdminLocationDto,
  })
  async createLocation(
    @Body() dto: CreateLocationDto,
  ): Promise<AdminLocationDto> {
    return this.adminService.createLocation(dto);
  }

  @Patch('locations/:id')
  @ApiOperation({
    summary: 'Update location',
    description: 'Update a location. Admin only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateLocationDto })
  @ApiResponse({
    status: 200,
    description: 'Location updated',
    type: AdminLocationDto,
  })
  async updateLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLocationDto,
  ): Promise<AdminLocationDto> {
    return this.adminService.updateLocation(id, dto);
  }

  @Delete('locations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete location',
    description: 'Delete a location. Fails if jobs are associated. Admin only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Location deleted',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete location with jobs',
    type: ApiErrorResponseDto,
  })
  async deleteLocation(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.adminService.deleteLocation(id);
  }
}
