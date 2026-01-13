import { ExceptionCode } from './exception-codes.enum';
import type { ErrorType, ErrorDetail } from './types';

export class ApiException extends Error {
  public readonly code: ExceptionCode;
  public readonly statusCode: number;
  public readonly type: ErrorType;
  public readonly details?: ErrorDetail[];
  public readonly params?: Record<string, string | number>;

  constructor(
    code: ExceptionCode,
    statusCode: number,
    type: ErrorType,
    details?: ErrorDetail[],
    params?: Record<string, string | number>,
    message?: string,
  ) {
    super(message || code);
    this.name = 'ApiException';
    this.code = code;
    this.statusCode = statusCode;
    this.type = type;
    this.details = details;
    this.params = params;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ApiExceptions {
  // Authentication
  static invalidCredentials(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_INVALID_CREDENTIALS,
      401,
      'authentication_error',
    );
  }

  static tokenExpired(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_TOKEN_EXPIRED,
      401,
      'authentication_error',
    );
  }

  static tokenInvalid(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_TOKEN_INVALID,
      401,
      'authentication_error',
    );
  }

  static tokenMissing(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_TOKEN_MISSING,
      401,
      'authentication_error',
    );
  }

  static refreshTokenExpired(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_REFRESH_TOKEN_EXPIRED,
      401,
      'authentication_error',
    );
  }

  static refreshTokenInvalid(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_REFRESH_TOKEN_INVALID,
      401,
      'authentication_error',
    );
  }

  static sessionExpired(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_SESSION_EXPIRED,
      401,
      'authentication_error',
    );
  }

  static accountDisabled(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_ACCOUNT_DISABLED,
      403,
      'authentication_error',
    );
  }

  static accountLocked(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_ACCOUNT_LOCKED,
      403,
      'authentication_error',
    );
  }

  static emailNotVerified(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_EMAIL_NOT_VERIFIED,
      403,
      'authentication_error',
    );
  }

  static mfaRequired(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_MFA_REQUIRED,
      403,
      'authentication_error',
    );
  }

  static mfaInvalid(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_MFA_INVALID,
      401,
      'authentication_error',
    );
  }

  // Authorization
  static permissionDenied(): ApiException {
    return new ApiException(
      ExceptionCode.AUTHZ_PERMISSION_DENIED,
      403,
      'authorization_error',
    );
  }

  static roleRequired(): ApiException {
    return new ApiException(
      ExceptionCode.AUTHZ_ROLE_REQUIRED,
      403,
      'authorization_error',
    );
  }

  static resourceAccessDenied(): ApiException {
    return new ApiException(
      ExceptionCode.AUTHZ_RESOURCE_ACCESS_DENIED,
      403,
      'authorization_error',
    );
  }

  static tenantAccessDenied(): ApiException {
    return new ApiException(
      ExceptionCode.AUTHZ_TENANT_ACCESS_DENIED,
      403,
      'authorization_error',
    );
  }

  static organizationAccessDenied(): ApiException {
    return new ApiException(
      ExceptionCode.AUTHZ_ORGANIZATION_ACCESS_DENIED,
      403,
      'authorization_error',
    );
  }

  // Resource - Generic
  static notFound(resource?: string): ApiException {
    return new ApiException(
      ExceptionCode.RESOURCE_NOT_FOUND,
      404,
      'not_found_error',
      undefined,
      resource ? { resource } : undefined,
    );
  }

  static alreadyExists(resource?: string): ApiException {
    return new ApiException(
      ExceptionCode.RESOURCE_ALREADY_EXISTS,
      409,
      'conflict_error',
      undefined,
      resource ? { resource } : undefined,
    );
  }

  static conflict(resource?: string): ApiException {
    return new ApiException(
      ExceptionCode.RESOURCE_CONFLICT,
      409,
      'conflict_error',
      undefined,
      resource ? { resource } : undefined,
    );
  }

  static gone(): ApiException {
    return new ApiException(
      ExceptionCode.RESOURCE_GONE,
      410,
      'not_found_error',
    );
  }

  static locked(): ApiException {
    return new ApiException(
      ExceptionCode.RESOURCE_LOCKED,
      423,
      'conflict_error',
    );
  }

  // Resource - Specific
  static userNotFound(): ApiException {
    return new ApiException(
      ExceptionCode.USER_NOT_FOUND,
      404,
      'not_found_error',
    );
  }

  static userAlreadyExists(): ApiException {
    return new ApiException(
      ExceptionCode.USER_ALREADY_EXISTS,
      409,
      'conflict_error',
    );
  }

  static jobNotFound(): ApiException {
    return new ApiException(
      ExceptionCode.JOB_NOT_FOUND,
      404,
      'not_found_error',
    );
  }

  static jobExpired(): ApiException {
    return new ApiException(
      ExceptionCode.JOB_EXPIRED,
      410,
      'conflict_error',
    );
  }

  static jobClosed(): ApiException {
    return new ApiException(
      ExceptionCode.JOB_CLOSED,
      410,
      'conflict_error',
    );
  }

  static applicationNotFound(): ApiException {
    return new ApiException(
      ExceptionCode.APPLICATION_NOT_FOUND,
      404,
      'not_found_error',
    );
  }

  static applicationAlreadyExists(): ApiException {
    return new ApiException(
      ExceptionCode.APPLICATION_ALREADY_EXISTS,
      409,
      'conflict_error',
    );
  }

  static organizationNotFound(): ApiException {
    return new ApiException(
      ExceptionCode.ORGANIZATION_NOT_FOUND,
      404,
      'not_found_error',
    );
  }

  static tenantNotFound(): ApiException {
    return new ApiException(
      ExceptionCode.TENANT_NOT_FOUND,
      404,
      'not_found_error',
    );
  }

  static fileNotFound(): ApiException {
    return new ApiException(
      ExceptionCode.FILE_NOT_FOUND,
      404,
      'not_found_error',
    );
  }

  static categoryNotFound(): ApiException {
    return new ApiException(
      ExceptionCode.CATEGORY_NOT_FOUND,
      404,
      'not_found_error',
    );
  }

  // Validation
  static validationFailed(details: ErrorDetail[]): ApiException {
    return new ApiException(
      ExceptionCode.VALIDATION_FAILED,
      400,
      'validation_error',
      details,
    );
  }

  // Rate Limiting
  static rateLimitExceeded(): ApiException {
    return new ApiException(
      ExceptionCode.RATE_LIMIT_EXCEEDED,
      429,
      'rate_limit_error',
    );
  }

  static tooManyRequests(): ApiException {
    return new ApiException(
      ExceptionCode.RATE_LIMIT_TOO_MANY_REQUESTS,
      429,
      'rate_limit_error',
    );
  }

  static quotaExceeded(): ApiException {
    return new ApiException(
      ExceptionCode.RATE_LIMIT_QUOTA_EXCEEDED,
      429,
      'rate_limit_error',
    );
  }

  // Payment
  static paymentRequired(): ApiException {
    return new ApiException(
      ExceptionCode.PAYMENT_REQUIRED,
      402,
      'api_error',
    );
  }

  static paymentFailed(): ApiException {
    return new ApiException(
      ExceptionCode.PAYMENT_FAILED,
      402,
      'api_error',
    );
  }

  static paymentDeclined(): ApiException {
    return new ApiException(
      ExceptionCode.PAYMENT_DECLINED,
      402,
      'api_error',
    );
  }

  static insufficientFunds(): ApiException {
    return new ApiException(
      ExceptionCode.PAYMENT_INSUFFICIENT_FUNDS,
      402,
      'api_error',
    );
  }

  static subscriptionExpired(): ApiException {
    return new ApiException(
      ExceptionCode.SUBSCRIPTION_EXPIRED,
      402,
      'api_error',
    );
  }

  static subscriptionRequired(): ApiException {
    return new ApiException(
      ExceptionCode.SUBSCRIPTION_REQUIRED,
      402,
      'api_error',
    );
  }

  // File/Upload
  static fileTooLarge(maxSize?: number): ApiException {
    return new ApiException(
      ExceptionCode.FILE_TOO_LARGE,
      413,
      'validation_error',
      undefined,
      maxSize ? { maxSize } : undefined,
    );
  }

  static fileTypeNotAllowed(allowedTypes?: string): ApiException {
    return new ApiException(
      ExceptionCode.FILE_TYPE_NOT_ALLOWED,
      415,
      'validation_error',
      undefined,
      allowedTypes ? { allowedTypes } : undefined,
    );
  }

  static fileUploadFailed(): ApiException {
    return new ApiException(
      ExceptionCode.FILE_UPLOAD_FAILED,
      500,
      'api_error',
    );
  }

  static fileCorrupted(): ApiException {
    return new ApiException(
      ExceptionCode.FILE_CORRUPTED,
      400,
      'validation_error',
    );
  }

  // External Services
  static externalServiceError(service?: string): ApiException {
    return new ApiException(
      ExceptionCode.EXTERNAL_SERVICE_ERROR,
      502,
      'api_error',
      undefined,
      service ? { service } : undefined,
    );
  }

  static externalServiceTimeout(service?: string): ApiException {
    return new ApiException(
      ExceptionCode.EXTERNAL_SERVICE_TIMEOUT,
      504,
      'api_error',
      undefined,
      service ? { service } : undefined,
    );
  }

  static externalServiceUnavailable(service?: string): ApiException {
    return new ApiException(
      ExceptionCode.EXTERNAL_SERVICE_UNAVAILABLE,
      503,
      'api_error',
      undefined,
      service ? { service } : undefined,
    );
  }

  // Internal
  static internalError(): ApiException {
    return new ApiException(
      ExceptionCode.INTERNAL_ERROR,
      500,
      'internal_error',
    );
  }

  static databaseError(): ApiException {
    return new ApiException(
      ExceptionCode.INTERNAL_DATABASE_ERROR,
      500,
      'internal_error',
    );
  }

  static configurationError(): ApiException {
    return new ApiException(
      ExceptionCode.INTERNAL_CONFIGURATION_ERROR,
      500,
      'internal_error',
    );
  }

  static maintenanceMode(): ApiException {
    return new ApiException(
      ExceptionCode.MAINTENANCE_MODE,
      503,
      'api_error',
    );
  }
}
