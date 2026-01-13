import { AsyncLocalStorage } from 'async_hooks';

export const CORRELATION_ID_HEADER = 'X-Correlation-ID';
export const TENANT_ID_HEADER = 'X-Tenant-ID';

interface CorrelationStore {
  correlationId: string;
  tenantId?: string;
  userId?: string;
  requestId?: string;
}

const asyncLocalStorage = new AsyncLocalStorage<CorrelationStore>();

export function generateCorrelationId(): string {
  return crypto.randomUUID();
}

export function generateRequestId(): string {
  return `req_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
}

export function getCorrelationId(req: { headers: Record<string, string | string[] | undefined> }): string {
  const headerValue = req.headers[CORRELATION_ID_HEADER.toLowerCase()] ||
                      req.headers[CORRELATION_ID_HEADER];

  if (typeof headerValue === 'string' && headerValue) {
    return headerValue;
  }

  if (Array.isArray(headerValue) && headerValue[0]) {
    return headerValue[0];
  }

  return generateCorrelationId();
}

export function getTenantId(req: { headers: Record<string, string | string[] | undefined> }): string | undefined {
  const headerValue = req.headers[TENANT_ID_HEADER.toLowerCase()] ||
                      req.headers[TENANT_ID_HEADER];

  if (typeof headerValue === 'string' && headerValue) {
    return headerValue;
  }

  if (Array.isArray(headerValue) && headerValue[0]) {
    return headerValue[0];
  }

  return undefined;
}

export const CorrelationContext = {
  run<T>(store: CorrelationStore, fn: () => T): T {
    return asyncLocalStorage.run(store, fn);
  },

  runAsync<T>(store: CorrelationStore, fn: () => Promise<T>): Promise<T> {
    return asyncLocalStorage.run(store, fn);
  },

  get(): CorrelationStore | undefined {
    return asyncLocalStorage.getStore();
  },

  getCorrelationId(): string | undefined {
    return asyncLocalStorage.getStore()?.correlationId;
  },

  getTenantId(): string | undefined {
    return asyncLocalStorage.getStore()?.tenantId;
  },

  getUserId(): string | undefined {
    return asyncLocalStorage.getStore()?.userId;
  },

  getRequestId(): string | undefined {
    return asyncLocalStorage.getStore()?.requestId;
  },

  setUserId(userId: string): void {
    const store = asyncLocalStorage.getStore();
    if (store) {
      store.userId = userId;
    }
  },
};
