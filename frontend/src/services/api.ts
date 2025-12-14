import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080/api';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface DecodedToken {
  exp: number;
  iat: number;
  roles?: string[];
  sub?: string;
}

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add JWT token
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshed = await this.refreshToken();
            if (refreshed) {
              originalRequest.headers.Authorization = `Bearer ${this.getToken()}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            this.clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        if (error.response?.status === 403) {
          window.location.href = '/unauthorized';
        }

        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private setTokens(token: string, refreshToken: string) {
    console.log('Setting tokens in localStorage');
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    console.log('Tokens set successfully');
  }

  private clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await this.axiosInstance.post('/auth/refresh', {
        refreshToken,
      });

      if (response.data.token && response.data.refreshToken) {
        this.setTokens(response.data.token, response.data.refreshToken);
        return true;
      }

      return false;
    } catch {
      this.clearAuth();
      return false;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log('Checking authentication - token exists:', !!token);
    if (!token) return false;
    const isExpired = this.isTokenExpired(token);
    console.log('Checking authentication - token expired:', isExpired);
    return !isExpired;
  }

  getStoredToken(): string | null {
    return this.getToken();
  }

  setAuth(token: string, refreshToken: string) {
    this.setTokens(token, refreshToken);
  }

  logout() {
    this.clearAuth();
  }

  get<T>(url: string, config?: Record<string, unknown>): Promise<{ data: T }> {
    return this.axiosInstance.get<T>(url, config);
  }

  post<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<{ data: T }> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<{ data: T }> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<{ data: T }> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: Record<string, unknown>): Promise<{ data: T }> {
    return this.axiosInstance.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
