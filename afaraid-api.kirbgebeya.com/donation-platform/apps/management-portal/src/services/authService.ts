import { apiService } from "./api";
import { API_CONFIG } from "../config";

// === Types ===
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  isVerified?: boolean;
  [key: string]: any;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name?: string;
  [key: string]: any;
}

export interface PasswordData {
  currentPassword?: string;
  password: string;
  passwordConfirmation?: string;
}

export interface AuthService {
  register(userData: RegisterData): Promise<AuthResponse>;
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<{ user: User }>;
  updateProfile(userData: Partial<User>): Promise<{ user: User }>;
  changePassword(passwordData: PasswordData): Promise<any>;
  forgotPassword(email: string): Promise<any>;
  resetPassword(token: string, newPassword: string): Promise<any>;
  verifyEmail(token: string): Promise<any>;
  resendVerification(email: string): Promise<any>;
  refreshToken(): Promise<{ token: string }>;
  isAuthenticated(): boolean;
  getStoredUser(): User | null;
  getStoredToken(): string | null;
  validateToken(): Promise<boolean>;
  socialLogin(
    provider: "google" | "facebook",
    token: string
  ): Promise<AuthResponse>;
  deleteAccount(password: string): Promise<any>;
}

export const authService: AuthService = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>(
        `${API_CONFIG.ENDPOINTS.AUTH}/register`,
        userData
      );

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error: any) {
      throw new Error(`Failed to register: ${error.message}`);
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>(
        `${API_CONFIG.ENDPOINTS.AUTH}/login`,
        credentials
      );

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error: any) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await apiService.post(`${API_CONFIG.ENDPOINTS.AUTH}/logout`);
      }
    } catch (error: any) {
      console.warn("Logout API call failed:", error.message);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    try {
      const response = await apiService.get<{ user: User }>(
        `${API_CONFIG.ENDPOINTS.AUTH}/me`
      );
      localStorage.setItem("user", JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        return { user: JSON.parse(cachedUser) };
      }
      throw new Error(`Failed to get current user: ${error.message}`);
    }
  },

  updateProfile: async (userData: Partial<User>): Promise<{ user: User }> => {
    try {
      const response = await apiService.put<{ user: User }>(
        `${API_CONFIG.ENDPOINTS.AUTH}/profile`,
        userData
      );
      localStorage.setItem("user", JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  changePassword: async (passwordData: PasswordData): Promise<any> => {
    try {
      return await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/change-password`,
        passwordData
      );
    } catch (error: any) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  },

  forgotPassword: async (email: string): Promise<any> => {
    try {
      return await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/forgot-password`,
        { email }
      );
    } catch (error: any) {
      throw new Error(`Failed to send reset email: ${error.message}`);
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<any> => {
    try {
      return await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/reset-password`,
        {
          token,
          password: newPassword,
        }
      );
    } catch (error: any) {
      throw new Error(`Failed to reset password: ${error.message}`);
    }
  },

  verifyEmail: async (token: string): Promise<any> => {
    try {
      return await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/verify-email`,
        { token }
      );
    } catch (error: any) {
      throw new Error(`Failed to verify email: ${error.message}`);
    }
  },

  resendVerification: async (email: string): Promise<any> => {
    try {
      return await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/resend-verification`,
        { email }
      );
    } catch (error: any) {
      throw new Error(`Failed to resend verification: ${error.message}`);
    }
  },

  refreshToken: async (): Promise<{ token: string }> => {
    try {
      const response = await apiService.post<{ token: string }>(
        `${API_CONFIG.ENDPOINTS.AUTH}/refresh`
      );

      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      return response;
    } catch (error: any) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("authToken");
    return !!token;
  },

  getStoredUser: (): User | null => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  validateToken: async (): Promise<boolean> => {
    try {
      const response = await apiService.get<{ valid: boolean }>(
        `${API_CONFIG.ENDPOINTS.AUTH}/validate`
      );
      return response.valid;
    } catch {
      return false;
    }
  },

  socialLogin: async (
    provider: "google" | "facebook",
    token: string
  ): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>(
        `${API_CONFIG.ENDPOINTS.AUTH}/social/${provider}`,
        { token }
      );

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error: any) {
      throw new Error(`Failed to login with ${provider}: ${error.message}`);
    }
  },

  deleteAccount: async (password: string): Promise<any> => {
    try {
      const response = await apiService.delete<any>(
        `${API_CONFIG.ENDPOINTS.AUTH}/account`,
        {
          password,
        }
      );

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      return response;
    } catch (error: any) {
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  },
};

export default authService;
