import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

class BuildingUnitService {
  async getAllBuildingUnits(filter) {
    return apiService.get(`/building-units?${filter}`).then((response) => {
      return response.data.data.data;
    });
  }

  async getAllBuildingUnitsWithoutFilter() {
    return apiService.get(`/building-units-all`).then((response) => {
      return response.data.data;
    });
  }

  async getAllRoomTypes() {
    return apiService.get(`/room-types`).then((response) => {
      return response.data;
    });
  }

  async createBuildingUnit(unitData) {
    return apiService.post("/building-units", unitData).then((response) => {
      return response;
    });
  }

  async getBuildingUnitById(id) {
    return apiService.get(`/building-units/${id}`).then((response) => {
      return response.data;
    });
  }

  async updateBuildingUnit(id, unitData) {
    return apiService
      .post(`/building-units/${id}`, unitData)
      .then((response) => {
        return response.data;
      });
  }

  async deleteBuildingUnit(property_id) {
    return apiService.delete(`/building-units/${property_id}`).then(() => {
      return;
    });
  }

  async getBuildingUnitsCount() {
    return apiService.get("/building-unit/count").then((response) => {
      return response.data;
    });
  }
}

export default new BuildingUnitService();
