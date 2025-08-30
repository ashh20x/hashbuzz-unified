#!/bin/sh
# =============================================================================
# Docker Environment Setup Script
# =============================================================================
# This script automatically sets up environment variables for Docker containers
# It detects if running in Docker and configures the environment accordingly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Docker Environment Setup for HashBuzz Frontend${NC}"

# Function to detect if running in Docker
is_docker() {
    [ -f /.dockerenv ] || grep -q 'docker\|lxc' /proc/1/cgroup 2>/dev/null || [ -f /proc/self/cgroup ] && grep -q docker /proc/self/cgroup 2>/dev/null
}

# Function to set default environment variables
setup_default_env() {
    echo -e "${YELLOW}📋 Setting up default environment variables...${NC}"

    # Set default values if not already set
    export NODE_ENV=${NODE_ENV:-development}
    export VITE_NETWORK=${VITE_NETWORK:-testnet}
    export VITE_BASE_URL=${VITE_BASE_URL:-http://localhost:5000}
    export VITE_ENABLE_DEV_TOOLS=${VITE_ENABLE_DEV_TOOLS:-true}
    export VITE_ENABLE_DEBUG_LOGS=${VITE_ENABLE_DEBUG_LOGS:-true}

    # AWS Secrets Manager defaults
    export FETCH_SECRETS=${FETCH_SECRETS:-true}
    export AWS_REGION=${AWS_REGION:-us-east-1}
    export SECRET_NAME=${SECRET_NAME:-hashbuzz/frontend/secrets}

    echo -e "${GREEN}✅ Default environment variables set${NC}"
}

# Function to setup AWS credentials from various sources
setup_aws_credentials() {
    echo -e "${YELLOW}🔑 Setting up AWS credentials...${NC}"

    # Check if AWS credentials are available
    if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
        echo -e "${GREEN}✅ AWS credentials found in environment variables${NC}"
        return 0
    fi

    # Check for AWS profile
    if [ -n "$AWS_PROFILE" ]; then
        echo -e "${GREEN}✅ AWS profile found: $AWS_PROFILE${NC}"
        return 0
    fi

    # Check for IAM role (ECS/EC2)
    if curl -s --connect-timeout 2 http://169.254.169.254/latest/meta-data/iam/security-credentials/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ AWS IAM role detected (ECS/EC2)${NC}"
        return 0
    fi

    # Check for mounted AWS credentials
    if [ -f /root/.aws/credentials ] || [ -f /home/node/.aws/credentials ]; then
        echo -e "${GREEN}✅ AWS credentials file found${NC}"
        return 0
    fi

    echo -e "${YELLOW}⚠️  No AWS credentials found. Secrets fetching may fail.${NC}"
    echo -e "${YELLOW}💡 Make sure to set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY${NC}"
    return 1
}

# Function to create environment file
create_env_file() {
    local env_file="/app/.env.docker"

    echo -e "${YELLOW}📝 Creating Docker environment file...${NC}"

    cat > "$env_file" << EOF
# =============================================================================
# Docker Environment Configuration - Auto-generated
# Generated at: $(date)
# =============================================================================

# Application Environment
NODE_ENV=$NODE_ENV

# Vite Configuration
VITE_NETWORK=$VITE_NETWORK
VITE_BASE_URL=$VITE_BASE_URL
VITE_ENABLE_DEV_TOOLS=$VITE_ENABLE_DEV_TOOLS
VITE_ENABLE_DEBUG_LOGS=$VITE_ENABLE_DEBUG_LOGS

# AWS Secrets Manager Configuration
FETCH_SECRETS=$FETCH_SECRETS
AWS_REGION=$AWS_REGION
SECRET_NAME=$SECRET_NAME

# Runtime Configuration
DOCKER_ENV=true
CONTAINER_STARTUP_TIME=$(date -Iseconds)
EOF

    if [ -n "$AWS_ACCESS_KEY_ID" ]; then
        echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" >> "$env_file"
    fi

    if [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
        echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" >> "$env_file"
    fi

    if [ -n "$AWS_SESSION_TOKEN" ]; then
        echo "AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN" >> "$env_file"
    fi

    if [ -n "$AWS_PROFILE" ]; then
        echo "AWS_PROFILE=$AWS_PROFILE" >> "$env_file"
    fi

    chmod 600 "$env_file"
    echo -e "${GREEN}✅ Docker environment file created: $env_file${NC}"
}

# Function to load environment file
load_env_file() {
    local env_file="/app/.env.docker"

    if [ -f "$env_file" ]; then
        echo -e "${YELLOW}📂 Loading Docker environment file...${NC}"
        set -a
        . "$env_file"
        set +a
        echo -e "${GREEN}✅ Environment loaded from $env_file${NC}"
    fi
}

# Function to validate environment
validate_environment() {
    echo -e "${YELLOW}🔍 Validating environment...${NC}"

    local errors=0

    # Check required variables
    if [ -z "$NODE_ENV" ]; then
        echo -e "${RED}❌ NODE_ENV is not set${NC}"
        errors=$((errors + 1))
    fi

    if [ "$FETCH_SECRETS" = "true" ] && [ -z "$AWS_REGION" ]; then
        echo -e "${RED}❌ AWS_REGION is required when FETCH_SECRETS=true${NC}"
        errors=$((errors + 1))
    fi

    if [ "$FETCH_SECRETS" = "true" ] && [ -z "$SECRET_NAME" ]; then
        echo -e "${RED}❌ SECRET_NAME is required when FETCH_SECRETS=true${NC}"
        errors=$((errors + 1))
    fi

    if [ $errors -eq 0 ]; then
        echo -e "${GREEN}✅ Environment validation passed${NC}"
        return 0
    else
        echo -e "${RED}❌ Environment validation failed with $errors errors${NC}"
        return 1
    fi
}

# Function to display environment summary
display_summary() {
    echo -e "${BLUE}📊 Environment Summary:${NC}"
    echo -e "${BLUE}========================${NC}"
    echo "Node Environment: $NODE_ENV"
    echo "Vite Network: $VITE_NETWORK"
    echo "Base URL: $VITE_BASE_URL"
    echo "Fetch Secrets: $FETCH_SECRETS"
    echo "AWS Region: $AWS_REGION"
    echo "Secret Name: $SECRET_NAME"

    if is_docker; then
        echo "Container: Docker"
    else
        echo "Container: Native"
    fi

    echo -e "${BLUE}========================${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting Docker environment setup...${NC}"

    # Setup default environment
    setup_default_env

    # Setup AWS credentials
    setup_aws_credentials

    # Create environment file if in Docker
    if is_docker; then
        echo -e "${BLUE}🐳 Docker environment detected${NC}"
        create_env_file
        load_env_file
    else
        echo -e "${YELLOW}💻 Native environment detected${NC}"
    fi

    # Validate environment
    if ! validate_environment; then
        echo -e "${RED}❌ Environment setup failed${NC}"
        exit 1
    fi

    # Display summary
    display_summary

    echo -e "${GREEN}✅ Docker environment setup completed successfully!${NC}"
}

# Run main function if script is executed directly
if [ "${BASH_SOURCE[0]}" = "${0}" ] || [ "$0" = "sh" ] || [ "$0" = "/bin/sh" ]; then
    main "$@"
fi
