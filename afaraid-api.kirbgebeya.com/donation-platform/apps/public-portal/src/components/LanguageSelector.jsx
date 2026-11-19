import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaLanguage } from 'react-icons/fa';
import { useLocalization } from '../contexts/LocalizationContext';

const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, getSupportedLanguages, t } = useLocalization();

  const languages = getSupportedLanguages();

  const getLanguageFlag = (code) => {
    const flags = {
      en: '🇺🇸',
      am: '🇪🇹',
      or: '🇪🇹'
    };
    return flags[code] || '🌍';
  };

  return (
    <div className={`relative ${className}`}>
      <motion.select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {getLanguageFlag(language.code)} {language.nativeName}
          </option>
        ))}
      </motion.select>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaLanguage className="h-4 w-4 text-gray-400" />
        </motion.div>
      </div>
    </div>
  );
};

export default LanguageSelector;
