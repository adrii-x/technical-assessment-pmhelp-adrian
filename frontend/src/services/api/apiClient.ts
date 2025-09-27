import axios from 'axios';
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';

import { env } from '../../config/env';
import { tokenStorage } from '../storage/tokenStorage';
import type { ApiError } from '../../types';


class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: env.API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = tokenStorage.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = tokenStorage.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Attempt token refresh
            const response = await this.client.post('/auth/refresh', {
              refreshToken,
            });

            const { accessToken } = response.data;
            tokenStorage.setTokens({ accessToken });

            // Retry all queued requests with new token
            this.refreshSubscribers.forEach((callback) => callback(accessToken));
            this.refreshSubscribers = [];

            // Retry original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return this.client(originalRequest);

          } catch (refreshError) {
            // Refresh failed, redirect to login
            tokenStorage.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.transformError(error));
      }
    );
  }

private transformError(error: AxiosError): ApiError {
  if (error.response?.data) {
    const responseData = error.response.data as Record<string, unknown>;

    return {
      message:
        typeof responseData.message === 'string'
          ? responseData.message
          : 'An error occurred',
      statusCode: typeof error.response.status === 'number' ? error.response.status : 500,
      error: typeof responseData.error === 'string' ? responseData.error : undefined,
      timestamp: typeof responseData.timestamp === 'string' ? responseData.timestamp : undefined,
    };
  }

  if (error.request) {
    return {
      message: 'Network error - please check your connection',
      statusCode: 0,
    };
  }

  return {
    message: typeof error.message === 'string' ? error.message : 'An unexpected error occurred',
    statusCode: 500,
  };
}


  // Public methods for making requests
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await this.client.get<T>(url, config);
  return response.data;
    }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await this.client.post<T>(url, data, config);
  return response.data;
}

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await this.client.put<T>(url, data, config);
  return response.data;
}

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await this.client.patch<T>(url, data, config);
  return response.data;
}

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await this.client.delete<T>(url, config);
  return response.data;
    }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return tokenStorage.hasValidToken();
  }

  // Method to manually logout (clear tokens)
  logout(): void {
    tokenStorage.clearTokens();
  }
}

export const apiClient = new ApiClient();