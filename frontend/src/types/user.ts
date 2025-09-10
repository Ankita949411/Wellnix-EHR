export enum UserRole {
  ADMIN = "admin",
  DOCTOR = "doctor",
  NURSE = "nurse",
  SUPER_ADMIN = "super_admin",
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  licenseNumber?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  licenseNumber?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}