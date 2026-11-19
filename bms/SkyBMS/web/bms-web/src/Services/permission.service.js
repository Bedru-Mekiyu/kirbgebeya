import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
});

const PermissionService = {
  getAllPermissions: async () => {
    try {
      const response = await apiService.get("/permissions");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPermissionById: async (id) => {
    try {
      const response = await apiService.get(`/permissions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createPermission: async (permissionData) => {
    try {
      const response = await apiService.post("/permissions", permissionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePermission: async (id, permissionData) => {
    try {
      const response = await apiService.put(
        `/permissions/${id}`,
        permissionData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePermission: async (id) => {
    try {
      const response = await apiService.delete(`/permissions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to delete permission");
    }
  },

  getPermissionCount: async () => {
    try {
      const response = await apiService.get("/permissions/count");
      return response.data.count;
    } catch (error) {
      throw error;
    }
  },
};

export default PermissionService;
