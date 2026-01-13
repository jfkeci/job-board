import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Optional,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import type { Request } from 'express';

import { LoggerService } from './logger.service';
import type { LoggerModuleOptions } from './types';
import { LOGGER_MODULE_OPTIONS } from './logger.middleware';
import { sanitizeError } from './log-format';
import { CorrelationContext } from './correlation';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: LoggerService;
  private readonly excludeRoutes: Set<string>;
  private readonly isProduction: boolean;
  private readonly options?: LoggerModuleOptions;

  constructor(
    @Optional()
    @Inject(LOGGER_MODULE_OPTIONS)
    options?: object
  ) {
    const opts = options as LoggerModuleOptions | undefined;
    this.options = opts;
    this.logger = new LoggerService({
      context: 'Interceptor',
      isProduction: opts?.environment === 'production',
      logLevel: opts?.logLevel,
    });

    this.excludeRoutes = new Set(opts?.excludeRoutes || ['/health', '/healthz', '/ready', '/metrics']);
    this.isProduction = opts?.environment === 'production';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;

    if (this.shouldExclude(url)) {
      return next.handle();
    }

    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const correlationId = CorrelationContext.getCorrelationId();
    const startTime = Date.now();

    this.logger.debug(`${className}.${handlerName}() called`, undefined, {
      method,
      url: this.sanitizeUrl(url),
      correlationId,
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.debug(`${className}.${handlerName}() completed`, undefined, {
          duration,
          correlationId,
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const errorInfo = sanitizeError(error);

        this.logger.error(
          `${className}.${handlerName}() failed: ${errorInfo.message}`,
          this.isProduction ? undefined : errorInfo.stack,
          undefined,
          {
            duration,
            correlationId,
            errorName: errorInfo.name,
          }
        );

        return throwError(() => error);
      })
    );
  }

  private shouldExclude(url: string): boolean {
    const path = url.split('?')[0] || url;
    for (const route of this.excludeRoutes) {
      if (path === route || path.startsWith(route + '/')) {
        return true;
      }
    }
    return false;
  }

  private sanitizeUrl(url: string): string {
    const [path, queryString] = url.split('?');
    if (!queryString) {
      return path || url;
    }

    const sensitiveParams = ['token', 'apikey', 'api_key', 'password', 'secret', 'authorization'];
    const params = new URLSearchParams(queryString);
    const sanitizedParams: string[] = [];

    params.forEach((value, key) => {
      if (sensitiveParams.includes(key.toLowerCase())) {
        sanitizedParams.push(`${key}=[REDACTED]`);
      } else {
        sanitizedParams.push(`${key}=${value.slice(0, 50)}`);
      }
    });

    return sanitizedParams.length > 0 ? `${path}?${sanitizedParams.join('&')}` : path || url;
  }
}
