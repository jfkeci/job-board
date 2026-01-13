// Module
export { ExceptionsModule } from './exceptions.module';
export type { ExceptionsModuleAsyncOptions } from './exceptions.module';

// Exception class and factory
export { ApiException, ApiExceptions } from './api.exception';

// Exception codes
export { ExceptionCode } from './exception-codes.enum';

// Types
export type {
  ErrorType,
  SupportedLanguage,
  ErrorDetail,
  ApiErrorResponse,
  ExceptionsModuleOptions,
} from './types';
export {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  EXCEPTIONS_MODULE_OPTIONS,
} from './types';

// Services
export { ExceptionI18nService } from './services';

// Filters
export {
  HttpExceptionFilter,
  createValidationExceptionFactory,
  flattenValidationErrors,
  validationErrorsToDetails,
  mapConstraintToCode,
} from './filters';
export type { ValidationExceptionFactory } from './filters';

// i18n (for customization)
export { exceptionMessages } from './i18n';
export { validationMessages, fieldNameTranslations } from './i18n';
