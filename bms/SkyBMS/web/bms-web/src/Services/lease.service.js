import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const LeaseService = {
  getAllLeases: async () => {
    try {
      const response = await apiService.get("/leases");
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getLeaseById: async (leaseId) => {
    try {
      const response = await apiService.get(`/leases/${leaseId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getLeaseByUserId: async (userId) => {
    try {
      const response = await apiService.get(`/leases/user/${userId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  createLease: async (newLeaseData) => {
    try {
      const response = await apiService.post("/leases", newLeaseData);
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  updateLease: async (leaseId, updatedData) => {
    try {
      const response = await apiService.post(`/leases/${leaseId}`, updatedData);
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  deleteLease: async (leaseId, propertyId) => {
    try {
      const response = await apiService.delete(
        `/leases/${leaseId}/${propertyId}`
      );
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getLeaseCount: async () => {
    try {
      const response = await apiService.get("/lease/count");
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  },

  getPendingPaymentsByMonth: async () => {
    try {
      const response = await apiService.get("/pending-payments-by-month");
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getPaidPaymentsByMonth: async () => {
    try {
      const response = await apiService.get("/paid-payments-by-month");
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getLatePaymentsByMonth: async () => {
    try {
      const response = await apiService.get("/late-payments-by-month");
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default LeaseService;
