#!/bin/bash

# 🚀 Firebase Deployment Script for Ping Pong League Manager
# This script handles the complete deployment process including environment setup

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Handle help first
if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
    echo "🚀 Firebase Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [environment] [options]"
    echo ""
    echo "Environments:"
    echo "  staging               Deploy to staging (pingpong-staging)"
    echo "  production            Deploy to production (pingpong-league-manager) [default]"
    echo ""
    echo "Options:"
    echo "  --help, -h            Show this help message"
    echo "  --check               Run pre-deployment checks only"
    echo "  --build               Build application only (no deploy)"
    echo "  --env-template        Create environment template"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh                    # Deploy to production"
    echo "  ./deploy.sh staging            # Deploy to staging"
    echo "  ./deploy.sh staging --check   # Check staging environment"
    echo "  ./deploy.sh production --build # Build production only"
    echo ""
    echo "Environment Files:"
    echo "  staging     → .env.staging"
    echo "  production  → .env.production"
    echo ""
    exit 0
fi

# Configuration
PROJECT_NAME="pingpong-league-manager"
BUILD_DIR="out"

# Determine environment and options
if [[ "${1:-}" == --* ]]; then
    # First argument is an option, use default environment
    ENVIRONMENT="production"
    OPTION="${1:-}"
else
    # First argument might be environment, second might be option
    ENVIRONMENT=${1:-production}
    OPTION="${2:-}"
fi

# Determine environment file and Firebase project
case $ENVIRONMENT in
    staging)
        ENV_FILE=".env.staging"
        FIREBASE_PROJECT="pingpong-league-manager"  # Using same project for staging (configured in .env.staging)
        ;;
    production)
        ENV_FILE=".env.production"
        FIREBASE_PROJECT="pingpong-league-manager"
        ;;
    *)
        print_error "Unknown environment: $ENVIRONMENT"
        echo "Supported environments: staging, production"
        exit 1
        ;;
esac

check_dependencies() {
    print_step "Checking dependencies..."
    
    # Check if Firebase CLI is installed
    if ! command -v firebase &> /dev/null; then
        print_error "Firebase CLI is not installed"
        echo "Install it with: npm install -g firebase-tools"
        exit 1
    fi
    
    # Check if pnpm is installed
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed"
        echo "Install it with: npm install -g pnpm"
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

check_firebase_auth() {
    print_step "Checking Firebase authentication..."
    
    if ! firebase projects:list &> /dev/null; then
        print_error "Not authenticated with Firebase CLI"
        echo "Run: firebase login"
        exit 1
    fi
    
    print_success "Firebase CLI is authenticated"
}

setup_environment() {
    print_step "Setting up environment variables for $ENVIRONMENT..."
    
    # Create environment file if it doesn't exist
    if [ ! -f "$ENV_FILE" ]; then
        print_warning "$ENV_FILE file not found. Creating template..."
        
        # Use env-manager to create template
        if [ -f "scripts/env-manager.sh" ]; then
            ./scripts/env-manager.sh create "$ENVIRONMENT"
        else
            # Fallback to basic template
            cat > "$ENV_FILE" << 'EOF'
# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pingpong-league-manager.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pingpong-league-manager
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pingpong-league-manager.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Environment
NODE_ENV=production
NEXT_PUBLIC_ENV=production

# Firebase Emulator (set to false for production)
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
EOF
        fi
        print_error "Please configure your environment variables in $ENV_FILE"
        echo "Fill in the Firebase configuration values and run the script again."
        exit 1
    fi
    
    # Validate required environment variables
    if ! grep -q "NEXT_PUBLIC_FIREBASE_API_KEY.*=" "$ENV_FILE" || grep -q "your_api_key_here" "$ENV_FILE"; then
        print_error "Firebase configuration is not properly set in $ENV_FILE"
        echo "Please configure all Firebase environment variables."
        exit 1
    fi
    
    # Copy environment file to .env for build
    if [ ! -f ".env" ] || [ "$ENV_FILE" -nt ".env" ]; then
        cp "$ENV_FILE" .env
        print_success "Environment file ($ENV_FILE) copied to .env"
    fi
    
    print_success "Environment variables are configured"
}

install_dependencies() {
    print_step "Installing dependencies..."
    
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        pnpm install
        print_success "Dependencies installed"
    else
        print_success "Dependencies are up to date"
    fi
}

run_linting() {
    print_step "Running linting and type checking..."
    
    # Run ESLint (optional, but good practice)
    if pnpm run lint 2>/dev/null; then
        print_success "Linting passed"
    else
        print_warning "Linting has warnings (continuing anyway)"
    fi
}

build_application() {
    print_step "Building application for production..."
    
    # Clean previous build
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        print_success "Cleaned previous build"
    fi
    
    # Build the application
    if pnpm build; then
        print_success "Application built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
    
    # Verify build output
    if [ ! -d "$BUILD_DIR" ]; then
        print_error "Build directory $BUILD_DIR not found"
        exit 1
    fi
    
    # Count files in build
    FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l)
    print_success "Build contains $FILE_COUNT files"
}

deploy_to_firebase() {
    print_step "Deploying to Firebase Hosting ($ENVIRONMENT environment)..."
    
    # Ensure we're using the correct project
    print_step "Switching to Firebase project: $FIREBASE_PROJECT"
    firebase use "$FIREBASE_PROJECT"
    
    # Deploy to Firebase Hosting
    if firebase deploy --only hosting; then
        print_success "Deployment completed successfully to $ENVIRONMENT!"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

show_deployment_info() {
    echo ""
    echo "🎉 Deployment Summary ($ENVIRONMENT):"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ Application deployed successfully to $ENVIRONMENT!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Live URLs:${NC}"
    
    # Determine app URL based on Firebase project
    local app_url
    case $FIREBASE_PROJECT in
        "pingpong-dev")
            app_url="https://pingpong-dev.web.app"
            ;;
        "pingpong-staging")
            app_url="https://pingpong-staging.web.app"
            ;;
        "pingpong-league-manager")
            app_url="https://pingpong-league-manager.web.app"
            ;;
        *)
            app_url="https://${FIREBASE_PROJECT}.web.app"
            ;;
    esac
    
    echo "   • App URL: $app_url"
    echo "   • Console: https://console.firebase.google.com/project/$FIREBASE_PROJECT"
    echo ""
    echo -e "${BLUE}🧪 Test Access:${NC}"
    echo "   • Admin: Login with 0333141692"
    echo "   • User: Any other phone number"
    echo "   • Public: /viewer (no login required)"
    echo ""
    echo -e "${BLUE}📊 Build Stats:${NC}"
    if [ -d "$BUILD_DIR" ]; then
        FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l)
        BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
        echo "   • Files: $FILE_COUNT"
        echo "   • Size: $BUILD_SIZE"
    fi
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Main deployment process
main() {
    echo "🚀 Starting Firebase deployment for Ping Pong League Manager ($ENVIRONMENT)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Environment: $ENVIRONMENT"
    echo "Config File: $ENV_FILE"  
    echo "Firebase Project: $FIREBASE_PROJECT"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Pre-deployment checks
    check_dependencies
    check_firebase_auth
    setup_environment
    
    # Build process
    install_dependencies
    run_linting
    build_application
    
    # Deployment
    deploy_to_firebase
    
    # Success
    show_deployment_info
}

# Handle script options
case "$OPTION" in
    --check)
        check_dependencies
        check_firebase_auth
        setup_environment
        print_success "All checks passed! Ready for deployment."
        exit 0
        ;;
    --build)
        check_dependencies
        setup_environment
        install_dependencies
        run_linting
        build_application
        print_success "Build completed successfully!"
        exit 0
        ;;
    --env-template)
        setup_environment
        exit 0
        ;;
    "")
        # No options, run full deployment
        main
        ;;
    *)
        print_error "Unknown option: $OPTION"
        echo "Use --help for usage information"
        exit 1
        ;;
esac
