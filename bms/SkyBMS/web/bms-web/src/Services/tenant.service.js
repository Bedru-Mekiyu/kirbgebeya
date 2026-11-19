import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
});

const TenantService = {
  getAllTenants: async () => {
    try {
      const response = await apiService.get("/tenants");
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getTenantById: async (tenantId) => {
    try {
      const response = await apiService.get(`/tenants/${tenantId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  createTenant: async (newTenantData) => {
    try {
      const response = await apiService.post("/tenants", newTenantData);
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  updateTenant: async (tenantId, updatedData) => {
    try {
      const response = await apiService.put(
        `/tenants/${tenantId}`,
        updatedData
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  deleteTenant: async (tenantId) => {
    try {
      const response = await apiService.delete(`/tenants/${tenantId}`);
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getTenantCount: async () => {
    try {
      const response = await apiService.get("/tenantcount");
      return response.data.data.tenant_count;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default TenantService;
