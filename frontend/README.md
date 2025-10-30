# HashBuzz Frontend

A modern React-based frontend application for the HashBuzz decentralized social media platform built on Hedera Hashgraph. This application provides an intuitive interface for campaign management, social media integration, and blockchain interactions.

## 📚 Documentation

- **[🚀 TECHNICAL DOCUMENTATION](./TECHNICAL_DOCUMENTATION.md)** - **Complete setup guide for judges & evaluators**
- **[� ENVIRONMENT SETUP](./ENVIRONMENT_SETUP.md)** - **Quick reference for environment variables & API keys**
- **[�🚀 Complete Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Docker, AWS, Production deployment
- **[👨‍💻 Developer Onboarding](docs/DEVELOPER_ONBOARDING.md)** - Getting started for new developers
- **[🛡️ Error Boundary Guide](docs/ERROR_BOUNDARY_GUIDE.md)** - Error handling implementation
- **[🤝 Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute to the project

## ⚡ Quick Start for Judges & Evaluators

> **New to HashBuzz?** → **[Start with TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)** for complete setup with environment variables, data flow diagrams, and testing instructions.

### 🚀 Fastest Setup (Docker)

```bash
# 1. Clone the repository
git clone <repository-url>
cd hashbuzz

# 2. Setup environment files
cp dApp-backend/.env.example dApp-backend/.env
cp frontend/.env.example frontend/.env

# 3. Edit environment files with your API keys
# See TECHNICAL_DOCUMENTATION.md for detailed configuration

# 4. Start complete stack
cd dApp-backend
docker compose --profile dev up -d

# 5. Start frontend
cd ../frontend
npm install && npm run dev

# 6. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# Database Admin: http://localhost:5555
```

### ✅ Verification

```bash
# Check backend health
curl http://localhost:4000/health

# Check frontend
open http://localhost:3000
```

## �🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **Yarn**: >= 1.22.0 (preferred) or npm >= 8.0.0
- **Git**: Latest version

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
yarn install
# or
npm install

# Start development server
yarn dev
# or
npm run dev
```

## 🌍 Environment Configuration

The application supports multiple environment configurations:

### Available Environments

- **Local Development** (`.env`): Uses local backend server at `http://localhost:4000`
- **Remote Development** (`.env.dev`): Uses remote development API at `https://testnet-dev-api.hashbuzz.social`

### Development Scripts

```bash
# Local development (uses .env - connects to localhost:4000)
yarn dev
yarn dev:local

# Remote development (uses .env.dev - connects to remote API)
yarn dev:remote

# Build for different environments
yarn build          # Local build
yarn build:local    # Local build
yarn build:dev      # Development build
```

### Environment Files

- `.env` - Local development with backend at localhost:4000
- `.env.dev` - Development environment with remote API

## 📁 Project Structure

```
frontend/
├── src/
│   ├── API/                    # RTK Query API definitions
│   ├── components/             # Reusable UI components
│   ├── screens/               # Main application screens
│   ├── Store/                 # Redux store and slices
│   ├── Ver2Designs/           # Version 2 redesigned components
│   │   ├── Admin/             # Admin panel components
│   │   └── Pages/             # Main application pages
│   ├── Wallet/                # Wallet integration logic
│   ├── theme/                 # Material-UI theme configuration
│   ├── types/                 # TypeScript type definitions
│   └── Utilities/             # Helper functions and utilities
├── public/                    # Static assets
├── build/                     # Production build output
└── docs/                      # Project documentation
```

## 🛠 Technology Stack

### Core Technologies

- **React 19.1.0**: Modern React with hooks and concurrent features
- **TypeScript 5.8.2**: Type-safe JavaScript with advanced features
- **Vite 6.2.1**: Fast build tool and dev server
- **Material-UI 7.2.0**: Comprehensive React component library

### State Management

- **Redux Toolkit 2.8.2**: Modern Redux with simplified syntax
- **RTK Query**: Powerful data fetching and caching solution
- **React Redux 9.2.0**: Official React bindings for Redux

### Blockchain & Wallet Integration

- **Hedera SDK 2.70.0**: Official Hedera Hashgraph SDK
- **HashConnect 3.0.13**: Hedera wallet connection library
- **WalletConnect**: Multi-wallet connection support
- **Ethers.js 6.13.5**: Ethereum-compatible wallet interactions

### Additional Libraries

- **React Router DOM 6.14.1**: Client-side routing
- **Axios 0.27.2**: HTTP client for API requests
- **React Toastify 11.0.5**: Toast notifications
- **Styled Components 5.3.3**: CSS-in-JS styling
- **Firebase 11.1.0**: Authentication and real-time features

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Hedera Network Configuration
VITE_NETWORK=testnet                    # hedera network (testnet/mainnet)
VITE_HEDERA_NETWORK_TYPE=testnet       # Network type for SDK

# API Configuration
VITE_BASE_URL=http://localhost:5000     # Backend API base URL
VITE_API_VERSION=v1                     # API version

# Social Media Integration
VITE_TWITTER_REDIRECT_URL=http://localhost:3000/auth/twitter
VITE_INSTAGRAM_REDIRECT_URL=http://localhost:3000/auth/instagram

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

# Wallet Configuration
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
VITE_HEDERA_ACCOUNT_ID=0.0.123456       # Default account for testing

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_ERROR_REPORTING=true
```

### SSL Certificates (Development)

For HTTPS development server:

```bash
openssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem
```

## 🏗 Architecture

### Component Architecture

- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms)
- **Feature-Based**: Related components grouped by functionality
- **Reusable UI**: Consistent design system with Material-UI

### State Management Flow

```
UI Components → Actions → RTK Query/Slices → API → Backend
     ↑                                                ↓
React Components ← Selectors ← Store ← Reducers ← Response
```

### Key Store Slices

- **`authSlice`**: User authentication and session management
- **`campaignSlice`**: Campaign creation and management
- **`campaignListSlice`**: Campaign listing and filtering
- **`walletSlice`**: Wallet connection and blockchain state
- **`uiSlice`**: UI state and theme management

## 🚦 Available Scripts

```bash
# Development
yarn dev              # Start development server (http://localhost:5173)
yarn build             # Build for production
yarn preview           # Preview production build locally

# Production
yarn start:prod        # Serve production build (port 3000)
yarn serve            # Alternative production server

# Code Quality
yarn lint             # Run ESLint
yarn format           # Format code with Prettier
yarn type-check       # TypeScript type checking

# Testing
yarn test             # Run tests (when configured)
yarn test:coverage    # Run tests with coverage
```

## 🎨 UI/UX Guidelines

### Design System

- **Material Design 3**: Following Google's Material Design principles
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: WCAG 2.1 AA compliance
- **Dark/Light Theme**: System and user preference support

### Component Standards

- Use Material-UI components as base
- Implement consistent spacing using theme spacing units
- Follow naming conventions: PascalCase for components
- Use TypeScript interfaces for all props

### Color Palette

```typescript
// Primary Colors
primary: '#1976d2'      // Hashbuzz Blue
secondary: '#dc004e'    // Accent Pink
success: '#2e7d32'      // Success Green
error: '#d32f2f'        // Error Red
warning: '#ed6c02'      # Warning Orange
info: '#0288d1'         // Info Blue

// Neutral Colors
background: '#fafafa'   // Light background
surface: '#ffffff'      # Card/surface color
text: '#212121'        # Primary text
textSecondary: '#757575' # Secondary text
```

## 🔧 Development Workflow

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/\***: Individual feature development
- **hotfix/\***: Critical production fixes

### Code Standards

- **ESLint**: Enforce code quality and consistency
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking enabled
- **Conventional Commits**: Standardized commit messages

### Formatting & editor setup

This project enforces formatting via Prettier and linting via ESLint. Husky + lint-staged auto-run these checks on commit. To keep VS Code, Husky, and lint-staged consistent:

- Install recommended VS Code extensions: Prettier - Code formatter (`esbenp.prettier-vscode`), ESLint (`dbaeumer.vscode-eslint`).
- Ensure workspace settings (`.vscode/settings.json`) set Prettier as the default formatter and enable format on save.
- Prettier config is in `.prettierrc` at each project folder. The settings used:
  - `semi: true`
  - `singleQuote: true`
  - `tabWidth: 2`
  - `trailingComma: es5`
  - `printWidth: 80`
  - `arrowParens: avoid`

Quick commands:

- Install dependencies: `yarn install`
- Install husky hooks (after install): `yarn prepare`
- Check formatting: `yarn format:check`
- Fix formatting and lint: `yarn fix-all`

If VS Code doesn't format on save, check that `prettier.requireConfig` is set to `false` in `.vscode/settings.json` or create a root `.prettierrc` to satisfy the extension.

### Component Development

1. Create component in appropriate directory
2. Add TypeScript interface for props
3. Implement component with Material-UI
4. Add to Storybook (if configured)
5. Write unit tests
6. Update documentation

## 🔒 Security Guidelines

### Environment Security

- Never commit `.env` files
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Use HTTPS in production

### Code Security

- Sanitize user inputs
- Validate API responses
- Implement proper error boundaries
- Use secure storage for sensitive data

### Wallet Security

- Never store private keys
- Validate all transactions before signing
- Implement proper permission checks
- Use secure wallet connection protocols

## 📱 Mobile Responsiveness

### Breakpoints

- **xs**: 0px (Mobile portrait)
- **sm**: 600px (Mobile landscape)
- **md**: 900px (Tablet)
- **lg**: 1200px (Desktop)
- **xl**: 1536px (Large desktop)

### Mobile-First Development

- Design for mobile, enhance for desktop
- Use Material-UI's responsive grid system
- Test on real devices and emulators
- Optimize touch interactions

## 🔗 API Integration

### RTK Query Setup

```typescript
// API slice example
export const campaignApi = createApi({
  reducerPath: 'campaignApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/campaigns',
    prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState());
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Campaign'],
  endpoints: builder => ({
    getCampaigns: builder.query<Campaign[], void>({
      query: () => '',
      providesTags: ['Campaign'],
    }),
  }),
});
```

### Error Handling

- Global error boundary for React errors
- RTK Query error handling with retries
- User-friendly error messages
- Comprehensive logging

## 🧪 Testing Strategy

### Testing Libraries

- **Jest**: Test runner and assertions
- **React Testing Library**: Component testing
- **MSW**: API mocking for tests
- **Cypress**: End-to-end testing (when configured)

### Testing Guidelines

- Write tests for critical user flows
- Test components in isolation
- Mock external dependencies
- Aim for 80%+ code coverage

## 🚀 Deployment

### Build Process

```bash
# Production build
yarn build

# Build artifacts
dist/
├── assets/           # Bundled JS, CSS, and assets
├── index.html       # Main HTML file
└── manifest.json    # PWA manifest
```

### Deployment Environments

- **Development**: Auto-deploy from develop branch
- **Staging**: Manual deploy for testing
- **Production**: Tagged releases only

### Environment Configuration

- Development: Hot reload, dev tools enabled
- Staging: Production build, debug logs
- Production: Optimized build, minimal logging

## 📋 Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install

# Clear Vite cache
rm -rf .vite
```

#### Development Server Issues

```bash
# Check port availability
lsof -i :5173

# Reset development environment
yarn dev --force --port 3001
```

#### TypeScript Errors

```bash
# Type check without emitting
yarn type-check

# Restart TypeScript service in IDE
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Performance Optimization

- Use React.memo for expensive components
- Implement code splitting with React.lazy
- Optimize bundle size with tree shaking
- Use RTK Query caching effectively

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Hedera Documentation](https://docs.hedera.com/)
- [Vite Documentation](https://vitejs.dev/)

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Team Chat**: Internal Slack/Discord channels

---

**Made with ❤️ by the Hashbuzz Team**
