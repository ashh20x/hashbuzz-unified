# HashBuzz - Unified Repository

**A Hedera Hashgraph-based Social Media Campaign Platform**

> **⚡ 10-Minute Setup**: Get HashBuzz running locally in under 10 minutes with our [Quick Setup Guide](#-10-minute-quick-setup)

This unified repository contains the complete HashBuzz platform for hackathon submission, combining three previously separate components with preserved commit history.

## 🏗️ Repository Structure

```
hashbuzz-unified/
├── backend/                 # Node.js/Express API Server
├── frontend/               # React/TypeScript Web Application  
├── smart-contracts/        # Hedera Smart Contracts (Solidity)
├── docs/                   # Documentation
├── TECHNICAL_DOCUMENTATION.md    # Complete setup & development guide
├── ENVIRONMENT_SETUP.md          # Environment variables guide
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

## ⚡ 10-Minute Quick Setup

> **Prerequisites**: Node.js 18+, PostgreSQL, Redis running

```bash
# 1. Clone repository
git clone https://github.com/ops295/hashbuzz-unified.git
cd hashbuzz-unified

# 2. Setup environment files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# 3. Generate basic secrets
openssl rand -hex 32  # Use for JWT_SECRET in backend/.env

# 4. Start backend
cd backend && npm install && npx prisma db push && npm run dev

# 5. Start frontend (new terminal)
cd frontend && yarn install && yarn dev

# 6. Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
```

**⚠️ Limited functionality without API keys. For full setup with Twitter/Wallet integration, see [Complete Setup Guide](#-complete-setup--documentation).**

### � Running Environment Details

| Service | Command | URL | Notes |
|---------|---------|-----|-------|
| **Frontend** | `cd frontend && yarn dev` | <http://localhost:3000> | React + Vite development server |
| **Backend** | `cd backend && npm run dev` | <http://localhost:4000> | Express.js with nodemon |
| **Database** | `npx prisma studio` | <http://localhost:5555> | PostgreSQL admin interface |
| **Cache** | `redis-cli ping` | `localhost:6379` | Redis cache server |

### 🌐 Hedera Testnet Configuration

```bash
# All blockchain operations use Hedera Testnet (free)
HEDERA_NETWORK=testnet
MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com

# View transactions: https://hashscan.io/testnet
```

## � Complete Setup & Documentation

### 📖 Main Documentation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[📋 TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)** | Complete setup, architecture, and development guide | **Start here** for full platform setup |
| **[🛠️ ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** | Detailed environment variable configuration | When configuring API keys and credentials |
| **[🚀 Frontend README](./frontend/README.md)** | Frontend-specific setup and development | Frontend development and customization |
| **[⚙️ Backend README](./backend/ReadMe.md)** | Backend API documentation and architecture | Backend development and API integration |
| **[⛓️ Smart Contracts README](./smart-contracts/README.md)** | Contract deployment and blockchain integration | Smart contract development and deployment |

### 🎯 Documentation Quick Navigation

#### **For Immediate Testing (10 minutes)**
1. Follow [⚡ 10-Minute Quick Setup](#-10-minute-quick-setup) above
2. Access basic functionality at localhost:3000
3. Limited features (no Twitter/Wallet integration)

#### **For Full Platform Setup (30-60 minutes)**
1. Read [📋 TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) - Complete guide
2. Follow [API Key Setup](./TECHNICAL_DOCUMENTATION.md#-api-keys-and-external-services-setup) - Get Twitter, Firebase, WalletConnect credentials
3. Configure [🛠️ ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - All environment variables
4. Complete [End-to-End Testing](./TECHNICAL_DOCUMENTATION.md#-final-setup-validation) - Verify everything works

#### **For Development Work**
1. Review [System Architecture](./TECHNICAL_DOCUMENTATION.md#️-system-architecture) - Understand data flow
2. Check [V201 Backend Architecture](./backend/ReadMe.md) - New modular backend structure
3. Follow [Development Workflow](./TECHNICAL_DOCUMENTATION.md#-development-workflow-setup) - VS Code setup and tools

### 🆔 Deployed Hedera Testnet Resources

#### **Smart Contracts**
- **Main Campaign Contract**: `0.0.5089474`
- **Token Manager**: `0.0.5089475` 
- **Quest System**: `0.0.5089476`

#### **Tokens**
- **HBUZZ Token**: `0.0.5089480` (Fungible)
- **Campaign Badges**: `0.0.5089481` (NFT)

#### **HCS Topics**
- **Campaign Events**: `0.0.5089485`
- **User Activity**: `0.0.5089486`
- **Notifications**: `0.0.5089487`

**View on HashScan**: [Platform Account 0.0.5089472](https://hashscan.io/testnet/account/0.0.5089472)

### 🏗️ Architecture Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │◄──►│   Backend   │◄──►│   Smart     │◄──►│   Hedera    │◄──►│  Mirror     │
│  (React)    │    │  (Node.js)  │    │  Contract   │    │  Network    │    │  Node       │
│             │    │             │    │             │    │             │    │             │
│ • User UI   │    │ • API Logic │    │ • Rewards   │    │ • Consensus │    │ • History   │
│ • Wallet    │    │ • Database  │    │ • Tokens    │    │ • Ledger    │    │ • Queries   │
│ • Auth      │    │ • Twitter   │    │ • Campaign  │    │ • HCS       │    │ • Analytics │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                     │                    │                    │                    │
      ▼                     ▼                    ▼                    ▼                    ▼
localhost:3000      localhost:4000        0.0.CONTRACT      testnet.hedera.com     testnet.mirrornode
```

### 📁 Environment File Structure

```bash
# Copy these example files and configure
cp frontend/.env.example frontend/.env    # Firebase, WalletConnect config
cp backend/.env.example backend/.env      # Database, APIs, Hedera config

# ⚠️ SECURITY WARNING: Never commit real credentials to version control
```

## 🔧 Development & Deployment

### �🛠️ Development Commands

```bash
# Backend development
cd backend && npm run dev              # Start with nodemon
cd backend && npm run test             # Run test suite
cd backend && npx prisma studio        # Database admin

# Frontend development  
cd frontend && yarn dev                # Start with hot reload
cd frontend && yarn build              # Production build
cd frontend && yarn test               # Run tests

# Smart contracts
cd smart-contracts && npm run compile # Compile contracts
cd smart-contracts && npm run deploy  # Deploy to testnet
cd smart-contracts && npm test        # Run contract tests
```

### 🚀 Production Deployment

**Docker Support:**
```bash
# Full stack with Docker
cd backend && docker compose up --profile production
```

**Manual Deployment:**
- See [Deployment Guide](./TECHNICAL_DOCUMENTATION.md#-deployment--production) in technical documentation
- Configure production environment variables
- Set up SSL certificates and domain routing

## ⚠️ Security Notice

**🔐 Important Security Guidelines:**

1. **Never commit private keys or credentials** to version control
2. **Use strong random secrets** for JWT and encryption keys  
3. **Testnet only** - Do not use real funds in development
4. **Environment files** are in `.gitignore` for security
5. **API keys** should be project-specific and rotated regularly

Generated secrets example:
```bash
# Generate secure secrets (save these values)
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 32  # For ENCRYPTION_KEY
```

---

## 🤝 Contributing & Support

### 📞 Getting Help

1. **Setup Issues**: Check [🔧 Troubleshooting](./TECHNICAL_DOCUMENTATION.md#-troubleshooting) section
2. **Environment Config**: Review [🛠️ ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
3. **API Questions**: See component-specific READMEs
4. **Bug Reports**: Create GitHub issue with environment details

### 🎯 Project Status

- ✅ **Core Platform**: Campaign creation, Twitter integration, reward distribution
- ✅ **Blockchain Integration**: Hedera smart contracts, HTS tokens, HCS messaging
- ✅ **User Interface**: React frontend with wallet connection
- ✅ **Documentation**: Complete setup and development guides
- 🔄 **Active Development**: Quest system enhancements, advanced analytics

**🚀 Ready to explore HashBuzz? Start with the [📋 TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) for complete setup instructions!**

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

- `backend/ReadMe.md` - Backend setup and API documentation
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