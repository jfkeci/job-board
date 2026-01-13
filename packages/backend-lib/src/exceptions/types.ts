export type ErrorType =
  | 'validation_error'
  | 'authentication_error'
  | 'authorization_error'
  | 'not_found_error'
  | 'conflict_error'
  | 'rate_limit_error'
  | 'api_error'
  | 'internal_error';

export type SupportedLanguage = 'en' | 'hr' | 'bs' | 'mk';

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'hr', 'bs', 'mk'];

export interface ErrorDetail {
  field: string;
  code: string;
  message: string;
  value?: unknown;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    type: ErrorType;
    statusCode: number;
    timestamp: string;
    path: string;
    requestId?: string;
    details?: ErrorDetail[];
    stack?: string;
  };
}

export interface ExceptionsModuleOptions {
  defaultLanguage?: SupportedLanguage;
  includeStack?: boolean;
  customMessages?: Record<string, Record<SupportedLanguage, string>>;
}

export const EXCEPTIONS_MODULE_OPTIONS = 'EXCEPTIONS_MODULE_OPTIONS';
