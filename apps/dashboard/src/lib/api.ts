import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
  ApiErrorResponse,
} from '@/types/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClientError extends Error {
  code: string;
  statusCode: number;
  type: string;

  constructor(error: ApiErrorResponse['error']) {
    super(error.message);
    this.name = 'ApiClientError';
    this.code = error.code;
    this.statusCode = error.statusCode;
    this.type = error.type;
  }
}

async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('auth-storage');
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return parsed.state?.accessToken || null;
  } catch {
    return null;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth header if we have a token (and not explicitly skipping)
  const skipAuth = (options.headers as Record<string, string>)?.['X-Skip-Auth'];
  if (!skipAuth) {
    const token = await getAccessToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }
  delete (headers as Record<string, string>)['X-Skip-Auth'];

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ApiErrorResponse;
    throw new ApiClientError(
      errorData.error || {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        type: 'api_error',
        statusCode: response.status,
      },
    );
  }

  return response.json() as Promise<T>;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: { 'X-Skip-Auth': 'true' },
    }),

  register: (credentials: RegisterCredentials) =>
    apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: { 'X-Skip-Auth': 'true' },
    }),

  refresh: (refreshToken: string) =>
    apiClient<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      headers: { 'X-Skip-Auth': 'true' },
    }),

  logout: () =>
    apiClient<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  me: () => apiClient<User>('/auth/me'),
};

export { ApiClientError };
