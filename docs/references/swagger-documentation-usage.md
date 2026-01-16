# Swagger Documentation Usage Reference

Quick reference for documenting API endpoints with request body, response, and exceptions.

---

## Table of Contents

1. [Setup](#setup)
2. [Controller Documentation](#controller-documentation)
3. [Endpoint Documentation](#endpoint-documentation)
4. [Request Body Documentation](#request-body-documentation)
5. [Response Documentation](#response-documentation)
6. [Exception Documentation](#exception-documentation)
7. [DTO Documentation](#dto-documentation)
8. [Common Patterns](#common-patterns)
9. [Quick Reference](#quick-reference)

---

## Setup

### Main Configuration

```typescript
// main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiErrorResponseDto } from './common/dto/api-error-response.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('job-board API')
    .setDescription('Job advertisement platform API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT access token',
      },
      'access-token',
    )
    .addGlobalParameters({
      name: 'X-Language',
      in: 'header',
      required: false,
      schema: { type: 'string', enum: ['en', 'hr', 'bs', 'mk'], default: 'en' },
      description: 'Response language for error messages',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ApiErrorResponseDto],
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
    },
  });

  await app.listen(3000);
}
```

### Required Imports

```typescript
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiProperty,
  ApiPropertyOptional,
  ApiBearerAuth,
  ApiHeader,
  ApiConsumes,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
```

---

## Controller Documentation

```typescript
@ApiTags('Jobs')
@ApiBearerAuth('access-token')
@ApiExtraModels(ApiErrorResponseDto)
@Controller('v1/jobs')
export class JobsController {}
```

---

## Endpoint Documentation

### Complete Endpoint Template

```typescript
@Post()
@ApiOperation({
  summary: 'Create a new job posting',
  description: `
    Creates a new job posting for the authenticated organization.

    **Required Permission:** \`jobs:create\`

    **Side Effects:**
    - Sends notification to organization admins
    - Triggers search index update
  `,
  operationId: 'createJob',
})
@ApiBody({ type: CreateJobDto })
@ApiResponse({ status: 201, description: 'Job created', type: JobResponseDto })
@ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponseDto })
@ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
@ApiResponse({ status: 403, description: 'Permission denied', type: ApiErrorResponseDto })
@ApiResponse({ status: 409, description: 'Duplicate job', type: ApiErrorResponseDto })
async create(@Body() dto: CreateJobDto): Promise<JobResponseDto> {}
```

### Path Parameters

```typescript
@Get(':id')
@ApiOperation({ summary: 'Get job by ID' })
@ApiParam({
  name: 'id',
  type: String,
  format: 'uuid',
  description: 'Job unique identifier',
  example: '550e8400-e29b-41d4-a716-446655440000',
})
@ApiResponse({ status: 200, type: JobResponseDto })
@ApiResponse({ status: 404, type: ApiErrorResponseDto })
async findOne(@Param('id', ParseUUIDPipe) id: string) {}
```

### Query Parameters

```typescript
@Get()
@ApiOperation({ summary: 'List jobs with filters' })
@ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
@ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
@ApiQuery({ name: 'status', enum: JobStatus, required: false })
@ApiQuery({ name: 'search', type: String, required: false })
@ApiQuery({
  name: 'sort',
  type: String,
  required: false,
  example: 'createdAt:desc',
  description: 'Sort field and direction',
})
@ApiResponse({ status: 200, type: PaginatedJobResponseDto })
async findAll(@Query() query: JobQueryDto) {}
```

---

## Request Body Documentation

### Basic Body

```typescript
@Post()
@ApiBody({
  type: CreateJobDto,
  description: 'Job creation payload',
})
async create(@Body() dto: CreateJobDto) {}
```

### Body with Examples

```typescript
@Post()
@ApiBody({
  type: CreateJobDto,
  description: 'Job creation payload',
  examples: {
    minimal: {
      summary: 'Minimal (draft)',
      description: 'Only required fields',
      value: {
        title: 'Software Engineer',
        description: 'We are looking for...',
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
      },
    },
    complete: {
      summary: 'Complete (publish)',
      description: 'All fields populated',
      value: {
        title: 'Senior Software Engineer',
        description: '## About Us\n\nWe are...',
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'active',
        salary: { min: 80000, max: 120000, currency: 'EUR' },
        location: { city: 'Zagreb', country: 'HR', remote: true },
        requirements: ['5+ years', 'TypeScript'],
      },
    },
  },
})
async create(@Body() dto: CreateJobDto) {}
```

### File Upload Body

```typescript
@Post('upload')
@ApiConsumes('multipart/form-data')
@ApiBody({
  description: 'File upload',
  schema: {
    type: 'object',
    required: ['file'],
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: 'File to upload (PDF, DOC, DOCX, max 10MB)',
      },
      description: {
        type: 'string',
        description: 'Optional file description',
        maxLength: 500,
      },
    },
  },
})
@UseInterceptors(FileInterceptor('file'))
async upload(@UploadedFile() file: Express.Multer.File) {}
```

---

## Response Documentation

### Success Response

```typescript
@ApiResponse({
  status: 200,
  description: 'Job retrieved successfully',
  type: JobResponseDto,
})
```

### Created with Location Header

```typescript
@ApiResponse({
  status: 201,
  description: 'Job created successfully',
  type: JobResponseDto,
  headers: {
    Location: {
      description: 'URL of created resource',
      schema: { type: 'string', example: '/v1/jobs/550e8400-...' },
    },
  },
})
```

### No Content

```typescript
@ApiResponse({
  status: 204,
  description: 'Job deleted successfully',
})
```

### Paginated Response

```typescript
@ApiResponse({
  status: 200,
  description: 'Paginated job list',
  schema: {
    allOf: [
      { $ref: getSchemaPath(PaginatedResponseDto) },
      {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(JobListItemDto) },
          },
        },
      },
    ],
  },
})
```

---

## Exception Documentation

### Standard Error Responses

Add these to every authenticated endpoint:

```typescript
// Validation Error (400)
@ApiResponse({
  status: 400,
  description: 'Validation error',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      example: {
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Validation failed. Please check your input',
          type: 'validation_error',
          statusCode: 400,
          timestamp: '2026-01-13T12:00:00.000Z',
          path: '/v1/jobs',
          details: [
            { field: 'title', code: 'VALIDATION_FIELD_REQUIRED', message: 'Title is required' },
          ],
        },
      },
    },
  },
})

// Authentication Error (401)
@ApiResponse({
  status: 401,
  description: 'Authentication required',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      example: {
        error: {
          code: 'AUTH_TOKEN_INVALID',
          message: 'Invalid authentication token',
          type: 'authentication_error',
          statusCode: 401,
          timestamp: '2026-01-13T12:00:00.000Z',
          path: '/v1/jobs',
        },
      },
    },
  },
})

// Authorization Error (403)
@ApiResponse({
  status: 403,
  description: 'Permission denied',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      example: {
        error: {
          code: 'AUTHZ_PERMISSION_DENIED',
          message: 'You do not have permission to perform this action',
          type: 'authorization_error',
          statusCode: 403,
          timestamp: '2026-01-13T12:00:00.000Z',
          path: '/v1/jobs',
        },
      },
    },
  },
})

// Not Found (404)
@ApiResponse({
  status: 404,
  description: 'Resource not found',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      example: {
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'The requested job was not found',
          type: 'not_found_error',
          statusCode: 404,
          timestamp: '2026-01-13T12:00:00.000Z',
          path: '/v1/jobs/invalid-id',
        },
      },
    },
  },
})

// Conflict (409)
@ApiResponse({
  status: 409,
  description: 'Resource conflict',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      example: {
        error: {
          code: 'RESOURCE_ALREADY_EXISTS',
          message: 'A job with this title already exists',
          type: 'conflict_error',
          statusCode: 409,
          timestamp: '2026-01-13T12:00:00.000Z',
          path: '/v1/jobs',
        },
      },
    },
  },
})
```

### Exception with Frontend Guidance

```typescript
@ApiResponse({
  status: 401,
  description: 'Authentication errors',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      examples: {
        token_expired: {
          summary: 'AUTH_TOKEN_EXPIRED',
          description: `
            **When:** JWT token has expired
            **Frontend:** Attempt token refresh, redirect to login if fails
            **Show Message:** No
          `,
          value: {
            error: {
              code: 'AUTH_TOKEN_EXPIRED',
              message: 'Your session has expired',
              type: 'authentication_error',
              statusCode: 401,
            },
          },
        },
        token_invalid: {
          summary: 'AUTH_TOKEN_INVALID',
          description: `
            **When:** JWT token is malformed
            **Frontend:** Clear tokens, redirect to login
            **Show Message:** No
          `,
          value: {
            error: {
              code: 'AUTH_TOKEN_INVALID',
              message: 'Invalid authentication token',
              type: 'authentication_error',
              statusCode: 401,
            },
          },
        },
      },
    },
  },
})
```

### Reusable Error Response Decorator

```typescript
// decorators/api-error-responses.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../dto/api-error-response.dto';

export function ApiErrorResponses(options?: {
  400?: boolean;
  401?: boolean;
  403?: boolean;
  404?: boolean;
  409?: boolean;
  429?: boolean;
}) {
  const decorators = [];

  if (options?.400 !== false) {
    decorators.push(
      ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponseDto })
    );
  }
  if (options?.401 !== false) {
    decorators.push(
      ApiResponse({ status: 401, description: 'Authentication required', type: ApiErrorResponseDto })
    );
  }
  if (options?.403) {
    decorators.push(
      ApiResponse({ status: 403, description: 'Permission denied', type: ApiErrorResponseDto })
    );
  }
  if (options?.404) {
    decorators.push(
      ApiResponse({ status: 404, description: 'Not found', type: ApiErrorResponseDto })
    );
  }
  if (options?.409) {
    decorators.push(
      ApiResponse({ status: 409, description: 'Conflict', type: ApiErrorResponseDto })
    );
  }
  if (options?.429) {
    decorators.push(
      ApiResponse({ status: 429, description: 'Rate limit exceeded', type: ApiErrorResponseDto })
    );
  }

  return applyDecorators(...decorators);
}

// Usage
@Post()
@ApiErrorResponses({ 403: true, 409: true })
async create(@Body() dto: CreateJobDto) {}
```

---

## DTO Documentation

### Basic DTO

```typescript
export class CreateJobDto {
  @ApiProperty({
    description: 'Job title',
    example: 'Senior Software Engineer',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Job description (Markdown supported)',
    example: '## About the Role\n\nWe are looking for...',
    minLength: 100,
    maxLength: 50000,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Category ID',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  categoryId: string;
}
```

### Optional Properties

```typescript
export class UpdateJobDto {
  @ApiPropertyOptional({
    description: 'Job title',
    example: 'Senior Software Engineer',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Salary range',
    type: SalaryRangeDto,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryRangeDto)
  salary?: SalaryRangeDto | null;
}
```

### Enum Properties

```typescript
export class JobQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: JobStatus,
    enumName: 'JobStatus',
    example: JobStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
```

### Array Properties

```typescript
export class CreateJobDto {
  @ApiPropertyOptional({
    description: 'Required skills',
    type: [String],
    example: ['TypeScript', 'NestJS', 'PostgreSQL'],
    maxItems: 20,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  requirements?: string[];
}
```

### Nested Objects

```typescript
export class SalaryRangeDto {
  @ApiProperty({ description: 'Minimum salary', example: 80000, minimum: 0 })
  @IsNumber()
  @Min(0)
  min: number;

  @ApiProperty({ description: 'Maximum salary', example: 120000, minimum: 0 })
  @IsNumber()
  @Min(0)
  max: number;

  @ApiProperty({
    description: 'Currency (ISO 4217)',
    example: 'EUR',
    pattern: '^[A-Z]{3}$',
  })
  @IsString()
  @Matches(/^[A-Z]{3}$/)
  currency: string;
}

export class CreateJobDto {
  @ApiPropertyOptional({
    description: 'Salary range',
    type: SalaryRangeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryRangeDto)
  salary?: SalaryRangeDto;
}
```

### Response DTO

```typescript
export class JobResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({ description: 'Job title', example: 'Software Engineer' })
  title: string;

  @ApiProperty({
    description: 'Current status',
    enum: JobStatus,
    enumName: 'JobStatus',
    example: JobStatus.ACTIVE,
  })
  status: JobStatus;

  @ApiProperty({
    description: 'Creation timestamp',
    format: 'date-time',
    example: '2026-01-13T12:00:00.000Z',
  })
  createdAt: string;

  @ApiPropertyOptional({
    description: 'Salary range (null if not disclosed)',
    type: SalaryRangeDto,
    nullable: true,
  })
  salary: SalaryRangeDto | null;
}
```

### Pagination DTOs

```typescript
export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 150 })
  total: number;

  @ApiProperty({ example: 8 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPrevPage: boolean;
}

export class PaginatedJobResponseDto {
  @ApiProperty({ type: [JobListItemDto] })
  data: JobListItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
```

### Error Response DTO

```typescript
export class ErrorDetailDto {
  @ApiProperty({ example: 'email' })
  field: string;

  @ApiProperty({ example: 'VALIDATION_EMAIL_INVALID' })
  code: string;

  @ApiProperty({ example: 'Please enter a valid email address' })
  message: string;

  @ApiPropertyOptional()
  value?: unknown;
}

export class ApiErrorDto {
  @ApiProperty({ example: 'VALIDATION_FAILED' })
  code: string;

  @ApiProperty({ example: 'Validation failed' })
  message: string;

  @ApiProperty({
    enum: ['validation_error', 'authentication_error', 'authorization_error',
           'not_found_error', 'conflict_error', 'rate_limit_error',
           'api_error', 'internal_error'],
    example: 'validation_error',
  })
  type: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: '2026-01-13T12:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/v1/jobs' })
  path: string;

  @ApiPropertyOptional({ example: 'req_abc123' })
  requestId?: string;

  @ApiPropertyOptional({ type: [ErrorDetailDto] })
  details?: ErrorDetailDto[];
}

export class ApiErrorResponseDto {
  @ApiProperty({ type: ApiErrorDto })
  error: ApiErrorDto;
}
```

---

## Common Patterns

### Public vs Protected Endpoints

```typescript
// Public endpoint (no auth)
@Get()
@ApiOperation({ summary: 'List public jobs' })
@ApiResponse({ status: 200, type: PaginatedJobResponseDto })
async findPublic() {}

// Protected endpoint
@Post()
@ApiBearerAuth('access-token')
@ApiOperation({ summary: 'Create job' })
@ApiResponse({ status: 201, type: JobResponseDto })
@ApiResponse({ status: 401, type: ApiErrorResponseDto })
@ApiResponse({ status: 403, type: ApiErrorResponseDto })
async create(@Body() dto: CreateJobDto) {}
```

### CRUD Endpoint Set

```typescript
@ApiTags('Jobs')
@ApiBearerAuth('access-token')
@Controller('v1/jobs')
export class JobsController {
  // CREATE
  @Post()
  @ApiOperation({ summary: 'Create job', operationId: 'createJob' })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({ status: 201, type: JobResponseDto })
  @ApiResponse({ status: 400, type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, type: ApiErrorResponseDto })
  @ApiResponse({ status: 409, type: ApiErrorResponseDto })
  async create(@Body() dto: CreateJobDto) {}

  // READ (list)
  @Get()
  @ApiOperation({ summary: 'List jobs', operationId: 'listJobs' })
  @ApiResponse({ status: 200, type: PaginatedJobResponseDto })
  @ApiResponse({ status: 401, type: ApiErrorResponseDto })
  async findAll(@Query() query: JobQueryDto) {}

  // READ (single)
  @Get(':id')
  @ApiOperation({ summary: 'Get job', operationId: 'getJob' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: JobResponseDto })
  @ApiResponse({ status: 401, type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {}

  // UPDATE
  @Put(':id')
  @ApiOperation({ summary: 'Update job', operationId: 'updateJob' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateJobDto })
  @ApiResponse({ status: 200, type: JobResponseDto })
  @ApiResponse({ status: 400, type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateJobDto) {}

  // DELETE
  @Delete(':id')
  @ApiOperation({ summary: 'Delete job', operationId: 'deleteJob' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Job deleted' })
  @ApiResponse({ status: 401, type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  @ApiResponse({ status: 409, type: ApiErrorResponseDto })
  async remove(@Param('id', ParseUUIDPipe) id: string) {}
}
```

---

## Quick Reference

### Decorator Cheatsheet

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@ApiTags('Name')` | Group endpoints | `@ApiTags('Jobs')` |
| `@ApiOperation({})` | Describe endpoint | `summary`, `description`, `operationId` |
| `@ApiBody({})` | Document request body | `type`, `examples` |
| `@ApiParam({})` | Document path param | `name`, `type`, `format` |
| `@ApiQuery({})` | Document query param | `name`, `type`, `required` |
| `@ApiResponse({})` | Document response | `status`, `type`, `description` |
| `@ApiProperty({})` | Document DTO property | `description`, `example` |
| `@ApiPropertyOptional({})` | Optional property | Same as ApiProperty |
| `@ApiBearerAuth()` | Require auth | `@ApiBearerAuth('access-token')` |
| `@ApiHeader({})` | Document header | `name`, `required` |
| `@ApiConsumes()` | Content type | `@ApiConsumes('multipart/form-data')` |
| `@ApiExtraModels()` | Register model | `@ApiExtraModels(ErrorDto)` |

### ApiProperty Options

| Option | Type | Description |
|--------|------|-------------|
| `description` | string | Property description |
| `example` | any | Example value |
| `required` | boolean | Is required (default: true) |
| `type` | Type | Property type |
| `format` | string | `uuid`, `date-time`, `email`, `uri` |
| `enum` | enum | Enum values |
| `enumName` | string | Enum name for codegen |
| `minimum` | number | Min value |
| `maximum` | number | Max value |
| `minLength` | number | Min string length |
| `maxLength` | number | Max string length |
| `pattern` | string | Regex pattern |
| `nullable` | boolean | Can be null |
| `default` | any | Default value |
| `isArray` | boolean | Is array |
| `minItems` | number | Min array items |
| `maxItems` | number | Max array items |

### HTTP Status Codes

| Status | When to Use |
|--------|-------------|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 204 | No content (DELETE) |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Not authorized |
| 404 | Not found |
| 409 | Conflict |
| 413 | Payload too large |
| 415 | Unsupported media type |
| 429 | Rate limited |
| 500 | Server error |

### Endpoint Documentation Checklist

```
□ @ApiOperation with summary and operationId
□ @ApiBody with type and examples (POST/PUT/PATCH)
□ @ApiParam for each path parameter
□ @ApiQuery for each query parameter
□ @ApiResponse for success (200/201/204)
□ @ApiResponse for 400 (if has body)
□ @ApiResponse for 401 (if authenticated)
□ @ApiResponse for 403 (if authorization)
□ @ApiResponse for 404 (if resource lookup)
□ @ApiResponse for 409 (if conflict possible)
□ @ApiBearerAuth (if authenticated)
```

### DTO Property Checklist

```
□ @ApiProperty or @ApiPropertyOptional
□ description with clear explanation
□ example with realistic value
□ format for special types (uuid, date-time)
□ enum + enumName for enums
□ min/max constraints
□ minLength/maxLength for strings
□ type for nested objects
□ nullable: true if can be null
```
