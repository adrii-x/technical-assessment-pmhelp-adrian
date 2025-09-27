import { z } from 'zod';
import { AppointmentStatus } from '../types/';
import { UserRoles } from '../types/userRole'; 

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must be less than 100 characters');

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must be less than 15 digits')
  .regex(/^[+]?[\d\s\-()]+$/, 'Please enter a valid phone number');

 

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.nativeEnum(UserRoles).optional(),
});

// Appointment validation schemas
export const createAppointmentSchema = z.object({
  doctorId: z.number().min(1, 'Please select a doctor'),
  availabilityId: z.number().min(1, 'Please select a time slot'),
  date: z.string().min(1, 'Please select a date'),
  reason: z.string().min(1, 'Please provide a reason for the appointment').max(500, 'Reason must be less than 500 characters'),
});

export const updateAppointmentSchema = z.object({
  status: z.nativeEnum(AppointmentStatus).optional(),
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
});

// Medical record validation schemas
export const createMedicalRecordSchema = z.object({
  patientId: z.number().min(1, 'Patient ID is required'),
  details: z.string().min(1, 'Details are required').max(2000, 'Details must be less than 2000 characters'),
  diagnosis: z.string().max(1000, 'Diagnosis must be less than 1000 characters').optional(),
  treatment: z.string().max(1000, 'Treatment must be less than 1000 characters').optional(),
});

// User management validation schemas
export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  role: z.nativeEnum(UserRoles).optional(),
});

export const updateUserSubscriptionSchema = z.object({
  tier: z.string().min(1, 'Subscription tier is required'),
  endDate: z.string().min(1, 'End date is required'),
});

// Subscription validation schemas
export const upgradeSubscriptionSchema = z.object({
  tier: z.string().min(1, 'Please select a subscription tier'),
});

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().max(100, 'Search query must be less than 100 characters').optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const appointmentFiltersSchema = searchSchema.extend({
  status: z.nativeEnum(AppointmentStatus).optional(),
  doctorId: z.number().optional(),
  patientId: z.number().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const userFiltersSchema = searchSchema.extend({
  role: z.nativeEnum(UserRoles).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// Form validation helper types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateAppointmentFormData = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentFormData = z.infer<typeof updateAppointmentSchema>;
export type CreateMedicalRecordFormData = z.infer<typeof createMedicalRecordSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UpdateUserSubscriptionFormData = z.infer<typeof updateUserSubscriptionSchema>;
export type UpgradeSubscriptionFormData = z.infer<typeof upgradeSubscriptionSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type AppointmentFiltersFormData = z.infer<typeof appointmentFiltersSchema>;
export type UserFiltersFormData = z.infer<typeof userFiltersSchema>;