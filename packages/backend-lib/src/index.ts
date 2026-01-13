// Re-export types for convenience
export * from '@borg/types';

// Logger exports
export {
  // Core logger
  LoggerService,
  LoggerModule,
  LoggerMiddleware,
  LoggingInterceptor,
  LOGGER_MODULE_OPTIONS,
  // PII Redaction
  redactObject,
  redactString,
  maskValue,
  maskEmail,
  maskPhone,
  maskIP,
  createRedactor,
  DEFAULT_SENSITIVE_FIELDS,
  DEFAULT_PII_FIELDS,
  // Correlation
  CorrelationContext,
  generateCorrelationId,
  generateRequestId,
  getCorrelationId,
  getTenantId,
  CORRELATION_ID_HEADER,
  TENANT_ID_HEADER,
  // Log formatting
  formatLog,
  formatLogJson,
  formatLogPretty,
  createStructuredLog,
  sanitizeError,
  // Types
  type LoggerOptions,
  type LoggerModuleAsyncOptions,
  type RedactorConfig,
  type StructuredLog,
  type LoggerModuleOptions,
  type RequestLogData,
} from './logger';

// Exceptions exports
export {
  // Module
  ExceptionsModule,
  // Exception class and factory
  ApiException,
  ApiExceptions,
  // Exception codes
  ExceptionCode,
  // Constants
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  EXCEPTIONS_MODULE_OPTIONS,
  // Services
  ExceptionI18nService,
  // Filters
  HttpExceptionFilter,
  createValidationExceptionFactory,
  flattenValidationErrors,
  validationErrorsToDetails,
  mapConstraintToCode,
  // i18n (for customization)
  exceptionMessages,
  validationMessages,
  fieldNameTranslations,
  // Types
  type ExceptionsModuleAsyncOptions,
  type ErrorType,
  type SupportedLanguage,
  type ErrorDetail,
  type ApiErrorResponse,
  type ExceptionsModuleOptions,
  type ValidationExceptionFactory,
} from './exceptions';

// Utility functions
export function generateId(): string {
  return crypto.randomUUID();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Response helpers
export function successResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(error: string, message?: string) {
  return {
    success: false,
    error,
    message,
  };
}

// Date utilities
export function formatDate(date: Date): string {
  return date.toISOString();
}

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}
