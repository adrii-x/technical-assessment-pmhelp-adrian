export const APP_CONSTANTS = {
  // App Info
  APP_NAME: 'MedPortal',
  APP_VERSION: '1.0.0',
  
  // API
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  REQUEST_TIMEOUT: 30000,
  
  // UI Constants
  SIDEBAR_WIDTH: 256,
  HEADER_HEIGHT: 64,
  
  // Subscription Tiers
  SUBSCRIPTION_TIERS: {
    FREE: {
      name: 'Free',
      appointmentLimit: 2,
      priceCents: 0,
      features: ['Basic scheduling', 'Email notifications']
    },
    BASIC: {
      name: 'Basic',
      appointmentLimit: 5,
      priceCents: 2900, // $29.00
      features: ['Priority scheduling', 'SMS notifications', 'Medical records']
    },
    PREMIUM: {
      name: 'Premium',
      appointmentLimit: null, // Unlimited
      priceCents: 7900, // $79.00
      features: ['Unlimited appointments', 'Analytics', '24/7 support', 'API access']
    }
  } as const,
  
  // Date/Time
  DATE_FORMAT: 'yyyy-MM-dd',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
  
  // Pagination
  DEFAULT_PAGINATION: {
    page: 1,
    limit: 10,
  },
  
  // Cache Keys (for localStorage)
  STORAGE_KEYS: {
    THEME: 'medportal_theme',
    LANGUAGE: 'medportal_language',
    USER_PREFERENCES: 'medportal_user_preferences',
  },
} as const;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id: number) => `/users/${id}`,
    UPDATE_SUBSCRIPTION: (id: number) => `/users/${id}/subscription`,
  },
  
  // Appointments
  APPOINTMENTS: {
    LIST: '/appointments',
    MY_APPOINTMENTS: '/appointments/my',
    CREATE: '/appointments',
    DETAIL: (id: number) => `/appointments/${id}`,
  },
  
  // Medical Records
  MEDICAL_RECORDS: {
    LIST: '/medical-records',
    MY_RECORDS: '/medical-records/my',
    CREATE: '/medical-records',
    DETAIL: (id: number) => `/medical-records/${id}`,
  },
  
  // Subscriptions
  SUBSCRIPTIONS: {
    PLANS: '/subscriptions/plans',
    MY_SUBSCRIPTION: '/subscriptions/my',
    USAGE: '/subscriptions/usage',
    UPGRADE: '/subscriptions/upgrade',
    CANCEL: '/subscriptions/cancel',
  },
  
  // Analytics
  ANALYTICS: {
    PRACTICE: '/analytics/practice',
    SYSTEM: '/analytics/system',
  },
  
  // Patients (for doctors)
  PATIENTS: {
    RECORDS: (patientId: number) => `/patients/${patientId}/records`,
  },
} as const;
