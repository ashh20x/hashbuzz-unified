#!/bin/sh
# =============================================================================
# AWS Secrets Manager Integration for HashBuzz Frontend
# =============================================================================
# This script fetches secrets from AWS Secrets Manager and sets environment variables

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
SECRET_NAME=${SECRET_NAME:-hashbuzz/frontend/secrets}
ENV_FILE=${ENV_FILE:-/app/.env.secrets}

echo -e "${YELLOW}🔐 Fetching secrets from AWS Secrets Manager...${NC}"
echo "Region: $AWS_REGION"
echo "Secret: $SECRET_NAME"

# Check if AWS CLI is available
if ! command -v aws >/dev/null 2>&1; then
    echo -e "${RED}❌ AWS CLI not found. Installing...${NC}"
    apk add --no-cache aws-cli
fi

# Check AWS credentials
if [ -z "$AWS_ACCESS_KEY_ID" ] && [ -z "$AWS_PROFILE" ]; then
    echo -e "${RED}❌ AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY${NC}"
    exit 1
fi

# Fetch secrets from AWS Secrets Manager
echo -e "${YELLOW}📡 Retrieving secrets...${NC}"
SECRET_JSON=$(aws secretsmanager get-secret-value \
    --region $AWS_REGION \
    --secret-id $SECRET_NAME \
    --query SecretString \
    --output text 2>/dev/null)

if [ $? -ne 0 ] || [ -z "$SECRET_JSON" ]; then
    echo -e "${RED}❌ Failed to fetch secrets from AWS Secrets Manager${NC}"
    echo -e "${YELLOW}💡 Make sure the secret '$SECRET_NAME' exists and you have proper permissions${NC}"
    exit 1
fi

# Parse JSON and create environment file
echo -e "${YELLOW}📝 Creating environment file...${NC}"
echo "# Auto-generated from AWS Secrets Manager" > $ENV_FILE
echo "# Generated at: $(date)" >> $ENV_FILE
echo "" >> $ENV_FILE

# Extract Firebase secrets
FIREBASE_API_KEY=$(echo $SECRET_JSON | jq -r '.VITE_FIREBASE_API_KEY // empty')
FIREBASE_AUTH_DOMAIN=$(echo $SECRET_JSON | jq -r '.VITE_FIREBASE_AUTH_DOMAIN // empty')
FIREBASE_PROJECT_ID=$(echo $SECRET_JSON | jq -r '.VITE_FIREBASE_PROJECT_ID // empty')
FIREBASE_STORAGE_BUCKET=$(echo $SECRET_JSON | jq -r '.VITE_FIREBASE_STORAGE_BUCKET // empty')
FIREBASE_MESSAGING_SENDER_ID=$(echo $SECRET_JSON | jq -r '.VITE_FIREBASE_MESSAGING_SENDER_ID // empty')
FIREBASE_APP_ID=$(echo $SECRET_JSON | jq -r '.VITE_FIREBASE_APP_ID // empty')
FIREBASE_MEASUREMENT_ID=$(echo $SECRET_JSON | jq -r '.VITE_FIREBASE_MEASUREMENT_ID // empty')

# Extract WalletConnect secrets
PROJECT_ID=$(echo $SECRET_JSON | jq -r '.VITE_PROJECT_ID // empty')

# Write Firebase secrets
if [ -n "$FIREBASE_API_KEY" ]; then
    echo "# Firebase Configuration" >> $ENV_FILE
    echo "VITE_FIREBASE_API_KEY=$FIREBASE_API_KEY" >> $ENV_FILE
    echo "VITE_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN" >> $ENV_FILE
    echo "VITE_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID" >> $ENV_FILE
    echo "VITE_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET" >> $ENV_FILE
    echo "VITE_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID" >> $ENV_FILE
    echo "VITE_FIREBASE_APP_ID=$FIREBASE_APP_ID" >> $ENV_FILE
    echo "VITE_FIREBASE_MEASUREMENT_ID=$FIREBASE_MEASUREMENT_ID" >> $ENV_FILE
    echo "" >> $ENV_FILE
    echo -e "${GREEN}✅ Firebase secrets loaded${NC}"
fi

# Write WalletConnect secrets
if [ -n "$PROJECT_ID" ]; then
    echo "# WalletConnect Configuration" >> $ENV_FILE
    echo "VITE_PROJECT_ID=$PROJECT_ID" >> $ENV_FILE
    echo "" >> $ENV_FILE
    echo -e "${GREEN}✅ WalletConnect secrets loaded${NC}"
fi

# Add any other secrets from the JSON
echo $SECRET_JSON | jq -r 'to_entries[] | select(.key | startswith("VITE_") and (. | contains("FIREBASE") or contains("PROJECT_ID")) | not) | "\(.key)=\(.value)"' >> $ENV_FILE

# Set permissions
chmod 600 $ENV_FILE

echo -e "${GREEN}✅ Secrets successfully fetched and saved to $ENV_FILE${NC}"
echo -e "${YELLOW}🔒 Environment file permissions set to 600 for security${NC}"

# Export variables to current session if requested
if [ "$EXPORT_VARS" = "true" ]; then
    echo -e "${YELLOW}📤 Exporting variables to current session...${NC}"
    set -a
    . $ENV_FILE
    set +a
fi
