// ============================================================================
// Common Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface MessageResponse {
  message: string;
}

// ============================================================================
// API Error Types
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  type: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  error: ApiError;
}

// ============================================================================
// User & Auth Types
// ============================================================================

export enum UserRole {
  USER = 'USER',
  CLIENT = 'CLIENT',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string | null;
  headline: string | null;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  tenantId: string;
  emailVerified: boolean;
  language: string;
  organizationId: string | null;
  createdAt: string;
  updatedAt?: string;
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

// ============================================================================
// Organization Types
// ============================================================================

export enum OrganizationSize {
  STARTUP = 'STARTUP',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE',
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logoFileId: string | null;
  industry: string | null;
  size: OrganizationSize | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationDto {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: OrganizationSize;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: OrganizationSize;
}

// ============================================================================
// Job Types
// ============================================================================

export enum JobStatus {
  DRAFT = 'DRAFT',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP',
}

export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  EXECUTIVE = 'EXECUTIVE',
}

export enum RemoteOption {
  ON_SITE = 'ON_SITE',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
}

export enum JobTier {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
}

export enum SalaryPeriod {
  HOURLY = 'HOURLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum PromotionType {
  FEATURED = 'FEATURED',
  HIGHLIGHTED = 'HIGHLIGHTED',
  TOP_POSITION = 'TOP_POSITION',
  SOCIAL_BOOST = 'SOCIAL_BOOST',
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  categoryId: string;
  locationId: string | null;
  employmentType: EmploymentType;
  remoteOption: RemoteOption;
  experienceLevel: ExperienceLevel | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: SalaryPeriod;
  tier: JobTier;
  promotions: PromotionType[];
  status: JobStatus;
  publishedAt: string | null;
  expiresAt: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobListItem {
  id: string;
  title: string;
  slug: string;
  status: JobStatus;
  tier: JobTier;
  employmentType: EmploymentType;
  publishedAt: string | null;
  expiresAt: string | null;
  viewCount: number;
  createdAt: string;
}

export interface JobListResponse {
  data: JobListItem[];
  total: number;
}

export interface CreateJobDto {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  categoryId: string;
  locationId?: string;
  employmentType: EmploymentType;
  remoteOption: RemoteOption;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: SalaryPeriod;
}

export interface UpdateJobDto {
  title?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  categoryId?: string;
  locationId?: string;
  employmentType?: EmploymentType;
  remoteOption?: RemoteOption;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: SalaryPeriod;
}

export interface PublishJobDto {
  tier: JobTier;
  promotions?: PromotionType[];
}

// ============================================================================
// Utility Types
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// Legacy exports for backwards compatibility
export { Status } from './legacy';
