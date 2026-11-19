import axios from "axios";

import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
});

const BusinessOwnerService = {
  createBusinessOwner: async (newOwnerData) => {
    try {
      const response = await apiService.post("/business-owners", newOwnerData);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
  getAllBusinessOwners: async () => {
    try {
      const response = await apiService.get("/business-owners");
      return response.data.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  updateBusinessOwner: async (ownerId, newData) => {
    try {
      const response = await apiService.put(
        `/business-owners/${ownerId}`,
        newData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  deleteBusinessOwner: async (ownerId) => {
    try {
      const response = await apiService.delete(`/business-owners/${ownerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default BusinessOwnerService;
