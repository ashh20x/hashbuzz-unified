# 🔧 HashBuzz Environment Variables Quick Reference

> **Fast setup guide for judges, evaluators, and developers**

## 📋 Required Environment Variables Summary

### 🎯 Frontend (.env)

```bash
# Application Configuration
NODE_ENV=development
VITE_NETWORK=testnet
VITE_BASE_URL=http://localhost:4000

# Token Configuration (Critical for session handling)
VITE_TOKEN_REFRESH_INTERVAL=90000          # 1.5 minutes (90 seconds)
VITE_TOKEN_EXPIRY_BUFFER=30000             # 30 seconds

# Firebase Configuration (Get from Firebase Console)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# WalletConnect Configuration (Get from WalletConnect Cloud)
VITE_PROJECT_ID=your-walletconnect-project-id

# Development Features
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_DEBUG_LOGS=true
VITE_ENABLE_CAMPAIGN_V201=true
```

### 🎯 Backend (.env)

```bash
# Basic Configuration
NODE_ENV=development
PORT=4000
HOST=localhost

# Database (PostgreSQL)
DATABASE_URL="postgresql://hashbuzz:your_password@localhost:5432/hashbuzz_db"
POSTGRES_DB=hashbuzz
POSTGRES_USER=hashbuzz
POSTGRES_PASSWORD=your_secure_password

# Redis Cache
REDIS_URL=redis://localhost:6379

# Security (Generate strong random strings)
JWT_SECRET=your-jwt-secret-256-bits-minimum
JWT_REFRESH_SECRET=your-refresh-secret
SESSION_SECRET=your-session-secret
ENCRYPTION_KEY=your-32-character-encryption-key

# Token Timing
ACCESS_TOKEN_EXPIRES_IN=24h                # Or 2m for testing
REFRESH_TOKEN_EXPIRES_IN=7d

# Hedera Hashgraph (Get from Hedera Portal)
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.123456              # Your account ID
HEDERA_OPERATOR_KEY=302e020100300506...    # Your private key (DER format)
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=302e020100300506...
HEDERA_CONTRACT_ID=0.0.789012              # Your deployed contract
MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com

# Twitter API (Get from Twitter Developer Portal)
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_BEARER_TOKEN=your_bearer_token
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_secret
TWITTER_CALLBACK_HOST=http://localhost:4000

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=sk-your-openai-key

# Email Configuration (Optional - for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ALERT_RECEIVER=admin@example.com

# CORS & Frontend
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760                     # 10MB in bytes
UPLOAD_DIR=./public/uploads

# Campaign Configuration
CAMPAIGN_DURATION=1440                     # 24 hours in minutes
REWARD_CALIM_DURATION=60                   # 60 minutes
```

## 🔑 How to Get API Keys

### 🔥 Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or select existing
3. Go to Project Settings → General → Your apps
4. Add web app or get config from existing app
5. Copy configuration values to frontend `.env`

### 🔗 WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create account and new project
3. Copy Project ID to `VITE_PROJECT_ID`

### ⛓️ Hedera Hashgraph Setup

1. Go to [Hedera Portal](https://portal.hedera.com/)
2. Create testnet account
3. Get account ID (0.0.XXXXXX format)
4. Get private key (DER format)
5. Fund account with testnet HBAR
6. Deploy smart contract (optional)

### 🐦 Twitter API Keys

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create developer account
3. Create new app
4. Generate API keys and tokens
5. Set up OAuth 1.0a for user authentication

### 🤖 OpenAI API Key (Optional)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create account and get API key
3. Add credits for usage

## 🚀 Quick Setup Commands

### Setup Environment Files

```bash
# Clone and setup
git clone <repository-url>
cd hashbuzz

# Copy environment templates
cp dApp-backend/.env.example dApp-backend/.env
cp frontend/.env.example frontend/.env

# Edit environment files
nano dApp-backend/.env  # Update database, JWT secrets, API keys
nano frontend/.env      # Update Firebase, WalletConnect config
```

### Generate Secure Secrets

```bash
# Generate JWT secrets (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

### Database Setup

```bash
# Local PostgreSQL
createdb hashbuzz_db
psql -d hashbuzz_db -c "CREATE USER hashbuzz WITH PASSWORD 'your_password';"
psql -d hashbuzz_db -c "GRANT ALL PRIVILEGES ON DATABASE hashbuzz_db TO hashbuzz;"

# Or use Docker
cd dApp-backend
docker compose up postgres -d
```

### Start Services

```bash
# Option 1: Docker (Recommended)
cd dApp-backend
docker compose --profile dev up -d

# Option 2: Manual
# Terminal 1: Backend
cd dApp-backend
npm install
npx prisma db push
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

## ✅ Validation Checklist

```bash
# Check backend health
curl http://localhost:4000/health

# Check database connection
cd dApp-backend
npx prisma studio  # Opens at http://localhost:5555

# Check frontend
open http://localhost:3000

# Check Redis
redis-cli ping  # Should return PONG

# Check environment loading
curl http://localhost:4000/api/status
```

## 🐛 Common Issues

### Token Timing Issues

```bash
# Problem: Frequent 401 errors
# Solution: Ensure frontend refresh interval < backend token expiry
# Frontend: VITE_TOKEN_REFRESH_INTERVAL=90000 (1.5 min)
# Backend: ACCESS_TOKEN_EXPIRES_IN=2m (2 min for testing) or 24h (production)
```

### Database Connection

```bash
# Problem: Database connection refused
# Solution: Check PostgreSQL is running and credentials match
docker compose ps postgres
```

### File Upload 413 Errors

```bash
# Problem: File uploads fail
# Solution: Check backend file size limit
# Backend: MAX_FILE_SIZE=10485760 (10MB)
```

### Hedera Network Issues

```bash
# Problem: Smart contract calls fail
# Solution: Check account has HBAR balance
curl "https://testnet.mirrornode.hedera.com/api/v1/accounts/0.0.YOUR_ACCOUNT_ID"
```

## 🎯 Minimal Working Configuration

**For quick testing, you need at minimum:**

1. **Database**: PostgreSQL running with correct credentials
2. **Cache**: Redis running
3. **Security**: Valid JWT secrets generated
4. **Blockchain**: Hedera testnet account with HBAR
5. **Frontend**: Firebase project configured
6. **Social**: Twitter API keys for campaign functionality

**Optional but recommended:**

- WalletConnect Project ID (for wallet integration)
- OpenAI API key (for AI features)
- Email configuration (for notifications)

---

**🚀 Ready to start? Follow the setup commands above and refer to [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) for complete system overview!**
