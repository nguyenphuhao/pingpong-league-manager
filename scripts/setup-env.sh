#!/bin/bash

# 🔧 Environment Setup Script for Ping Pong League Manager
# This script helps configure environment variables for deployment

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

ENV_FILE=".env.local"
FIREBASE_CONFIG_FILE="src/lib/firebase.ts"

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

create_env_template() {
    print_step "Creating .env.local template..."
    
    cat > "$ENV_FILE" << 'EOF'
# Firebase Configuration (Production)
# Get these values from: https://console.firebase.google.com/project/pingpong-league-manager/settings/general

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pingpong-league-manager.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pingpong-league-manager
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pingpong-league-manager.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Environment Configuration
NODE_ENV=production
NEXT_PUBLIC_ENV=production

# Firebase Emulator (set to false for production)
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false

# Optional: Analytics and Performance
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
EOF
    
    print_success "Template created at $ENV_FILE"
    echo ""
    echo "📝 Next steps:"
    echo "1. Go to: https://console.firebase.google.com/project/pingpong-league-manager/settings/general"
    echo "2. Scroll down to 'Your apps' section"
    echo "3. Click on the web app (if none exists, create one)"
    echo "4. Copy the config values to $ENV_FILE"
    echo "5. Replace 'your_*_here' with actual values"
}

validate_env() {
    print_step "Validating environment configuration..."
    
    if [ ! -f "$ENV_FILE" ]; then
        print_error ".env.local file not found"
        echo "Run: ./scripts/setup-env.sh --create"
        return 1
    fi
    
    # Check for placeholder values
    local has_errors=false
    
    if grep -q "your_.*_here" "$ENV_FILE"; then
        print_error "Found placeholder values in $ENV_FILE"
        echo "Please replace all 'your_*_here' values with actual Firebase config"
        has_errors=true
    fi
    
    # Check required variables
    local required_vars=(
        "NEXT_PUBLIC_FIREBASE_API_KEY"
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
        "NEXT_PUBLIC_FIREBASE_APP_ID"
    )
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$ENV_FILE"; then
            print_error "Missing required variable: $var"
            has_errors=true
        fi
    done
    
    if [ "$has_errors" = true ]; then
        return 1
    fi
    
    print_success "Environment configuration is valid"
    return 0
}

show_current_config() {
    print_step "Current environment configuration:"
    
    if [ ! -f "$ENV_FILE" ]; then
        print_warning "No .env.local file found"
        return 1
    fi
    
    echo ""
    echo "🔧 Environment Variables:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Show env vars but mask sensitive values
    while IFS= read -r line; do
        if [[ $line =~ ^[[:space:]]*# ]] || [[ -z $line ]]; then
            echo "$line"
        elif [[ $line =~ ^([^=]+)=(.*)$ ]]; then
            var_name="${BASH_REMATCH[1]}"
            var_value="${BASH_REMATCH[2]}"
            
            # Mask sensitive values
            if [[ $var_value == *"your_"*"_here" ]]; then
                echo "$var_name=${YELLOW}$var_value${NC} ${RED}(NEEDS CONFIGURATION)${NC}"
            elif [[ $var_name == *"API_KEY"* ]] || [[ $var_name == *"APP_ID"* ]]; then
                masked_value="${var_value:0:8}...${var_value: -4}"
                echo "$var_name=${GREEN}$masked_value${NC}"
            else
                echo "$var_name=${GREEN}$var_value${NC}"
            fi
        else
            echo "$line"
        fi
    done < "$ENV_FILE"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

backup_env() {
    if [ -f "$ENV_FILE" ]; then
        local backup_file="$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$ENV_FILE" "$backup_file"
        print_success "Backup created: $backup_file"
    fi
}

update_env_from_firebase() {
    print_step "Updating environment from Firebase config..."
    
    if [ ! -f "$FIREBASE_CONFIG_FILE" ]; then
        print_error "Firebase config file not found: $FIREBASE_CONFIG_FILE"
        return 1
    fi
    
    print_warning "This will extract config from $FIREBASE_CONFIG_FILE"
    print_warning "Make sure the Firebase config is up to date!"
    
    # Extract config values (this is a simplified extraction)
    # In a real scenario, you might want to use a more robust method
    
    echo ""
    echo "🔧 Firebase Config Detection:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if grep -q "apiKey:" "$FIREBASE_CONFIG_FILE"; then
        echo "✅ Firebase config found in source code"
        echo "📝 Please manually extract the values and update $ENV_FILE"
        echo ""
        echo "Look for the firebaseConfig object in:"
        echo "   $FIREBASE_CONFIG_FILE"
    else
        print_warning "No Firebase config detected in source code"
    fi
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "🔧 Environment Setup Script"
        echo ""
        echo "Usage: ./scripts/setup-env.sh [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h         Show this help message"
        echo "  --create           Create .env.local template"
        echo "  --validate         Validate current environment"
        echo "  --show             Show current configuration"
        echo "  --backup           Backup current .env.local"
        echo "  --update-from-fb   Update from Firebase config file"
        echo ""
        echo "Examples:"
        echo "  ./scripts/setup-env.sh --create     # Create template"
        echo "  ./scripts/setup-env.sh --validate   # Check config"
        echo "  ./scripts/setup-env.sh --show       # Show current"
        echo ""
        exit 0
        ;;
    --create)
        backup_env
        create_env_template
        ;;
    --validate)
        validate_env
        ;;
    --show)
        show_current_config
        ;;
    --backup)
        backup_env
        ;;
    --update-from-fb)
        update_env_from_firebase
        ;;
    "")
        echo "🔧 Environment Setup for Ping Pong League Manager"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        if [ -f "$ENV_FILE" ]; then
            print_step "Found existing $ENV_FILE"
            show_current_config
            echo ""
            if validate_env; then
                print_success "Environment is ready for deployment!"
            else
                print_error "Environment needs configuration"
                echo ""
                echo "💡 Quick fixes:"
                echo "   ./scripts/setup-env.sh --create    # Create new template"
                echo "   ./scripts/setup-env.sh --validate  # Check issues"
            fi
        else
            print_warning "No environment file found"
            echo ""
            echo "🚀 Getting started:"
            echo "   ./scripts/setup-env.sh --create    # Create template"
            echo "   # Edit .env.local with your Firebase config"
            echo "   ./scripts/setup-env.sh --validate  # Verify setup"
        fi
        ;;
    *)
        print_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac
