import axios from "axios";

import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
});

const BusinessService = {
  getAllBusinesses: async () => {
    try {
      const response = await apiService.get("/businesses");
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getBusinessById: async (businessId) => {
    try {
      const response = await apiService.get(`/businesses/${businessId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  createBusiness: async (newBusinessData) => {
    try {
      const response = await apiService.post("/businesses", newBusinessData);
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  updateBusiness: async (businessId, updatedData) => {
    try {
      const response = await apiService.put(
        `/businesses/${businessId}`,
        updatedData
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  deleteBusiness: async (businessId) => {
    try {
      const response = await apiService.delete(`/businesses/${businessId}`);
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default BusinessService;
