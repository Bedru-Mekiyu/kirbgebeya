# AfarAid - Donation Management System

A professional donation management system focused on providing sustainable livestock (goats) to families in need.

## Features

- **Multi-language Support**: English, Amharic, and Oromo
- **Multi-currency Support**: USD and ETB (Ethiopian Birr)
- **Goat-specific Donations**: Four types of goats with different pricing
- **Advanced Animations**: Professional UI with Framer Motion
- **Responsive Design**: Works on all devices
- **Real-time Currency Conversion**: Automatic exchange rate updates
- **Campaign Management**: Create and manage donation campaigns
- **Donor Dashboard**: Track donations and impact

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Routing**: React Router
- **State Management**: React Context API

## Environment Setup

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Environment Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=AfarAid
VITE_APP_VERSION=1.0.0

# API Endpoints
VITE_CAMPAIGNS_API=/campaigns
VITE_DONATIONS_API=/donations
VITE_USERS_API=/users
VITE_AUTH_API=/auth
VITE_PAYMENTS_API=/payments
VITE_REPORTS_API=/reports

# Payment Configuration
VITE_PAYMENT_GATEWAY_URL=https://api.payment-gateway.com
VITE_PAYMENT_PUBLIC_KEY=pk_test_your_public_key_here
VITE_PAYMENT_SECRET_KEY=sk_test_your_secret_key_here

# Currency Configuration
VITE_DEFAULT_CURRENCY=USD
VITE_SUPPORTED_CURRENCIES=USD,ETB
VITE_CURRENCY_EXCHANGE_API=https://api.exchangerate-api.com/v4/latest/USD

# Localization
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,am,or

# Goat Configuration
VITE_GOAT_TYPES=young,adult,pregnant,breeding
VITE_GOAT_PRICES_USD=150,200,300,400
VITE_GOAT_PRICES_ETB=4500,6000,9000,12000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_SOCIAL_SHARING=true
VITE_ENABLE_RECURRING_DONATIONS=true

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### 2. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Site footer
│   ├── CurrencySelector.jsx
│   └── LanguageSelector.jsx
├── contexts/           # React Context providers
│   ├── CurrencyContext.jsx
│   └── LocalizationContext.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Donate.jsx
│   ├── Campaigns.jsx
│   └── ...
├── services/           # API services
│   ├── api.js          # Base API client
│   ├── campaignsService.js
│   ├── donationsService.js
│   ├── currencyService.js
│   ├── goatsService.js
│   ├── localizationService.js
│   ├── paymentService.js
│   ├── authService.js
│   └── index.js        # Service exports
├── config/             # Configuration files
│   └── index.js        # App configuration
└── App.jsx             # Main app component
```

## API Integration

The application includes comprehensive API services for:

- **Campaigns**: CRUD operations for donation campaigns
- **Donations**: Process and track donations
- **Currency**: Exchange rate conversion
- **Goats**: Goat types and pricing
- **Payments**: Payment processing
- **Authentication**: User management
- **Localization**: Multi-language support

## Goat Types

The system supports four types of goats:

1. **Young Goat** (6-12 months) - $150 USD / 4,500 ETB
2. **Adult Goat** (1-3 years) - $200 USD / 6,000 ETB
3. **Pregnant Goat** (2-4 years) - $300 USD / 9,000 ETB
4. **Breeding Goat** (3-5 years) - $400 USD / 12,000 ETB

## Currency Support

- **USD**: US Dollar
- **ETB**: Ethiopian Birr
- Real-time exchange rate conversion
- Automatic currency formatting

## Localization

Supported languages:

- **English** (en)
- **Amharic** (am) - አማርኛ
- **Oromo** (or) - Afaan Oromoo

## Development

### Adding New Languages

1. Add language code to `VITE_SUPPORTED_LANGUAGES` in `.env`
2. Add translations to `src/services/localizationService.js`
3. Update language selector component

### Adding New Currencies

1. Add currency code to `VITE_SUPPORTED_CURRENCIES` in `.env`
2. Update `currencyService.js` with currency details
3. Add currency symbol and formatting

### Adding New Goat Types

1. Add goat type to `VITE_GOAT_TYPES` in `.env`
2. Add prices to `VITE_GOAT_PRICES_USD` and `VITE_GOAT_PRICES_ETB`
3. Update `goatsService.js` with goat details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
