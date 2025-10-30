#!/bin/bash
# =============================================================================
# AWS Secrets Manager Setup for HashBuzz Frontend
# =============================================================================
# This script creates the required secret in AWS Secrets Manager

set -e

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
SECRET_NAME=${SECRET_NAME:-hashbuzz/frontend/secrets}
SECRETS_FILE=${SECRETS_FILE:-./secrets.json}

echo "🔐 Creating AWS Secrets Manager secret for HashBuzz Frontend"
echo "Region: $AWS_REGION"
echo "Secret Name: $SECRET_NAME"
echo "Secrets File: $SECRETS_FILE"

# Check if secrets file exists
if [ ! -f "$SECRETS_FILE" ]; then
    echo "❌ Secrets file '$SECRETS_FILE' not found!"
    echo "💡 Please create it from the template:"
    echo "   cp secrets.template.json secrets.json"
    echo "   # Then edit secrets.json with your actual values"
    exit 1
fi

# Read the secret JSON from file
echo "📄 Reading secrets from $SECRETS_FILE..."
SECRET_JSON=$(cat "$SECRETS_FILE")

# Validate JSON
if ! echo "$SECRET_JSON" | jq . >/dev/null 2>&1; then
    echo "❌ Invalid JSON in secrets file!"
    exit 1
fi

# Create or update the secret
echo "📡 Creating/updating secret in AWS Secrets Manager..."

# Try to create the secret
aws secretsmanager create-secret \
    --region $AWS_REGION \
    --name $SECRET_NAME \
    --description "HashBuzz Frontend secrets including Firebase and WalletConnect configuration" \
    --secret-string "$SECRET_JSON" 2>/dev/null || {

    # If creation fails (secret exists), update it
    echo "Secret already exists, updating..."
    aws secretsmanager update-secret \
        --region $AWS_REGION \
        --secret-id $SECRET_NAME \
        --secret-string "$SECRET_JSON"
}

echo "✅ Secret created/updated successfully!"
echo ""
echo "🔧 To use this with Docker Compose, set these environment variables:"
echo "export AWS_REGION=$AWS_REGION"
echo "export SECRET_NAME=$SECRET_NAME"
echo "export AWS_ACCESS_KEY_ID=your-access-key"
echo "export AWS_SECRET_ACCESS_KEY=your-secret-key"
echo ""
echo "📋 Then run:"
echo "docker compose -f compose-dev.yaml up frontend-dev"
echo ""
echo "🗑️  Remember to delete the secrets.json file after setup for security:"
echo "rm secrets.json"
