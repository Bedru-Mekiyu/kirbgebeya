import { apiService } from "./api";
import { API_CONFIG } from "../config";

export interface User {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  isVerified?: boolean;
  [key: string]: any;
}

export interface CreateUserData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  role?: string;
  [key: string]: any;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  [key: string]: any;
}

export interface UserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  createUser(userData: CreateUserData): Promise<User>;
  updateUser(id: string, userData: UpdateUserData): Promise<User>;
  deleteUser(id: string): Promise<void>;
  searchUsers(query: string): Promise<User[]>;
}

export const userService: UserService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      return await apiService.get<User[]>(`${API_CONFIG.ENDPOINTS.USERS}`);
    } catch (error: any) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      return await apiService.get<User>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
    } catch (error: any) {
      throw new Error(`Failed to fetch user ${id}: ${error.message}`);
    }
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    try {
      return await apiService.post<User>(
        `${API_CONFIG.ENDPOINTS.USERS}`,
        userData
      );
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  updateUser: async (id: string, userData: UpdateUserData): Promise<User> => {
    try {
      return await apiService.put<User>(
        `${API_CONFIG.ENDPOINTS.USERS}/${id}`,
        userData
      );
    } catch (error: any) {
      throw new Error(`Failed to update user ${id}: ${error.message}`);
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
    } catch (error: any) {
      throw new Error(`Failed to delete user ${id}: ${error.message}`);
    }
  },

  searchUsers: async (query: string): Promise<User[]> => {
    try {
      return await apiService.get<User[]>(
        `${API_CONFIG.ENDPOINTS.USERS}?search=${encodeURIComponent(query)}`
      );
    } catch (error: any) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  },
};

export default userService;
