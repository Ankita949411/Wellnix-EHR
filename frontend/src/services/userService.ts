import { apiService } from "./api";
import {
  ApiResponse,
  UserListResponse,
  User,
  CreateUserDto,
} from "../types/user";

export const userService = {
  getUsers: (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ApiResponse<UserListResponse>> => {
    const validPage = isNaN(page) ? 1 : Math.max(1, Math.floor(page));
    const validLimit = isNaN(limit) ? 10 : Math.max(1, Math.floor(limit));

    const params = new URLSearchParams({
      page: validPage.toString(),
      limit: validLimit.toString(),
      ...(search && search.trim() && { search: search.trim() }),
    });
    return apiService.post(`/users/list`, params);
  },

  getUserById: (id: number): Promise<ApiResponse<User>> => {
    return apiService.get(`/users/${id}`);
  },

  createUser: (userData: CreateUserDto): Promise<ApiResponse<User>> => {
    return apiService.post("/users/create", userData);
  },

  updateUser: (
    id: number,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    return apiService.request(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  deleteUser: (id: number): Promise<ApiResponse<User>> => {
    return apiService.delete(`/users/${id}`);
  },
};
