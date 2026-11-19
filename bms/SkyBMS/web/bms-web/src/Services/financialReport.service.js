import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const FinancialReportService = {
  getAllReports: async (filter) => {
    try {
      const response = await apiService.get("/financial-report", {
        params: filter,
      });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
          "An error occurred while fetching reports"
      );
    }
  },
};

export default FinancialReportService;
