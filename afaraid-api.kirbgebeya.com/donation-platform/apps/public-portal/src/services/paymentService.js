import { apiService } from "./api";
import { API_CONFIG } from "../config";

export const paymentService = {
  initializePayment: async (paymentData) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/initialize`,
        paymentData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to initialize payment: ${error.message}`);
    }
  },

  processPayment: async (paymentId, paymentMethod) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/process`,
        {
          paymentId,
          paymentMethod,
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to process payment: ${error.message}`);
    }
  },

  verifyPayment: async (paymentId, transactionId) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/verify`,
        {
          paymentId,
          transactionId,
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to verify payment: ${error.message}`);
    }
  },

  getPaymentStatus: async (paymentId) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/${paymentId}/status`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  },

  cancelPayment: async (paymentId) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/${paymentId}/cancel`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to cancel payment: ${error.message}`);
    }
  },

  refundPayment: async (paymentId, amount, reason) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/${paymentId}/refund`,
        {
          amount,
          reason,
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to refund payment: ${error.message}`);
    }
  },

  getPaymentMethods: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/methods`
      );
      return response;
    } catch (error) {
      return {
        methods: [
          {
            id: "card",
            name: "Credit/Debit Card",
            icon: "credit-card",
            enabled: true,
          },
          {
            id: "bank_transfer",
            name: "Bank Transfer",
            icon: "university",
            enabled: true,
          },
          {
            id: "mobile_money",
            name: "Mobile Money",
            icon: "mobile",
            enabled: true,
          },
          {
            id: "crypto",
            name: "Cryptocurrency",
            icon: "bitcoin",
            enabled: false,
          },
        ],
      };
    }
  },

  validateCard: async (cardData) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/validate-card`,
        cardData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to validate card: ${error.message}`);
    }
  },

  getPaymentHistory: async (userId, params = {}) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/history/${userId}`,
        params
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to get payment history: ${error.message}`);
    }
  },

  createPaymentIntent: async (amount, currency, metadata = {}) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/intent`,
        {
          amount,
          currency,
          metadata,
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  },

  confirmPaymentIntent: async (intentId, paymentMethod) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/intent/${intentId}/confirm`,
        {
          paymentMethod,
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to confirm payment intent: ${error.message}`);
    }
  },

  getPaymentAnalytics: async (params = {}) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.PAYMENTS}/analytics`,
        params
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to get payment analytics: ${error.message}`);
    }
  },

  formatCardNumber: (cardNumber) => {
    return cardNumber
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  },

  formatExpiryDate: (expiryDate) => {
    return expiryDate
      .replace(/\D/g, "")
      .replace(/(.{2})/, "$1/")
      .substring(0, 5);
  },

  validateCardNumber: (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, "");
    if (!/^\d+$/.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  validateExpiryDate: (expiryDate) => {
    const [month, year] = expiryDate.split("/");
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    if (expMonth < 1 || expMonth > 12) return false;

    return true;
  },

  validateCVV: (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  },

  getCardType: (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, "");

    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6/.test(cleaned)) return "discover";

    return "unknown";
  },
};

export default paymentService;
