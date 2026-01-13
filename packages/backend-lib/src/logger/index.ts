// Core logger
export { LoggerService, type LoggerOptions } from './logger.service';
export { LoggerModule, type LoggerModuleAsyncOptions } from './logger.module';
export { LoggerMiddleware, LOGGER_MODULE_OPTIONS } from './logger.middleware';
export { LoggingInterceptor } from './logging.interceptor';

// PII Redaction
export {
  redactObject,
  redactString,
  maskValue,
  maskEmail,
  maskPhone,
  maskIP,
  createRedactor,
  DEFAULT_SENSITIVE_FIELDS,
  DEFAULT_PII_FIELDS,
} from './pii-redactor';

// Correlation
export {
  CorrelationContext,
  generateCorrelationId,
  generateRequestId,
  getCorrelationId,
  getTenantId,
  CORRELATION_ID_HEADER,
  TENANT_ID_HEADER,
} from './correlation';

// Log formatting
export {
  formatLog,
  formatLogJson,
  formatLogPretty,
  createStructuredLog,
  sanitizeError,
} from './log-format';

// Types
export type {
  RedactorConfig,
  StructuredLog,
  LoggerModuleOptions,
  RequestLogData,
} from './types';
