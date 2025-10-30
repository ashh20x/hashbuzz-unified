#!/bin/sh
# =============================================================================
# Environment Setup Script for HashBuzz Frontend
# =============================================================================
# This script helps set up the environment for Docker development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 HashBuzz Frontend Environment Setup${NC}"
echo -e "${BLUE}======================================${NC}"

# Function to prompt for user input
prompt_for_input() {
    local prompt="$1"
    local default="$2"
    local secret="$3"

    if [ "$secret" = "true" ]; then
        echo -n "$prompt: "
        read -s value
        echo
    else
        echo -n "$prompt"
        if [ -n "$default" ]; then
            echo -n " [$default]"
        fi
        echo -n ": "
        read value
        if [ -z "$value" ] && [ -n "$default" ]; then
            value="$default"
        fi
    fi

    echo "$value"
}

# Function to setup environment file
setup_env_file() {
    echo -e "${YELLOW}📝 Setting up environment file...${NC}"

    if [ -f .env ]; then
        echo -e "${YELLOW}⚠️  .env file already exists. Backing up to .env.backup${NC}"
        cp .env .env.backup
    fi

    # Copy from example
    cp .env.example .env

    echo -e "${GREEN}✅ Environment file created from template${NC}"
}

# Function to configure AWS settings
configure_aws() {
    echo -e "${BLUE}🔑 AWS Configuration${NC}"
    echo "Do you want to use AWS Secrets Manager for storing sensitive data? (recommended for production)"
    echo -n "Use AWS Secrets Manager? [y/N]: "
    read use_aws

    case "$use_aws" in
        [Yy]* )
            echo -e "${YELLOW}Setting up AWS Secrets Manager...${NC}"

            # Get AWS credentials
            aws_access_key=$(prompt_for_input "AWS Access Key ID" "" "true")
            aws_secret_key=$(prompt_for_input "AWS Secret Access Key" "" "true")
            aws_region=$(prompt_for_input "AWS Region" "us-east-1" "false")
            secret_name=$(prompt_for_input "Secret Name" "hashbuzz/frontend/secrets" "false")

            # Update .env file
            sed -i "s/FETCH_SECRETS=.*/FETCH_SECRETS=true/" .env
            sed -i "s/AWS_ACCESS_KEY_ID=.*/AWS_ACCESS_KEY_ID=$aws_access_key/" .env
            sed -i "s/AWS_SECRET_ACCESS_KEY=.*/AWS_SECRET_ACCESS_KEY=$aws_secret_key/" .env
            sed -i "s/AWS_REGION=.*/AWS_REGION=$aws_region/" .env
            sed -i "s/SECRET_NAME=.*/SECRET_NAME=$secret_name/" .env

            echo -e "${GREEN}✅ AWS configuration saved${NC}"
            ;;
        * )
            echo -e "${YELLOW}⚠️  Using local environment variables (not recommended for production)${NC}"
            sed -i "s/FETCH_SECRETS=.*/FETCH_SECRETS=false/" .env

            echo "You'll need to manually set your Firebase and WalletConnect credentials in .env file"
            ;;
    esac
}

# Function to configure development settings
configure_development() {
    echo -e "${BLUE}🛠️ Development Configuration${NC}"

    base_url=$(prompt_for_input "Backend API URL" "http://localhost:5000" "false")
    network=$(prompt_for_input "Hedera Network" "testnet" "false")

    # Update .env file
    sed -i "s|VITE_BASE_URL=.*|VITE_BASE_URL=$base_url|" .env
    sed -i "s/VITE_NETWORK=.*/VITE_NETWORK=$network/" .env

    echo -e "${GREEN}✅ Development configuration saved${NC}"
}

# Function to verify Docker setup
verify_docker() {
    echo -e "${BLUE}🐳 Verifying Docker Setup${NC}"

    if ! command -v docker >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker not found. Please install Docker first.${NC}"
        exit 1
    fi

    if ! command -v docker-compose >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker Compose not found. Please install Docker Compose first.${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Docker and Docker Compose are available${NC}"
}

# Function to test environment
test_environment() {
    echo -e "${BLUE}🧪 Testing Environment${NC}"

    # Test environment setup script
    if [ -f scripts/setup-docker-env.sh ]; then
        echo -e "${YELLOW}Running environment setup test...${NC}"
        if ./scripts/setup-docker-env.sh; then
            echo -e "${GREEN}✅ Environment setup script works correctly${NC}"
        else
            echo -e "${RED}❌ Environment setup script failed${NC}"
            return 1
        fi
    fi

    echo -e "${GREEN}✅ Environment test completed${NC}"
}

# Function to display next steps
display_next_steps() {
    echo -e "${BLUE}🎉 Setup Complete!${NC}"
    echo -e "${BLUE}=================${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo ""
    echo -e "${GREEN}1. Start development environment:${NC}"
    echo "   docker compose -f compose-dev.yaml up frontend-dev"
    echo ""
    echo -e "${GREEN}2. Start production environment:${NC}"
    echo "   docker compose -f compose-dev.yaml --profile production up frontend-prod"
    echo ""
    echo -e "${GREEN}3. Access the application:${NC}"
    echo "   Development: http://localhost:3000"
    echo "   Production:  http://localhost:3002"
    echo ""
    echo -e "${YELLOW}📝 Note: Your .env file contains sensitive information.${NC}"
    echo -e "${YELLOW}   Make sure it's not committed to version control.${NC}"
    echo ""

    if grep -q "FETCH_SECRETS=true" .env 2>/dev/null; then
        echo -e "${BLUE}🔐 AWS Secrets Manager Setup:${NC}"
        echo "   1. Upload secrets: ./scripts/setup-aws-secrets.sh"
        echo "   2. Test secrets:   docker compose -f compose-dev.yaml up frontend-dev"
        echo ""
    fi
}

# Main execution
main() {
    echo -e "${BLUE}Starting automated environment setup...${NC}"
    echo ""

    # Verify Docker
    verify_docker

    # Setup environment file
    setup_env_file

    # Configure AWS
    configure_aws

    # Configure development settings
    configure_development

    # Test environment
    test_environment

    # Display next steps
    display_next_steps

    echo -e "${GREEN}🎉 Environment setup completed successfully!${NC}"
}

# Show help if requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "HashBuzz Frontend Environment Setup Script"
    echo ""
    echo "This script helps you set up the environment for Docker development."
    echo "It will:"
    echo "  1. Create .env file from template"
    echo "  2. Configure AWS Secrets Manager (optional)"
    echo "  3. Set development configuration"
    echo "  4. Test the environment setup"
    echo ""
    echo "Usage: $0 [--help]"
    echo ""
    echo "After running this script, you can start the development environment with:"
    echo "  docker compose -f compose-dev.yaml up frontend-dev"
    exit 0
fi

# Run main function
main "$@"
