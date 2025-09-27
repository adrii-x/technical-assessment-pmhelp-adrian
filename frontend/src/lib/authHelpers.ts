// src/lib/authHelpers.ts
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload, UserRole } from '../types';

export class AuthHelpers {
  /**
   * Decode JWT token to get payload
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.warn('Failed to decode JWT token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }

    // Add 5-minute buffer for token refresh
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const buffer = 5 * 60 * 1000; // 5 minutes

    return currentTime >= (expirationTime - buffer);
  }

  /**
   * Get token expiration date
   */
  static getTokenExpiration(token: string): Date | null {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return null;
    }

    return new Date(payload.exp * 1000);
  }

  /**
   * Get user info from token
   */
  static getUserFromToken(token: string): Pick<JwtPayload, 'sub' | 'email' | 'role'> | null {
    const payload = this.decodeToken(token);
    if (!payload) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }

  /**
   * Validate token format (basic JWT structure check)
   */
  static isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  static getTimeUntilExpiration(token: string): number | null {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return null;
    }

    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    return Math.max(0, expirationTime - currentTime);
  }

  /**
   * Format token expiration for display
   */
  static formatTokenExpiration(token: string): string {
    const expirationDate = this.getTokenExpiration(token);
    if (!expirationDate) {
      return 'Invalid token';
    }

    const now = new Date();
    const diffMs = expirationDate.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return 'Expired';
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} remaining`;
    }
  }

  /**
   * Check if user has specific role
   */
  static hasRole(token: string, role: UserRole): boolean {
    const userInfo = this.getUserFromToken(token);
    if (!userInfo) {
      return false;
    }

    return userInfo.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(token: string, roles: UserRole[]): boolean {
    const userInfo = this.getUserFromToken(token);
    if (!userInfo) {
      return false;
    }

    return roles.includes(userInfo.role);
  }

  /**
   * Get user ID from token
   */
  static getUserId(token: string): number | string | null {
    const userInfo = this.getUserFromToken(token);
    return userInfo?.sub ?? null;
  }

  /**
   * Get user email from token
   */
  static getUserEmail(token: string): string | null {
    const userInfo = this.getUserFromToken(token);
    return userInfo?.email ?? null;
  }

  /**
   * Get user role from token
   */
  static getUserRole(token: string): UserRole | null {
    const userInfo = this.getUserFromToken(token);
    return userInfo?.role ?? null;
  }

  /**
   * Check if token will expire soon (within specified minutes)
   */
  static willExpireSoon(token: string, withinMinutes: number = 5): boolean {
    const timeUntilExpiration = this.getTimeUntilExpiration(token);
    if (!timeUntilExpiration) {
      return true; // Consider invalid tokens as expiring soon
    }

    const thresholdMs = withinMinutes * 60 * 1000;
    return timeUntilExpiration <= thresholdMs;
  }

  /**
   * Calculate token age (how long ago it was issued)
   */
  static getTokenAge(token: string): number | null {
    const payload = this.decodeToken(token);
    if (!payload || !payload.iat) {
      return null;
    }

    const issuedTime = payload.iat * 1000;
    const currentTime = Date.now();
    
    return currentTime - issuedTime;
  }

  /**
   * Format token age for display
   */
  static formatTokenAge(token: string): string {
    const ageMs = this.getTokenAge(token);
    if (!ageMs) {
      return 'Unknown';
    }

    const ageMinutes = Math.floor(ageMs / (1000 * 60));
    const ageHours = Math.floor(ageMinutes / 60);
    const ageDays = Math.floor(ageHours / 24);

    if (ageDays > 0) {
      return `${ageDays} day${ageDays > 1 ? 's' : ''} ago`;
    } else if (ageHours > 0) {
      return `${ageHours} hour${ageHours > 1 ? 's' : ''} ago`;
    } else if (ageMinutes > 0) {
      return `${ageMinutes} minute${ageMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  /**
   * Validate token and return validation result with details
   */
  static validateToken(token: string): {
    isValid: boolean;
    isExpired: boolean;
    isFormatValid: boolean;
    expiresAt: Date | null;
    userInfo: Pick<JwtPayload, 'sub' | 'email' | 'role'> | null;
    errors: string[];
  } {
    const errors: string[] = [];
    let isValid = true;

    // Check format
    const isFormatValid = this.isValidTokenFormat(token);
    if (!isFormatValid) {
      errors.push('Invalid token format');
      isValid = false;
    }

    // Check if expired
    const isExpired = this.isTokenExpired(token);
    if (isExpired) {
      errors.push('Token is expired');
      isValid = false;
    }

    // Get token info
    const expiresAt = this.getTokenExpiration(token);
    const userInfo = this.getUserFromToken(token);

    if (!userInfo && isFormatValid) {
      errors.push('Unable to decode user information');
      isValid = false;
    }

    return {
      isValid: isValid && !isExpired,
      isExpired,
      isFormatValid,
      expiresAt,
      userInfo,
      errors,
    };
  }

  /**
   * Extract refresh token expiration (if your backend provides refresh token expiry in JWT)
   */
  static getRefreshTokenExpiration(refreshToken: string): Date | null {
    return this.getTokenExpiration(refreshToken);
  }

  /**
   * Check if refresh token is expired
   */
  static isRefreshTokenExpired(refreshToken: string): boolean {
    return this.isTokenExpired(refreshToken);
  }

  /**
   * Create a debug info object for token (useful for development)
   */
  static getTokenDebugInfo(token: string): Record<string, unknown> {
    const payload = this.decodeToken(token);
    const validation = this.validateToken(token);

    return {
      isValidFormat: this.isValidTokenFormat(token),
      isExpired: this.isTokenExpired(token),
      expiresAt: this.getTokenExpiration(token),
      timeUntilExpiration: this.getTimeUntilExpiration(token),
      age: this.getTokenAge(token),
      userInfo: this.getUserFromToken(token),
      rawPayload: payload,
      validation,
      formattedExpiration: this.formatTokenExpiration(token),
      formattedAge: this.formatTokenAge(token),
    };
  }
}