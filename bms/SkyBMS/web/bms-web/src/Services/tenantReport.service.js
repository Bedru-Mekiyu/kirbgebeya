import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const TenantReportService = {
  getAllReports: async (filter) => {
    try {
      const response = await apiService.get("/tenant-report", {
        params: filter,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching reports"
      );
    }
  },

  getReportById: async (reportId) => {
    try {
      const response = await apiService.get(`/tenant-report/${reportId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching the report"
      );
    }
  },

  getReportsByTenantId: async (tenantId) => {
    try {
      const response = await apiService.get(
        `/tenant-report/tenant/${tenantId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching reports for the tenant"
      );
    }
  },

  createReport: async (newReportData) => {
    try {
      const response = await apiService.post("/tenant-report", newReportData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while creating the report"
      );
    }
  },

  updateReport: async (reportId, updatedData) => {
    try {
      const response = await apiService.put(
        `/tenant-report/${reportId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while updating the report"
      );
    }
  },

  deleteReport: async (reportId) => {
    try {
      const response = await apiService.delete(`/tenant-report/${reportId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while deleting the report"
      );
    }
  },
};

export default TenantReportService;
