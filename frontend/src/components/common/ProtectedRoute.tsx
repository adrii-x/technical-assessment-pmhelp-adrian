import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { usePermissions } from '../../hooks/auth/usePermissions';
import type { UserRole } from '../../types';
import { UserRoles } from '../../types/userRole'; 
import type { ReactNode } from 'react';


import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiresAuth?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requiresAuth = true,
  fallbackPath,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { hasAnyRole } = usePermissions();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (allowedRoles.length > 0 && (!user || !hasAnyRole(allowedRoles))) {
    // Determine fallback path based on user role or use provided fallback
    let redirectPath = fallbackPath;
    
    if (!redirectPath && user) {
      switch (user.role) {
        case UserRoles.PATIENT:
          redirectPath = '/patient';
          break;
        case UserRoles.DOCTOR:
          redirectPath = '/doctor';
          break;
        case UserRoles.ADMIN:
          redirectPath = '/admin';
          break;
        default:
          redirectPath = '/unauthorized';
      }
    } else if (!redirectPath) {
      redirectPath = '/unauthorized';
    }

    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Export for easier importing
export default ProtectedRoute;