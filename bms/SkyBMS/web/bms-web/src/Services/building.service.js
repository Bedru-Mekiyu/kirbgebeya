import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

class BuildingService {
  async getAllBuildings() {
    try {
      const response = await apiService.get("/buildings");
      return response.data;
    } catch (error) {
      console.error("Error fetching all buildings:", error);
      throw error;
    }
  }

  async createBuilding(buildingData) {
    try {
      const response = await apiService.post("/buildings", buildingData);
      return response;
    } catch (error) {
      throw error.response.data.message;
    }
  }

  async getBuildingById(id) {
    try {
      const response = await apiService.get(`/buildings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  }

  async updateBuilding(id, buildingData) {
    try {
      const response = await apiService.post(`/buildings/${id}`, buildingData);
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  }

  async deleteBuilding(id) {
    try {
      await apiService.delete(`/buildings/${id}`);
    } catch (error) {
      throw error.response.data.message;
    }
  }
}

export default new BuildingService();
