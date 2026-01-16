// Re-export auth types from shared package
export {
  // Enums (value exports)
  UserRole,
} from '@job-board/types';

export type {
  // Interfaces
  User,
  UserProfile,
  AuthTokens,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ApiError,
  ApiErrorResponse,
} from '@job-board/types';
