import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
});

const MaintenanceContractorService = {
  getAllMaintenanceContractors: async () => {
    try {
      const response = await apiService.get("/maintenance-contractors");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response.data.error || "Failed to fetch maintenance contractors"
      );
    }
  },

  getMaintenanceContractorById: async (id) => {
    try {
      const response = await apiService.get(`/maintenance-contractors/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response.data.error || "Failed to fetch maintenance contractor"
      );
    }
  },

  createMaintenanceContractor: async (newMaintenanceContractor) => {
    try {
      const response = await apiService.post(
        "/maintenance-contractors",
        newMaintenanceContractor
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response.data.message || "Failed to create maintenance contractor"
      );
    }
  },

  updateMaintenanceContractor: async (id, updatedMaintenanceContractor) => {
    try {
      const response = await apiService.put(
        `/maintenance-contractors/${id}`,
        updatedMaintenanceContractor
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response.data.error || "Failed to update maintenance contractor"
      );
    }
  },

  deleteMaintenanceContractor: async (id) => {
    try {
      await apiService.delete(`/maintenance-contractors/${id}`);
      return;
    } catch (error) {
      throw new Error(
        error.response.data.error || "Failed to delete maintenance contractor"
      );
    }
  },
};

export default MaintenanceContractorService;
