export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export type UserRole = 'ADMIN' | 'MEMBER' | 'TRAINER' | 'STAFF';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface EmailVerificationRequest {
  email: string;
  code: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export interface GymClass {
  id: string;
  name: string;
  description: string;
  maxCapacity: number;
  currentEnrollment: number;
  schedule: ClassSchedule[];
}

export interface ClassSchedule {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface KPIMetrics {
  totalMembers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  classUtilization: number;
}
