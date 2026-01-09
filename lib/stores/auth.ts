import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { apiClient } from '../api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post<{ access_token: string; refresh_token: string; user: User }>(
            '/auth/login',
            { username, password }
          );
          apiClient.setTokens(response.access_token, response.refresh_token);
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post<{ access_token: string; refresh_token: string; user: User }>(
            '/auth/register',
            { username, email, password }
          );
          apiClient.setTokens(response.access_token, response.refresh_token);
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        apiClient.clearTokens();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        if (!apiClient.isAuthenticated()) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        try {
          const user = await apiClient.get<User>('/auth/me');
          set({ user, isAuthenticated: true });
        } catch {
          apiClient.clearTokens();
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
