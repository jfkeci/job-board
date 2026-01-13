// Re-export types for convenience
export * from '@borg/types';

// Utility functions
export function generateId(): string {
  return crypto.randomUUID();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Response helpers
export function successResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(error: string, message?: string) {
  return {
    success: false,
    error,
    message,
  };
}

// Date utilities
export function formatDate(date: Date): string {
  return date.toISOString();
}

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}
