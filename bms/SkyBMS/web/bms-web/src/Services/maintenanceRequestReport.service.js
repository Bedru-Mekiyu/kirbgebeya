import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const MaintenanceRequestReportService = {
  getAllReports: async (filter) => {
    try {
      const response = await apiService.get("/maintenance-request-report", {
        params: filter,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
          "An error occurred while fetching reports"
      );
    }
  },
};

export default MaintenanceRequestReportService;
