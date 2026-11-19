import axios, { type AxiosError, type AxiosProgressEvent } from "axios";
import { API_CONFIG } from "../config";

interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

function extractData<T>(res: ApiResponse<T> | T): T {
  return (res as ApiResponse<T>).data ?? (res as T);
}

function getAuthToken() {
  return localStorage.getItem("authToken");
}

export const apiService = {
  get: async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    try {
      const res = await axios.get<ApiResponse<T>>(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        {
          params,
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return extractData(res.data);
    } catch (err) {
      throw new Error((err as AxiosError).message || "Failed to fetch data");
    }
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    try {
      const res = await axios.post<ApiResponse<T>>(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return extractData(res.data);
    } catch (err) {
      throw new Error((err as AxiosError).message || "Failed to post data");
    }
  },

  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    try {
      const res = await axios.put<ApiResponse<T>>(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return extractData(res.data);
    } catch (err) {
      throw new Error((err as AxiosError).message || "Failed to update data");
    }
  },

  patch: async <T>(endpoint: string, data?: any): Promise<T> => {
    try {
      const res = await axios.patch<ApiResponse<T>>(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return extractData(res.data);
    } catch (err) {
      throw new Error((err as AxiosError).message || "Failed to patch data");
    }
  },

  delete: async <T>(endpoint: string, data?: any): Promise<T> => {
    try {
      const res = await axios.delete<ApiResponse<T>>(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        {
          data,
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return extractData(res.data);
    } catch (err) {
      throw new Error((err as AxiosError).message || "Failed to delete data");
    }
  },

  upload: async <T>(
    endpoint: string,
    formData: FormData,
    onProgress?: (e: AxiosProgressEvent) => void
  ): Promise<T> => {
    try {
      const res = await axios.post<ApiResponse<T>>(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        formData,
        {
          onUploadProgress: onProgress,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return extractData(res.data);
    } catch (err) {
      throw new Error((err as AxiosError).message || "Failed to upload file");
    }
  },
};

export default apiService;
