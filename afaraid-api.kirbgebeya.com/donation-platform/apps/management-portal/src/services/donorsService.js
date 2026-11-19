// services/donorsService.js
import { apiService } from "./api";
import { API_CONFIG } from "../config";

export const donorsService = {
    // Get all donors
    getAllDonors: async () => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.DONATIONS}/donors/all`);
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch donors: ${error.message}`);
        }
    },

    // Get donor by ID
    getDonorById: async (id) => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.DONATIONS}/donors/${id}`);
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch donor: ${error.message}`);
        }
    },

    // Get donor statistics
    getDonorStats: async () => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.DONATIONS}/donors/stats`);
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch donor statistics: ${error.message}`);
        }
    },

    // Search donors
    searchDonors: async (query) => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.DONATIONS}/donors/search`, {
                params: { query }
            });
            return response;
        } catch (error) {
            throw new Error(`Failed to search donors: ${error.message}`);
        }
    },

    // Get donor's donation history
    getDonorDonations: async (donorId) => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.DONATIONS}/donors/${donorId}/donations`);
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch donor donations: ${error.message}`);
        }
    },
};

export default donorsService;