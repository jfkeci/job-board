import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  Optional,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { ApiException } from '../api.exception';
import { ExceptionCode } from '../exception-codes.enum';
import { ExceptionI18nService } from '../services/exception-i18n.service';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  EXCEPTIONS_MODULE_OPTIONS,
} from '../types';
import type {
  ApiErrorResponse,
  ErrorType,
  SupportedLanguage,
  ExceptionsModuleOptions,
} from '../types';
import { LoggerService } from '../../logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: LoggerService;
  private readonly isProduction: boolean;

  constructor(
    private readonly i18nService: ExceptionI18nService,
    @Optional()
    @Inject(EXCEPTIONS_MODULE_OPTIONS)
    private readonly options?: ExceptionsModuleOptions,
    @Optional()
    loggerService?: LoggerService,
  ) {
    this.logger = loggerService || new LoggerService({ context: 'HttpExceptionFilter' });
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const language = this.extractLanguage(request);
    const correlationId = (request.headers['x-correlation-id'] as string) || undefined;
    const includeStack = this.options?.includeStack ?? !this.isProduction;

    const errorResponse = this.buildErrorResponse(
      exception,
      request,
      language,
      correlationId,
      includeStack,
    );

    this.logger.error(
      `${errorResponse.error.code}: ${errorResponse.error.message}`,
      exception instanceof Error ? exception.stack : undefined,
      'HttpExceptionFilter',
      {
        correlationId,
        path: request.path,
        statusCode: errorResponse.error.statusCode,
        code: errorResponse.error.code,
      },
    );

    response.status(errorResponse.error.statusCode).json(errorResponse);
  }

  private extractLanguage(request: Request): SupportedLanguage {
    const header = request.headers['x-language'] as string;
    if (header && SUPPORTED_LANGUAGES.includes(header.toLowerCase() as SupportedLanguage)) {
      return header.toLowerCase() as SupportedLanguage;
    }
    return this.options?.defaultLanguage || DEFAULT_LANGUAGE;
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request,
    language: SupportedLanguage,
    correlationId: string | undefined,
    includeStack: boolean,
  ): ApiErrorResponse {
    if (exception instanceof ApiException) {
      return this.handleApiException(exception, request, language, correlationId, includeStack);
    }

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, request, language, correlationId, includeStack);
    }

    return this.handleUnknownException(exception, request, language, correlationId, includeStack);
  }

  private handleApiException(
    exception: ApiException,
    request: Request,
    language: SupportedLanguage,
    correlationId: string | undefined,
    includeStack: boolean,
  ): ApiErrorResponse {
    const message = this.i18nService.getMessage(exception.code, language, exception.params);

    const errorResponse: ApiErrorResponse = {
      error: {
        code: exception.code,
        message,
        type: exception.type,
        statusCode: exception.statusCode,
        timestamp: new Date().toISOString(),
        path: request.path,
      },
    };

    if (correlationId) {
      errorResponse.error.requestId = correlationId;
    }

    if (exception.details && exception.details.length > 0) {
      errorResponse.error.details = exception.details.map((detail) => ({
        ...detail,
        message: detail.message || this.i18nService.getValidationMessage(
          detail.code,
          language,
          { field: detail.field },
        ),
      }));
    }

    if (includeStack && exception.stack) {
      errorResponse.error.stack = exception.stack;
    }

    return errorResponse;
  }

  private handleHttpException(
    exception: HttpException,
    request: Request,
    language: SupportedLanguage,
    correlationId: string | undefined,
    includeStack: boolean,
  ): ApiErrorResponse {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const { code, type, message } = this.mapHttpStatusToCodeAndType(
      status,
      exceptionResponse,
      language,
    );

    const errorResponse: ApiErrorResponse = {
      error: {
        code,
        message,
        type,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.path,
      },
    };

    if (correlationId) {
      errorResponse.error.requestId = correlationId;
    }

    if (includeStack && exception.stack) {
      errorResponse.error.stack = exception.stack;
    }

    return errorResponse;
  }

  private handleUnknownException(
    exception: unknown,
    request: Request,
    language: SupportedLanguage,
    correlationId: string | undefined,
    includeStack: boolean,
  ): ApiErrorResponse {
    const message = this.i18nService.getMessage(ExceptionCode.INTERNAL_ERROR, language);

    const errorResponse: ApiErrorResponse = {
      error: {
        code: ExceptionCode.INTERNAL_ERROR,
        message,
        type: 'internal_error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.path,
      },
    };

    if (correlationId) {
      errorResponse.error.requestId = correlationId;
    }

    if (includeStack && exception instanceof Error && exception.stack) {
      errorResponse.error.stack = exception.stack;
    }

    return errorResponse;
  }

  private mapHttpStatusToCodeAndType(
    status: number,
    exceptionResponse: string | object,
    language: SupportedLanguage,
  ): { code: string; type: ErrorType; message: string } {
    const responseMessage = typeof exceptionResponse === 'string'
      ? exceptionResponse
      : (exceptionResponse as { message?: string }).message;

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return {
          code: ExceptionCode.VALIDATION_FAILED,
          type: 'validation_error',
          message: responseMessage || this.i18nService.getMessage(ExceptionCode.VALIDATION_FAILED, language),
        };

      case HttpStatus.UNAUTHORIZED:
        return {
          code: ExceptionCode.AUTH_TOKEN_INVALID,
          type: 'authentication_error',
          message: responseMessage || this.i18nService.getMessage(ExceptionCode.AUTH_TOKEN_INVALID, language),
        };

      case HttpStatus.FORBIDDEN:
        return {
          code: ExceptionCode.AUTHZ_PERMISSION_DENIED,
          type: 'authorization_error',
          message: responseMessage || this.i18nService.getMessage(ExceptionCode.AUTHZ_PERMISSION_DENIED, language),
        };

      case HttpStatus.NOT_FOUND:
        return {
          code: ExceptionCode.RESOURCE_NOT_FOUND,
          type: 'not_found_error',
          message: responseMessage || this.i18nService.getMessage(ExceptionCode.RESOURCE_NOT_FOUND, language),
        };

      case HttpStatus.CONFLICT:
        return {
          code: ExceptionCode.RESOURCE_CONFLICT,
          type: 'conflict_error',
          message: responseMessage || this.i18nService.getMessage(ExceptionCode.RESOURCE_CONFLICT, language),
        };

      case HttpStatus.TOO_MANY_REQUESTS:
        return {
          code: ExceptionCode.RATE_LIMIT_EXCEEDED,
          type: 'rate_limit_error',
          message: responseMessage || this.i18nService.getMessage(ExceptionCode.RATE_LIMIT_EXCEEDED, language),
        };

      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        return {
          code: ExceptionCode.INTERNAL_ERROR,
          type: 'internal_error',
          message: this.i18nService.getMessage(ExceptionCode.INTERNAL_ERROR, language),
        };
    }
  }
}
