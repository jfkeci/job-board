export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string | null;
  headline: string | null;
}

export interface User {
  id: string;
  email: string;
  role: string;
  tenantId: string;
  emailVerified: boolean;
  language: string;
  organizationId: string | null;
  createdAt: string;
  profile?: UserProfile;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse extends AuthTokens {
  user?: User;
}

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

export interface ApiError {
  code: string;
  message: string;
  type: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  error: ApiError;
}
