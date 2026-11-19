import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const ProfileService = {
  updateProfile: async (userId, updatedData) => {
    try {
      const response = await apiService.post(`/profile/${userId}`, updatedData);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default ProfileService;
