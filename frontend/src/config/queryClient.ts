import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - data is considered fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      
      // Cache time - data stays in cache for 10 minutes after component unmount
      gcTime: 1000 * 60 * 10,
      
      // Retry failed requests 2 times
      retry: (failureCount, error: unknown) => {
        if (error && typeof error === 'object' && error !== null && 'statusCode' in error) {
            const status = (error as { statusCode: number }).statusCode;
            if (status >= 400 && status < 500) return false;
        }
        return failureCount < 2;
        },
            
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus for important data
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on network errors
     retry: (failureCount, error: unknown) => {
  if (error && typeof error === 'object' && error !== null && 'statusCode' in error) {
    const status = (error as { statusCode: number }).statusCode;
    if (status === 0) return failureCount < 1; // Network error
  }
  return false;
},

    },
  },
});

// Query keys factory for consistent cache management
type Filters = Record<string, string | number | boolean>;

export const queryKeys = {
  // Auth
  currentUser: ['auth', 'currentUser'] as const,

  // Appointments
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters: Filters) => [...queryKeys.appointments.lists(), filters] as const,
    details: () => [...queryKeys.appointments.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.appointments.details(), id] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Filters) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },

  // Medical Records
  medicalRecords: {
    all: ['medicalRecords'] as const,
    lists: () => [...queryKeys.medicalRecords.all, 'list'] as const,
    list: (filters: Filters) => [...queryKeys.medicalRecords.lists(), filters] as const,
    details: () => [...queryKeys.medicalRecords.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.medicalRecords.details(), id] as const,
  },

  // Subscriptions
  subscriptions: {
    all: ['subscriptions'] as const,
    plans: () => [...queryKeys.subscriptions.all, 'plans'] as const,
    current: () => [...queryKeys.subscriptions.all, 'current'] as const,
    usage: () => [...queryKeys.subscriptions.all, 'usage'] as const,
  },

  // Analytics
  analytics: {
    all: ['analytics'] as const,
    practice: () => [...queryKeys.analytics.all, 'practice'] as const,
    system: () => [...queryKeys.analytics.all, 'system'] as const,
  },
} as const;
