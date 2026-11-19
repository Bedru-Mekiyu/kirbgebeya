import React, { createContext, useContext, useState, useEffect } from "react";
import { localizationService } from "../services";

const LocalizationContext = createContext();

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
};

export const LocalizationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(
    localizationService.getCurrentLanguage()
  );
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    localizationService.initialize();
    setIsRTL(localizationService.getTextDirection() === "rtl");
  }, [currentLanguage]);

  const changeLanguage = (language) => {
    if (localizationService.setLanguage(language)) {
      setCurrentLanguage(language);
      setIsRTL(localizationService.getTextDirection(language) === "rtl");

      document.documentElement.lang = language;
      document.documentElement.dir =
        localizationService.getTextDirection(language);
    }
  };

  const t = (key, params = {}) => {
    return localizationService.t(key, params);
  };

  const getSupportedLanguages = () => {
    return localizationService.getSupportedLanguages();
  };

  const formatDate = (date, options = {}) => {
    return localizationService.formatDate(date, options);
  };

  const formatNumber = (number, options = {}) => {
    return localizationService.formatNumber(number, options);
  };

  const formatCurrency = (amount, currency = "USD", options = {}) => {
    return localizationService.formatCurrency(amount, currency, options);
  };

  const value = {
    currentLanguage,
    isRTL,
    changeLanguage,
    t,
    getSupportedLanguages,
    formatDate,
    formatNumber,
    formatCurrency,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export { LocalizationContext };
export default LocalizationContext;
