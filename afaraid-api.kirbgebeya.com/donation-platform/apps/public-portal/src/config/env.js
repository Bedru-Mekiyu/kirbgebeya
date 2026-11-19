export const ENV_CONFIG = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  APP_NAME: import.meta.env.VITE_APP_NAME || "AfarAid",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",

  CAMPAIGNS_API: import.meta.env.VITE_CAMPAIGNS_API || "/campaigns",
  DONATIONS_API: import.meta.env.VITE_DONATIONS_API || "/donations",
  USERS_API: import.meta.env.VITE_USERS_API || "/users",
  AUTH_API: import.meta.env.VITE_AUTH_API || "/auth",
  PAYMENTS_API: import.meta.env.VITE_PAYMENTS_API || "/payments",
  REPORTS_API: import.meta.env.VITE_REPORTS_API || "/reports",
  STATS_API: import.meta.env.VITE_STATS_API || "/stats",

  PAYMENT_GATEWAY_URL:
    import.meta.env.VITE_PAYMENT_GATEWAY_URL ||
    "https://api.payment-gateway.com",
  PAYMENT_PUBLIC_KEY:
    import.meta.env.VITE_PAYMENT_PUBLIC_KEY || "pk_test_your_public_key_here",
  PAYMENT_SECRET_KEY:
    import.meta.env.VITE_PAYMENT_SECRET_KEY || "sk_test_your_secret_key_here",

  DEFAULT_CURRENCY: import.meta.env.VITE_DEFAULT_CURRENCY || "USD",
  SUPPORTED_CURRENCIES: (
    import.meta.env.VITE_SUPPORTED_CURRENCIES || "USD,ETB"
  ).split(","),
  CURRENCY_EXCHANGE_API:
    import.meta.env.VITE_CURRENCY_EXCHANGE_API ||
    "https://api.exchangerate-api.com/v4/latest/USD",

  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || "en",
  SUPPORTED_LANGUAGES: (
    import.meta.env.VITE_SUPPORTED_LANGUAGES || "en,am,or"
  ).split(","),

  GOAT_TYPES: (import.meta.env.VITE_GOAT_TYPES || "young,adult").split(","),
  GOAT_PRICES_USD: (import.meta.env.VITE_GOAT_PRICES_USD || "150,200")
    .split(",")
    .map(Number),
  GOAT_PRICES_ETB: (import.meta.env.VITE_GOAT_PRICES_ETB || "4500,6000")
    .split(",")
    .map(Number),

  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === "true",
  ENABLE_SOCIAL_SHARING: import.meta.env.VITE_ENABLE_SOCIAL_SHARING === "true",
  ENABLE_RECURRING_DONATIONS:
    import.meta.env.VITE_ENABLE_RECURRING_DONATIONS === "true",

  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === "true",
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || "debug",
};

export default ENV_CONFIG;
