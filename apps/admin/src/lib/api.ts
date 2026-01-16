import type {
  AuthResponse,
  LoginCredentials,
  ApiErrorResponse,
} from '@/types/auth';
import { env } from './env';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

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
  const stored = localStorage.getItem('admin-auth-storage');
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

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
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
};

// ============================================================================
// Admin API Types
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  organizationId: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: {
    jobs: number;
    members: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  _count?: {
    jobs: number;
  };
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: string;
  parentId: string | null;
  _count?: {
    jobs: number;
  };
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  isActive: boolean;
  createdAt: string;
  settings: Record<string, unknown>;
}

export interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  totalJobs: number;
  totalApplications: number;
  recentSignups: number;
  activeJobs: number;
}

export interface ImpersonationToken {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// ============================================================================
// Admin API
// ============================================================================

export const adminApi = {
  // Stats
  getStats: () => apiClient<AdminStats>('/admin/stats'),

  // Users
  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.role) query.set('role', params.role);
    return apiClient<PaginatedResponse<User>>(`/admin/users?${query.toString()}`);
  },

  getUser: (id: string) => apiClient<User>(`/admin/users/${id}`),

  updateUser: (id: string, data: Partial<Pick<User, 'role' | 'isActive'>>) =>
    apiClient<User>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteUser: (id: string) =>
    apiClient<void>(`/admin/users/${id}`, { method: 'DELETE' }),

  impersonateUser: (id: string) =>
    apiClient<ImpersonationToken>(`/admin/users/${id}/impersonate`, { method: 'POST' }),

  // Organizations
  getOrganizations: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.search) query.set('search', params.search);
    return apiClient<PaginatedResponse<Organization>>(`/admin/organizations?${query.toString()}`);
  },

  getOrganization: (id: string) => apiClient<Organization>(`/admin/organizations/${id}`),

  updateOrganization: (id: string, data: Partial<Pick<Organization, 'isActive'>>) =>
    apiClient<Organization>(`/admin/organizations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteOrganization: (id: string) =>
    apiClient<void>(`/admin/organizations/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    return apiClient<PaginatedResponse<Category>>(`/admin/categories?${query.toString()}`);
  },

  createCategory: (data: { name: string; slug: string; description?: string; parentId?: string }) =>
    apiClient<Category>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCategory: (id: string, data: Partial<{ name: string; slug: string; description: string }>) =>
    apiClient<Category>(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteCategory: (id: string) =>
    apiClient<void>(`/admin/categories/${id}`, { method: 'DELETE' }),

  // Locations
  getLocations: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    return apiClient<PaginatedResponse<Location>>(`/admin/locations?${query.toString()}`);
  },

  createLocation: (data: { name: string; slug: string; type: string; parentId?: string }) =>
    apiClient<Location>('/admin/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateLocation: (id: string, data: Partial<{ name: string; slug: string; type: string }>) =>
    apiClient<Location>(`/admin/locations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteLocation: (id: string) =>
    apiClient<void>(`/admin/locations/${id}`, { method: 'DELETE' }),

  // Tenants
  getTenants: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    return apiClient<PaginatedResponse<Tenant>>(`/admin/tenants?${query.toString()}`);
  },

  getTenant: (id: string) => apiClient<Tenant>(`/admin/tenants/${id}`),

  createTenant: (data: { name: string; slug: string; domain?: string; settings?: Record<string, unknown> }) =>
    apiClient<Tenant>('/admin/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTenant: (id: string, data: Partial<{ name: string; domain: string; isActive: boolean; settings: Record<string, unknown> }>) =>
    apiClient<Tenant>(`/admin/tenants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteTenant: (id: string) =>
    apiClient<void>(`/admin/tenants/${id}`, { method: 'DELETE' }),
};

export { ApiClientError };
