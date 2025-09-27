import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback
} from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/api/authApi';
import { tokenStorage } from '../services/storage/tokenStorage';
import { queryKeys } from '../config/queryClient';
import type { 
  User, 
  UserRole, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '../types';  
import { 
  AuthenticationError, 
  getErrorMessage, 
  logError 
} from '../lib/errorHandling';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const queryClient = useQueryClient();

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check if we have a valid token
      if (!tokenStorage.hasValidToken()) {
        setState(prev => ({ 
          ...prev, 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        }));
        return;
      }

      // Try to get current user
      const user = await authApi.getCurrentUser();
      
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
      }));

    } catch (error) {
      logError(error, { context: 'AuthProvider.initializeAuth' });
      
      // Clear invalid tokens
      tokenStorage.clearTokens();
      queryClient.clear();
      
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null, // Don't show error for expired tokens on initialization
      }));
    }
  }, [queryClient]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login function
  const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await authApi.login(credentials);
      
      setState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      }));

      // Invalidate all queries to ensure fresh data
      await queryClient.invalidateQueries();

      return response;

    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logError(error, { context: 'AuthProvider.login', credentials: { email: credentials.email } });
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, [queryClient]);

  // Register function
  const register = useCallback(async (userData: RegisterRequest): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      await authApi.register(userData);
      
      setState(prev => ({ ...prev, isLoading: false }));

    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logError(error, { context: 'AuthProvider.register', userData: { email: userData.email } });
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      await authApi.logout();
      
    } catch (error) {
      // Continue with logout even if API call fails
      logError(error, { context: 'AuthProvider.logout' });
    } finally {
      // Clear all local state and cache
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      queryClient.clear();
    }
  }, [queryClient]);

  // Refresh current user
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      if (!tokenStorage.hasValidToken()) {
        throw new AuthenticationError('No valid token');
      }

      const user = await authApi.getCurrentUser();
      
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));

      // Invalidate user-related queries
      await queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });

    } catch (error) {
      logError(error, { context: 'AuthProvider.refreshUser' });
      
      // If refresh fails, logout user
      await logout();
    }
  }, [queryClient, logout]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Role checking utilities
  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user?.role]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return state.user ? roles.includes(state.user.role) : false;
  }, [state.user]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    refreshUser,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
/* eslint-disable react-refresh/only-export-components */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
/* eslint-enable react-refresh/only-export-components */
