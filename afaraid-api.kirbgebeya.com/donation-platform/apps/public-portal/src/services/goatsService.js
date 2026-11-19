import { apiService } from "./api";
import { API_CONFIG, GOAT_CONFIG } from "../config";

export const goatsService = {
  getGoatTypes: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/pricing`
      );

      const goatTypes = [
        {
          id: "goat",
          name: "Goat",
          age: "6 months - 3 years",
          description: "Healthy goat perfect for supporting families",
          prices: {
            USD: Math.round(response.goatPrice / 85),
            ETB: response.goatPrice,
          },
          impact: "Provides sustainable livelihood for families",
        },
      ];

      return { types: goatTypes };
    } catch (error) {
      console.error("Error fetching goat pricing:", error);
      return {
        types: [
          {
            id: "goat",
            name: "Goat",
            age: "6 months - 3 years",
            description: "Healthy goat perfect for supporting families",
            prices: {
              USD: GOAT_CONFIG.PRICES.USD[0],
              ETB: GOAT_CONFIG.PRICES.ETB[0],
            },
            impact: "Provides sustainable livelihood for families",
          },
        ],
      };
    }
  },

  getGoatTypesByCampaign: async (campaignId) => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.GOATS}/pricing/${campaignId}`
      );

      const goatTypes = [
        {
          id: "goat",
          name: "Goat",
          age: "6 months - 3 years",
          description: "Healthy goat perfect for supporting families",
          prices: {
            USD: Math.round(response.goatPrice / 85),
            ETB: response.goatPrice,
          },
          impact: "Provides sustainable livelihood for families",
        },
      ];

      return { types: goatTypes };
    } catch (error) {
      console.error("Error fetching campaign-specific goat pricing:", error);

      try {
        return await goatsService.getGoatTypes();
      } catch (fallbackError) {
        console.error("Error fetching fallback goat pricing:", fallbackError);

        return {
          types: [
            {
              id: "goat",
              name: "Goat",
              age: "6 months - 3 years",
              description: "Healthy goat perfect for supporting families",
              prices: {
                USD: GOAT_CONFIG.PRICES.USD[0],
                ETB: GOAT_CONFIG.PRICES.ETB[0],
              },
              impact: "Provides sustainable livelihood for families",
            },
          ],
        };
      }
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
      return {
        pricing: [
          {
            type: "goat",
            price:
              currency === "ETB"
                ? GOAT_CONFIG.PRICES.ETB[0]
                : GOAT_CONFIG.PRICES.USD[0],
          },
        ],
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
      const price =
        currency === "ETB"
          ? GOAT_CONFIG.PRICES.ETB[0]
          : GOAT_CONFIG.PRICES.USD[0];

      Object.entries(goatSelections).forEach(([type, count]) => {
        if (type === "goat" && count > 0) {
          total += price * count;
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
      goat: "Goat",
    };
    return names[type] || type;
  },

  getGoatTypeAge: (type) => {
    const ages = {
      goat: "6 months - 3 years",
    };
    return ages[type] || "Unknown";
  },

  getGoatTypeDescription: (type) => {
    const descriptions = {
      goat: "Healthy goat perfect for supporting families",
    };
    return descriptions[type] || "Healthy goat for donation";
  },

  getGoatPrice: async (type, currency = "USD") => {
    try {
      // First try to get from database
      const pricing = await goatsService.getGoatPricing(currency);
      const goatPrice = pricing.pricing?.find((item) => item.type === type);
      if (goatPrice) {
        return goatPrice.price;
      }
    } catch (error) {
      console.warn(
        "Failed to fetch price from database, using fallback:",
        error
      );
    }

    if (type === "goat") {
      return currency === "ETB"
        ? GOAT_CONFIG.PRICES.ETB[0]
        : GOAT_CONFIG.PRICES.USD[0];
    }
    return 0;
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
