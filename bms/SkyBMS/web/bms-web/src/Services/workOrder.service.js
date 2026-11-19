import axios from "axios";
import { BASE_URL } from "../Config"; // Adjust the import path as needed

// Create an Axios instance with the base URL
const apiService = axios.create({
  baseURL: BASE_URL,
});

const WorkOrderService = {
  getAllWorkOrders: async () => {
    try {
      const response = await apiService.get("/work-orders");
      return response.data.workOrders;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch work orders"
      );
    }
  },

  getWorkOrderById: async (id) => {
    try {
      const response = await apiService.get(`/work-orders/${id}`);
      return response.data.workOrder;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch work order"
      );
    }
  },

  createWorkOrder: async (newWorkOrder) => {
    try {
      const response = await apiService.post("/work-orders", newWorkOrder);
      return response.data.workOrder;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create work order"
      );
    }
  },

  updateWorkOrder: async (id, updatedWorkOrder) => {
    try {
      const response = await apiService.put(
        `/work-orders/${id}`,
        updatedWorkOrder
      );
      return response.data.workOrder;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to update work order"
      );
    }
  },

  deleteWorkOrder: async (id) => {
    try {
      await apiService.delete(`/work-orders/${id}`);
      return;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to delete work order"
      );
    }
  },

  // Mark a work order as completed
  completeWorkOrder: async (id) => {
    try {
      const response = await apiService.patch(`/work-orders/${id}/complete`);
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to complete work order"
      );
    }
  },

  // Mark a work order as canceled
  cancelWorkOrder: async (id) => {
    try {
      const response = await apiService.patch(`/work-orders/${id}/cancel`);
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to cancel work order"
      );
    }
  },
};

export default WorkOrderService;
