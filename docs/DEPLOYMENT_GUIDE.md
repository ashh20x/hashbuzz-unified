# 🚀 HashBuzz Frontend Deployment Guide

Complete guide for building, deploying, and managing the HashBuzz Frontend with Docker and AWS integration.

## 📋 Table of Contents

- [🏗️ Docker Setup](#-docker-setup)
- [🔐 AWS Secrets Manager](#-aws-secrets-manager)
- [🚀 Local Development](#-local-development)
- [🏭 Production Deployment](#-production-deployment)
- [📊 Monitoring & Troubleshooting](#-monitoring--troubleshooting)

---

## 🏗️ Docker Setup

### Image Optimization Results

- **Before**: 2.87GB (unoptimized)
- **After**: 72.7MB (optimized)
- **Savings**: 96%+ reduction

### Build Commands

```bash
# Development build
docker build --target development -t hashbuzz-frontend:dev .

# Production build (optimized)
docker build --target production -t hashbuzz-frontend:prod .

# Build for AWS ECR
docker build --target production -t 554403238201.dkr.ecr.us-east-1.amazonaws.com/frontend:latest .
```

### Docker Compose Usage

```bash
# Start development environment
docker compose -f compose-dev.yaml up frontend-dev

# Start production environment for testing
docker compose -f compose-dev.yaml --profile production up frontend-prod

# With database services
docker compose -f compose-dev.yaml --profile database up

# Full stack with reverse proxy
docker compose -f compose-dev.yaml --profile database --profile proxy up
```

---

## 🔐 AWS Secrets Manager

### Overview

Instead of storing sensitive data in environment files, the frontend Docker container **automatically** fetches secrets from AWS Secrets Manager at startup. The setup scripts handle all environment configuration automatically.

### 🚀 Automated Setup (Recommended)

For the easiest setup experience, use our automated environment setup script:

```bash
# Run the interactive setup script
./scripts/setup-env.sh

# This script will:
# 1. Create .env file from template
# 2. Configure AWS credentials
# 3. Set up development environment
# 4. Test the configuration
```

### 🛠️ Manual Setup

If you prefer manual configuration:

#### 1. Create secrets file from template

```bash
cp secrets.template.json secrets.json
```

#### 2. Edit with your actual values

```bash
nano secrets.json  # Add your Firebase & WalletConnect credentials
```

#### 3. Set up AWS credentials

```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=us-east-1
```

#### 4. Upload to AWS Secrets Manager

```bash
./scripts/setup-aws-secrets.sh
```

#### 5. 🚨 CRITICAL: Delete local secrets file

```bash
rm secrets.json
```

### Secret Structure

The secret in AWS should contain:

```json
{
  "VITE_FIREBASE_API_KEY": "your-firebase-api-key",
  "VITE_FIREBASE_AUTH_DOMAIN": "your-project.firebaseapp.com",
  "VITE_FIREBASE_PROJECT_ID": "your-project-id",
  "VITE_FIREBASE_STORAGE_BUCKET": "your-project.appspot.com",
  "VITE_FIREBASE_MESSAGING_SENDER_ID": "123456789",
  "VITE_FIREBASE_APP_ID": "1:123456789:web:abcdef",
  "VITE_FIREBASE_MEASUREMENT_ID": "G-XXXXXXXXXX",
  "VITE_PROJECT_ID": "your-walletconnect-project-id"
}
```

### Required AWS IAM Permissions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:us-east-1:*:secret:hashbuzz/frontend/secrets*"
    }
  ]
}
```

---

## 🚀 Local Development

### Prerequisites

- Node.js >= 20.0.0
- Yarn >= 1.22.0
- Docker & Docker Compose

### 🎯 Quick Start with Docker

The fastest way to get started:

```bash
# 1. Run automated environment setup
./scripts/setup-env.sh

# 2. Start development environment
docker compose -f compose-dev.yaml up frontend-dev

# 3. Access application at http://localhost:3000
```

### 🔧 Manual Environment Setup

If you prefer to set up manually:

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your values
nano .env

# Set AWS credentials (if using AWS Secrets Manager)
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
```

### 🤖 Automatic Environment Configuration

The Docker containers automatically handle environment setup through the `setup-docker-env.sh` script, which:

- **Detects Docker environment** and configures accordingly
- **Sets default values** for all required variables
- **Validates configuration** before startup
- **Loads environment files** in the correct order
- **Provides helpful error messages** for missing configuration

### Environment Variables

```bash
# Required for secrets management
export FETCH_SECRETS=true
export AWS_REGION=us-east-1
export SECRET_NAME=hashbuzz/frontend/secrets
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Development Commands

```bash
# Local development (no Docker)
yarn dev                    # Port 3000, connects to localhost:4000
yarn dev:remote            # Port 3000, connects to remote API

# Docker development
docker compose -f compose-dev.yaml up frontend-dev

# Development with hot reload
docker compose -f compose-dev.yaml up frontend-dev
# Access at: http://localhost:3000
```

---

## 🏭 Production Deployment

### AWS ECR Deployment

#### 1. Build and tag for ECR

```bash
docker build --target production -t hashbuzz-frontend:latest .
docker tag hashbuzz-frontend:latest 554403238201.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
```

#### 2. Push to ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 554403238201.dkr.ecr.us-east-1.amazonaws.com

# Push image
docker push 554403238201.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
```

#### 3. ECS/Fargate Task Definition

```json
{
  "containerDefinitions": [
    {
      "name": "hashbuzz-frontend",
      "image": "554403238201.dkr.ecr.us-east-1.amazonaws.com/frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        { "name": "FETCH_SECRETS", "value": "true" },
        { "name": "AWS_REGION", "value": "us-east-1" },
        { "name": "SECRET_NAME", "value": "hashbuzz/frontend/secrets" },
        { "name": "NODE_ENV", "value": "production" }
      ],
      "taskRoleArn": "arn:aws:iam::554403238201:role/ECS-SecretsManagerRole",
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

#### 4. Direct Docker Run

```bash
docker run -d \
  -p 3000:3000 \
  -e FETCH_SECRETS=true \
  -e AWS_REGION=us-east-1 \
  -e SECRET_NAME=hashbuzz/frontend/secrets \
  -e NODE_ENV=production \
  554403238201.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
```

---

## 📊 Monitoring & Troubleshooting

### Health Checks

```bash
# Check container health
docker ps --filter "name=hashbuzz-frontend"

# View container logs
docker logs hashbuzz-frontend-prod

# Check secrets loading
docker exec -it hashbuzz-frontend-prod cat /app/.env.secrets
```

### Common Issues

#### 1. Secrets Not Loading

```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify secret exists
aws secretsmanager describe-secret --secret-id hashbuzz/frontend/secrets --region us-east-1

# Check container logs
docker logs hashbuzz-frontend-prod | grep -i secret
```

#### 2. Build Issues

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache --target production -t hashbuzz-frontend:latest .
```

#### 3. Port Conflicts

```bash
# Check what's using port 3000
lsof -i :3000

# Use different port
docker run -p 3001:3000 hashbuzz-frontend:latest
```

### Performance Monitoring

- **Image Size**: 72.7MB (optimized)
- **Startup Time**: ~10-15 seconds (including secret fetch)
- **Memory Usage**: ~50-100MB
- **Health Check**: Every 60 seconds

---

## 🔒 Security Best Practices

### ✅ Implemented Security Measures

- Secrets stored only in AWS Secrets Manager
- Non-root user in container
- Minimal Alpine Linux base images
- No secrets in Docker images or layers
- Proper .gitignore and .dockerignore

### 🚨 Security Checklist

- [ ] Secrets uploaded to AWS Secrets Manager
- [ ] Local secrets.json file deleted
- [ ] IAM permissions properly configured
- [ ] Container running as non-root user
- [ ] Health checks enabled
- [ ] Logs monitored for security events

---

## 📞 Support

For deployment issues:

1. Check container logs: `docker logs <container-name>`
2. Verify AWS credentials and permissions
3. Ensure secrets exist in AWS Secrets Manager
4. Review network connectivity and firewall rules

**Current Setup Status**: ✅ Production Ready with 96% size optimization and secure secrets management!
