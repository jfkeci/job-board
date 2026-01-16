import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authApi, ApiClientError } from '@/lib/api';
import type { User, LoginCredentials } from '@/types/auth';

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  setUser: (user: User) => void;
  clearError: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);

          // Check if user is admin
          if (response.user?.role !== 'ADMIN' && response.user?.role !== 'SUPER_ADMIN') {
            throw new Error('Access denied. Admin privileges required.');
          }

          set({
            user: response.user || null,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          const message =
            err instanceof ApiClientError
              ? err.message
              : err instanceof Error
                ? err.message
                : 'An unexpected error occurred';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Ignore logout errors - we'll clear state anyway
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshTokens: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const response = await authApi.refresh(refreshToken);
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
          });
          return true;
        } catch {
          // Refresh failed - clear auth state
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          return false;
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
