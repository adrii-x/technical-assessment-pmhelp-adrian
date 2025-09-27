// src/lib/errorHandling.ts
import type { ApiError } from '../types';



export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.name = 'AppError';

    // Node.js only: safely capture stack trace
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor as new (...args: unknown[]) => unknown);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

// Error message helpers
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object') {
    const apiError = error as ApiError;
    if (apiError.message) {
      return apiError.message;
    }
  }
  
  return 'An unexpected error occurred';
};

// User-friendly error messages
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  const message = getErrorMessage(error);
  
  // Map common error messages to user-friendly ones
  const errorMap: Record<string, string> = {
    'Invalid credentials': 'Please check your email and password and try again.',
    'Email already registered': 'An account with this email already exists. Try logging in instead.',
    'Network Error': 'Please check your internet connection and try again.',
    'timeout': 'The request took too long. Please try again.',
    'subscription limit reached': 'You have reached your monthly appointment limit. Please upgrade your subscription to book more appointments.',
    'Appointment slot not available': 'This time slot is no longer available. Please select a different time.',
    'Access denied': 'You don\'t have permission to perform this action.',
  };
  
  // Check for exact matches first
  if (errorMap[message]) {
    return errorMap[message];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return message;
};

// Error logging (for production use)
export const logError = (error: unknown, context?: Record<string, unknown>) => {
  const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

  if (isDev) {
    console.error('Error:', error);
    if (context) console.error('Context:', context);
  } else {
    // Production logging, e.g., Sentry.captureException(error, { extra: context });
  }
};


// Retry mechanism for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof AppError && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }
  
  throw lastError;
};
