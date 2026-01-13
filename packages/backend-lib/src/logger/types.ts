export interface RedactorConfig {
  sensitiveFields: string[];
  piiFields: string[];
  sensitivePatterns: RegExp[];
  maskChar: string;
  preserveLength: boolean;
  customRedactors?: Record<string, (value: unknown) => unknown>;
}

export interface StructuredLog {
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'debug' | 'verbose';
  message: string;
  context?: string;
  correlationId?: string;
  tenantId?: string;
  requestId?: string;
  duration?: number;
  meta?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export interface LoggerModuleOptions {
  serviceName: string;
  environment?: string;
  sensitiveFields?: string[];
  piiFields?: string[];
  enableRequestLogging?: boolean;
  enableCorrelationId?: boolean;
  logLevel?: 'log' | 'error' | 'warn' | 'debug' | 'verbose';
  excludeRoutes?: string[];
  redactQueryParams?: string[];
}

export interface RequestLogData {
  correlationId: string;
  method: string;
  path: string;
  userAgent?: string;
  timestamp: string;
  tenantId?: string;
  userId?: string;
  duration?: number;
  statusCode?: number;
  contentLength?: number;
  ip?: string;
}
