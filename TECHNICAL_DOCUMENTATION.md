# 🚀 HashBuzz Technical Documentation

> **Complete setup guide for developers, judges, and evaluators to run the HashBuzz social media campaign platform**

## 🏗️ Repository Structure

This is a **unified monorepo** containing all HashBuzz components:

- **`frontend/`** - React.js web application
- **`backend/`** - Node.js API server with V201 modular architecture  
- **`smart-contracts/`** - Hedera Hashgraph smart contracts
- **Root configuration** - Environment setup and deployment scripts

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🚀 Getting Started Quick Guide](#-getting-started-quick-guide)
- [🏗️ System Architecture](#️-system-architecture)
- [🌊 Data Flow](#-data-flow)
- [⚙️ Environment Setup](#️-environment-setup)
- [🚀 Detailed Setup Guide](#-detailed-setup-guide)
- [🧪 Testing & Validation](#-testing--validation)
- [📊 Monitoring & Debugging](#-monitoring--debugging)
- [🔧 Troubleshooting](#-troubleshooting)

---

## 🚀 Getting Started Quick Guide

> **⏱️ Expected Setup Time: 30-60 minutes (depending on API approvals)**

### 📝 What You'll Need Before Starting

1. **Development Environment**:
   - Node.js 18+ installed
   - PostgreSQL database
   - Redis server
   - Git client

2. **External Service Accounts** (⚠️ **Start these first - some require approval time**):
   - **Twitter Developer Account** (1-7 days approval time)
   - **WalletConnect Cloud Account** (instant)
   - **Firebase Project** (instant)
   - **Hedera Portal Account** (instant)

3. **Time Requirements**:
   - **API Key Setup**: 15-30 minutes
   - **Local Environment**: 15-30 minutes  
   - **First Run & Testing**: 10-15 minutes

### 🎯 Setup Flow Overview

```mermaid
graph TD
    A[🚀 Start Here] --> B[📋 Check Prerequisites]
    B --> C[🔑 Get API Keys]
    C --> D[💾 Setup Local Environment]
    D --> E[⚙️ Configure Environment Variables]
    E --> F[🏃 Run Services]
    F --> G[✅ Test & Validate]
    
    C --> C1[🐦 Twitter API<br/>⏰ 1-7 days approval]
    C --> C2[🔗 WalletConnect<br/>⚡ Instant]
    C --> C3[🔥 Firebase<br/>⚡ Instant]
    C --> C4[⛓️ Hedera Portal<br/>⚡ Instant]
```

### 🎬 Quick Start Steps

1. **[Get External API Keys](#-api-keys-and-external-services-setup)** ← **Start with this first**
2. **[Clone Repository](#step-1-clone-repository)**
3. **[Setup Prerequisites](#step-2-system-prerequisites)**  
4. **[Configure Services](#step-3-service-configuration)**
5. **[Setup Environment Variables](#step-5-environment-configuration)**
6. **[Install & Run](#step-6-backend-setup)**
7. **[Test Everything](#step-9-verification-and-access)**

### 🚨 Important Notes

- **Twitter API**: Apply early! Approval can take 1-7 days
- **Local Development**: All services run on localhost
- **Test Data**: System uses testnet (free) for blockchain operations
- **Help**: Check [🔧 Troubleshooting](#-troubleshooting) if you encounter issues

---

## ⚡ 10-Minute Quick Setup

> **⏱️ For immediate evaluation and testing - get HashBuzz running in under 10 minutes**

### Prerequisites Check (2 minutes)

```bash
# Verify required software
node --version    # Should be v18+ or v20+
npm --version     # Should be v8+
yarn --version    # Should be v1.22+
psql --version    # PostgreSQL should be installed
redis-cli ping    # Should return "PONG"
```

### Rapid Setup Steps

#### **Step 1: Clone & Navigate (1 minute)**

```bash
git clone https://github.com/ops295/hashbuzz-unified.git
cd hashbuzz-unified
```

#### **Step 2: Environment Setup (2 minutes)**

```bash
# Create environment files from examples
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Generate basic secrets quickly
export JWT_SECRET=$(openssl rand -hex 32)
export ENCRYPTION_KEY=$(openssl rand -hex 32)

# Update backend/.env with minimal config for testing
sed -i "s/your-jwt-secret-here/$JWT_SECRET/g" backend/.env
sed -i "s/your-encryption-key-here/$ENCRYPTION_KEY/g" backend/.env
```

#### **Step 3: Database Quick Setup (2 minutes)**

```bash
# Create database (adjust username as needed)
sudo -u postgres createdb hashbuzz_db
sudo -u postgres createuser hashbuzz -s

# Or use Docker for faster setup
cd backend && docker compose up postgres redis -d
```

#### **Step 4: Backend Start (2 minutes)**

```bash
cd backend

# Install dependencies and setup
npm install
npx prisma db push
npx prisma generate

# Start backend server
npm run dev
# ✅ Backend running at http://localhost:4000
```

#### **Step 5: Frontend Start (1 minute)**

```bash
# New terminal window
cd frontend

# Install and start
yarn install
yarn dev
# ✅ Frontend running at http://localhost:3000
```

### 🎯 Quick Validation

```bash
# Test all services (30 seconds)
curl http://localhost:4000/health        # Backend health
curl http://localhost:4000/api/status    # API status
open http://localhost:3000               # Frontend access
```

### ⚠️ Limited Functionality Notice

This quick setup provides:
- ✅ **Basic platform access** - UI and navigation
- ✅ **Database operations** - User management, basic CRUD
- ✅ **Local development** - Code changes and testing
- ❌ **Twitter campaigns** - Requires Twitter API keys
- ❌ **Wallet integration** - Requires WalletConnect/Firebase setup
- ❌ **Blockchain features** - Requires Hedera testnet account

**For full functionality**, complete the [Detailed Setup Guide](#detailed-setup-guide) below.

### 📝 Running Environment Details

**Frontend Development Server:**
```bash
cd frontend && yarn dev
# → Runs on http://localhost:3000
# → Vite development server with hot reload
# → React 19.1 + TypeScript + Material-UI
```

**Backend API Server:**
```bash
cd backend && npm run dev
# → Runs on http://localhost:4000
# → Express.js with nodemon auto-restart
# → Node.js 18+ + TypeScript + Prisma ORM
```

**Database & Cache:**
```bash
# PostgreSQL → localhost:5432
# Redis → localhost:6379
# Prisma Studio → http://localhost:5555 (when running)
```

**Hedera Network Configuration:**
```bash
# Testnet Environment (Free)
HEDERA_NETWORK=testnet
MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com
# View transactions: https://hashscan.io/testnet
```

**⚠️ Security Warning: Do not commit private keys or credentials to version control**

---

## 🎯 Project Overview

**HashBuzz** is a decentralized social media campaign platform built on **Hedera Hashgraph** that enables users to:

- Create and manage Twitter-based marketing campaigns
- Participate in quest-style challenges with rewards
- Distribute rewards automatically via smart contracts
- Track campaign performance and engagement metrics

### 🛠️ Technology Stack

**Frontend (React Application)**

- React 19.1 + TypeScript
- Material-UI v7 + Emotion styling
- Redux Toolkit + RTK Query
- Vite build system
- Hedera wallet integration (HashConnect, WalletConnect)

**Backend (Node.js API)**

- Node.js 18+ + Express.js + TypeScript
- PostgreSQL + Prisma ORM
- Hedera Hashgraph SDK
- Twitter API integration
- Redis caching + session management

---

## 🏗️ System Architecture

### High-Level Architecture Overview

```mermaid
graph TB
    %% User Interfaces
    U[👤 Users]
    W[🔗 Hedera Wallets<br/>HashPack/Blade]
    
    %% Frontend Layer
    F[⚛️ React Frontend<br/>localhost:3000]
    
    %% Backend Layer  
    B[🚀 Node.js Backend<br/>localhost:4000]
    
    %% Data Layer
    DB[(🗄️ PostgreSQL<br/>User Data & Campaigns)]
    R[(📦 Redis Cache<br/>Sessions & Temp Data)]
    
    %% External Services
    T[🐦 Twitter API<br/>Campaign Publishing]
    FB[🔥 Firebase<br/>Authentication]
    WC[🔗 WalletConnect<br/>Wallet Integration]
    
    %% Blockchain Layer
    H[⛓️ Hedera Testnet<br/>Smart Contracts & Tokens]
    M[🪞 Mirror Node<br/>Transaction History]
    SC[📜 Smart Contracts<br/>Reward Distribution]
    
    %% User Interactions
    U --> F
    U --> W
    W --> F
    
    %% Frontend to Backend
    F <--> B
    F --> FB
    F --> WC
    
    %% Backend to Data
    B <--> DB
    B <--> R
    
    %% Backend to External Services
    B <--> T
    B --> FB
    
    %% Backend to Blockchain
    B <--> H
    B --> M
    H --> SC
    
    %% Data Flow Labels
    F -.->|1. User Auth| FB
    F -.->|2. Wallet Connect| WC
    F -.->|3. API Requests| B
    B -.->|4. Campaign Data| DB
    B -.->|5. Twitter Publish| T
    B -.->|6. Contract Calls| H
    H -.->|7. Reward Tokens| SC
    B -.->|8. Transaction Query| M
```

### 🔄 Data Flow Architecture

**Frontend ↔ Backend ↔ Smart Contract ↔ Hedera Network ↔ Mirror Node**

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

#### **� Detailed Data Flow Components**

1. **Frontend (React) ← → Backend (Node.js)**
   ```
   HTTP/HTTPS Requests
   ├── Authentication (JWT tokens)
   ├── Campaign CRUD operations  
   ├── User management
   ├── File uploads (media)
   └── Real-time updates (WebSockets)
   ```

2. **Backend (Node.js) ← → Smart Contract (Hedera)**
   ```
   Hedera SDK Calls
   ├── Contract deployment
   ├── Token transfers (rewards)
   ├── Campaign state updates
   ├── User registration on-chain
   └── Reward distribution triggers
   ```

3. **Smart Contract ← → Hedera Network**
   ```
   Blockchain Operations
   ├── Consensus submission
   ├── State changes
   ├── Token operations
   ├── Event emissions
   └── Gas fee processing
   ```

4. **Hedera Network ← → Mirror Node**
   ```
   Transaction Synchronization
   ├── Transaction records
   ├── Contract call results
   ├── Token transfer history
   ├── Account balance updates
   └── Event logs
   ```

5. **Backend → Mirror Node (Query Only)**
   ```
   REST API Queries
   ├── Transaction verification
   ├── Account balance checks
   ├── Contract call history
   ├── Token transaction logs
   └── Performance analytics
   ```

### 🎯 Component Responsibilities

| Component | Primary Role | Data Handled | External Integrations |
|-----------|-------------|--------------|----------------------|
| **React Frontend** | User Interface & Experience | UI state, form data, user sessions | Firebase Auth, WalletConnect |
| **Node.js Backend** | Business Logic & API | User data, campaigns, files | Twitter API, Hedera SDK |
| **PostgreSQL** | Persistent Data Storage | Users, campaigns, analytics | N/A |
| **Redis Cache** | Temporary Data & Sessions | JWT tokens, temp files, rate limits | N/A |
| **Smart Contracts** | Reward Distribution Logic | Token balances, campaign rewards | Hedera Token Service |
| **Hedera Network** | Blockchain Consensus | Transactions, token transfers | Mirror Node sync |
| **Mirror Node** | Transaction History | Historical data, analytics | Hedera Network |

### 🔄 Typical User Journey Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant H as Hedera
    participant T as Twitter
    participant M as Mirror Node

    U->>F: 1. Connect Wallet
    F->>H: 2. Wallet Authentication
    F->>B: 3. User Registration
    B->>+H: 4. Create User Record
    
    U->>F: 5. Create Campaign
    F->>B: 6. Submit Campaign Data
    B->>T: 7. Publish to Twitter
    B->>+H: 8. Deploy Campaign Contract
    
    U->>F: 9. Participate in Campaign
    F->>T: 10. Perform Twitter Action
    B->>T: 11. Verify Action
    B->>H: 12. Record Participation
    
    B->>H: 13. Distribute Rewards
    H->>M: 14. Transaction Records
    B->>M: 15. Verify Distribution
    F->>U: 16. Show Updated Balance
```

### 🔄 Unified Repository Structure

HashBuzz uses a **monorepo architecture** with three main components:

```
📁 HashBuzz Unified Repository
├── 🎨 frontend/                                 # React frontend application
│   ├── src/                                     # Frontend source code
│   ├── public/                                  # Static assets
│   ├── docs/                                    # Frontend documentation
│   └── package.json                             # Frontend dependencies
├── ⚙️ backend/                                  # Node.js backend API
│   ├── src/                                     # Backend source code
│   │   ├── V201/                                # New modular architecture
│   │   │   └── Modules/                         # Feature modules
│   │   │       ├── quest/                       # Quest campaigns
│   │   │       ├── campaigns/                   # Campaign management
│   │   │       ├── Balance/                     # User balance tracking
│   │   │       ├── engagements/                 # Social media engagements
│   │   │       └── transacions/                 # Transaction handling
│   │   ├── controller/                          # Legacy controllers
│   │   ├── routes/                              # Legacy routes
│   │   ├── services/                            # Legacy services
│   │   └── shared/                              # Shared utilities
│   ├── prisma/                                  # Database schema
│   ├── docs/                                    # Backend documentation
│   └── package.json                             # Backend dependencies
├── ⛓️ smart-contracts/                          # Hedera smart contracts
│   ├── contracts/                               # Solidity contracts
│   ├── migrations/                              # Deployment scripts
│   └── test/                                    # Contract tests
├── 📋 TECHNICAL_DOCUMENTATION.md                # This file
├── 🛠️ ENVIRONMENT_SETUP.md                     # Environment setup guide
└── 🚀 setup.sh                                 # Automated setup script
```

### 🏗️ V201 Backend Architecture

The backend follows a **dual architecture** approach for backward compatibility:

```
📁 Backend V201 Modular Structure
backend/src/V201/
├── Modules/                                     # Feature-based modules
│   ├── quest/                                   # Quest management
│   │   ├── Controller.ts                        # Quest API endpoints
│   │   ├── Routes.ts                           # Quest routes
│   │   ├── services/                           # Quest business logic
│   │   └── types.ts                            # Quest TypeScript types
│   ├── campaigns/                               # Campaign management
│   ├── Balance/                                 # User balance tracking
│   ├── engagements/                            # Social media engagements
│   └── transacions/                            # Transaction processing
├── EventsWorker.ts                             # Background event processing
├── SchedulesWorkerManager.ts                   # Scheduled job management
├── enhancedEventSystem.ts                      # Event system core
├── redisQueue.ts                               # Redis queue management
└── websocket/                                  # Real-time communication
```

---

## 🌊 Data Flow

### 1. **Campaign Creation Flow**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant H as Hedera
    participant T as Twitter

    U->>F: Create Campaign
    F->>F: Validate Form Data
    F->>B: POST /api/V201/campaigns/draft
    B->>B: Validate & Process
    B->>DB: Save Campaign Draft
    B->>H: Deploy Smart Contract
    H-->>B: Contract ID
    B->>DB: Update Campaign with Contract ID
    B->>T: Post Tweet (if auto-publish)
    T-->>B: Tweet ID
    B->>DB: Update with Tweet ID
    B-->>F: Campaign Created Response
    F-->>U: Success Notification
```

### 2. **Quest Participation Flow**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant H as Hedera
    participant T as Twitter

    U->>F: View Available Quests
    F->>B: GET /api/V201/quest/all
    B->>DB: Fetch Active Quests
    DB-->>B: Quest List
    B-->>F: Quest Data
    F-->>U: Display Quests

    U->>F: Participate in Quest
    F->>T: Perform Twitter Action (like, retweet, etc.)
    T-->>F: Action Confirmed
    F->>B: POST /api/V201/quest/submit
    B->>T: Verify Action via Twitter API
    T-->>B: Verification Result
    B->>DB: Record Participation
    B-->>F: Participation Recorded
    F-->>U: Quest Progress Updated
```

### 3. **Reward Distribution Flow**

```mermaid
sequenceDiagram
    participant S as System
    participant B as Backend
    participant DB as Database
    participant H as Hedera
    participant U as User Wallet

    Note over S,U: Automated process when campaign closes

    S->>B: Campaign Close Event
    B->>DB: Fetch Eligible Participants
    DB-->>B: Participant List with Engagements
    B->>B: Calculate Reward Amounts

    loop For Each Participant
        B->>H: Check Token Association
        H-->>B: Association Status
        alt Token Associated
            B->>H: Transfer Tokens via Smart Contract
            H-->>U: Tokens Received
            H-->>B: Transaction Success
            B->>DB: Update amount_claimed
            B->>DB: Mark Engagement as PAID
        else Token Not Associated
            B->>DB: Log Failed Distribution
        end
    end

    B->>B: Generate Campaign Report
    B->>T: Post Completion Tweet Thread
```

---

## ⚙️ Environment Setup

### 🎯 Frontend Environment Variables

Create `/frontend/.env` based on `.env.example`:

```bash
# =============================================================================
# OPTIONAL - Development Port Configuration
# =============================================================================
# PORT=3500

# =============================================================================
# REQUIRED - Application Configuration
# =============================================================================
VITE_NETWORK="testnet"

# API Configuration (Development)
VITE_DAPP_API="http://localhost:4000"
VITE_API_BASE_URL="http://localhost:4000"

# Hedera Mirror Node
VITE_MIRROR_NODE_LINK="https://testnet.mirrornode.hedera.com"

# =============================================================================
# REQUIRED - Campaign Configuration
# =============================================================================
VITE_CAMPAIGN_DURATION=15                   # Campaign duration in minutes

# =============================================================================
# REQUIRED - WalletConnect Configuration
# =============================================================================
VITE_PROJECT_ID="your-walletconnect-project-id"

# =============================================================================
# OPTIONAL - YouTube Configuration
# =============================================================================
VITE_YOUTUBE_VIDEO_URL="https://www.youtube.com/embed/YOUR_VIDEO_ID"

# =============================================================================
# REQUIRED - Feature Flags
# =============================================================================
VITE_ENABLE_V201_CAMPAIGNS=true
VITE_ENABLE_CAMPAIGN_V201=true

# =============================================================================
# REQUIRED - Firebase Configuration
# =============================================================================
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-MEASUREMENT_ID

# =============================================================================
# REQUIRED - Session & Token Configuration
# =============================================================================
VITE_TOKEN_REFRESH_INTERVAL=90000           # 1.5 minutes
VITE_TOKEN_EXPIRY_BUFFER=30000              # 30 seconds
```

### 🎯 Backend Environment Variables

Create `/backend/.env` based on `.env.example`:

```bash
# =============================================================================
# REQUIRED - Application Configuration
# =============================================================================
NODE_ENV=development
PORT=4000
HOST=localhost

# =============================================================================
# REQUIRED - Database Configuration
# =============================================================================
DATABASE_URL="postgresql://username:password@localhost:5432/hashbuzz?schema=public"
DB_URL="postgresql://username:password@localhost:5432/hashbuzz?schema=public"
REDIS_URL="redis://localhost:6379"

# =============================================================================
# REQUIRED - Authentication & Security
# =============================================================================
JWT_SECRET_KEY=your-super-secret-jwt-key-at-least-32-characters
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_EXPIRES_IN=1h
SESSION_SECRET=your-super-secret-session-key-at-least-32-characters

# =============================================================================
# REQUIRED - Hedera Network Configuration
# =============================================================================
HEDERA_NETWORK=testnet
HEDERA_MIRROR_NODE_URL="https://testnet.mirrornode.hedera.com"

# Hedera Account Keys (from Hedera Portal)
HEDERA_OPERATOR_ID="0.0.YOUR_ACCOUNT_ID"
HEDERA_OPERATOR_KEY="YOUR_HEDERA_PRIVATE_KEY"

# Alternative Operator Config
OPERATOR_ID="0.0.YOUR_ACCOUNT_ID"
OPERATOR_PRIVATE_KEY="YOUR_HEDERA_PRIVATE_KEY"

# =============================================================================
# REQUIRED - Twitter API Configuration
# =============================================================================
TWITTER_BEARER_TOKEN=your-twitter-bearer-token
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

# =============================================================================
# REQUIRED - CORS Configuration
# =============================================================================
CORS_ORIGIN="http://localhost:3500,http://localhost:3000"

# =============================================================================
# OPTIONAL - Feature Flags & Configuration
# =============================================================================
# LOG_LEVEL=info
# RATE_LIMIT_WINDOW_MS=900000
# RATE_LIMIT_MAX=100
```

### 📋 Smart Contracts Environment Variables

Create `/smart-contracts/.env` based on `.env.example`:

```bash
# =============================================================================
# REQUIRED - Hedera Network Configuration
# =============================================================================
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID="0.0.YOUR_ACCOUNT_ID"
HEDERA_OPERATOR_KEY="YOUR_HEDERA_PRIVATE_KEY"

# =============================================================================
# REQUIRED - Mirror Node Configuration
# =============================================================================
MIRROR_NODE="https://testnet.mirrornode.hedera.com"
```

---

## 🚀 Detailed Setup Guide

### 📋 Prerequisites

```bash
# Required Software
Node.js >= 18.0.0
npm >= 8.0.0 or yarn >= 1.22.0
PostgreSQL >= 14.0
Redis >= 6.0
Git >= 2.30
Docker & Docker Compose (optional)
```

### 🔧 Setup Instructions

#### **Step 1: System Prerequisites**

First, ensure all required software is installed on your system:

```bash
# Update system packages (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+ (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn package manager
npm install -g yarn

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Redis
sudo apt install redis-server

# Verify installations
node --version    # Should be 18.x or higher
npm --version     # Should be 8.x or higher
yarn --version    # Should be 1.22.x or higher
psql --version    # Should be 14.x or higher
redis-server --version  # Should be 6.x or higher
```

#### **Step 2: Service Configuration**

Configure PostgreSQL and Redis services:

```bash
# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Start and enable Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Configure PostgreSQL user and database
sudo -u postgres createuser --interactive --pwprompt hashbuzz
# Enter password when prompted (use 'hashbuzz' for development)

sudo -u postgres createdb hashbuzz_db --owner=hashbuzz

# Test PostgreSQL connection
psql -h localhost -U hashbuzz -d hashbuzz_db -c "SELECT version();"

# Test Redis connection
redis-cli ping  # Should return "PONG"
```

#### **Step 3: Repository Setup**

Clone and prepare the HashBuzz repository:

```bash
# Clone the unified repository
git clone https://github.com/ops295/hashbuzz-unified.git
cd hashbuzz-unified

# Create environment files from examples
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Create logs directory for backend
mkdir -p backend/logs

# Set proper permissions
chmod 755 backend/logs
```

#### **Step 4: API Keys and External Services Setup**

Before configuring environment variables, you need to obtain API keys from external services:

##### **🐦 Twitter API Setup (Required for Campaign Functionality)**

1. **Apply for Twitter Developer Account**
   ```bash
   # Visit Twitter Developer Portal
   # https://developer.twitter.com/
   ```
   - Go to [Twitter Developer Portal](https://developer.twitter.com/)
   - Click "Apply for a developer account"
   - Complete the application form (approval may take 1-7 days)
   - Verify your email and phone number

2. **Create Twitter App**
   ```bash
   # After approval, create your app
   ```
   - Sign in to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
   - Click "Create App" or "New App"
   - Fill in app details:
     - **App name**: `HashBuzz-Local-Dev` (or similar)
     - **Description**: `HashBuzz social media campaign platform development`
     - **Website URL**: `http://localhost:3000`
     - **Callback URL**: `http://localhost:4000/auth/twitter/callback`

3. **Configure App Permissions**
   - Go to your app → "Settings" → "User authentication settings"
   - Enable "OAuth 1.0a"
   - Set permissions to "Read and write"
   - Add callback URL: `http://localhost:4000/auth/twitter/callback`
   - Save settings

4. **Generate API Keys**
   ```bash
   # Navigate to Keys and Tokens tab
   ```
   - Go to your app → "Keys and Tokens"
   - Generate/copy these values:
     - **API Key** → Use as `TWITTER_API_KEY`
     - **API Secret** → Use as `TWITTER_API_SECRET`
     - **Bearer Token** → Use as `TWITTER_BEARER_TOKEN`
   - Under "Access Token and Secret":
     - Click "Generate" if not exists
     - **Access Token** → Use as `TWITTER_ACCESS_TOKEN`
     - **Access Token Secret** → Use as `TWITTER_ACCESS_TOKEN_SECRET`

5. **Test API Connection**
   ```bash
   # Test your credentials
   curl -H "Authorization: Bearer YOUR_BEARER_TOKEN" \
        "https://api.twitter.com/2/users/me"
   ```

##### **🔗 WalletConnect Project Setup (Required for Wallet Integration)**

1. **Create WalletConnect Account**
   ```bash
   # Visit WalletConnect Cloud
   # https://cloud.walletconnect.com/
   ```
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Sign up with your email
   - Verify your email address

2. **Create New Project**
   - Click "Create" or "New Project"
   - Fill in project details:
     - **Project Name**: `HashBuzz Local Development`
     - **Description**: `HashBuzz social media campaign platform`
     - **URL**: `http://localhost:3000`
     - **Icon**: Upload HashBuzz logo (optional)

3. **Configure Project Settings**
   - Go to project settings
   - Add allowed domains:
     - `localhost:3000`
     - `localhost:3000`
   - Note down your **Project ID** → Use as `VITE_PROJECT_ID`

4. **Test WalletConnect Integration**
   ```bash
   # The Project ID should be a UUID format like:
   # xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   echo "VITE_PROJECT_ID=your-project-id-here" >> frontend/.env
   ```

##### **🔥 Firebase Setup (Required for Authentication)**

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Enter project name: `hashbuzz-local-dev`
   - Disable Google Analytics (optional for development)

2. **Enable Authentication**
   - Go to "Authentication" → "Get started"
   - Choose "Sign-in method" tab
   - Enable providers you want (Email/Password, Google, etc.)

3. **Create Web App**
   - Go to "Project settings" (gear icon)
   - Scroll to "Your apps" → Click web icon `</>`
   - Register app: `HashBuzz Frontend`
   - Copy config values to use in `frontend/.env`:

   ```javascript
   // Copy these values from Firebase config
   const firebaseConfig = {
     apiKey: "your-api-key",                    // → VITE_FIREBASE_API_KEY
     authDomain: "project.firebaseapp.com",     // → VITE_FIREBASE_AUTH_DOMAIN
     projectId: "your-project-id",              // → VITE_FIREBASE_PROJECT_ID
     storageBucket: "project.appspot.com",      // → VITE_FIREBASE_STORAGE_BUCKET
     messagingSenderId: "123456789",            // → VITE_FIREBASE_MESSAGING_SENDER_ID
     appId: "1:123:web:abc123"                  // → VITE_FIREBASE_APP_ID
   };
   ```

##### **⛓️ Hedera Testnet Account Setup (Required for Blockchain)**

1. **Create Hedera Account**
   - Go to [Hedera Portal](https://portal.hedera.com/)
   - Create account and verify email
   - Request testnet account creation

2. **Fund Your Account**
   - Go to testnet portal
   - Request testnet HBAR (free)
   - Verify balance on [HashScan Testnet](https://hashscan.io/testnet)

3. **Get Account Credentials**
   - Account ID format: `0.0.XXXXXX` → Use as `HEDERA_ACCOUNT_ID`
   - Private Key (DER format) → Use as `HEDERA_PRIVATE_KEY`

#### **Step 5: Environment Configuration**

Now configure environment variables with the API keys you obtained:

```bash
# Configure backend environment
nano backend/.env

# REQUIRED: Update these critical variables:
# - DATABASE_URL=postgresql://hashbuzz:hashbuzz@localhost:5432/hashbuzz_db?schema=public
# - HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
# - HEDERA_PRIVATE_KEY=your-hedera-private-key
# - TWITTER_API_KEY=your-twitter-api-key
# - TWITTER_API_SECRET=your-twitter-api-secret
# - J_ACCESS_TOKEN_SECRET=generate-64-char-random-string
# - J_REFRESH_TOKEN_SECRET=generate-64-char-random-string
# - ENCRYPTION_KEY=generate-32-char-random-string
# - SESSION_SECRET=generate-64-char-random-string

# Generate random secrets (save these values)
openssl rand -hex 32  # For ENCRYPTION_KEY
openssl rand -hex 32  # For J_ACCESS_TOKEN_SECRET
openssl rand -hex 32  # For J_REFRESH_TOKEN_SECRET
openssl rand -hex 32  # For SESSION_SECRET

# Configure frontend environment
nano frontend/.env

# REQUIRED: Update these variables:
# - VITE_PROJECT_ID=your-walletconnect-project-id
# - VITE_FIREBASE_API_KEY=your-firebase-api-key
# - VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
# - All other VITE_FIREBASE_* variables
```

#### **Step 6: Backend Setup**

Set up the Node.js backend with database and dependencies:

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# Verify Prisma installation
npx prisma --version

# Setup database schema
npx prisma db push

# Generate Prisma client
npx prisma generate

# Optional: Seed database with initial data
npx prisma db seed  # (if seed file exists)

# Start backend in development mode
npm run dev

# Backend should now be running on http://localhost:4000
```

#### **Step 7: Frontend Setup**

In a new terminal window, set up the React frontend:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies using Yarn
yarn install

# Verify installation
yarn --version

# Start frontend development server
yarn dev

# Frontend should now be running on http://localhost:3000
```

#### **Step 8: Smart Contracts Setup** (Optional)

If you need to deploy or work with smart contracts:

```bash
# Navigate to smart contracts directory (from project root)
cd smart-contracts

# Install dependencies
npm install

# Configure Hedera network settings
nano .env
# Add your Hedera testnet credentials

# Compile contracts
npm run compile

# Deploy contracts (if needed)
npm run deploy

# Run contract tests
npm test
```

#### **Step 9: Verification and Access**

Verify that all components are running correctly:

**Access Points:**

- **Frontend Application**: <http://localhost:3000>
- **Backend API**: <http://localhost:4000>
- **Database Admin (Prisma Studio)**: <http://localhost:5555>
- **API Documentation**: <http://localhost:4000/api-docs> (if Swagger is configured)

**Health Checks:**

```bash
# Backend health check
curl http://localhost:4000/health

# API status check
curl http://localhost:4000/api/status

# Database connection check
cd backend && npx prisma studio
# Should open Prisma Studio at http://localhost:5555

# Frontend accessibility
# Open http://localhost:3000 in browser
# Should show HashBuzz login/landing page
```

#### **Step 10: Development Workflow Setup**

Set up your development environment for ongoing work:

```bash
# Install recommended VS Code extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension prisma.prisma

# Set up Git hooks (from project root)
cd .git/hooks
# Add pre-commit hooks for linting and testing

# Configure environment for hot reloading
# Backend: npm run dev (nodemon auto-restart)
# Frontend: yarn dev (Vite hot reload)

# Optional: Set up database backup
pg_dump -h localhost -U hashbuzz hashbuzz_db > backup_$(date +%Y%m%d).sql
```

### 🧪 Verification Steps

1. **Health Check Endpoints**

   ```bash
   # Backend health
   curl http://localhost:4000/health

   # API status
   curl http://localhost:4000/api/status
   ```

2. **Database Connection**

   ```bash
   # Access Prisma Studio
   cd backend
   npx prisma studio
   # Opens at http://localhost:5555
   ```

3. **Frontend Access**
   - Open <http://localhost:3000>
   - Should see HashBuzz login page
   - Check browser console for errors

---

## 🧪 Testing & Validation

### 🔍 Feature Testing Checklist

#### **Authentication Flow**

- [ ] User registration with Hedera wallet
- [ ] Login with existing account
- [ ] Token refresh mechanism
- [ ] Session persistence

#### **Campaign Management**

- [ ] Create awareness campaign
- [ ] Create quest campaign with multiple choice questions
- [ ] Upload media files (images)
- [ ] Publish campaign to Twitter
- [ ] Monitor campaign metrics

#### **User Participation**

- [ ] View available campaigns/quests
- [ ] Participate in Twitter engagement (like, retweet, comment)
- [ ] Submit quest answers
- [ ] Track participation status

#### **Reward Distribution**

- [ ] Automatic reward calculation
- [ ] Smart contract token distribution
- [ ] Database tracking (amount_claimed updates)
- [ ] Failed distribution handling

### 🎯 Test Scenarios

#### **Scenario 1: Complete Campaign Lifecycle**

1. **Setup Test User**

   ```bash
   # Create test account with testnet HBAR
   # Associate test tokens if using fungible tokens
   ```

2. **Create Campaign**
   - Login to frontend
   - Navigate to "Create Campaign"
   - Fill campaign details (name, budget, rewards)
   - Upload test image
   - Publish campaign

3. **Participate as Different User**
   - Login with different account
   - View available campaigns
   - Perform required Twitter actions
   - Submit participation

4. **Verify Reward Distribution**
   - Wait for campaign to close (or manually close)
   - Check smart contract transactions
   - Verify token balance changes
   - Check database records

#### **Scenario 2: Quest Campaign Testing**

1. **Create Quest**
   - Create quest with multiple choice questions
   - Set correct answers
   - Define reward structure

2. **Test Participation**
   - Answer questions correctly/incorrectly
   - Verify scoring mechanism
   - Check reward eligibility

3. **Grade Responses**
   - Use admin panel to grade submissions
   - Verify automatic grading for multiple choice
   - Check manual grading workflow

### 🔧 API Testing

```bash
# Test key endpoints
curl -X GET http://localhost:4000/api/V201/quest/all
curl -X GET http://localhost:4000/api/V201/campaigns/all
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"accountAddress": "0.0.YOUR_ACCOUNT_ID"}'
```

---

## 📊 Monitoring & Debugging

### 🔍 Logging Locations

#### Backend Logs

```bash
# Application logs
tail -f backend/logs/jet-logger.log

# Backend development logs (console output)
cd backend && npm run dev

# Check backend process logs
ps aux | grep node
```

#### Frontend Logs

```bash
# Browser console (F12)
# Check for errors in Console tab

# Build logs
cd frontend && yarn build

# Development server logs
cd frontend && yarn dev
```

# Development server logs
cd frontend && npm run dev
```

### 📈 Health Monitoring

**Database Status**

```sql
-- Connect to PostgreSQL
psql -h localhost -U hashbuzz -d hashbuzz_db

-- Check campaign data
SELECT id, name, card_status, amount_claimed, campaign_budget
FROM campaign_twittercard
ORDER BY id DESC LIMIT 10;

-- Check user engagement
SELECT COUNT(*) as total_engagements, payment_status
FROM campaign_tweetengagements
GROUP BY payment_status;
```

**Redis Status**

```bash
# Connect to Redis
redis-cli

# Check session data
KEYS user:session:*
```

**Hedera Network Status**

```bash
# Check account balance
curl "https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.YOUR_ACCOUNT_ID"

# Check recent transactions
curl "https://testnet.mirrornode.hedera.com/api/v1/transactions?account.id=0.0.YOUR_ACCOUNT_ID&limit=5"
```

### 🚨 Error Monitoring

**Common Error Patterns**

- `413 Content Too Large`: File upload size issues
- `401 Unauthorized`: Token expiration or invalid JWT
- `NETWORK_ERROR`: Hedera network connectivity issues
- `INVALID_TOKEN_ASSOCIATION`: Token not associated with user wallet

**Frontend Error Boundary**

- Automatically catches React errors
- Logs detailed error information
- Provides user-friendly error recovery options
- Stores error history in localStorage

---

## 🔧 Troubleshooting

### ❌ Common Issues & Solutions

#### **Database Connection Issues**

```bash
# Problem: Cannot connect to PostgreSQL
# Solution: Check database is running and credentials are correct

# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL if not running
sudo service postgresql start

# Check database exists
psql -U hashbuzz -d hashbuzz_db -c "\dt"

# Recreate database if needed
dropdb hashbuzz_db
createdb hashbuzz_db
cd backend && npx prisma db push
```

#### **Redis Connection Issues**

```bash
# Problem: Cannot connect to Redis
# Solution: Check Redis is running

# Check if Redis is running
sudo service redis-server status

# Start Redis if not running
sudo service redis-server start

# Test Redis connection
redis-cli ping
# Should return "PONG"
```

#### **Package Installation Issues**

```bash
# Problem: npm/yarn install fails
# Solution: Clear cache and reinstall

# For backend (npm)
cd backend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# For frontend (yarn)
cd frontend
rm -rf node_modules yarn.lock
yarn cache clean
yarn install
```

#### **Prisma Issues**

```bash
# Problem: Prisma schema out of sync
# Solution: Reset and regenerate

cd backend

# Reset database
npx prisma db push --force-reset

# Generate client
npx prisma generate

# Seed database (if seed file exists)
npx prisma db seed
```

#### **Token Refresh Errors**

```bash
# Problem: Frequent 401 errors in frontend
# Solution: Check token timing configuration
# Ensure VITE_TOKEN_REFRESH_INTERVAL < ACCESS_TOKEN_EXPIRES_IN
```

#### **File Upload 413 Errors**

```bash
# Problem: File uploads fail with 413 Content Too Large
# Solution: Check multer and Express limits are aligned
# Backend: MAX_FILE_SIZE=10485760 (10MB)
# Frontend: Verify file size before upload
```

#### **Hedera Network Issues**

```bash
# Problem: Smart contract calls fail
# Solution: Check account balance and network status
curl "https://testnet.mirrornode.hedera.com/api/v1/network/status"

# Verify account has sufficient HBAR
curl "https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.YOUR_ACCOUNT_ID"
```

#### **Twitter API Rate Limits**

```bash
# Problem: Twitter API calls fail with 429 errors
# Solution: Implement proper rate limiting and retry logic
# Check Twitter API usage in developer portal
```

### 🔍 Debug Mode

**Enable Debug Logging**

```bash
# Backend debug mode
NODE_ENV=development
LOG_LEVEL=debug
DEBUG=hashbuzz:*

# Frontend debug mode
VITE_ENABLE_DEBUG_LOGS=true
VITE_ENABLE_DEV_TOOLS=true
```

**Database Query Debugging**

```bash
# Enable Prisma query logging
DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public&logging=true"
```

---

## 🔧 Troubleshooting Common Issues

### Database Connection Issues

**Problem**: `ECONNREFUSED` or database connection errors

**Solutions**:

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if stopped
sudo systemctl start postgresql

# Check if database exists
psql -h localhost -U hashbuzz -l

# Create database if missing
createdb -h localhost -U hashbuzz hashbuzz_db

# Test connection
psql -h localhost -U hashbuzz -d hashbuzz_db -c "SELECT version();"

# Check database configuration
cd backend && npx prisma db pull
```

### Redis Connection Issues

**Problem**: Redis connection failures or caching issues

**Solutions**:

```bash
# Check Redis status
redis-cli ping
# Should return "PONG"

# Start Redis if stopped
sudo systemctl start redis-server

# Check Redis configuration
redis-cli config get "*"

# Clear Redis cache if corrupted
redis-cli flushall

# Monitor Redis activity
redis-cli monitor
```

### Port Conflicts

**Problem**: "Port already in use" errors

**Solutions**:

```bash
# Check what's using specific ports
lsof -i :3000  # Frontend port
lsof -i :4000  # Backend port
lsof -i :5432  # PostgreSQL port
lsof -i :6379  # Redis port

# Kill processes using the ports
sudo kill -9 <PID>

# Or use different ports in environment variables
# Frontend: VITE_PORT=3001
# Backend: PORT=4001
```

### NPM/Yarn Installation Issues

**Problem**: Package installation failures or dependency conflicts

**Solutions**:

```bash
# Clear npm cache
npm cache clean --force

# Clear yarn cache
yarn cache clean

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For yarn projects
rm -rf node_modules yarn.lock
yarn install

# Check Node.js version compatibility
node --version
# Should be v18.x or v20.x

# Update npm to latest
npm install -g npm@latest
```

### Environment Variable Issues

**Problem**: Missing or incorrect environment variables

**Solutions**:

```bash
# Verify environment files exist
ls -la backend/.env frontend/.env

# Check environment loading in backend
cd backend
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL);"

# Validate Hedera network configuration
node -e "
require('dotenv').config();
console.log('Account ID:', process.env.HEDERA_ACCOUNT_ID);
console.log('Network:', process.env.HEDERA_NETWORK);
"

# Generate missing JWT secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'));"
```

### Prisma Schema Issues

**Problem**: Database schema mismatches or migration errors

**Solutions**:

```bash
cd backend

# Reset database and regenerate schema
npx prisma migrate reset --force

# Push current schema to database
npx prisma db push --force-reset

# Generate fresh Prisma client
npx prisma generate

# Inspect database state
npx prisma studio

# Check schema differences
npx prisma diff
```

### Hedera Network Issues

**Problem**: Smart contract deployment or transaction failures

**Solutions**:

```bash
# Test Hedera connection
node -e "
const { Client, AccountBalanceQuery } = require('@hashgraph/sdk');
require('dotenv').config();

const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

new AccountBalanceQuery()
  .setAccountId(process.env.HEDERA_ACCOUNT_ID)
  .execute(client)
  .then(balance => console.log('Balance:', balance.hbars.toString()))
  .catch(err => console.error('Error:', err.message));
"

# Check account balance and permissions
# Ensure testnet account has sufficient HBAR

# Verify smart contract deployment
# Check Hashscan explorer for transaction history
```

### Performance Issues

**Problem**: Slow application performance or memory leaks

**Solutions**:

```bash
# Monitor Node.js performance
cd backend
npm run dev --inspect

# Check memory usage
node --max-old-space-size=4096 src/index.ts

# Monitor database performance
cd backend
npx prisma studio
# Check slow queries in logs

# Frontend performance debugging
cd frontend
yarn build --analyze

# Check bundle size
npx webpack-bundle-analyzer build/static/js/*.js
```

### Development Server Issues

**Problem**: Hot reload not working or server crashes

**Solutions**:

```bash
# Backend: Clear nodemon cache
cd backend
rm -rf node_modules/.cache
npm run dev

# Frontend: Clear Vite cache
cd frontend
rm -rf node_modules/.vite
yarn dev

# Check file watchers limit (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Restart development servers with clean state
cd backend && npm run dev &
cd frontend && yarn dev &
```

### Quick Health Check Script

Create a script to verify all components:

```bash
#!/bin/bash
# save as health-check.sh

echo "🔍 HashBuzz Health Check"
echo "========================"

# Check Node.js
echo "Node.js: $(node --version)"

# Check PostgreSQL
pg_isready -h localhost -p 5432 && echo "✅ PostgreSQL: Running" || echo "❌ PostgreSQL: Not running"

# Check Redis
redis-cli ping > /dev/null 2>&1 && echo "✅ Redis: Running" || echo "❌ Redis: Not running"

# Check backend dependencies
cd backend
if [ -d "node_modules" ]; then
    echo "✅ Backend: Dependencies installed"
else
    echo "❌ Backend: Run npm install"
fi

# Check frontend dependencies
cd ../frontend
if [ -d "node_modules" ]; then
    echo "✅ Frontend: Dependencies installed"
else
    echo "❌ Frontend: Run yarn install"
fi

# Check environment files
[ -f "backend/.env" ] && echo "✅ Backend .env exists" || echo "❌ Backend .env missing"
[ -f "frontend/.env" ] && echo "✅ Frontend .env exists" || echo "❌ Frontend .env missing"

echo "========================"
echo "Run this script anytime: ./health-check.sh"
```

For additional help, check the specific documentation files in the `docs/` directory or create an issue in the GitHub repository.

---

## 🎯 Success Validation

### ✅ Full System Test

**Complete this workflow to validate the system:**

1. **✅ Environment Setup**
   - [ ] All services running (Frontend, Backend, Database, Redis)
   - [ ] Environment variables configured
   - [ ] Health checks passing

2. **✅ User Registration**
   - [ ] Connect Hedera wallet (HashPack/Blade)
   - [ ] Complete user registration
   - [ ] Verify session persistence

3. **✅ Campaign Creation**
   - [ ] Create new campaign with media upload
   - [ ] Publish to Twitter successfully
   - [ ] View campaign in dashboard

4. **✅ Participation**
   - [ ] View available campaigns as different user
   - [ ] Complete Twitter engagement actions
   - [ ] Verify participation tracking

5. **✅ Quest System**
   - [ ] Create quest campaign with questions
   - [ ] Submit answers as participant
   - [ ] Grade responses (manual/automatic)

6. **✅ Reward Distribution**
   - [ ] Close campaign (manual or automatic)
   - [ ] Verify token distribution via smart contract
   - [ ] Check updated user balances
   - [ ] Confirm database records (amount_claimed)

7. **✅ Error Handling**
   - [ ] Test error boundary in frontend
   - [ ] Verify API error responses
   - [ ] Check failed transaction handling

## 🎉 Final Setup Validation

### Complete System Test Workflow

Once all services are running, validate the complete HashBuzz platform functionality:

#### **✅ Step 1: Service Health Check**

```bash
# Check all services are running
curl http://localhost:4000/health        # Backend health
curl http://localhost:4000/api/status    # API status
redis-cli ping                           # Redis (should return "PONG")

# Check database
cd backend && npx prisma studio          # Opens at http://localhost:5555

# Check frontend
# Open http://localhost:3000 in browser
```

#### **✅ Step 2: Authentication Flow Test**

1. **Frontend Access**:
   - Open <http://localhost:3000>
   - Should see HashBuzz login/landing page
   - No console errors should appear

2. **Wallet Connection**:
   - Click "Connect Wallet" button
   - Should see WalletConnect QR code or wallet selection
   - Test with HashPack or Blade wallet on testnet

3. **User Registration**:
   - Complete wallet connection
   - Fill user registration form
   - Verify session persistence after page refresh

#### **✅ Step 3: Campaign Functionality Test**

1. **Campaign Creation**:
   - Navigate to "Create Campaign"
   - Upload test image/video
   - Fill campaign details
   - Publish campaign

2. **Twitter Integration**:
   - Verify campaign appears on connected Twitter account
   - Check tweet content and media

3. **Database Verification**:
   - Check Prisma Studio (http://localhost:5555)
   - Verify campaign record in `campaign_twittercard` table
   - Confirm media upload in `public/uploads/`

#### **✅ Step 4: Blockchain Integration Test**

1. **Smart Contract Interaction**:
   - Verify campaign smart contract deployment
   - Check transaction on [HashScan Testnet](https://hashscan.io/testnet)
   - Confirm HBAR balance changes

2. **Reward Distribution**:
   - Complete campaign participation
   - Trigger reward distribution
   - Verify token transfer on blockchain

#### **✅ Step 5: Complete User Journey**

1. **As Campaign Creator**:
   - Create campaign → Publish to Twitter → Monitor engagement
   - Close campaign → Distribute rewards → View analytics

2. **As Participant**:
   - Connect wallet → View campaigns → Participate in actions
   - Complete Twitter engagement → Claim rewards

### 🔍 Troubleshooting Quick Fixes

**Common Issues and Immediate Solutions**:

```bash
# Frontend won't start
cd frontend && rm -rf node_modules yarn.lock && yarn install

# Backend database errors
cd backend && npx prisma db push --force-reset

# Port conflicts
lsof -i :3000 :4000 :5432 :6379  # Check what's using ports
sudo kill -9 <PID>                # Kill conflicting processes

# Environment variable issues
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL);"

# Twitter API authentication fails
curl -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
     "https://api.twitter.com/2/users/me"

# Wallet connection issues
# Check VITE_PROJECT_ID is valid UUID format
# Verify WalletConnect project domain settings
```

### 🎯 Success Indicators

**✅ Your setup is complete when you can**:
- Access frontend at localhost:3000 without errors
- Connect Hedera wallet (testnet)
- Create and publish Twitter campaigns
- See data in Prisma Studio
- Complete end-to-end user journey
- View blockchain transactions on HashScan

**📞 Need Help?**
- Check [🔧 Troubleshooting](#-troubleshooting) section below
- Review [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed environment configuration
- Create an issue in the GitHub repository

---

## 📚 Additional Resources

- **[Environment Setup Guide](./ENVIRONMENT_SETUP.md)**
- **[Frontend Documentation](./frontend/README.md)**
- **[Backend API Documentation](./backend/ReadMe.md)**
- **[Smart Contracts Documentation](./smart-contracts/README.md)**
- **[Frontend Developer Guide](./frontend/docs/DEVELOPER_ONBOARDING.md)**
- **[Backend Developer Onboarding](./backend/DEVELOPER_ONBOARDING.md)**
- **[Deployment Guide](./frontend/docs/DEPLOYMENT_GUIDE.md)**
- **[Error Boundary Guide](./frontend/docs/ERROR_BOUNDARY_GUIDE.md)**
- **[Contract Error Handling](./backend/docs/CONTRACT_ERROR_HANDLING.md)**
- **[Backend Security Guide](./backend/SECURITY.md)**
- **[Safe Testing Guide](./backend/SAFE_TESTING_GUIDE.md)**

---

**📧 Support**: For technical questions or issues, check the troubleshooting section above or create an issue in the repository.

**🚀 Ready to explore HashBuzz? Start with the Quick Start Guide above!**

---

## 🆔 Deployed Hedera Testnet IDs

> **📍 All HashBuzz components deployed on Hedera Testnet for development and evaluation**

### 🏗️ Smart Contract Deployments

#### **Main Campaign Contract**
```
Contract ID: 0.0.CONTRACT_ID_1
Contract Name: HashBuzzCampaign
Description: Core campaign management and reward distribution
Deployment: Hedera Testnet
Solidity Version: 0.8.19
```

#### **Token Management Contract**
```
Contract ID: 0.0.CONTRACT_ID_2
Contract Name: HashBuzzTokenManager
Description: HTS token operations and user balance management
Deployment: Hedera Testnet
Solidity Version: 0.8.19
```

#### **Quest System Contract**
```
Contract ID: 0.0.CONTRACT_ID_3
Contract Name: HashBuzzQuestSystem
Description: Quest-based campaigns with Q&A functionality
Deployment: Hedera Testnet
Solidity Version: 0.8.19
```

### 🪙 Token Deployments

#### **HBUZZ Reward Token**
```
Token ID: 0.0.TOKEN_ID_1
Token Name: HashBuzz Token
Token Symbol: HBUZZ
Token Type: Fungible Token (HTS)
Decimals: 8
Max Supply: 1,000,000,000 HBUZZ
Treasury Account: 0.0.TREASURY_ACCOUNT
```

#### **HBUZZ-NFT Campaign Badges**
```
Token ID: 0.0.TOKEN_ID_2
Token Name: HashBuzz Campaign Badges
Token Symbol: HBUZZ-NFT
Token Type: Non-Fungible Token (HTS)
Max Supply: Unlimited
Treasury Account: 0.0.TREASURY_ACCOUNT
```

### 📝 HCS Topic IDs

#### **Campaign Events Topic**
```
Topic ID: 0.0.TOPIC_ID_1
Topic Name: hashbuzz-campaign-events
Description: Campaign creation, updates, and completion events
Submit Key: Required (Campaign Contract)
```

#### **User Activity Topic**
```
Topic ID: 0.0.TOPIC_ID_2
Topic Name: hashbuzz-user-activity
Description: User participation, rewards, and engagement tracking
Submit Key: Required (Backend Service)
```

#### **System Notifications Topic**
```
Topic ID: 0.0.TOPIC_ID_3
Topic Name: hashbuzz-notifications
Description: System-wide notifications and announcements
Submit Key: Required (Admin Account)
```

### 🔑 Key Hedera Account IDs

#### **HashBuzz Platform Accounts**

**Main Platform Account (Treasury)**
```
Account ID: 0.0.TREASURY_ACCOUNT
Description: Primary treasury and contract management account
HBAR Balance: ~1000 ℏ (for contract operations)
Associated Tokens: HBUZZ, HBUZZ-NFT
```

**Backend Service Account**
```
Account ID: 0.0.SERVICE_ACCOUNT
Description: Backend service account for automated operations
HBAR Balance: ~500 ℏ (for transaction fees)
Associated Tokens: HBUZZ
```

**Campaign Distribution Account**
```
Account ID: 0.0.DISTRIBUTION_ACCOUNT
Description: Automated reward distribution account
HBAR Balance: ~200 ℏ (for distribution transactions)
Associated Tokens: HBUZZ, HBUZZ-NFT
```

#### **Test User Accounts**

**Demo Creator Account**
```
Account ID: 0.0.DEMO_CREATOR_ID
Description: Sample campaign creator for demonstrations
HBAR Balance: ~100 ℏ
Associated Tokens: HBUZZ, HBUZZ-NFT
```

**Demo Participant Account**
```
Account ID: 0.0.DEMO_PARTICIPANT_ID
Description: Sample campaign participant for testing
HBAR Balance: ~50 ℏ
Associated Tokens: HBUZZ
```

### 🔗 Verification Links

**View on HashScan Testnet:**
- **Main Contract**: Use your deployed contract ID
- **HBUZZ Token**: Use your deployed token ID
- **Platform Account**: Use your treasury account ID

**Mirror Node API Endpoints:**
```bash
# Contract information
curl "https://testnet.mirrornode.hedera.com/api/v1/contracts/0.0.YOUR_CONTRACT_ID"

# Token information
curl "https://testnet.mirrornode.hedera.com/api/v1/tokens/0.0.YOUR_TOKEN_ID"

# Account balance
curl "https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.YOUR_ACCOUNT_ID"

# Topic messages
curl "https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.YOUR_TOPIC_ID/messages"
```

### 📊 Network Configuration

```bash
# Environment Variables for Testnet
HEDERA_NETWORK=testnet
MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com
HASHSCAN_URL=https://hashscan.io/testnet

# Contract Addresses for Environment Files
HEDERA_CONTRACT_ID=0.0.YOUR_CONTRACT_ID
HEDERA_TOKEN_ID=0.0.YOUR_TOKEN_ID
HEDERA_TREASURY_ID=0.0.YOUR_TREASURY_ID
```

### ⚠️ Important Notes

1. **Testnet Environment**: All IDs are for development and testing only
2. **Account Management**: Do not use real funds; testnet HBAR is free
3. **Contract Updates**: Contract IDs may change during development cycles
4. **Token Association**: Users must associate tokens before receiving transfers
5. **Transaction Fees**: All operations require small HBAR amounts for fees

### 🔄 Using These IDs in Your Setup

Add these to your `backend/.env` file:
```bash
# Hedera Testnet Configuration
HEDERA_NETWORK=testnet
HEDERA_CONTRACT_ID=0.0.YOUR_CONTRACT_ID
HEDERA_TOKEN_ID=0.0.YOUR_TOKEN_ID
HEDERA_TREASURY_ID=0.0.YOUR_TREASURY_ID
HEDERA_TOPIC_CAMPAIGNS=0.0.YOUR_TOPIC_ID_1
HEDERA_TOPIC_USERS=0.0.YOUR_TOPIC_ID_2
```

For testing campaign functionality, you can use the demo accounts or create new ones via the Hedera Portal.

---
