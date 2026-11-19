import axios from "axios";

import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
});

const BusinessTypeService = {
  getAllBusinessTypes: async () => {
    try {
      const response = await apiService.get("/business-types");
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default BusinessTypeService;
