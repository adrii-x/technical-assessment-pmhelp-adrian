import { apiClient } from './apiClient';
import { tokenStorage } from '../storage/tokenStorage';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User 
} from '../../types';

export class AuthApi {
  async login(credentials: LoginRequest): Promise<AuthResponse> { 
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  
  tokenStorage.setTokens({
    accessToken: response.accessToken,
  });

  return response;
}


  async register(userData: RegisterRequest): Promise<{ user: User }> {
  const response = await apiClient.post<{ user: User }>('/auth/register', userData);
  return response;
}


  async getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me');
  return response;
}


  async logout(): Promise<void> {
    try {
      // Call backend logout if needed
      // await apiClient.post('/auth/logout');
      
      // Clear local tokens
      tokenStorage.clearTokens();
    } catch (error) {
      // Even if backend call fails, clear local tokens
      tokenStorage.clearTokens();
      throw error;
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {
        refreshToken,
      });

      tokenStorage.setTokens({
        accessToken: response.accessToken,
      });

      return response;
    } catch (error) {
      tokenStorage.clearTokens();
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return tokenStorage.hasValidToken();
  }
}

export const authApi = new AuthApi();