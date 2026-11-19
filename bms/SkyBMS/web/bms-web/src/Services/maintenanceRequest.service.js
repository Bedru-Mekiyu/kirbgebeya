import axios from "axios";

import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
});

const MaintenanceRequestService = {
  getAllMaintenanceRequests: async () => {
    try {
      const response = await apiService.get("/maintenance-requests");
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  },

  getMaintenanceRequestById: async (id) => {
    try {
      const response = await apiService.get(`/maintenance-requests/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  },

  getMaintenanceRequestByUserId: async (id) => {
    try {
      const response = await apiService.get(`/maintenance-requests/user/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  },

  createMaintenanceRequest: async (newMaintenanceRequest) => {
    try {
      const response = await apiService.post(
        "/maintenance-requests",
        newMaintenanceRequest
      );
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  updateMaintenanceRequest: async (id, updatedMaintenanceRequest) => {
    try {
      const response = await apiService.put(
        `/maintenance-requests/${id}`,
        updatedMaintenanceRequest
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  },

  deleteMaintenanceRequest: async (id) => {
    try {
      const response = await apiService.delete(`/maintenance-requests/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  },
};

export default MaintenanceRequestService;
