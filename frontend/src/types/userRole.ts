// src/types/userRole.ts
export const UserRoles = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];