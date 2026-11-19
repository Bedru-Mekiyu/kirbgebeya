import { apiService } from "./api";
import { API_CONFIG } from "../config";

export const donationsService = {
  // Create new donation
  createDonation: async (donationData) => {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.DONATIONS,
        donationData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to create donation: ${error.message}`);
    }
  },

  // Get donation by ID
  getDonationById: async (id) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/${id}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch donation: ${error.message}`);
    }
  },

  validateDonorIdentity: async (donorIdentityNumber) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/validate/${donorIdentityNumber}`
      );
      return response;
    } catch (error) {
      throw new Error(`Donor not found: ${error.message}`);
    }
  },

  getUserDonations: async (userId) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/user/${userId}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch user donations: ${error.message}`);
    }
  },

  getDonorDashboard: async (donorIdentityNumber) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/dashboard/${donorIdentityNumber}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to load dashboard: ${error.message}`);
    }
  },

  getCampaignDonations: async (campaignId) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/campaign/${campaignId}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch campaign donations: ${error.message}`);
    }
  },

  updateDonationStatus: async (id, status) => {
    try {
      const response = await apiService.patch(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/${id}/status`,
        { status }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to update donation status: ${error.message}`);
    }
  },

  cancelDonation: async (id) => {
    try {
      const response = await apiService.patch(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/${id}/cancel`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to cancel donation: ${error.message}`);
    }
  },

  getDonationReceipt: async (id) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/${id}/receipt`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch donation receipt: ${error.message}`);
    }
  },

  downloadDonationReceipt: async (id) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/${id}/receipt/download`,
        {
          responseType: "blob",
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to download donation receipt: ${error.message}`);
    }
  },

  getDonationStats: async (params = {}) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/stats`,
        params
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch donation statistics: ${error.message}`);
    }
  },

  getRecentDonations: async (limit = 10) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/recent`,
        { limit }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch recent donations: ${error.message}`);
    }
  },

  createRecurringDonation: async (donationData) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/recurring`,
        donationData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to create recurring donation: ${error.message}`);
    }
  },

  updateRecurringDonation: async (id, donationData) => {
    try {
      const response = await apiService.put(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/recurring/${id}`,
        donationData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to update recurring donation: ${error.message}`);
    }
  },

  cancelRecurringDonation: async (id) => {
    try {
      const response = await apiService.patch(
        `${API_CONFIG.ENDPOINTS.DONATIONS}/recurring/${id}/cancel`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to cancel recurring donation: ${error.message}`);
    }
  },
};

export default donationsService;
