#!/bin/bash

# HashBuzz Unified Repository Setup Script
# This script helps set up the complete HashBuzz platform for development

set -e

echo "🚀 HashBuzz Unified Repository Setup"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2)
print_success "Node.js version: $NODE_VERSION"

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL is not installed. You'll need it for the backend."
fi

# Check if Redis is available
if ! command -v redis-cli &> /dev/null; then
    print_warning "Redis is not installed. You'll need it for the backend queue system."
fi

echo ""
print_status "Setting up Backend..."
cd backend/

if [ ! -f ".env" ]; then
    print_status "Creating backend .env from example"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "Please configure your .env file with proper values"
    else
        print_warning "No .env.example found. Please create .env file manually"
    fi
fi

if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
    print_success "Backend dependencies installed"
else
    print_success "Backend dependencies already installed"
fi

cd ../

echo ""
print_status "Setting up Frontend..."
cd frontend/

if [ ! -f "secrets.json" ]; then
    print_status "Creating frontend secrets.json from template"
    if [ -f "secrets.template.json" ]; then
        cp secrets.template.json secrets.json
        print_warning "Please configure your secrets.json file with proper API endpoints"
    else
        print_warning "No secrets.template.json found. Please create secrets.json file manually"
    fi
fi

if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    yarn install
    print_success "Frontend dependencies installed"
else
    print_success "Frontend dependencies already installed"
fi

cd ../

echo ""
print_status "Setting up Smart Contracts..."
cd smart-contracts/

if [ ! -f ".env" ]; then
    print_warning "Please create .env file in smart-contracts/ with your Hedera credentials"
fi

if [ ! -d "node_modules" ]; then
    print_status "Installing smart contracts dependencies..."
    npm install
    print_success "Smart contracts dependencies installed"
else
    print_success "Smart contracts dependencies already installed"
fi

cd ../

echo ""
print_success "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Configure environment files:"
echo "   - backend/.env (database, Hedera, Twitter API keys)"
echo "   - frontend/secrets.json (API endpoints)"
echo "   - smart-contracts/.env (Hedera credentials)"
echo ""
echo "2. Start the services:"
echo "   Backend:  cd backend && npm run dev"
echo "   Frontend: cd frontend && yarn dev"
echo ""
echo "3. Deploy smart contracts:"
echo "   cd smart-contracts && npm run deploy"
echo ""
echo "🔗 Documentation:"
echo "   - Backend API: http://localhost:4000/api-docs"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend README: backend/README.md"
echo "   - Frontend README: frontend/README.md"
echo ""
echo "🎯 Happy Hacking!"