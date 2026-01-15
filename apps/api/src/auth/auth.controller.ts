import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { CurrentUser, Public } from './decorators';
import {
  AuthResponseDto,
  LoginDto,
  MessageResponseDto,
  RefreshTokenDto,
  RegisterDto,
  UserResponseDto,
} from './dto';
import { RequestUser } from './interfaces';

import { ApiErrorResponseDto } from '@/common/dto/api-error-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * POST /auth/register
   */
  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with email and password. Returns access and refresh tokens.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - invalid input data',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists with this email',
    type: ApiErrorResponseDto,
  })
  async register(
    @Body() dto: RegisterDto,
    @Req() request: Request,
  ): Promise<AuthResponseDto> {
    return this.authService.register(dto, request);
  }

  /**
   * Login user
   * POST /auth/login
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticates user with email and password. Returns access and refresh tokens.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - invalid input data',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ApiErrorResponseDto,
  })
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
  ): Promise<AuthResponseDto> {
    return this.authService.login(dto, request);
  }

  /**
   * Refresh tokens
   * POST /auth/refresh
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Exchanges a valid refresh token for a new access token and rotated refresh token.',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - invalid input data',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
    type: ApiErrorResponseDto,
  })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refresh(dto.refreshToken);
  }

  /**
   * Logout user
   * POST /auth/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Invalidates the current session and associated refresh tokens.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing access token',
    type: ApiErrorResponseDto,
  })
  async logout(@CurrentUser() user: RequestUser): Promise<MessageResponseDto> {
    await this.authService.logout(user.sessionId);
    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user
   * GET /auth/me
   */
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the authenticated user profile information.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing access token',
    type: ApiErrorResponseDto,
  })
  async me(@CurrentUser() user: RequestUser): Promise<UserResponseDto> {
    return this.authService.getCurrentUser(user);
  }
}
