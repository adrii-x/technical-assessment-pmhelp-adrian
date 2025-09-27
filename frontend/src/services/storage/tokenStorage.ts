export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

class TokenStorage {
  private readonly ACCESS_TOKEN_KEY = 'medportal_access_token';
  private readonly REFRESH_TOKEN_KEY = 'medportal_refresh_token';
  private readonly EXPIRES_AT_KEY = 'medportal_token_expires_at';

  getAccessToken(): string | null {
    try {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to get access token from localStorage:', error);
      return null;
    }
  }

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to get refresh token from localStorage:', error);
      return null;
    }
  }

  getTokenExpiresAt(): number | null {
    try {
      const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
      return expiresAt ? parseInt(expiresAt, 10) : null;
    } catch (error) {
      console.warn('Failed to get token expiration from localStorage:', error);
      return null;
    }
  }

  setTokens(data: TokenData): void {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, data.accessToken);
      
      if (data.refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);
      }
      
      if (data.expiresAt) {
        localStorage.setItem(this.EXPIRES_AT_KEY, data.expiresAt.toString());
      }
    } catch (error) {
      console.error('Failed to store tokens in localStorage:', error);
    }
  }

  clearTokens(): void {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.EXPIRES_AT_KEY);
    } catch (error) {
      console.error('Failed to clear tokens from localStorage:', error);
    }
  }

  isTokenExpired(): boolean {
    const expiresAt = this.getTokenExpiresAt();
    if (!expiresAt) return true;
    
    // Add 5-minute buffer for token refresh
    return Date.now() >= (expiresAt - 5 * 60 * 1000);
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    return Boolean(token && !this.isTokenExpired());
  }
}

export const tokenStorage = new TokenStorage();