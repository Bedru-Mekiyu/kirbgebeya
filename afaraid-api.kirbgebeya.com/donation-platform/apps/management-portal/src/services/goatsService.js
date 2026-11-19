import { apiService } from "./api";
import { API_CONFIG, GOAT_CONFIG } from "../config";

export const goatsService = {
  getGoatTypes: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/types`
      );
      return response;
    } catch (error) {
      return {
        types: GOAT_CONFIG.TYPES.map((type, index) => ({
          id: type,
          name: this.getGoatTypeName(type),
          age: this.getGoatTypeAge(type),
          description: this.getGoatTypeDescription(type),
          prices: {
            USD: GOAT_CONFIG.PRICES.USD[index],
            ETB: GOAT_CONFIG.PRICES.ETB[index],
          },
        })),
      };
    }
  },

  getGoatTypeById: async (id) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/types/${id}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch goat type: ${error.message}`);
    }
  },

  getGoatPricing: async (currency = "USD") => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/pricing`,
        { currency }
      );
      return response;
    } catch (error) {
      const typeIndex = GOAT_CONFIG.TYPES.indexOf("young");
      return {
        pricing: GOAT_CONFIG.TYPES.map((type, index) => ({
          type,
          price:
            currency === "ETB"
              ? GOAT_CONFIG.PRICES.ETB[index]
              : GOAT_CONFIG.PRICES.USD[index],
        })),
      };
    }
  },

  calculateTotalCost: async (goatSelections, currency = "USD") => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.GOATS}/calculate`,
        {
          selections: goatSelections,
          currency,
        }
      );
      return response;
    } catch (error) {
      let total = 0;
      const prices =
        currency === "ETB" ? GOAT_CONFIG.PRICES.ETB : GOAT_CONFIG.PRICES.USD;

      Object.entries(goatSelections).forEach(([type, count]) => {
        const typeIndex = GOAT_CONFIG.TYPES.indexOf(type);
        if (typeIndex !== -1 && count > 0) {
          total += prices[typeIndex] * count;
        }
      });

      return { total };
    }
  },

  getGoatAvailability: async (campaignId) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/availability/${campaignId}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch goat availability: ${error.message}`);
    }
  },

  reserveGoats: async (reservationData) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.GOATS}/reserve`,
        reservationData
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to reserve goats: ${error.message}`);
    }
  },

  releaseReservation: async (reservationId) => {
    try {
      const response = await apiService.delete(
        `${API_CONFIG.ENDPOINTS.GOATS}/reserve/${reservationId}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to release reservation: ${error.message}`);
    }
  },

  getGoatAnalytics: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/analytics`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch goat analytics: ${error.message}`);
    }
  },
  getGoatStats: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/stats`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch goat statistics: ${error.message}`);
    }
  },

  getGoatTypeName: (type) => {
    const names = {
      young: "Young Goat",
      adult: "Adult Goat",
      pregnant: "Pregnant Goat",
      breeding: "Breeding Goat",
    };
    return names[type] || type;
  },

  getGoatTypeAge: (type) => {
    const ages = {
      young: "6-12 months",
      adult: "1-3 years",
      pregnant: "2-4 years",
      breeding: "3-5 years",
    };
    return ages[type] || "Unknown";
  },

  getGoatTypeDescription: (type) => {
    const descriptions = {
      young: "Perfect for starting a family's livestock journey",
      adult: "Ready for breeding and milk production",
      pregnant: "Will provide offspring and immediate milk",
      breeding: "Premium breeding stock for maximum impact",
    };
    return descriptions[type] || "Healthy goat for donation";
  },

  getGoatTypeByIndex: (index) => {
    return GOAT_CONFIG.TYPES[index] || null;
  },

  getGoatPrice: (type, currency = "USD") => {
    const typeIndex = GOAT_CONFIG.TYPES.indexOf(type);
    if (typeIndex === -1) return 0;

    const prices =
      currency === "ETB" ? GOAT_CONFIG.PRICES.ETB : GOAT_CONFIG.PRICES.USD;
    return prices[typeIndex] || 0;
  },

  getGoatPricing: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/pricing`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch goat pricing: ${error.message}`);
    }
  },

  getGoatPricingByCampaign: async (campaignId) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/pricing/${campaignId}`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch goat pricing: ${error.message}`);
    }
  },

  updateGoatPricing: async (pricing) => {
    try {
      const response = await apiService.put(
        `${API_CONFIG.ENDPOINTS.GOATS}/pricing`,
        pricing
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to update goat pricing: ${error.message}`);
    }
  },

  // Get goat analytics
  getGoatAnalytics: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/analytics`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch goat analytics: ${error.message}`);
    }
  },

  // Calculate goats from amount
  calculateGoats: async (amount) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.GOATS}/calculate`,
        { amount }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to calculate goats: ${error.message}`);
    }
  },

  // Get goat donation trends
  getGoatTrends: async (period = "monthly") => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/trends`,
        {
          params: { period },
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch goat trends: ${error.message}`);
    }
  },

  // Get goat impact report
  getImpactReport: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/impact-report`
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch impact report: ${error.message}`);
    }
  },
};

export default goatsService;
