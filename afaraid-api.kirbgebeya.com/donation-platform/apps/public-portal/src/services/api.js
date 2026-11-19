import axios from "axios";
import { API_CONFIG } from "../config";

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["X-Request-ID"] = Date.now().toString();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem("authToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (!error.response) {
      error.message = "Network error. Please check your connection.";
    }

    return Promise.reject(error);
  }
);

export const apiService = {
  get: async (endpoint, params = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch data");
    }
  },

  post: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to create data");
    }
  },

  put: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.put(endpoint, data);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to update data");
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await apiClient.delete(endpoint);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to delete data");
    }
  },

  patch: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.patch(endpoint, data);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to update data");
    }
  },

  upload: async (endpoint, formData, onProgress) => {
    try {
      const response = await apiClient.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: onProgress,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to upload file");
    }
  },
};

export default apiService;
