# 🔧 HashBuzz Environment Variables Setup Guide

> **Complete environment configuration guide for the unified HashBuzz platform**

## 📋 Overview

This document provides detailed environment variable setup for the HashBuzz unified repository structure. For complete system setup and development workflow, see [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md).

### Repository Structure

```text
hashbuzz-unified/
├── frontend/          # React/Vite frontend (Yarn)
├── backend/           # Node.js/Express backend (npm)
├── smart-contracts/   # Hedera smart contracts (npm)
└── docs/             # Documentation
```

## 🎯 Frontend Environment Variables

Create `frontend/.env` with the following configuration:

```bash
# Port Configuration (Optional)
# PORT=3500

# Network Configuration
VITE_NETWORK=testnet

# API Configuration
VITE_DAPP_API=http://localhost:4000
VITE_API_BASE_URL=http://localhost:4000

# Mirror Node Configuration
VITE_MIRROR_NODE_LINK=https://testnet.mirrornode.hedera.com

# Campaign Configuration
VITE_CAMPAIGN_DURATION=15

# WalletConnect Configuration (Get from WalletConnect Cloud)
VITE_PROJECT_ID=your-walletconnect-project-id-here

# YouTube Configuration
VITE_YOUTUBE_VIDEO_URL=https://www.youtube.com/embed/VIDEO_ID_HERE

# Feature Flags
VITE_ENABLE_V201_CAMPAIGNS=true
VITE_ENABLE_CAMPAIGN_V201=true

# Firebase Configuration (Get from Firebase Console)
VITE_FIREBASE_API_KEY=your-firebase-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id-here
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-MEASUREMENT_ID_HERE

# Session & Token Configuration
VITE_TOKEN_REFRESH_INTERVAL=90000
VITE_TOKEN_EXPIRY_BUFFER=30000
```

## 🎯 Backend Environment Variables

Create `backend/.env` with the following configuration:

```bash
# Application Environment
NODE_ENV=development

# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/database_name?schema=public

# Redis Cache Configuration
REDIS_URL=redis://localhost:6379

# Jet Logger Configuration
JET_LOGGER_MODE=FILE
JET_LOGGER_FILEPATH=logs/jet-logger.log
JET_LOGGER_FILEPATH_DATETIME=FALSE
JET_LOGGER_TIMESTAMP=TRUE
JET_LOGGER_FORMAT=LINE

# Port Configuration
PORT=4000

# Blockchain Parameters (Hedera)
HEDERA_NETWORK=testnet
HEDERA_PRIVATE_KEY=your-hedera-private-key-here
HEDERA_PUBLIC_KEY=your-hedera-public-key-here
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
REWARD_CALIM_DURATION=15
CAMPAIGN_DURATION=15
MIRROR_NODE=https://testnet.mirrornode.hedera.com

# Twitter API Configuration
TWITTER_APP_USER_TOKEN=your-twitter-app-user-token-here
TWITTER_API_KEY=your-twitter-api-key-here
TWITTER_API_SECRET=your-twitter-api-secret-here

# HashBuzz Twitter Account Credentials
HASHBUZZ_ACCESS_TOKEN=your-hashbuzz-access-token-here
HASHBUZZ_ACCESS_SECRET=your-hashbuzz-access-secret-here

# Twitter Callback Configuration
TWITTER_CALLBACK_HOST=http://localhost:4000

# OpenAI Configuration
OPEN_AI_KEY=your-openai-api-key-here

# JWT & Security Configuration
J_ACCESS_TOKEN_SECRET=your-access-token-secret-here
J_REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
ENCRYPTION_KEY=your-encryption-key-here

# Frontend URL Configuration
FRONTEND_URL=http://localhost:3000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://www.hashbuzz.social,https://hashbuzz.social

# Smart Contract Configuration
HASHBUZZ_CONTRACT_ADDRESS=0.0.CONTRACT_ADDRESS
ADMIN_ADDRESS=0.0.ADMIN_ADDRESS_1,0.0.ADMIN_ADDRESS_2

# GitHub Repository Configuration
REPO_CLIENT_ID=your-github-client-id-here
REPO_CLIENT_SECRET=your-github-client-secret-here
REPO=hashbuzz/dApp-backend

# Session Secret
SESSION_SECRET=your-session-secret-here

# Digital Ocean Spaces Configuration
BUCKET_ACCESS_KEY_ID=your-bucket-access-key-here
BUCKET_SECRET_ACCESS_KEY=your-bucket-secret-key-here
BUCKET_NAME=campaign-media
BUCKET_ENDPOINT=https://sfo3.digitaloceanspaces.com
BUCKET_REGION=sfo3

# Email Configuration
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password-here
ALERT_RECEIVER=notifications@yourdomain.com

# Token Expiration Configuration
ACCESS_TOKEN_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d
```

## 🎯 Smart Contracts Environment Variables

Create `smart-contracts/.env` with the following configuration:

```bash
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_PRIVATE_KEY=YOUR_HEDERA_PRIVATE_KEY

# Testnet Mirror Node
MIRROR_NODE=https://testnet.mirrornode.hedera.com

# Test Account (Optional)
TEST_ACCOUNT_ID=0.0.TEST_ACCOUNT_ID
TEST_PRIVATE_KEY=YOUR_TEST_PRIVATE_KEY
```

## 🔑 How to Obtain API Keys and Credentials

### 🐦 Twitter API Setup (Essential for Campaign Functionality)

**Why needed**: HashBuzz creates and manages Twitter-based marketing campaigns. Without Twitter API access, the core campaign functionality will not work.

1. **Apply for Twitter Developer Account**
   - Visit [Twitter Developer Portal](https://developer.twitter.com/)
   - Click "Apply for a developer account"
   - **Important**: Application approval can take 1-7 days
   - Complete the detailed application form explaining your use case:
     - Use case: "Social media campaign management platform"
     - Will you display Twitter content: "Yes, campaign tweets and engagement metrics"
     - Will you analyze Twitter content: "Yes, for campaign performance tracking"

2. **Create Twitter Application**
   - After approval, sign in to [Developer Portal](https://developer.twitter.com/en/portal/dashboard)
   - Click "Create App" or "Add App"
   - **App Details**:
     - **Name**: `HashBuzz-Local-Development`
     - **Description**: `HashBuzz social media campaign platform for local development`
     - **Website URL**: `http://localhost:3000`
     - **Tell us how this app will be used**: Describe campaign management functionality

3. **Configure App Permissions and Authentication**
   - Go to your app → "Settings" → "User authentication settings"
   - Click "Set up" if not configured
   - **App permissions**: Select "Read and write" (required for campaign creation)
   - **Type of App**: "Web App, Automated App or Bot"
   - **App info**:
     - **Callback URI**: `http://localhost:4000/auth/twitter/callback`
     - **Website URL**: `http://localhost:3000`
     - **Organization name**: Your organization or personal name
     - **Organization website**: `http://localhost:3000`
   - Save settings

4. **Generate and Collect API Keys**
   - Go to "Keys and Tokens" tab
   - **API Key and Secret** (regenerate if needed):
     - `API Key` → Copy to `TWITTER_API_KEY`
     - `API Secret Key` → Copy to `TWITTER_API_SECRET`
   - **Bearer Token**:
     - Copy to `TWITTER_BEARER_TOKEN`
   - **Access Token and Secret**:
     - Click "Generate" if not exists
     - `Access Token` → Copy to `TWITTER_ACCESS_TOKEN`
     - `Access Token Secret` → Copy to `TWITTER_ACCESS_TOKEN_SECRET`

5. **Test API Access**
   ```bash
   # Test API connectivity
   curl -H "Authorization: Bearer YOUR_BEARER_TOKEN" \
        "https://api.twitter.com/2/users/me"
   
   # Should return your Twitter account information
   ```

6. **Important Notes**:
   - Keep all credentials secure and never commit to version control
   - Callback URL must exactly match: `http://localhost:4000/auth/twitter/callback`
   - For production, you'll need to update URLs to your actual domain

### 🔗 WalletConnect Project Setup (Essential for Wallet Integration)

**Why needed**: HashBuzz integrates with Hedera wallets (HashPack, Blade Wallet) for blockchain transactions. WalletConnect enables this integration.

1. **Create WalletConnect Account**
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Sign up with your email address
   - Verify email through confirmation link

2. **Create New Project**
   - Click "Create" or "New Project" in dashboard
   - **Project Details**:
     - **Name**: `HashBuzz Local Development`
     - **Description**: `HashBuzz social media campaign platform - local development environment`
     - **Homepage URL**: `http://localhost:3000`
     - **Image URL**: (optional) Link to HashBuzz logo

3. **Configure Project Settings**
   - **Allowed Domains**: Add these for local development:
     - `localhost:3000`
     - `0.0.XXXXXX:3000`
     - `localhost` (general)
   - **Redirect URIs**: Add if needed:
     - `http://localhost:3000`

4. **Get Project ID**
   - Copy your **Project ID** from the dashboard
   - Format looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Use this as `VITE_PROJECT_ID` in frontend/.env

5. **Test WalletConnect Setup**
   ```bash
   # Verify Project ID format (should be UUID)
   echo "VITE_PROJECT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" >> frontend/.env
   ```

6. **Important Notes**:
   - Project ID is not sensitive but should match exactly
   - For production, add your actual domain to allowed domains
   - Keep the Cloud dashboard bookmarked for monitoring connection analytics

### 🔥 Firebase Configuration (Required for User Authentication)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" or select existing project
   - **Project Name**: `hashbuzz-local-dev` (or similar)
   - **Google Analytics**: Disable for development (optional)

2. **Enable Authentication Services**
   - Navigate to "Authentication" → "Get started"
   - Go to "Sign-in method" tab
   - Enable authentication providers you need:
     - **Email/Password**: For basic auth
     - **Google**: For social login (optional)
     - Others as needed

3. **Create Web App Configuration**
   - Go to Project Settings (gear icon) → "General" tab
   - Scroll to "Your apps" section
   - Click web icon `</>` to add web app
   - **Register app**:
     - **App nickname**: `HashBuzz Frontend`
     - **Also set up Firebase Hosting**: No (uncheck)
   - Copy the configuration object

4. **Extract Configuration Values**
   From the Firebase config object, map these values:
   ```javascript
   // Firebase provides this config object:
   const firebaseConfig = {
     apiKey: "AIza...",                     // → VITE_FIREBASE_API_KEY
     authDomain: "project.firebaseapp.com", // → VITE_FIREBASE_AUTH_DOMAIN
     projectId: "your-project-id",          // → VITE_FIREBASE_PROJECT_ID
     storageBucket: "project.appspot.com",  // → VITE_FIREBASE_STORAGE_BUCKET
     messagingSenderId: "123456789",        // → VITE_FIREBASE_MESSAGING_SENDER_ID
     appId: "1:123:web:abc123"              // → VITE_FIREBASE_APP_ID
   };
   ```

### ⛓️ Hedera Hashgraph Setup (Required for Blockchain Integration)

1. **Create Hedera Portal Account**
   - Go to [Hedera Portal](https://portal.hedera.com/)
   - Create developer account with email verification
   - Complete profile setup

2. **Create Testnet Account**
   - Navigate to testnet section
   - Click "Create Testnet Account"
   - **Important**: Save the generated credentials immediately:
     - **Account ID**: Format `0.0.XXXXXX` → Use as `HEDERA_ACCOUNT_ID`
     - **Private Key**: Long DER-encoded string → Use as `HEDERA_PRIVATE_KEY`

3. **Fund Testnet Account**
   - Use the portal's testnet faucet to get free HBAR
   - Or visit [Hedera Faucet](https://portal.hedera.com/faucet)
   - Verify balance on [HashScan Testnet](https://hashscan.io/testnet)

4. **Test Account Access**
   ```bash
   # Check account balance using Mirror Node API
   curl "https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.YOUR_ACCOUNT_ID"
   ```

### 🤖 OpenAI API Setup (Optional - for AI Features)

1. **Create Account**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up and verify phone number

2. **Generate API Key**
   - Go to API Keys section
   - Create new secret key → `OPENAI_API_KEY`
   - **Important**: Add credits for usage (paid service)

## 🚀 Quick Setup Process

### Step 1: Clone and Navigate

```bash
# Clone the unified repository
git clone https://github.com/ops295/hashbuzz-unified.git
cd hashbuzz-unified
```

### Step 2: Environment File Setup

```bash
# Create environment files from templates
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp smart-contracts/.env.example smart-contracts/.env

# Edit each file with your actual credentials
nano frontend/.env      # Update Firebase, WalletConnect
nano backend/.env       # Update database, API keys, secrets
nano smart-contracts/.env  # Update Hedera credentials
```

### Step 3: Generate Security Secrets

```bash
# Generate strong JWT secrets (run multiple times for different secrets)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL (if Node.js not available)
openssl rand -hex 64  # For JWT secrets
openssl rand -hex 32  # For encryption key
```

### Step 4: Database Setup

```bash
# Option 1: Local PostgreSQL (Recommended for development)
sudo -u postgres createdb hashbuzz_db
sudo -u postgres createuser hashbuzz
sudo -u postgres psql -c "ALTER USER hashbuzz WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE hashbuzz_db TO hashbuzz;"

# Option 2: Docker PostgreSQL
cd backend
docker compose up postgres redis -d
```

### Step 5: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup database schema
npx prisma db push

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
# Backend running at http://localhost:4000
```

### Step 6: Frontend Setup

```bash
# New terminal window
cd frontend

# Install dependencies with Yarn
yarn install

# Start development server
yarn dev
# Frontend running at http://localhost:3000
```

### Step 7: Smart Contracts Setup (Optional)

```bash
# New terminal window
cd smart-contracts

# Install dependencies
npm install

# Compile contracts
npm run compile

# Deploy to testnet (if needed)
npm run deploy
```

## ✅ System Validation

### Health Check Commands

```bash
# Check backend health
curl http://localhost:4000/health

# Check API status
curl http://localhost:4000/api/status

# Check database connection
cd backend && npx prisma studio
# Opens Prisma Studio at http://localhost:5555

# Check Redis connection
redis-cli ping
# Should return "PONG"

# Check frontend accessibility
# Open http://localhost:3000 in browser
# Should show HashBuzz application

# Check all services status
docker compose ps  # If using Docker
```

### Application Access Points

- **Frontend Application**: <http://localhost:3000>
- **Backend API**: <http://localhost:4000>
- **API Documentation**: <http://localhost:4000/api-docs> (if configured)
- **Database Admin**: <http://localhost:5555> (Prisma Studio)
- **Health Endpoint**: <http://localhost:4000/health>

### Environment Variable Validation

```bash
# Backend environment check
cd backend
node -e "
require('dotenv').config();
console.log('✅ Environment Variables:');
console.log('Database:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('JWT Secret:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('Hedera Account:', process.env.HEDERA_ACCOUNT_ID ? '✅ Set' : '❌ Missing');
console.log('Twitter API:', process.env.TWITTER_API_KEY ? '✅ Set' : '❌ Missing');
"

# Frontend environment check
cd frontend
node -e "
const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
console.log('✅ Frontend Environment:');
console.log('Firebase API Key:', envFile.includes('VITE_FIREBASE_API_KEY=') ? '✅ Set' : '❌ Missing');
console.log('WalletConnect:', envFile.includes('VITE_PROJECT_ID=') ? '✅ Set' : '❌ Missing');
"
```

## 🐛 Common Issues and Solutions

### Database Connection Problems

```bash
# Problem: Connection refused
# Check PostgreSQL service
sudo systemctl status postgresql
sudo systemctl start postgresql

# Check database exists
psql -h localhost -U hashbuzz -l

# Test connection
psql -h localhost -U hashbuzz -d hashbuzz_db -c "SELECT version();"
```

### Redis Connection Issues

```bash
# Problem: Redis connection failed
# Check Redis service
sudo systemctl status redis-server
sudo systemctl start redis-server

# Test Redis
redis-cli ping
redis-cli info server
```

### Port Conflicts

```bash
# Problem: "Port already in use"
# Check what's using the ports
lsof -i :3000  # Frontend
lsof -i :4000  # Backend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Kill conflicting processes
sudo kill -9 <PID>
```

### Authentication Token Issues

```bash
# Problem: Frequent 401 errors
# Solution: Check token timing configuration
# Frontend refresh interval should be < backend token expiry
# Frontend: VITE_TOKEN_REFRESH_INTERVAL=90000 (1.5 min)
# Backend: ACCESS_TOKEN_EXPIRES_IN=24h (or 2m for testing)
```

### File Upload Issues

```bash
# Problem: 413 Request Entity Too Large
# Solution: Check file size limits
# Backend: MAX_FILE_SIZE=10485760 (10MB)
# Nginx (if used): client_max_body_size 10M;
```

### Hedera Network Issues

```bash
# Problem: Smart contract calls fail
# Check account balance
curl "https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.YOUR_ACCOUNT_ID"

# Verify private key format (should be DER encoded)
# Check transaction on Hashscan: https://hashscan.io/testnet
```

### Package Installation Issues

```bash
# Backend (npm) issues
cd backend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Frontend (yarn) issues
cd frontend
rm -rf node_modules yarn.lock
yarn cache clean
yarn install

# Check Node.js version
node --version  # Should be v18.x or v20.x
```

## 🎯 Minimal Working Configuration

For quick testing and evaluation, ensure these **essential** components are configured:

### ✅ Required for Basic Operation

1. **Database**: PostgreSQL with correct credentials
2. **Cache**: Redis running on localhost:6379
3. **Security**: Generated JWT secrets (minimum 256-bit)
4. **Blockchain**: Hedera testnet account with HBAR balance
5. **Frontend**: Firebase project configured
6. **Backend**: Server running with database connection

### ⚠️ Required for Full Functionality

1. **Social Media**: Twitter API keys for campaign creation
2. **Wallet**: WalletConnect project ID for wallet integration
3. **Smart Contracts**: Deployed HashBuzz contract on Hedera
4. **File Uploads**: Proper upload directory permissions

### 🔧 Optional but Recommended

1. **AI Features**: OpenAI API key
2. **Notifications**: Email SMTP configuration
3. **Monitoring**: Application logging and error tracking
4. **Performance**: Redis caching optimization

## 📚 Related Documentation

- **[TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)** - Complete setup and development guide
- **[Frontend README](./frontend/README.md)** - Frontend-specific documentation
- **[Backend README](./backend/ReadMe.md)** - Backend API documentation
- **[Smart Contracts README](./smart-contracts/README.md)** - Contract deployment guide

---

## 🚀 Quick Start Summary

1. **Clone repository** and navigate to project root
2. **Create environment files** from templates
3. **Generate security secrets** using crypto functions
4. **Setup PostgreSQL and Redis** locally or via Docker
5. **Install dependencies** (npm for backend, yarn for frontend)
6. **Configure API keys** (Firebase, Twitter, Hedera, WalletConnect)
7. **Start services** (backend, frontend, database)
8. **Validate setup** using health checks and access points

**Need help?** Check the troubleshooting section above or refer to the comprehensive [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) for detailed setup instructions.

## 🎉 Setup Completion Checklist

### ✅ Pre-Setup Requirements

- [ ] **Twitter Developer Account** - Applied and approved (1-7 days)
- [ ] **Node.js 18+** - Installed and verified (`node --version`)
- [ ] **PostgreSQL** - Running and accessible
- [ ] **Redis** - Running and accessible
- [ ] **Git** - Installed for repository cloning

### ✅ API Keys and Credentials Obtained

- [ ] **Twitter API** - All 5 credentials collected
  - [ ] `TWITTER_API_KEY`
  - [ ] `TWITTER_API_SECRET` 
  - [ ] `TWITTER_BEARER_TOKEN`
  - [ ] `TWITTER_ACCESS_TOKEN`
  - [ ] `TWITTER_ACCESS_TOKEN_SECRET`
- [ ] **WalletConnect** - Project ID obtained
  - [ ] `VITE_PROJECT_ID` (UUID format)
- [ ] **Firebase** - Project configured
  - [ ] All 6 `VITE_FIREBASE_*` variables
- [ ] **Hedera** - Testnet account created
  - [ ] `HEDERA_ACCOUNT_ID` (0.0.XXXXXX format)
  - [ ] `HEDERA_PRIVATE_KEY` (DER format)
  - [ ] Account funded with testnet HBAR

### ✅ Environment Configuration Completed

- [ ] **Repository cloned** - `hashbuzz-unified` folder exists
- [ ] **Environment files created**:
  - [ ] `frontend/.env` - Configured with all VITE variables
  - [ ] `backend/.env` - Configured with all API keys and secrets
  - [ ] `smart-contracts/.env` - Configured with Hedera credentials
- [ ] **Security secrets generated** - All JWT and encryption keys
- [ ] **Database configured** - PostgreSQL accessible with credentials

### ✅ Services Running Successfully

- [ ] **Backend** - `npm run dev` running on port 4000
- [ ] **Frontend** - `yarn dev` running on port 3000  
- [ ] **Database** - PostgreSQL accessible, Prisma Studio working
- [ ] **Cache** - Redis running and responding to ping
- [ ] **Smart Contracts** - Compiled successfully (if using)

### ✅ System Validation Passed

- [ ] **Health Checks** - All API endpoints responding
- [ ] **Frontend Access** - Application loads without errors
- [ ] **Database Connection** - Prisma Studio opens and shows tables
- [ ] **Wallet Integration** - WalletConnect shows connection options
- [ ] **Authentication** - Firebase authentication working

### 🎯 Ready for Development

When all checkboxes above are completed, your HashBuzz development environment is fully configured and ready for:

- **Campaign Creation** - Twitter-based marketing campaigns
- **Wallet Integration** - Hedera blockchain wallet connections  
- **Reward Distribution** - Smart contract-based token distribution
- **User Management** - Firebase authentication and session management
- **Full Development Workflow** - Code changes, testing, and debugging

### 🚨 If Something Isn't Working

1. **Double-check environment variables** - Use the validation scripts provided
2. **Verify service status** - Ensure PostgreSQL and Redis are running
3. **Review API key format** - Ensure Twitter keys and Firebase config are correct
4. **Check port conflicts** - Use `lsof -i :PORT` to identify conflicts
5. **Consult troubleshooting** - Review the troubleshooting section above
6. **Check logs** - Look at terminal output for specific error messages

**🎉 Ready to explore HashBuzz? Your unified platform is now configured!**
