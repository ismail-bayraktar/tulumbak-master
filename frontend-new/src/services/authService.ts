import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  /**
   * Register new user account
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  /**
   * Verify token validity
   */
  async verifyToken(): Promise<{ valid: boolean }> {
    try {
      const response = await apiClient.get('/api/user/verify');
      return response.data;
    } catch (error) {
      return { valid: false };
    }
  },
};
