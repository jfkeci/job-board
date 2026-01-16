import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
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

// ============================================================================
// Applications API
// ============================================================================

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'REVIEWING'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'OFFERED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface Application {
  id: string;
  jobId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  coverLetter: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  resumeUrl: string | null;
  status: ApplicationStatus;
  notes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

export interface ApplicationsResponse {
  data: Application[];
  total: number;
}

export const applicationsApi = {
  getByJob: (jobId: string) =>
    apiClient<ApplicationsResponse>(`/applications/jobs/${jobId}`),

  updateStatus: (applicationId: string, status: ApplicationStatus, notes?: string) =>
    apiClient<Application>(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),
};

// ============================================================================
// Job Analytics API
// ============================================================================

export interface JobAnalytics {
  viewsOverTime: Array<{ date: string; views: number }>;
  applicationsOverTime: Array<{ date: string; applications: number }>;
  totalViews: number;
  totalApplications: number;
  conversionRate: number;
  averageTimeOnPage: number;
  sourceBreakdown: Array<{ source: string; count: number; percentage: number }>;
}

export const analyticsApi = {
  getJobAnalytics: (jobId: string, period: '7d' | '30d' | '90d' = '30d') =>
    apiClient<JobAnalytics>(`/analytics/jobs/${jobId}?period=${period}`),
};

// ============================================================================
// Organization API
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  industry: string | null;
  size: string | null;
  logoUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
}

export const organizationsApi = {
  get: (id: string) => apiClient<Organization>(`/organizations/${id}`),

  update: (id: string, data: UpdateOrganizationData) =>
    apiClient<Organization>(`/organizations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export { ApiClientError };
