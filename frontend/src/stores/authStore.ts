import { create } from 'zustand';
import type { User } from '@typings/index';
import authService from '@services/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      console.log('Auth response received:', response);

      // Handle roles mapping (backend returns roles array, frontend expects single role)
      let userWithRole = {...response.user};
      if (response.user && Array.isArray(response.user.roles) && response.user.roles.length > 0) {
        // Take the first role as primary role
        userWithRole.role = response.user.roles[0];
      }

      console.log('User with mapped role:', userWithRole);

      set({
        user: userWithRole,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error in store:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  signup: async (email: string, password: string, firstName: string, lastName: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signup({
        email,
        password,
        firstName,
        lastName,
      });
      console.log('Signup response received:', response);

      // Handle roles mapping (backend returns roles array, frontend expects single role)
      let userWithRole = {...response.user};
      if (response.user && Array.isArray(response.user.roles) && response.user.roles.length > 0) {
        // Take the first role as primary role
        userWithRole.role = response.user.roles[0];
      }

      console.log('User with mapped role:', userWithRole);

      set({
        user: userWithRole,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Signup error in store:', error);
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
