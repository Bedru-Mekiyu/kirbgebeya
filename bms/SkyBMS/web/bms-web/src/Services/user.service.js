import axios from "axios";

import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
});

const UserService = {
  getAllUsers: async () => {
    try {
      const response = await apiService.get("/users");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await apiService.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await apiService.post("/users", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await apiService.put(`/users/${id}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await apiService.delete(`/users/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to create work order");
    }
  },

  getUserCount: async () => {
    try {
      const response = await apiService.get("/user/count");
      return response.data.count;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;
