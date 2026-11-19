import React, { createContext, useContext, useState, useEffect } from "react";
import { currencyService } from "../services";

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(
    currencyService.getDefaultCurrency()
  );
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExchangeRates();
  }, []);

  const loadExchangeRates = async () => {
    setLoading(true);
    setError(null);

    try {
      const rates = await currencyService.getExchangeRates();
      setExchangeRates(rates.rates || rates);
    } catch (err) {
      setError(err.message);
      console.warn("Failed to load exchange rates:", err);
    } finally {
      setLoading(false);
    }
  };

  const changeCurrency = (currency) => {
    if (currencyService.isValidCurrency(currency)) {
      setCurrentCurrency(currency);
      localStorage.setItem("selectedCurrency", currency);
    }
  };

  const convertAmount = (
    amount,
    fromCurrency = "USD",
    toCurrency = currentCurrency
  ) => {
    if (fromCurrency === toCurrency) return amount;

    const rates = exchangeRates;
    if (!rates[fromCurrency] || !rates[toCurrency]) {
      const fallbackRates = {
        USD: 1,
        ETB: 30,
      };
      return (amount * fallbackRates[toCurrency]) / fallbackRates[fromCurrency];
    }

    return (amount * rates[toCurrency]) / rates[fromCurrency];
  };

  const formatAmount = (amount, currency = currentCurrency) => {
    return currencyService.formatCurrency(amount, currency);
  };

  const getCurrencySymbol = (currency = currentCurrency) => {
    return currencyService.getCurrencySymbol(currency);
  };

  const getCurrencyName = (currency = currentCurrency) => {
    return currencyService.getCurrencyName(currency);
  };

  const getSupportedCurrencies = () => {
    return currencyService.getSupportedCurrenciesList();
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency && currencyService.isValidCurrency(savedCurrency)) {
      setCurrentCurrency(savedCurrency);
    }
  }, []);

  const value = {
    currentCurrency,
    exchangeRates,
    loading,
    error,
    changeCurrency,
    convertAmount,
    formatAmount,
    getCurrencySymbol,
    getCurrencyName,
    getSupportedCurrencies,
    loadExchangeRates,
    isValidCurrency: currencyService.isValidCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext };
export default CurrencyContext;
