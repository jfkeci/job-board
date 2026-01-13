import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';

import { RedactorConfig } from './types';
import { createStructuredLog, formatLog, sanitizeError } from './log-format';

export interface LoggerOptions {
  context?: string;
  isProduction?: boolean;
  logLevel?: 'log' | 'error' | 'warn' | 'debug' | 'verbose';
  redactorConfig?: Partial<RedactorConfig>;
}

const LOG_LEVELS = {
  verbose: 0,
  debug: 1,
  log: 2,
  warn: 3,
  error: 4,
};

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private context?: string;
  private isProduction: boolean;
  private logLevel: number;
  private redactorConfig?: Partial<RedactorConfig>;

  constructor(options?: LoggerOptions) {
    this.context = options?.context;
    this.isProduction = options?.isProduction ?? process.env.NODE_ENV === 'production';
    this.logLevel = LOG_LEVELS[options?.logLevel ?? 'log'];
    this.redactorConfig = options?.redactorConfig;
  }

  setContext(context: string): void {
    this.context = context;
  }

  createChildLogger(context: string): LoggerService {
    return new LoggerService({
      context,
      isProduction: this.isProduction,
      logLevel: Object.keys(LOG_LEVELS).find(
        (key) => LOG_LEVELS[key as keyof typeof LOG_LEVELS] === this.logLevel
      ) as LoggerOptions['logLevel'],
      redactorConfig: this.redactorConfig,
    });
  }

  private shouldLog(level: keyof typeof LOG_LEVELS): boolean {
    return LOG_LEVELS[level] >= this.logLevel;
  }

  private output(message: string): void {
    process.stdout.write(message + '\n');
  }

  private outputError(message: string): void {
    process.stderr.write(message + '\n');
  }

  log(message: string, context?: string, meta?: Record<string, unknown>): void;
  log(message: string, ...optionalParams: unknown[]): void;
  log(message: string, contextOrMeta?: string | unknown, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('log')) return;

    const context = typeof contextOrMeta === 'string' ? contextOrMeta : this.context;
    const metaData = typeof contextOrMeta === 'object' ? contextOrMeta as Record<string, unknown> : meta;

    const structuredLog = createStructuredLog('log', message, {
      context,
      meta: metaData,
      redactorConfig: this.redactorConfig,
    });

    this.output(formatLog(structuredLog, this.isProduction));
  }

  error(message: string, trace?: string, context?: string, meta?: Record<string, unknown>): void;
  error(message: string, ...optionalParams: unknown[]): void;
  error(
    message: string,
    traceOrError?: string | Error | unknown,
    context?: string,
    meta?: Record<string, unknown>
  ): void {
    if (!this.shouldLog('error')) return;

    let errorInfo: { name: string; message: string; stack?: string } | undefined;

    if (traceOrError instanceof Error) {
      errorInfo = sanitizeError(traceOrError);
    } else if (typeof traceOrError === 'string' && traceOrError.includes('\n')) {
      errorInfo = {
        name: 'Error',
        message: message,
        stack: traceOrError,
      };
    }

    const structuredLog = createStructuredLog('error', message, {
      context: context ?? this.context,
      meta,
      error: errorInfo ? new Error(errorInfo.message) : undefined,
      includeStack: !this.isProduction,
      redactorConfig: this.redactorConfig,
    });

    if (errorInfo) {
      structuredLog.error = {
        name: errorInfo.name,
        message: errorInfo.message,
        stack: !this.isProduction ? errorInfo.stack : undefined,
      };
    }

    this.outputError(formatLog(structuredLog, this.isProduction));
  }

  warn(message: string, context?: string, meta?: Record<string, unknown>): void;
  warn(message: string, ...optionalParams: unknown[]): void;
  warn(message: string, contextOrMeta?: string | unknown, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('warn')) return;

    const context = typeof contextOrMeta === 'string' ? contextOrMeta : this.context;
    const metaData = typeof contextOrMeta === 'object' ? contextOrMeta as Record<string, unknown> : meta;

    const structuredLog = createStructuredLog('warn', message, {
      context,
      meta: metaData,
      redactorConfig: this.redactorConfig,
    });

    this.output(formatLog(structuredLog, this.isProduction));
  }

  debug(message: string, context?: string, meta?: Record<string, unknown>): void;
  debug(message: string, ...optionalParams: unknown[]): void;
  debug(message: string, contextOrMeta?: string | unknown, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('debug')) return;

    const context = typeof contextOrMeta === 'string' ? contextOrMeta : this.context;
    const metaData = typeof contextOrMeta === 'object' ? contextOrMeta as Record<string, unknown> : meta;

    const structuredLog = createStructuredLog('debug', message, {
      context,
      meta: metaData,
      redactorConfig: this.redactorConfig,
    });

    this.output(formatLog(structuredLog, this.isProduction));
  }

  verbose(message: string, context?: string, meta?: Record<string, unknown>): void;
  verbose(message: string, ...optionalParams: unknown[]): void;
  verbose(message: string, contextOrMeta?: string | unknown, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('verbose')) return;

    const context = typeof contextOrMeta === 'string' ? contextOrMeta : this.context;
    const metaData = typeof contextOrMeta === 'object' ? contextOrMeta as Record<string, unknown> : meta;

    const structuredLog = createStructuredLog('verbose', message, {
      context,
      meta: metaData,
      redactorConfig: this.redactorConfig,
    });

    this.output(formatLog(structuredLog, this.isProduction));
  }

  fatal(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.error(message, undefined, context, meta);
  }

  logWithDuration(
    message: string,
    duration: number,
    context?: string,
    meta?: Record<string, unknown>
  ): void {
    if (!this.shouldLog('log')) return;

    const structuredLog = createStructuredLog('log', message, {
      context: context ?? this.context,
      meta,
      duration,
      redactorConfig: this.redactorConfig,
    });

    this.output(formatLog(structuredLog, this.isProduction));
  }
}
