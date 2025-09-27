// src/App.tsx - Corrected version with proper imports
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { useAuth } from './hooks/auth/useAuth';
import { env } from './config/env';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Error Pages
import { NotFound } from './pages/shared/NotFound';
import { Unauthorized } from './pages/shared/Unauthorized';
import { ServerError } from './pages/shared/ServerError';

// For now, create placeholder dashboard components since we haven't built them yet
const PlaceholderDashboard: React.FC<{ role: string }> = ({ role }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {role} Dashboard
      </h1>
      <p className="text-gray-600 mb-4">
        Welcome to your MedPortal {role.toLowerCase()} dashboard!
      </p>
      <p className="text-sm text-gray-500">
        This dashboard will be implemented in the next phases.
      </p>
    </div>
  </div>
);

// Placeholder components for different roles
const PatientDashboard = () => <PlaceholderDashboard role="Patient" />;
const DoctorDashboard = () => <PlaceholderDashboard role="Doctor" />;
const AdminDashboard = () => <PlaceholderDashboard role="Admin" />;

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error: unknown) => {
        const err = error as { statusCode?: number };
        if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});


// Loading fallback component
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);

// Component to handle authenticated redirects
const AuthenticatedRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SuspenseFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (user?.role) {
    case 'PATIENT':
      return <Navigate to="/patient" replace />;
    case 'DOCTOR':
      return <Navigate to="/doctor" replace />;
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Error Routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/server-error" element={<ServerError />} />
                <Route path="/404" element={<NotFound />} />
                
                {/* Protected Routes */}
                <Route
                  path="/patient/*"
                  element={
                    <ProtectedRoute allowedRoles={['PATIENT']}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/doctor/*"
                  element={
                    <ProtectedRoute allowedRoles={['DOCTOR']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Default redirect based on authentication status */}
                <Route path="/" element={<AuthenticatedRedirect />} />
                
                {/* Catch all - 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            
            {/* Global toast notifications */}
            <Toaster />
            
            {/* React Query Dev Tools (development only) */}
            {env.ENABLE_DEV_TOOLS && <ReactQueryDevtools initialIsOpen={false} />}
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;