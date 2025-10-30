# 🚀 HashBuzz Technical Documentation

> **Complete setup guide for developers, judges, and evaluators to run the HashBuzz social media campaign platform**

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🏗️ System Architecture](#️-system-architecture)
- [🌊 Data Flow](#-data-flow)
- [⚙️ Environment Setup](#️-environment-setup)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [🧪 Testing & Validation](#-testing--validation)
- [📊 Monitoring & Debugging](#-monitoring--debugging)
- [🔧 Troubleshooting](#-troubleshooting)

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

```mermaid
graph TB
    %% Frontend Layer
    subgraph Frontend["🎨 Frontend (React)"]
        UI[User Interface]
        Wallet[Wallet Integration]
        State[Redux Store]
        API[RTK Query APIs]
    end

    %% Backend Layer
    subgraph Backend["⚙️ Backend (Node.js)"]
        Routes[API Routes]
        Controllers[Controllers]
        Services[Business Logic]
        Middleware[Middleware]
    end

    %% Data Layer
    subgraph Data["🗄️ Data Layer"]
        Postgres[(PostgreSQL)]
        Redis[(Redis Cache)]
        S3[File Storage]
    end

    %% Blockchain Layer
    subgraph Blockchain["⛓️ Blockchain"]
        Hedera[Hedera Hashgraph]
        Contracts[Smart Contracts]
        Tokens[HTS Tokens]
    end

    %% External Services
    subgraph External["🌐 External APIs"]
        Twitter[Twitter API]
        Firebase[Firebase]
        AWS[AWS Services]
    end

    %% Connections
    UI --> API
    API --> Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> Postgres
    Services --> Redis
    Services --> Hedera
    Services --> Twitter
    Wallet --> Hedera
    Services --> S3
    Hedera --> Contracts
    Contracts --> Tokens
```

### 🔄 V201 Modular Architecture

The backend uses a **dual architecture** approach:

```
📁 Backend Structure
├── Legacy System (src/controller/, src/routes/)  # Original monolithic
└── V201 System (src/V201/Modules/)              # New modular
    ├── quest/                                    # Quest campaigns
    ├── campaigns/                                # Legacy campaign support
    └── {module}/                                 # Future modules
        ├── Controller.ts                         # Request handlers
        ├── Routes.ts                            # API endpoints
        ├── services/                            # Business logic
        └── types.ts                             # TypeScript definitions
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
# REQUIRED - Application Configuration
# =============================================================================
NODE_ENV=development
VITE_NETWORK=testnet
VITE_BASE_URL=http://localhost:4000

# Token Management (Critical for session handling)
VITE_TOKEN_REFRESH_INTERVAL=90000           # 1.5 minutes
VITE_TOKEN_EXPIRY_BUFFER=30000              # 30 seconds

# =============================================================================
# REQUIRED - Firebase Configuration
# =============================================================================
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# =============================================================================
# REQUIRED - WalletConnect Configuration
# =============================================================================
VITE_PROJECT_ID=your-walletconnect-project-id

# =============================================================================
# OPTIONAL - Development Features
# =============================================================================
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_DEBUG_LOGS=true
VITE_ENABLE_CAMPAIGN_V201=true

# =============================================================================
# OPTIONAL - AWS Secrets Manager (Production)
# =============================================================================
FETCH_SECRETS=false                         # Set to true for production
AWS_REGION=us-east-1
SECRET_NAME=hashbuzz/frontend/secrets
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

### 🎯 Backend Environment Variables

Create `/dApp-backend/.env` based on `.env.example`:

```bash
# =============================================================================
# REQUIRED - Basic Configuration
# =============================================================================
NODE_ENV=development
PORT=4000
HOST=localhost

# =============================================================================
# REQUIRED - Database Configuration
# =============================================================================
DATABASE_URL="postgresql://hashbuzz:change_me@localhost:5432/hashbuzz_db"
POSTGRES_DB=hashbuzz
POSTGRES_USER=hashbuzz
POSTGRES_PASSWORD=change_me_in_production

# =============================================================================
# REQUIRED - Redis Configuration
# =============================================================================
REDIS_URL=redis://localhost:6379

# =============================================================================
# REQUIRED - Security Configuration
# =============================================================================
JWT_SECRET=your-super-secret-jwt-key-minimum-256-bits-long
JWT_REFRESH_SECRET=your-jwt-refresh-secret-here
SESSION_SECRET=your-session-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key

# Token Expiration
ACCESS_TOKEN_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# =============================================================================
# REQUIRED - Hedera Hashgraph Configuration
# =============================================================================
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.123456
HEDERA_OPERATOR_KEY=302e020100300506032b657004220420...
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_CONTRACT_ID=0.0.789012
MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com

# =============================================================================
# REQUIRED - Twitter API Configuration
# =============================================================================
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_CALLBACK_HOST=http://localhost:4000

# =============================================================================
# OPTIONAL - Additional Services
# =============================================================================
OPENAI_API_KEY=sk-your-openai-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ALERT_RECEIVER=admin@example.com

# Frontend CORS
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760                       # 10MB
UPLOAD_DIR=./public/uploads

# Campaign Configuration
CAMPAIGN_DURATION=1440                       # 24 hours in minutes
REWARD_CALIM_DURATION=60                     # 60 minutes
```

---

## 🚀 Quick Start Guide

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

#### **Option 1: Docker Setup (Recommended for Evaluation)**

1. **Clone and Setup**

   ```bash
   # Clone the repository
   git clone <repository-url>
   cd hashbuzz

   # Setup environment files
   cp dApp-backend/.env.example dApp-backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Configure Environment**

   ```bash
   # Edit backend environment
   nano dApp-backend/.env
   # Update: DATABASE_URL, JWT_SECRET, HEDERA_*, TWITTER_*

   # Edit frontend environment
   nano frontend/.env
   # Update: VITE_FIREBASE_*, VITE_PROJECT_ID
   ```

3. **Start Services**

   ```bash
   # Start complete stack
   cd dApp-backend
   docker compose --profile dev up -d

   # Start frontend separately
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access Applications**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:4000
   - **Database Admin**: http://localhost:5555 (Prisma Studio)
   - **Monitoring**: http://localhost:3001 (Grafana, if monitoring profile used)

#### **Option 2: Manual Setup**

1. **Backend Setup**

   ```bash
   cd dApp-backend

   # Install dependencies
   npm install

   # Setup database
   createdb hashbuzz_db
   npx prisma db push
   npx prisma generate

   # Start Redis
   redis-server

   # Start backend
   npm run dev
   ```

2. **Frontend Setup**

   ```bash
   cd frontend

   # Install dependencies
   npm install

   # Start development server
   npm run dev
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
   cd dApp-backend
   npx prisma studio
   # Opens at http://localhost:5555
   ```

3. **Frontend Access**
   - Open http://localhost:3000
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
  -d '{"accountAddress": "0.0.123456"}'
```

---

## 📊 Monitoring & Debugging

### 🔍 Logging Locations

**Backend Logs**

```bash
# Application logs
tail -f dApp-backend/logs/jet-logger.log

# Docker logs
docker compose logs -f api

# Database logs
docker compose logs -f postgres
```

**Frontend Logs**

```bash
# Browser console (F12)
# Check for errors in Console tab

# Build logs
npm run build

# Development server logs
npm run dev
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
docker compose ps postgres
docker compose logs postgres

# Reset database if needed
docker compose down postgres
docker volume rm dapp-backend_postgres_data
docker compose up postgres -d
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

**🎉 If all checks pass, the HashBuzz platform is fully operational and ready for evaluation!**

---

## 📚 Additional Resources

- **[Frontend Developer Guide](./frontend/docs/DEVELOPER_ONBOARDING.md)**
- **[Backend API Documentation](./dApp-backend/ReadMe.md)**
- **[Deployment Guide](./frontend/docs/DEPLOYMENT_GUIDE.md)**
- **[Error Boundary Guide](./frontend/docs/ERROR_BOUNDARY_GUIDE.md)**
- **[Contributing Guidelines](./CONTRIBUTING.md)**

---

**📧 Support**: For technical questions or issues, check the troubleshooting section above or create an issue in the repository.

**🚀 Ready to explore HashBuzz? Start with the Quick Start Guide above!**
