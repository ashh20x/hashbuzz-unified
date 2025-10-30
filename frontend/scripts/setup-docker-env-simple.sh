#!/bin/sh
# =============================================================================
# Simplified Docker Environment Setup Script
# =============================================================================

set -e

echo "🐳 Setting up Docker environment for HashBuzz Frontend..."

# Set default environment variables
export NODE_ENV=${NODE_ENV:-development}
export VITE_NETWORK=${VITE_NETWORK:-testnet}
export VITE_BASE_URL=${VITE_BASE_URL:-http://localhost:4000}
export VITE_ENABLE_DEV_TOOLS=${VITE_ENABLE_DEV_TOOLS:-true}
export VITE_ENABLE_DEBUG_LOGS=${VITE_ENABLE_DEBUG_LOGS:-true}

# AWS Secrets Manager defaults
export FETCH_SECRETS=${FETCH_SECRETS:-true}
export AWS_REGION=${AWS_REGION:-us-east-1}
export SECRET_NAME=${SECRET_NAME:-hashbuzz/frontend/secrets}

# Create environment file
ENV_FILE="/app/.env.docker"
cat > "$ENV_FILE" << EOF
# Docker Environment Configuration
NODE_ENV=$NODE_ENV
VITE_NETWORK=$VITE_NETWORK
VITE_BASE_URL=$VITE_BASE_URL
VITE_ENABLE_DEV_TOOLS=$VITE_ENABLE_DEV_TOOLS
VITE_ENABLE_DEBUG_LOGS=$VITE_ENABLE_DEBUG_LOGS
FETCH_SECRETS=$FETCH_SECRETS
AWS_REGION=$AWS_REGION
SECRET_NAME=$SECRET_NAME
EOF

echo "✅ Docker environment setup completed"
echo "📋 Environment file created at: $ENV_FILE"
