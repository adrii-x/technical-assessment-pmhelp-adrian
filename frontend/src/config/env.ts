export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'MedPortal',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  ENABLE_DEV_TOOLS: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true' || import.meta.env.NODE_ENV === 'development'
} as const;

// Validate required environment variables
if (!env.API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}
