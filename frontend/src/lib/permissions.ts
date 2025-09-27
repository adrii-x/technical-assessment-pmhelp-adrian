import type { UserRole } from '../types/userRole';
import { UserRoles } from '../types/userRole';


// Define permissions for each role
export const PERMISSIONS = {
  // Appointment permissions
  APPOINTMENTS: {
    VIEW_OWN: [UserRoles.PATIENT, UserRoles.DOCTOR],
    VIEW_ALL: [UserRoles.ADMIN],
    CREATE: [UserRoles.PATIENT],
    UPDATE_OWN: [UserRoles.PATIENT, UserRoles.DOCTOR],
    UPDATE_ALL: [UserRoles.ADMIN],
    DELETE_OWN: [UserRoles.PATIENT],
    DELETE_ALL: [UserRoles.ADMIN],
  },

  // Medical records permissions
  MEDICAL_RECORDS: {
    VIEW_OWN: [UserRoles.PATIENT],
    VIEW_PATIENTS: [UserRoles.DOCTOR],
    VIEW_ALL: [UserRoles.ADMIN],
    CREATE: [UserRoles.DOCTOR],
    UPDATE_OWN: [UserRoles.DOCTOR],
    UPDATE_ALL: [UserRoles.ADMIN],
    DELETE_OWN: [UserRoles.DOCTOR],
    DELETE_ALL: [UserRoles.ADMIN],
  },

  // User management permissions
  USERS: {
    VIEW_OWN: [UserRoles.PATIENT, UserRoles.DOCTOR, UserRoles.ADMIN],
    VIEW_ALL: [UserRoles.ADMIN],
    CREATE: [UserRoles.ADMIN],
    UPDATE_OWN: [UserRoles.PATIENT, UserRoles.DOCTOR, UserRoles.ADMIN],
    UPDATE_ALL: [UserRoles.ADMIN],
    DELETE_ALL: [UserRoles.ADMIN],
  },

  // Subscription permissions
  SUBSCRIPTIONS: {
    VIEW_OWN: [UserRoles.PATIENT, UserRoles.ADMIN],
    VIEW_ALL: [UserRoles.ADMIN],
    MANAGE_OWN: [UserRoles.PATIENT],
    MANAGE_ALL: [UserRoles.ADMIN],
  },

  // Analytics permissions
  ANALYTICS: {
    VIEW_PRACTICE: [UserRoles.DOCTOR],
    VIEW_SYSTEM: [UserRoles.ADMIN],
  },

  // System settings permissions
  SETTINGS: {
    VIEW: [UserRoles.ADMIN],
    UPDATE: [UserRoles.ADMIN],
  },
} as const;

// Permission checker functions
export function hasPermission(userRoles: UserRole, permission: readonly UserRole[]): boolean {
  return permission.includes(userRoles);
}

export function canViewAllAppointments(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.APPOINTMENTS.VIEW_ALL);
}

export function canCreateAppointment(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.APPOINTMENTS.CREATE);
}

export function canViewAllUsers(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.USERS.VIEW_ALL);
}

export function canManageUsers(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.USERS.UPDATE_ALL);
}

export function canViewSystemAnalytics(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.ANALYTICS.VIEW_SYSTEM);
}

export function canViewPracticeAnalytics(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.ANALYTICS.VIEW_PRACTICE);
}

export function canManageSubscriptions(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.SUBSCRIPTIONS.MANAGE_ALL);
}

export function canAccessSettings(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.SETTINGS.VIEW);
}

// Route-based permission checks
export function getAccessibleRoutes(userRole: UserRole): string[] {
  const routes: string[] = [];

  // Common routes for all authenticated users
  routes.push('/profile', '/settings');

  // Role-specific routes
  switch (userRole) {
    case UserRoles.PATIENT:
      routes.push(
        '/patient',
        '/patient/appointments',
        '/patient/records',
        '/patient/book',
        '/patient/subscription'
      );
      break;

    case UserRoles.DOCTOR:
      routes.push(
        '/doctor',
        '/doctor/appointments',
        '/doctor/patients',
        '/doctor/analytics',
        '/doctor/availability'
      );
      break;

    case UserRoles.ADMIN:
      routes.push(
        '/admin',
        '/admin/users',
        '/admin/appointments',
        '/admin/analytics',
        '/admin/settings'
      );
      break;
  }

  return routes;
}

// Check if user can access a specific route
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const accessibleRoutes = getAccessibleRoutes(userRole);
  return accessibleRoutes.some(accessibleRoute => route.startsWith(accessibleRoute));
}