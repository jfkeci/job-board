import { env } from './env';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    type: string;
    statusCode: number;
  };
}

export class ApiClientError extends Error {
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
  const stored = localStorage.getItem('web-auth-storage');
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

  // Add auth header if we have a token
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

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ============================================================================
// API Functions
// ============================================================================

export interface JobSearchParams {
  q?: string;
  categoryId?: string;
  locationId?: string;
  employmentType?: string;
  remoteOption?: string;
  page?: number;
  limit?: number;
}

export interface PublicJob {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    industry: string | null;
  };
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
  location: {
    id: string;
    slug: string;
    name: string;
  } | null;
  employmentType: string;
  remoteOption: string;
  experienceLevel: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: string | null;
  tier: string;
  promotions: string[];
  viewCount: number;
  publishedAt: string;
  expiresAt: string;
}

export interface PublicJobListItem {
  id: string;
  title: string;
  slug: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    industry: string | null;
  };
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
  location: {
    id: string;
    slug: string;
    name: string;
  } | null;
  employmentType: string;
  remoteOption: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  tier: string;
  promotions: string[];
  publishedAt: string;
}

export interface JobSearchResponse {
  data: PublicJobListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FeaturedJobsResponse {
  featured: PublicJobListItem[];
  recent: PublicJobListItem[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  jobCount?: number;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: string;
  jobCount?: number;
}

export interface ApplicationData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  coverLetter?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface ApplicationResponse {
  id: string;
  trackingToken: string;
  status: string;
}

export interface ApplicationStatus {
  status: string;
  jobTitle: string;
  organizationName: string;
  submittedAt: string;
}

// Jobs API
export const jobsApi = {
  search: (params: JobSearchParams) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.categoryId) query.set('categoryId', params.categoryId);
    if (params.locationId) query.set('locationId', params.locationId);
    if (params.employmentType) query.set('employmentType', params.employmentType);
    if (params.remoteOption) query.set('remoteOption', params.remoteOption);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    return apiClient<JobSearchResponse>(`/public/jobs/search?${query.toString()}`, {
      headers: { 'X-Skip-Auth': 'true' },
    });
  },

  getFeatured: () =>
    apiClient<FeaturedJobsResponse>('/public/jobs/featured', {
      headers: { 'X-Skip-Auth': 'true' },
    }),

  getBySlug: (slug: string) =>
    apiClient<PublicJob>(`/public/jobs/${slug}`, {
      headers: { 'X-Skip-Auth': 'true' },
    }),

  getSimilar: (id: string) =>
    apiClient<PublicJobListItem[]>(`/public/jobs/${id}/similar`, {
      headers: { 'X-Skip-Auth': 'true' },
    }),

  trackView: (id: string) =>
    apiClient<{ success: boolean }>(`/public/jobs/${id}/view`, {
      method: 'POST',
      headers: { 'X-Skip-Auth': 'true' },
    }),
};

// Categories API
export const categoriesApi = {
  getAll: () =>
    apiClient<{ data: Category[] }>('/categories', {
      headers: { 'X-Skip-Auth': 'true' },
    }),
};

// Locations API
export const locationsApi = {
  getAll: () =>
    apiClient<{ data: Location[]; total: number }>('/locations', {
      headers: { 'X-Skip-Auth': 'true' },
    }),

  getWithCounts: () =>
    apiClient<Location[]>('/locations/with-counts', {
      headers: { 'X-Skip-Auth': 'true' },
    }),
};

// Applications API
export const applicationsApi = {
  apply: (jobId: string, data: ApplicationData) =>
    apiClient<ApplicationResponse>(`/applications/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'X-Skip-Auth': 'true' },
    }),

  checkStatus: (token: string) =>
    apiClient<ApplicationStatus>(`/applications/status/${token}`, {
      headers: { 'X-Skip-Auth': 'true' },
    }),
};

// Auth API
export interface LoginCredentials {
  email: string;
  password: string;
  tenantId: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
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

  me: () => apiClient<MeResponse>('/profiles/me'),
};

// Profiles API
export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  cvFileId: string | null;
  headline: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeResponse {
  id: string;
  email: string;
  role: string;
  profile: Profile | null;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  headline?: string;
  summary?: string;
}

export const profilesApi = {
  getMe: () => apiClient<MeResponse>('/profiles/me'),

  getProfile: () => apiClient<Profile | null>('/profiles'),

  updateProfile: (data: UpdateProfileData) =>
    apiClient<Profile>('/profiles', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  clearProfile: () =>
    apiClient<void>('/profiles', {
      method: 'DELETE',
    }),
};

// My Applications API (for authenticated users)
export interface MyApplication {
  id: string;
  status: string;
  job: {
    id: string;
    title: string;
    slug: string;
    organization: {
      id: string;
      name: string;
      slug: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface MyApplicationsResponse {
  data: MyApplication[];
}

export const myApplicationsApi = {
  getMyApplications: () =>
    apiClient<MyApplicationsResponse>('/applications/my'),
};
