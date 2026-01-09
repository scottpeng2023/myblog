import { useAuthStore } from '../stores/auth';

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, register, logout, checkAuth } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    isAdmin: user?.role === 'admin',
    isAuthor: user?.role === 'author' || user?.role === 'admin',
  };
}
