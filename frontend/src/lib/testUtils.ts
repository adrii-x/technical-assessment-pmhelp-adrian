import { QueryClient } from '@tanstack/react-query';
// import { AuthProvider } from '../contexts/AuthContext';
import type { User, UserRole } from '../types';

// Mock user factory for testing
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'PATIENT' as UserRole,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Create query client for testing
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Mock auth context for testing
export const createMockAuthContext = (user: User | null = null) => ({
  user,
  isAuthenticated: !!user,
  isLoading: false,
  error: null,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  clearError: jest.fn(),
  refreshUser: jest.fn(),
  hasRole: (role: UserRole) => user?.role === role,
  hasAnyRole: (roles: UserRole[]) => user ? roles.includes(user.role) : false,
});

// Environment validation
export const validateEnvironment = () => {
  const requiredVars = ['VITE_API_BASE_URL'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};