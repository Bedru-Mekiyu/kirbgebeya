import { apiService } from "./api";
import { API_CONFIG } from "../config";

export const statsService = {
  getStats: async () => {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.STATS);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch stats: ${error.message}`);
    }
  },

  updateStats: async (statsData) => {
    try {
      const response = await apiService.put(
        API_CONFIG.ENDPOINTS.STATS,
        statsData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to update stats: ${error.message}`);
    }
  },
};

export default statsService;
