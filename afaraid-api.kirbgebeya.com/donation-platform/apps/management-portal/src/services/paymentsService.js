import { apiService } from "./api";
import { API_CONFIG } from "../config";

export const paymentsService = {
    getAllPayments: async () => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.PAYMENTS}/all`);
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch payments: ${error.message}`);
        }
    },

    getPaymentById: async (id) => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.PAYMENTS}/${id}`);
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch payment: ${error.message}`);
        }
    },

    getPaymentStats: async () => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.PAYMENTS}/stats`);
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch payment statistics: ${error.message}`);
        }
    },

    updatePaymentStatus: async (id, status) => {
        try {
            const response = await apiService.patch(
                `${API_CONFIG.ENDPOINTS.PAYMENTS}/${id}/status`,
                { status }
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to update payment status: ${error.message}`);
        }
    },

    processRefund: async (id, amount) => {
        try {
            const response = await apiService.post(
                `${API_CONFIG.ENDPOINTS.PAYMENTS}/${id}/refund`,
                { amount }
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to process refund: ${error.message}`);
        }
    },

    downloadReceipt: async (id) => {
        try {
            const response = await apiService.get(
                `${API_CONFIG.ENDPOINTS.PAYMENTS}/${id}/receipt`,
                {
                    responseType: "blob",
                }
            );
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `payment-receipt-${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return response;
        } catch (error) {
            throw new Error(`Failed to download receipt: ${error.message}`);
        }
    },

    searchPayments: async (query) => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.PAYMENTS}/search`, {
                params: { query }
            });
            return response;
        } catch (error) {
            throw new Error(`Failed to search payments: ${error.message}`);
        }
    },

    getRecentPayments: async (limit = 10) => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.PAYMENTS}/recent`, {
                params: { limit }
            });
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch recent payments: ${error.message}`);
        }
    },
};

export default paymentsService;