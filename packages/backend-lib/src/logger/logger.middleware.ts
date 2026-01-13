import { Injectable, NestMiddleware, Inject, Optional } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

import { LoggerService } from './logger.service';
import type { LoggerModuleOptions, RequestLogData } from './types';
import {
  CorrelationContext,
  getCorrelationId,
  getTenantId,
  generateRequestId,
  CORRELATION_ID_HEADER,
} from './correlation';
import { maskIP } from './pii-redactor';

export const LOGGER_MODULE_OPTIONS = 'LOGGER_MODULE_OPTIONS';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: LoggerService;
  private readonly excludeRoutes: Set<string>;
  private readonly redactQueryParams: Set<string>;
  private readonly options?: LoggerModuleOptions;

  constructor(
    @Optional()
    @Inject(LOGGER_MODULE_OPTIONS)
    options?: object
  ) {
    const opts = options as LoggerModuleOptions | undefined;
    this.options = opts;
    this.logger = new LoggerService({
      context: 'HTTP',
      isProduction: opts?.environment === 'production',
      logLevel: opts?.logLevel,
    });

    this.excludeRoutes = new Set(opts?.excludeRoutes || ['/health', '/healthz', '/ready', '/metrics']);
    this.redactQueryParams = new Set([
      'token',
      'apiKey',
      'api_key',
      'password',
      'secret',
      ...(opts?.redactQueryParams || []),
    ]);
  }

  use(req: Request, res: Response, next: NextFunction): void {
    if (this.shouldExclude(req.path)) {
      return next();
    }

    const correlationId = getCorrelationId(req);
    const tenantId = getTenantId(req);
    const requestId = generateRequestId();
    const startTime = Date.now();

    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    const correlationStore = {
      correlationId,
      tenantId,
      requestId,
    };

    CorrelationContext.run(correlationStore, () => {
      const requestData = this.buildRequestData(req, correlationId, tenantId, requestId);

      this.logRequest(requestData);

      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.logResponse(requestData, res, duration);
      });

      next();
    });
  }

  private shouldExclude(path: string): boolean {
    for (const route of this.excludeRoutes) {
      if (path === route || path.startsWith(route + '/')) {
        return true;
      }
    }
    return false;
  }

  private buildRequestData(
    req: Request,
    correlationId: string,
    tenantId: string | undefined,
    requestId: string
  ): RequestLogData {
    const data: RequestLogData = {
      correlationId,
      method: req.method,
      path: this.redactPath(req.path, req.query),
      timestamp: new Date().toISOString(),
    };

    if (tenantId) {
      data.tenantId = tenantId;
    }

    const userAgent = req.get('user-agent');
    if (userAgent) {
      data.userAgent = userAgent.slice(0, 200);
    }

    const ip = this.getClientIP(req);
    if (ip) {
      data.ip = maskIP(ip);
    }

    return data;
  }

  private redactPath(path: string, query: Request['query']): string {
    if (!query || Object.keys(query).length === 0) {
      return path;
    }

    const redactedParams: string[] = [];

    for (const [key, value] of Object.entries(query)) {
      if (this.redactQueryParams.has(key.toLowerCase())) {
        redactedParams.push(`${key}=[REDACTED]`);
      } else if (typeof value === 'string') {
        redactedParams.push(`${key}=${value.slice(0, 50)}`);
      } else if (Array.isArray(value)) {
        redactedParams.push(`${key}=[array]`);
      } else {
        redactedParams.push(`${key}=[object]`);
      }
    }

    return redactedParams.length > 0 ? `${path}?${redactedParams.join('&')}` : path;
  }

  private getClientIP(req: Request): string | undefined {
    const forwardedFor = req.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0]?.trim();
    }

    const realIP = req.get('x-real-ip');
    if (realIP) {
      return realIP;
    }

    return req.ip || req.socket?.remoteAddress;
  }

  private logRequest(data: RequestLogData): void {
    this.logger.log(`--> ${data.method} ${data.path}`, undefined, {
      correlationId: data.correlationId,
      tenantId: data.tenantId,
      ip: data.ip,
      userAgent: data.userAgent,
    });
  }

  private logResponse(data: RequestLogData, res: Response, duration: number): void {
    const statusCode = res.statusCode;
    const contentLength = res.get('content-length');

    const logData = {
      correlationId: data.correlationId,
      tenantId: data.tenantId,
      statusCode,
      contentLength: contentLength ? parseInt(contentLength, 10) : undefined,
    };

    const message = `<-- ${data.method} ${data.path} ${statusCode}`;

    if (statusCode >= 500) {
      this.logger.error(message, undefined, undefined, { ...logData, duration });
    } else if (statusCode >= 400) {
      this.logger.warn(message, undefined, { ...logData, duration });
    } else {
      this.logger.logWithDuration(message, duration, undefined, logData);
    }
  }
}
