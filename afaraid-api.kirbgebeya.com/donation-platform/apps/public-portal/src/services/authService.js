import { apiService } from "./api";
import { API_CONFIG } from "../config";

export const authService = {
  register: async (userData) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/register`,
        userData
      );

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to register: ${error.message}`);
    }
  },

  login: async (credentials) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/login`,
        credentials
      );

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await apiService.post(`${API_CONFIG.ENDPOINTS.AUTH}/logout`);
      }
    } catch (error) {
      console.warn("Logout API call failed:", error.message);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.AUTH}/me`);
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error) {
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        return { user: JSON.parse(cachedUser) };
      }
      throw new Error(`Failed to get current user: ${error.message}`);
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await apiService.put(
        `${API_CONFIG.ENDPOINTS.AUTH}/profile`,
        userData
      );
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/change-password`,
        passwordData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/forgot-password`,
        { email }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to send reset email: ${error.message}`);
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/reset-password`,
        {
          token,
          password: newPassword,
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to reset password: ${error.message}`);
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/verify-email`,
        { token }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to verify email: ${error.message}`);
    }
  },

  resendVerification: async (email) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/resend-verification`,
        { email }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to resend verification: ${error.message}`);
    }
  },

  refreshToken: async () => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/refresh`
      );

      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("authToken");
    return !!token;
  },

  getStoredUser: () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  getStoredToken: () => {
    return localStorage.getItem("authToken");
  },

  validateToken: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.AUTH}/validate`
      );
      return response.valid;
    } catch (error) {
      return false;
    }
  },

  socialLogin: async (provider, token) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.AUTH}/social/${provider}`,
        { token }
      );

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to login with ${provider}: ${error.message}`);
    }
  },

  deleteAccount: async (password) => {
    try {
      const response = await apiService.delete(
        `${API_CONFIG.ENDPOINTS.AUTH}/account`,
        { password }
      );

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      return response;
    } catch (error) {
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  },
};

export default authService;
