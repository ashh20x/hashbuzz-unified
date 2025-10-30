# HashBuzz - Unified Repository

**A Hedera Hashgraph-based Social Media Campaign Platform**

This unified repository contains the complete HashBuzz platform for hackathon submission, combining three previously separate components with preserved commit history.

## 🏗️ Repository Structure

```
hashbuzz-unified/
├── backend/                 # Node.js/Express API Server
├── frontend/               # React/TypeScript Web Application  
├── smart-contracts/        # Hedera Smart Contracts (Solidity)
└── README.md              # This file
```

## 🚀 Platform Overview

HashBuzz is a revolutionary social media campaign platform built on Hedera Hashgraph that enables:

- **Twitter Campaign Management**: Create and manage engagement-based marketing campaigns
- **Smart Contract Rewards**: Automated reward distribution via Hedera consensus
- **Quest System**: Gamified user engagement with milestone-based rewards
- **Real-time Analytics**: Live campaign performance tracking and engagement metrics
- **Decentralized Verification**: Blockchain-backed proof of engagement and rewards

## 📋 Technical Stack

### Backend (`/backend/`)
- **Runtime**: Node.js 18+ with TypeScript 5.0+
- **Framework**: Express.js 4.18+ with V201 modular architecture
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Hedera Hashgraph SDK v2.x
- **Queue System**: Redis with Bull queue management
- **Authentication**: JWT with GitHub OAuth integration

### Frontend (`/frontend/`)
- **Framework**: React 18.3.1 with TypeScript
- **UI Library**: Material-UI v7 with custom theming
- **State Management**: Redux Toolkit with RTK Query
- **Build Tool**: Vite 6.0+ for fast development
- **Wallet Integration**: Hedera wallet connect support

### Smart Contracts (`/smart-contracts/`)
- **Language**: Solidity 0.8.x
- **Platform**: Hedera Smart Contract Service (HSCS)
- **Features**: Campaign lifecycle, reward distribution, token management
- **Security**: Multi-sig validation and emergency controls

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Redis 6+
- Hedera testnet account and API keys

### Backend Setup
```bash
cd backend/
npm install
cp .env.example .env  # Configure environment variables
npm run db:push       # Initialize database
npm run dev          # Start development server (port 4000)
```

### Frontend Setup
```bash
cd frontend/
yarn install
cp secrets.template.json secrets.json  # Configure API endpoints
yarn dev             # Start development server (port 5173)
```

### Smart Contracts Setup
```bash
cd smart-contracts/
npm install
# Deploy contracts to Hedera testnet (see deployment docs)
```

## 🔧 Environment Configuration

### Backend Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hashbuzz"

# Hedera Configuration
HEDERA_NETWORK="testnet"
HEDERA_ACCOUNT_ID="0.0.XXXXXXX"
HEDERA_PRIVATE_KEY="your-private-key"

# Twitter API
TWITTER_API_KEY="your-twitter-api-key"
TWITTER_API_SECRET="your-twitter-api-secret"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-jwt-secret"
```

### Frontend Configuration
```json
{
  "apiUrl": "http://localhost:4000",
  "hederaNetwork": "testnet",
  "contractId": "0.0.XXXXXXX"
}
```

## 🏆 Key Features Implemented

### Campaign Management
- ✅ Twitter campaign creation with smart contract integration
- ✅ Real-time engagement tracking (likes, retweets, replies)
- ✅ Automated reward calculation and distribution
- ✅ Campaign expiry management with custom messaging

### User Experience
- ✅ React ErrorBoundary for robust error handling
- ✅ Admin dashboard with user management
- ✅ Responsive design with Material-UI components
- ✅ Wallet integration for seamless Hedera interactions

### Technical Excellence
- ✅ V201 modular architecture for scalability
- ✅ Comprehensive error handling and logging
- ✅ Type-safe API integration with TypeScript
- ✅ Automated testing suite with BDD scenarios

## 📊 Architecture Highlights

### Dual Architecture System
The backend implements both legacy and V201 architectures:
- **Legacy**: Monolithic structure for existing features
- **V201**: Modern modular design for new development

### Smart Contract Integration
- Campaign lifecycle managed on-chain
- Automatic reward distribution via consensus
- Error handling with detailed transaction tracking

### Real-time Processing
- Redis-based queue system for engagement processing
- WebSocket integration for live updates
- Rate limiting and retry mechanisms

## 🧪 Testing & Quality

```bash
# Backend testing
cd backend/
npm run test:v201:safe --test-db  # Full test suite
npm run test:v201:bdd             # BDD scenarios

# Frontend testing
cd frontend/
yarn test                        # Unit tests
yarn test:coverage              # Coverage report

# Code quality
yarn lint                       # ESLint checks
yarn prettier                  # Code formatting
```

## 🚀 Deployment

### Docker Support
```bash
# Full stack deployment
docker-compose --profile dev up -d

# Services: API (4000), PostgreSQL (5432), Redis (6379)
```

### Production Deployment
- AWS ECR for container registry
- Automated CI/CD with GitHub Actions
- Environment-based configuration management

## 📖 Documentation

- `backend/README.md` - Backend setup and API documentation
- `frontend/README.md` - Frontend development guide
- `smart-contracts/README.md` - Contract deployment instructions
- `backend/docs/` - Technical documentation and guides

## 🎯 Hackathon Submission Notes

This unified repository demonstrates:

1. **Full-Stack Integration**: Seamless connection between React frontend, Node.js backend, and Hedera smart contracts
2. **Production-Ready Code**: Comprehensive error handling, testing, and documentation
3. **Hedera Innovation**: Native integration with Hedera Consensus Service and Smart Contracts
4. **Scalable Architecture**: Modern patterns supporting enterprise-level growth
5. **Developer Experience**: Extensive tooling, clear documentation, and consistent patterns

## 🤝 Contributing

See individual component documentation for development guidelines:
- Backend: V201 modular architecture with TypeScript
- Frontend: React 18 with Material-UI design system  
- Contracts: Solidity best practices with Hedera patterns

---

**HashBuzz Team** - Building the future of social media marketing on Hedera Hashgraph