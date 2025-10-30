#!/bin/bash

# =============================================================================
# HASHBUZZ FRONTEND - DEVELOPMENT SETUP SCRIPT
# =============================================================================
# Sets up the development environment with all necessary tools

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Functions for colored output
print_header() {
    echo ""
    echo "${BOLD}${BLUE}============================================================${NC}"
    echo "${BOLD}${BLUE} $1${NC}"
    echo "${BOLD}${BLUE}============================================================${NC}"
    echo ""
}

print_step() {
    echo "${BLUE}🚀 $1${NC}"
}

print_success() {
    echo "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo "${RED}❌ $1${NC}"
}

print_info() {
    echo "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_header "HASHBUZZ FRONTEND DEVELOPMENT SETUP"

# Check Node.js version
print_step "Checking Node.js version..."
node_version=$(node --version | cut -d'v' -f2)
required_version="18.0.0"

if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" = "$required_version" ]; then
    print_success "Node.js version $node_version is compatible (>= $required_version)"
else
    print_error "Node.js version $node_version is too old. Please upgrade to >= $required_version"
    exit 1
fi

# Check yarn
print_step "Checking Yarn..."
if command -v yarn >/dev/null 2>&1; then
    yarn_version=$(yarn --version)
    print_success "Yarn version $yarn_version found"
else
    print_error "Yarn not found. Please install Yarn: npm install -g yarn"
    exit 1
fi

# Install dependencies
print_step "Installing dependencies..."
if yarn install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Set up environment file
print_step "Setting up environment file..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env from .env.example"
        print_warning "Please update .env with your actual configuration values"
    else
        print_warning ".env.example not found. Creating basic .env file..."
        cat > .env << EOF
# Basic environment configuration
VITE_NETWORK=testnet
VITE_BASE_URL=http://localhost:5000
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_DEBUG_LOGS=true
EOF
        print_info "Basic .env file created. Please add your specific configuration."
    fi
else
    print_info ".env file already exists"
fi

# Set up Git hooks
print_step "Setting up Git hooks..."
if [ -d ".git" ]; then
    # Make sure husky is set up
    if yarn husky install 2>/dev/null; then
        print_success "Husky initialized"
    else
        print_info "Husky already initialized or using newer version"
    fi

    # Ensure hooks are executable
    if [ -f ".husky/pre-commit" ]; then
        chmod +x .husky/pre-commit
        print_success "Pre-commit hook is executable"
    fi

    if [ -f ".husky/commit-msg" ]; then
        chmod +x .husky/commit-msg
        print_success "Commit-msg hook is executable"
    fi
else
    print_warning "Not a Git repository. Git hooks will not be active."
fi

# Run initial code quality checks
print_step "Running initial code quality checks..."
print_info "This may take a moment for the first run..."

# Check TypeScript compilation
print_info "Checking TypeScript compilation..."
if yarn type-check 2>/dev/null; then
    print_success "TypeScript compilation successful"
else
    print_warning "TypeScript compilation has errors (this is normal for initial setup)"
    print_info "You can fix these later with 'yarn type-check'"
fi

# Check ESLint
print_info "Checking ESLint configuration..."
if yarn lint --max-warnings 0 2>/dev/null; then
    print_success "ESLint checks passed"
else
    print_warning "ESLint found issues (this is normal for initial setup)"
    print_info "You can fix these with 'yarn lint:fix'"
fi

# Check Prettier
print_info "Checking Prettier formatting..."
if yarn format:check 2>/dev/null; then
    print_success "Code formatting is correct"
else
    print_warning "Code formatting issues found (this is normal for initial setup)"
    print_info "You can fix these with 'yarn format'"
fi

# Create necessary directories
print_step "Creating necessary directories..."
mkdir -p logs
mkdir -p temp
print_success "Directory structure created"

# VS Code setup
print_step "Setting up VS Code configuration..."
if command -v code >/dev/null 2>&1; then
    if [ -f ".vscode/extensions.json" ]; then
        print_info "Recommended VS Code extensions:"
        cat .vscode/extensions.json | grep '"' | sed 's/.*"\([^"]*\)".*/  - \1/'
        echo ""
        print_info "Install them with: code --install-extension <extension-id>"
        print_info "Or use the Extensions panel in VS Code"
    fi
    print_success "VS Code configuration ready"
else
    print_info "VS Code not found in PATH. Configuration files are ready if you install it later."
fi

# Success message and next steps
print_header "SETUP COMPLETED SUCCESSFULLY!"

echo "${GREEN}🎉 Your development environment is ready!${NC}"
echo ""
echo "${BOLD}${BLUE}Next Steps:${NC}"
echo "1. ${YELLOW}Review and update .env file${NC} with your configuration"
echo "2. ${YELLOW}Install recommended VS Code extensions${NC} (if using VS Code)"
echo "3. ${YELLOW}Start development server:${NC} yarn dev"
echo "4. ${YELLOW}Run code quality checks:${NC} yarn check-all"
echo ""
echo "${BOLD}${BLUE}Available Commands:${NC}"
echo "• ${YELLOW}yarn dev${NC}           - Start development server"
echo "• ${YELLOW}yarn build${NC}         - Build for production"
echo "• ${YELLOW}yarn type-check${NC}    - Check TypeScript types"
echo "• ${YELLOW}yarn lint${NC}          - Run ESLint"
echo "• ${YELLOW}yarn lint:fix${NC}      - Fix ESLint issues"
echo "• ${YELLOW}yarn format${NC}        - Format code with Prettier"
echo "• ${YELLOW}yarn fix-all${NC}       - Fix all auto-fixable issues"
echo "• ${YELLOW}yarn check-all${NC}     - Run all quality checks"
echo ""
echo "${BOLD}${BLUE}Git Hooks Active:${NC}"
echo "• ${GREEN}Pre-commit${NC}  - Runs linting and formatting on staged files"
echo "• ${GREEN}Commit-msg${NC}  - Enforces conventional commit message format"
echo ""
echo "${BOLD}${BLUE}Documentation:${NC}"
echo "• ${YELLOW}README.md${NC}                  - Project overview and setup"
echo "• ${YELLOW}CONTRIBUTING.md${NC}            - Contribution guidelines"
echo "• ${YELLOW}DEVELOPER_ONBOARDING.md${NC}    - Detailed onboarding guide"
echo ""
echo "${GREEN}Happy coding! 🚀${NC}"
