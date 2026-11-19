import ENV_CONFIG from "./env";

export interface ApiEndpoints {
  CAMPAIGNS: string;
  CAMPAIGN_UPDATES: string;
  DONATIONS: string;
  USERS: string;
  ROLES: string;
  PERMISSIONS: string;
  AUTH: string;
  PAYMENTS: string;
  REPORTS: string;
  STATS: string;
  CURRENCY: string;
  GOATS: string;
}

export interface ApiConfig {
  BASE_URL: string;
  SOCKET_URL: string;
  ENDPOINTS: ApiEndpoints;
  TIMEOUT: number;
  RETRY_ATTEMPTS: number;
}

export interface CurrencyConfig {
  DEFAULT: string;
  SUPPORTED: string[];
  EXCHANGE_API: string;
}

export interface GoatConfig {
  TYPES: string[];
  PRICES: {
    USD: number[];
    ETB: number[];
  };
}

export interface LocaleConfig {
  DEFAULT: string;
  SUPPORTED: string[];
}

export const API_CONFIG: ApiConfig = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  SOCKET_URL: ENV_CONFIG.SOCKET_URL,
  ENDPOINTS: {
    CAMPAIGNS: ENV_CONFIG.CAMPAIGNS_API,
    CAMPAIGN_UPDATES: ENV_CONFIG.CAMPAIGN_UPDATES_API,
    DONATIONS: ENV_CONFIG.DONATIONS_API,
    USERS: ENV_CONFIG.USERS_API,
    ROLES: ENV_CONFIG.ROLES_API,
    PERMISSIONS: ENV_CONFIG.PERMISSIONS_API,
    AUTH: ENV_CONFIG.AUTH_API,
    PAYMENTS: ENV_CONFIG.PAYMENTS_API,
    REPORTS: ENV_CONFIG.REPORTS_API,
    STATS: ENV_CONFIG.STATS_API,
    CURRENCY: "/currency",
    GOATS: "/goats",
  },
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const CURRENCY_CONFIG: CurrencyConfig = {
  DEFAULT: ENV_CONFIG.DEFAULT_CURRENCY,
  SUPPORTED: ENV_CONFIG.SUPPORTED_CURRENCIES,
  EXCHANGE_API: ENV_CONFIG.CURRENCY_EXCHANGE_API,
};

export const GOAT_CONFIG: GoatConfig = {
  TYPES: ENV_CONFIG.GOAT_TYPES,
  PRICES: {
    USD: ENV_CONFIG.GOAT_PRICES_USD,
    ETB: ENV_CONFIG.GOAT_PRICES_ETB,
  },
};

export const LOCALE_CONFIG: LocaleConfig = {
  DEFAULT: ENV_CONFIG.DEFAULT_LANGUAGE,
  SUPPORTED: ENV_CONFIG.SUPPORTED_LANGUAGES,
};

export { ENV_CONFIG };
