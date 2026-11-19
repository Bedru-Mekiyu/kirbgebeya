import axios from "axios";

import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
});

const RoleService = {
  getAllRoles: async () => {
    try {
      const response = await apiService.get("/roles");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRoleById: async (id) => {
    try {
      const response = await apiService.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createRole: async (roleData) => {
    try {
      const response = await apiService.post("/roles", roleData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateRole: async (id, roleData) => {
    try {
      const response = await apiService.put(`/roles/${id}`, roleData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteRole: async (id) => {
    try {
      const response = await apiService.delete(`/roles/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to create work order");
    }
  },

  getRoleCount: async () => {
    try {
      const response = await apiService.get("/role/count");
      return response.data.count;
    } catch (error) {
      throw error;
    }
  },
};

export default RoleService;
