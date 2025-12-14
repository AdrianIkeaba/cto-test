import apiClient from './api';
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  EmailVerificationRequest,
} from '@typings/index';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data.accessToken && response.data.refreshToken) {
      apiClient.setAuth(response.data.accessToken, response.data.refreshToken);
    }
    return response.data;
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.data.accessToken && response.data.refreshToken) {
      apiClient.setAuth(response.data.accessToken, response.data.refreshToken);
    }
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } finally {
      apiClient.logout();
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      '/auth/password-reset/request',
      data
    );
    return response.data;
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      '/auth/password-reset/confirm',
      data
    );
    return response.data;
  }

  async verifyEmail(data: EmailVerificationRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      '/auth/verify-email',
      data
    );
    return response.data;
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      '/auth/resend-verification',
      { email }
    );
    return response.data;
  }
}

export const authService = new AuthService();
export default authService;
