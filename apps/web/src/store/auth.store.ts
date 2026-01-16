import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authApi, ApiClientError, profilesApi, type Profile } from '@/lib/api';
import type { LoginCredentials, RegisterCredentials } from '@/lib/api';
import { env } from '@/lib/env';

interface User {
  id: string;
  email: string;
  role: string;
  profile?: Profile | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;

  login: (credentials: Omit<LoginCredentials, 'tenantId'>) => Promise<void>;
  register: (credentials: Omit<RegisterCredentials, 'tenantId'>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  clearError: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      error: null,

      login: async (credentials: Omit<LoginCredentials, 'tenantId'>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({
            ...credentials,
            tenantId: env.NEXT_PUBLIC_DEFAULT_TENANT_ID,
          });
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
              : 'An unexpected error occurred';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      register: async (credentials: Omit<RegisterCredentials, 'tenantId'>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register({
            ...credentials,
            tenantId: env.NEXT_PUBLIC_DEFAULT_TENANT_ID,
          });
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
              : 'An unexpected error occurred';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      fetchProfile: async () => {
        try {
          const meResponse = await profilesApi.getMe();
          set((state) => ({
            user: state.user
              ? { ...state.user, profile: meResponse.profile }
              : null,
          }));
        } catch {
          // Ignore profile fetch errors
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Ignore logout errors
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
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'web-auth-storage',
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
