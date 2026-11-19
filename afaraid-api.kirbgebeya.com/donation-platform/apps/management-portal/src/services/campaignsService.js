import { apiService } from "./api";
import { API_CONFIG } from "../config";

export const campaignsService = {
  getAllCampaigns: async (params = {}) => {
    try {
      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.CAMPAIGNS,
        params
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch campaigns: ${error.message}`);
    }
  },

  getCampaignById: async (id) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.CAMPAIGNS}/${id}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch campaign: ${error.message}`);
    }
  },

  createCampaign: async (campaignData) => {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.CAMPAIGNS,
        campaignData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to create campaign: ${error.message}`);
    }
  },

  updateCampaign: async (id, campaignData) => {
    try {
      const response = await apiService.patch(
        `${API_CONFIG.ENDPOINTS.CAMPAIGNS}/${id}`,
        campaignData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to update campaign: ${error.message}`);
    }
  },

  deleteCampaign: async (id) => {
    try {
      const response = await apiService.delete(
        `${API_CONFIG.ENDPOINTS.CAMPAIGNS}/${id}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to delete campaign: ${error.message}`);
    }
  },

  getFeaturedCampaigns: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.CAMPAIGNS}/featured`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch featured campaigns: ${error.message}`);
    }
  },

  getCampaignsByStatus: async (status) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.CAMPAIGNS}/status/${status}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch campaigns by status: ${error.message}`);
    }
  },

  getCampaignsByLocation: async (location) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.CAMPAIGNS}/location/${location}`
      );
      return response;
    } catch (error) {
      throw new Error(
        `Failed to fetch campaigns by location: ${error.message}`
      );
    }
  },

  searchCampaigns: async (query) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.CAMPAIGNS}/search`,
        { q: query }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to search campaigns: ${error.message}`);
    }
  },

  getCampaignStats: async (id) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.CAMPAIGNS}/${id}/stats`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch campaign statistics: ${error.message}`);
    }
  },

  updateCampaignProgress: async (id, progressData) => {
    try {
      const response = await apiService.patch(
        `${API_CONFIG.ENDPOINTS.CAMPAIGNS}/${id}/progress`,
        progressData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to update campaign progress: ${error.message}`);
    }
  },

  addCampaignUpdate: async (updateData) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.CAMPAIGN_UPDATES}`,
        updateData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to add campaign update: ${error.message}`);
    }
  },

  updateCampaignUpdate: async (id, updateData) => {
    try {
      const response = await apiService.patch(
        `${API_CONFIG.ENDPOINTS.CAMPAIGN_UPDATES}/${id}`,
        updateData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to update campaign update: ${error.message}`);
    }
  },

  deleteCampaignUpdate: async (id) => {
    try {
      const response = await apiService.delete(
        `${API_CONFIG.ENDPOINTS.CAMPAIGN_UPDATES}/${id}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to delete campaign update: ${error.message}`);
    }
  },
};

export default campaignsService;
