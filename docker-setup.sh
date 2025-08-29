#!/bin/bash

# =============================================================================
# HASHBUZZ DOCKER SETUP SCRIPT
# =============================================================================
# This script helps manage Docker setup for the Hashbuzz project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Check if Docker is installed
check_docker() {
    print_header "Checking Docker Installation"

    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    print_status "Docker is installed: $(docker --version)"

    if ! command -v docker compose &> /dev/null; then
        print_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi

    print_status "Docker Compose is available: $(docker compose version)"
}

# Check Docker service
check_docker_service() {
    print_header "Checking Docker Service"

    if ! systemctl is-active --quiet docker; then
        print_warning "Docker service is not running. Starting it..."
        sudo systemctl start docker
        sudo systemctl enable docker
    fi

    print_status "Docker service is running"
}

# Test Docker functionality
test_docker() {
    print_header "Testing Docker Functionality"

    export DOCKER_HOST=unix:///var/run/docker.sock

    if docker ps > /dev/null 2>&1; then
        print_status "Docker is working correctly"
    else
        print_error "Docker is not working. Check permissions and service status."
        exit 1
    fi
}

# Main Docker setup functions
main() {
    print_header "Hashbuzz Docker Setup"

    check_docker
    check_docker_service
    test_docker

    print_header "Available Commands"
    echo "Development server:"
    echo "  docker compose -f compose-dev.yaml up frontend-dev"
    echo ""
    echo "Production build:"
    echo "  docker compose -f compose-dev.yaml --profile production up frontend-prod"
    echo ""
    echo "With database:"
    echo "  docker compose -f compose-dev.yaml --profile database up"
    echo ""
    echo "Full stack:"
    echo "  docker compose -f compose-dev.yaml --profile database --profile proxy up"
    echo ""

    print_status "Docker setup completed successfully! 🐳"
}

# Run the main function
main "$@"
