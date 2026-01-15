import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorDetailDto {
  @ApiProperty({ description: 'Field name that caused the error', example: 'email' })
  field!: string;

  @ApiProperty({ description: 'Error code', example: 'VALIDATION_EMAIL_INVALID' })
  code!: string;

  @ApiProperty({ description: 'Human-readable error message', example: 'Please enter a valid email address' })
  message!: string;

  @ApiPropertyOptional({ description: 'The invalid value that was provided' })
  value?: unknown;
}

export class ApiErrorDto {
  @ApiProperty({ description: 'Error code for programmatic handling', example: 'AUTH_INVALID_CREDENTIALS' })
  code!: string;

  @ApiProperty({ description: 'Human-readable error message', example: 'Invalid email or password' })
  message!: string;

  @ApiProperty({
    description: 'Error type category',
    enum: [
      'validation_error',
      'authentication_error',
      'authorization_error',
      'not_found_error',
      'conflict_error',
      'rate_limit_error',
      'api_error',
      'internal_error',
    ],
    example: 'authentication_error',
  })
  type!: string;

  @ApiProperty({ description: 'HTTP status code', example: 401 })
  statusCode!: number;

  @ApiProperty({ description: 'Error timestamp', format: 'date-time', example: '2026-01-15T10:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ description: 'Request path', example: '/api/auth/login' })
  path!: string;

  @ApiPropertyOptional({ description: 'Request ID for debugging', example: 'req_abc123' })
  requestId?: string;

  @ApiPropertyOptional({
    description: 'Validation error details (only for validation_error type)',
    type: [ErrorDetailDto],
  })
  details?: ErrorDetailDto[];

  @ApiPropertyOptional({ description: 'Stack trace (only in development)' })
  stack?: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ type: ApiErrorDto, description: 'Error details' })
  error!: ApiErrorDto;
}
