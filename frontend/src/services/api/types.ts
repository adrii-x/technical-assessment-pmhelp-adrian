// src/services/api/types.ts

import type { 
  User, 
  Appointment, 
  MedicalRecord, 
  UserSubscription,
  PracticeAnalytics,
  SystemAnalytics 
} from '../../types';

// API Response wrappers
export interface ApiListResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiSingleResponse<T> {
  data: T;
}

// Specific API response types with meaningful interfaces
export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  user: User;
  message?: string;
}

// Use type aliases instead of empty interfaces
export type AppointmentsResponse = ApiListResponse<Appointment>;
export type AppointmentResponse = ApiSingleResponse<Appointment>;
export type MedicalRecordsResponse = ApiListResponse<MedicalRecord>;
export type MedicalRecordResponse = ApiSingleResponse<MedicalRecord>;
export type UsersResponse = ApiListResponse<User>;
export type UserResponse = ApiSingleResponse<User>;
export type SubscriptionResponse = ApiSingleResponse<UserSubscription>;
export type PracticeAnalyticsResponse = ApiSingleResponse<PracticeAnalytics>;
export type SystemAnalyticsResponse = ApiSingleResponse<SystemAnalytics>;

// For subscription plans, create a proper interface since we don't have the exact type
export interface SubscriptionPlan {
  id: number;
  tier: string;
  name: string;
  allowedAppointmentsPerMonth: number | null;
  priceCents: number;
  features: string[];
  durationDays: number;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionPlansResponse = ApiListResponse<SubscriptionPlan>;

// Request parameter types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  query?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AppointmentFilters extends SearchParams {
  status?: string;
  doctorId?: number;
  patientId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface UserFilters extends SearchParams {
  role?: string;
  status?: 'active' | 'inactive';
}

// Additional useful response types
export interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  timestamp?: string;
}

export interface SuccessResponse {
  success: boolean;
  message?: string;
}

// Bulk operation responses
export interface BulkOperationResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
}