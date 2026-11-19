import React from 'react';
import { motion } from 'framer-motion';
import { FaDollarSign, FaCoins } from 'react-icons/fa';
import { useCurrency } from '../contexts/CurrencyContext';
import { useLocalization } from '../contexts/LocalizationContext';

const CurrencySelector = ({ className = '' }) => {
  const { currentCurrency, changeCurrency, getSupportedCurrencies, getCurrencySymbol } = useCurrency();
  const { t } = useLocalization();

  const currencies = getSupportedCurrencies().map(code => ({
    code,
    symbol: getCurrencySymbol(code),
    name: code === 'USD' ? t('currency.usd') : t('currency.etb')
  }));

  const getCurrencyIcon = (currency) => {
    return currency === 'USD' ? FaDollarSign : FaCoins;
  };

  return (
    <div className={`relative ${className}`}>
      <motion.select
        value={currentCurrency}
        onChange={(e) => changeCurrency(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {currencies.map((currency) => {
          const IconComponent = getCurrencyIcon(currency.code);
          return (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.name}
            </option>
          );
        })}
      </motion.select>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {React.createElement(getCurrencyIcon(currentCurrency), {
            className: "h-4 w-4 text-gray-400"
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default CurrencySelector;
