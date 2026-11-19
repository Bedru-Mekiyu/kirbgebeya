import { apiService } from "./api";
import { API_CONFIG, CURRENCY_CONFIG } from "../config";

export const currencyService = {
  getExchangeRates: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.CURRENCY}/rates`
      );
      return response;
    } catch (error) {
      try {
        const response = await fetch(CURRENCY_CONFIG.EXCHANGE_API);
        const data = await response.json();
        return data;
      } catch (fallbackError) {
        throw new Error(`Failed to fetch exchange rates: ${error.message}`);
      }
    }
  },

  convertCurrency: async (amount, fromCurrency, toCurrency) => {
    try {
      const response = await apiService.post(
        `${API_CONFIG.ENDPOINTS.CURRENCY}/convert`,
        {
          amount,
          from: fromCurrency,
          to: toCurrency,
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to convert currency: ${error.message}`);
    }
  },

  getSupportedCurrencies: async () => {
    try {
      const response = await apiService.get(
        `${API_CONFIG.ENDPOINTS.CURRENCY}/supported`
      );
      return response;
    } catch (error) {
      return {
        currencies: CURRENCY_CONFIG.SUPPORTED.map((code) => ({
          code,
          name: code === "USD" ? "US Dollar" : "Ethiopian Birr",
          symbol: code === "USD" ? "$" : "ETB",
        })),
      };
    }
  },

  formatCurrency: (
    amount,
    currency = CURRENCY_CONFIG.DEFAULT,
    locale = "en-US"
  ) => {
    const currencySymbols = {
      USD: "$",
      ETB: "ETB",
    };

    const currencyNames = {
      USD: "USD",
      ETB: "ETB",
    };

    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      const symbol = currencySymbols[currency] || currency;
      return `${symbol}${amount.toLocaleString()}`;
    }
  },

  getCurrencySymbol: (currency) => {
    const symbols = {
      USD: "$",
      ETB: "ETB",
    };
    return symbols[currency] || currency;
  },

  getCurrencyName: (currency) => {
    const names = {
      USD: "US Dollar",
      ETB: "Ethiopian Birr",
    };
    return names[currency] || currency;
  },

  isValidCurrency: (currency) => {
    return CURRENCY_CONFIG.SUPPORTED.includes(currency);
  },

  getDefaultCurrency: () => {
    return CURRENCY_CONFIG.DEFAULT;
  },

  getSupportedCurrenciesList: () => {
    return CURRENCY_CONFIG.SUPPORTED;
  },
};

export default currencyService;
