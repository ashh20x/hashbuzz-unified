#!/bin/sh
# =============================================================================
# Docker Environment Setup Script
# =============================================================================
# This script automatically sets up environment variables for Docker containers
# It detects if running in Docker and configures the environment accordingly

set -e

# Colors for output (safe defaults if 'echo -e' not supported)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Use printf instead of echo -e (more portable)
info()  { printf "%s\n" "$@"; }
color() { printf "%b%s%b\n" "$1" "$2" "$NC"; }

color "$BLUE" "🐳 Docker Environment Setup for HashBuzz Frontend"

# Function to detect if running in Docker
is_docker() {
    [ -f /.dockerenv ] && return 0
    grep -q 'docker\|lxc' /proc/1/cgroup 2>/dev/null && return 0
    grep -q 'docker' /proc/self/cgroup 2>/dev/null && return 0
    return 1
}

# Function to set default environment variables
setup_default_env() {
    color "$YELLOW" "📋 Setting up default environment variables..."

    NODE_ENV=${NODE_ENV:-development}
    VITE_NETWORK=${VITE_NETWORK:-testnet}
    VITE_BASE_URL=${VITE_BASE_URL:-http://localhost:5000}
    VITE_ENABLE_DEV_TOOLS=${VITE_ENABLE_DEV_TOOLS:-true}
    VITE_ENABLE_DEBUG_LOGS=${VITE_ENABLE_DEBUG_LOGS:-true}

    FETCH_SECRETS=${FETCH_SECRETS:-true}
    AWS_REGION=${AWS_REGION:-us-east-1}
    SECRET_NAME=${SECRET_NAME:-hashbuzz/frontend/secrets}

    export NODE_ENV VITE_NETWORK VITE_BASE_URL VITE_ENABLE_DEV_TOOLS VITE_ENABLE_DEBUG_LOGS
    export FETCH_SECRETS AWS_REGION SECRET_NAME

    color "$GREEN" "[OK] Default environment variables set"
}

# Function to setup AWS credentials
setup_aws_credentials() {
    color "$YELLOW" "🔑 Setting up AWS credentials..."

    if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
        color "$GREEN" "[OK] AWS credentials found in environment variables"
        return 0
    fi

    if [ -n "$AWS_PROFILE" ]; then
        color "$GREEN" "[OK] AWS profile found: $AWS_PROFILE"
        return 0
    fi

    if curl -s --connect-timeout 2 http://169.254.169.254/latest/meta-data/iam/security-credentials/ >/dev/null 2>&1; then
        color "$GREEN" "[OK] AWS IAM role detected (ECS/EC2)"
        return 0
    fi

    if [ -f /root/.aws/credentials ] || [ -f /home/node/.aws/credentials ]; then
        color "$GREEN" "[OK] AWS credentials file found"
        return 0
    fi

    color "$YELLOW" "⚠️  No AWS credentials found. Secrets fetching may fail."
    color "$YELLOW" "💡 Make sure to set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
    return 1
}

# Function to create environment file
create_env_file() {
    env_file="/app/.env.docker"
    color "$YELLOW" "📝 Creating Docker environment file..."

    cat > "$env_file" << EOF
# =============================================================================
# Docker Environment Configuration - Auto-generated
# Generated at: $(date)
# =============================================================================

NODE_ENV=$NODE_ENV
VITE_NETWORK=$VITE_NETWORK
VITE_BASE_URL=$VITE_BASE_URL
VITE_ENABLE_DEV_TOOLS=$VITE_ENABLE_DEV_TOOLS
VITE_ENABLE_DEBUG_LOGS=$VITE_ENABLE_DEBUG_LOGS

FETCH_SECRETS=$FETCH_SECRETS
AWS_REGION=$AWS_REGION
SECRET_NAME=$SECRET_NAME

DOCKER_ENV=true
CONTAINER_STARTUP_TIME=$(date -Iseconds)
EOF

    [ -n "$AWS_ACCESS_KEY_ID" ] && echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" >> "$env_file"
    [ -n "$AWS_SECRET_ACCESS_KEY" ] && echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" >> "$env_file"
    [ -n "$AWS_SESSION_TOKEN" ] && echo "AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN" >> "$env_file"
    [ -n "$AWS_PROFILE" ] && echo "AWS_PROFILE=$AWS_PROFILE" >> "$env_file"

    chmod 600 "$env_file"
    color "$GREEN" "[OK] Docker environment file created: $env_file"
}

# Function to load environment file
load_env_file() {
    env_file="/app/.env.docker"
    if [ -f "$env_file" ]; then
        color "$YELLOW" "📂 Loading Docker environment file..."
        set -a
        . "$env_file"
        set +a
        color "$GREEN" "[OK] Environment loaded from $env_file"
    fi
}

# Function to validate environment
validate_environment() {
    color "$YELLOW" "🔍 Validating environment..."

    errors=0
    [ -z "$NODE_ENV" ] && { color "$RED" "[ERROR] NODE_ENV is not set"; errors=$((errors+1)); }
    [ "$FETCH_SECRETS" = "true" ] && [ -z "$AWS_REGION" ] && { color "$RED" "[ERROR] AWS_REGION is required"; errors=$((errors+1)); }
    [ "$FETCH_SECRETS" = "true" ] && [ -z "$SECRET_NAME" ] && { color "$RED" "[ERROR] SECRET_NAME is required"; errors=$((errors+1)); }

    if [ "$errors" -eq 0 ]; then
        color "$GREEN" "[OK] Environment validation passed"
        return 0
    else
        color "$RED" "[ERROR] Environment validation failed with $errors errors"
        return 1
    fi
}

# Function to display summary
display_summary() {
    color "$BLUE" "📊 Environment Summary:"
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
    color "$BLUE" "========================"
}

# Main execution
main() {
    color "$BLUE" "🚀 Starting Docker environment setup..."
    setup_default_env
    setup_aws_credentials
    if is_docker; then
        color "$BLUE" "🐳 Docker environment detected"
        create_env_file
        load_env_file
    else
        color "$YELLOW" "💻 Native environment detected"
    fi
    if ! validate_environment; then
        color "$RED" "[ERROR] Environment setup failed"
        exit 1
    fi
    display_summary
    color "$GREEN" "[SUCCESS] Docker environment setup completed successfully!"
}

# Run main only if executed directly
case "$0" in
    *setup-docker-env.sh) main "$@" ;;
esac
