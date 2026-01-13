import type { StructuredLog, RedactorConfig } from './types';
import { CorrelationContext } from './correlation';
import { redactObject } from './pii-redactor';

const LOG_LEVEL_COLORS: Record<string, string> = {
  log: '\x1b[32m',     // Green
  error: '\x1b[31m',   // Red
  warn: '\x1b[33m',    // Yellow
  debug: '\x1b[36m',   // Cyan
  verbose: '\x1b[35m', // Magenta
};
const RESET_COLOR = '\x1b[0m';

export function formatLogJson(log: StructuredLog): string {
  return JSON.stringify(log);
}

export function formatLogPretty(log: StructuredLog): string {
  const color = LOG_LEVEL_COLORS[log.level] || '';
  const levelStr = `${color}[${log.level.toUpperCase()}]${RESET_COLOR}`;
  const contextStr = log.context ? `\x1b[33m[${log.context}]\x1b[0m ` : '';
  const correlationStr = log.correlationId ? `(${log.correlationId.slice(0, 8)}) ` : '';
  const durationStr = log.duration !== undefined ? ` +${log.duration}ms` : '';

  let output = `${log.timestamp} ${levelStr} ${contextStr}${correlationStr}${log.message}${durationStr}`;

  if (log.meta && Object.keys(log.meta).length > 0) {
    output += `\n  ${JSON.stringify(log.meta)}`;
  }

  if (log.error) {
    output += `\n  Error: ${log.error.name}: ${log.error.message}`;
    if (log.error.stack) {
      output += `\n  ${log.error.stack.split('\n').slice(1, 4).join('\n  ')}`;
    }
  }

  return output;
}

export function formatLog(log: StructuredLog, isProduction = false): string {
  if (isProduction) {
    return formatLogJson(log);
  }
  return formatLogPretty(log);
}

export function createStructuredLog(
  level: StructuredLog['level'],
  message: string,
  options?: {
    context?: string;
    meta?: Record<string, unknown>;
    error?: Error;
    duration?: number;
    includeStack?: boolean;
    redactorConfig?: Partial<RedactorConfig>;
  }
): StructuredLog {
  const correlationContext = CorrelationContext.get();

  const log: StructuredLog = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (options?.context) {
    log.context = options.context;
  }

  if (correlationContext?.correlationId) {
    log.correlationId = correlationContext.correlationId;
  }

  if (correlationContext?.tenantId) {
    log.tenantId = correlationContext.tenantId;
  }

  if (correlationContext?.requestId) {
    log.requestId = correlationContext.requestId;
  }

  if (options?.duration !== undefined) {
    log.duration = options.duration;
  }

  if (options?.meta && Object.keys(options.meta).length > 0) {
    log.meta = redactObject(options.meta, options.redactorConfig);
  }

  if (options?.error) {
    log.error = {
      name: options.error.name,
      message: options.error.message,
    };

    if (options.includeStack && options.error.stack) {
      log.error.stack = options.error.stack;
    }
  }

  return log;
}

export function sanitizeError(error: unknown): { name: string; message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (typeof error === 'string') {
    return {
      name: 'Error',
      message: error,
    };
  }

  return {
    name: 'UnknownError',
    message: String(error),
  };
}
