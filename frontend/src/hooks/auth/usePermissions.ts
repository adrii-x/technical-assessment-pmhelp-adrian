import { useMemo } from 'react';
import { useAuth } from './useAuth';
import type { UserRole } from '../../types';

import { UserRoles } from '../../types/userRole'; // goes up 2 folders

import { 
  canViewAllAppointments,
  canCreateAppointment,
  canViewAllUsers,
  canManageUsers,
  canViewSystemAnalytics,
  canViewPracticeAnalytics,
  canManageSubscriptions,
  canAccessSettings,
  canAccessRoute,
  getAccessibleRoutes,
} from '../../lib/permissions';

interface UsePermissionsReturn {
  // Role checks
  isPatient: boolean;
  isDoctor: boolean;
  isAdmin: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  
  // Specific permissions
  canViewAllAppointments: boolean;
  canCreateAppointment: boolean;
  canViewAllUsers: boolean;
  canManageUsers: boolean;
  canViewSystemAnalytics: boolean;
  canViewPracticeAnalytics: boolean;
  canManageSubscriptions: boolean;
  canAccessSettings: boolean;
  
  // Route permissions
  canAccessRoute: (route: string) => boolean;
  accessibleRoutes: string[];
}

export function usePermissions(): UsePermissionsReturn {
  const { user, hasRole, hasAnyRole } = useAuth();
  
  const permissions = useMemo(() => {
    if (!user) {
      return {
        isPatient: false,
        isDoctor: false,
        isAdmin: false,
        hasRole,
        hasAnyRole,
        canViewAllAppointments: false,
        canCreateAppointment: false,
        canViewAllUsers: false,
        canManageUsers: false,
        canViewSystemAnalytics: false,
        canViewPracticeAnalytics: false,
        canManageSubscriptions: false,
        canAccessSettings: false,
        canAccessRoute: () => false,
        accessibleRoutes: [],
      };
    }

    const userRole = user.role;

    return {
  isPatient: userRole === UserRoles.PATIENT,
  isDoctor: userRole === UserRoles.DOCTOR,
  isAdmin: userRole === UserRoles.ADMIN,
  hasRole,
  hasAnyRole,
  canViewAllAppointments: canViewAllAppointments(userRole),
  canCreateAppointment: canCreateAppointment(userRole),
  canViewAllUsers: canViewAllUsers(userRole),
  canManageUsers: canManageUsers(userRole),
  canViewSystemAnalytics: canViewSystemAnalytics(userRole),
  canViewPracticeAnalytics: canViewPracticeAnalytics(userRole),
  canManageSubscriptions: canManageSubscriptions(userRole),
  canAccessSettings: canAccessSettings(userRole),
  canAccessRoute: (route: string) => canAccessRoute(userRole, route),
  accessibleRoutes: getAccessibleRoutes(userRole),
};
  }, [user, hasRole, hasAnyRole]);

  return permissions;
}