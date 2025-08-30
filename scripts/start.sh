#!/bin/sh
# =============================================================================
# Frontend Startup Script with Automatic Environment Setup
# =============================================================================

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting HashBuzz Frontend with Automatic Environment Setup...${NC}"

# Step 1: Setup Docker environment automatically
echo -e "${YELLOW}🐳 Setting up Docker environment...${NC}"
/app/scripts/setup-docker-env.sh

# Step 2: Fetch secrets from AWS Secrets Manager
if [ "$FETCH_SECRETS" = "true" ]; then
    echo -e "${YELLOW}🔐 Fetching secrets from AWS Secrets Manager...${NC}"
    /app/scripts/fetch-secrets.sh

    # Source the secrets file if it exists
    if [ -f /app/.env.secrets ]; then
        echo -e "${YELLOW}📂 Loading secrets into environment...${NC}"
        set -a
        . /app/.env.secrets
        set +a
        echo -e "${GREEN}✅ Secrets loaded successfully${NC}"
    fi
fi

# Step 3: Load Docker environment if available
if [ -f /app/.env.docker ]; then
    echo -e "${YELLOW}📂 Loading Docker environment...${NC}"
    set -a
    . /app/.env.docker
    set +a
    echo -e "${GREEN}✅ Docker environment loaded${NC}"
fi

# Start the application based on the mode
if [ "$NODE_ENV" = "production" ]; then
    echo -e "${GREEN}🏭 Starting production server...${NC}"
    exec nginx -g "daemon off;"
else
    echo -e "${GREEN}🛠️ Starting development server...${NC}"
    exec dumb-init yarn dev --host 0.0.0.0 --port 3000
fi
