import axios from "axios";
import { BASE_URL } from "../Config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const PaymentService = {
  getAllPayments: async () => {
    try {
      const response = await apiService.get("/payments");
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getPaymentById: async (paymentId) => {
    try {
      const response = await apiService.get(`/payments/${paymentId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getPaymentsByLeaseId: async (leaseId) => {
    try {
      const response = await apiService.get(`/payments/lease/${leaseId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  createPayment: async (newPaymentData) => {
    try {
      const response = await apiService.post("/payments", newPaymentData);
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  update: async (paymentId, updatedData) => {
    try {
      const response = await apiService.post(
        `/payments/payment/${paymentId}`,
        updatedData
      );
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  updatePayment: async (paymentId, updatedData) => {
    try {
      const response = await apiService.post(
        `/payments/${paymentId}`,
        updatedData
      );
      return response;
    } catch (error) {
      console.log(error.response.data.message);
      throw new Error(error);
    }
  },

  approvePayment: async (paymentId) => {
    try {
      const response = await apiService.put(`/payments/approve/${paymentId}`);
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  rejectPayment: async (paymentId) => {
    try {
      const response = await apiService.put(`/payments/reject/${paymentId}`);
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  deletePayment: async (paymentId) => {
    try {
      const response = await apiService.delete(`/payments/${paymentId}`);
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default PaymentService;
