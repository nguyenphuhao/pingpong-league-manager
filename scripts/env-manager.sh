#!/bin/bash

# 🔧 Environment Manager for Firebase Hosting
# Manages multiple environment configurations and validation

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
ENVIRONMENTS=("staging" "production")
DEFAULT_ENV="production"

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

get_env_file() {
    local env=$1
    echo ".env.${env}"
}

create_env_template() {
    local environment=${1:-production}
    local env_file=$(get_env_file "$environment")
    
    print_step "Creating $environment environment template: $env_file"
    
    # Determine Firebase project ID based on environment
    local project_id
    case $environment in
        staging)
            project_id="pingpong-staging"
            ;;
        production)
            project_id="pingpong-league-manager"
            ;;
        *)
            project_id="your_project_id_here"
            ;;
    esac
    
    # Determine if emulator should be used (disabled for all environments)
    local use_emulator="false"
    
    cat > "$env_file" << EOF
# Firebase Configuration ($environment)
# Get these values from: https://console.firebase.google.com/project/${project_id}/settings/general

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${project_id}.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${project_id}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${project_id}.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Environment Configuration
NODE_ENV=${environment}
NEXT_PUBLIC_ENV=${environment}

# Firebase Emulator (use for development only)
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=${use_emulator}

# Optional: Build metadata
NEXT_PUBLIC_BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
NEXT_PUBLIC_BUILD_ENVIRONMENT=${environment}

# Optional: Feature flags (for development)
# NEXT_PUBLIC_ENABLE_DEBUG=true
# NEXT_PUBLIC_ENABLE_ANALYTICS=false
EOF
    
    print_success "Template created: $env_file"
    
    print_warning "Remember to:"
    echo "1. Replace 'your_*_here' values with actual Firebase config"
    echo "2. Get config from: https://console.firebase.google.com/project/${project_id}/settings/general"
}

validate_env() {
    local environment=${1:-production}
    local env_file=$(get_env_file "$environment")
    
    print_step "Validating $environment environment: $env_file"
    
    if [ ! -f "$env_file" ]; then
        print_error "Environment file not found: $env_file"
        echo "Create it with: ./scripts/env-manager.sh create $environment"
        return 1
    fi
    
    local has_errors=false
    local required_vars=(
        "NEXT_PUBLIC_FIREBASE_API_KEY"
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
        "NEXT_PUBLIC_FIREBASE_APP_ID"
        "NEXT_PUBLIC_ENV"
    )
    
    # Check for required variables
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$env_file"; then
            print_error "Missing required variable: $var"
            has_errors=true
        fi
    done
    
    # Check for placeholder values
    if grep -q "your_.*_here" "$env_file"; then
        print_error "Found placeholder values in $env_file"
        echo "Replace all 'your_*_here' values with actual Firebase config"
        has_errors=true
    fi
    
    # Validate environment-specific values
    local env_value=$(grep "^NEXT_PUBLIC_ENV=" "$env_file" | cut -d'=' -f2)
    if [ "$env_value" != "$environment" ]; then
        print_warning "NEXT_PUBLIC_ENV value ($env_value) doesn't match environment ($environment)"
    fi
    
    # Validate Firebase project ID based on environment
    local project_id=$(grep "^NEXT_PUBLIC_FIREBASE_PROJECT_ID=" "$env_file" | cut -d'=' -f2)
    case $environment in
        staging)
            if [[ ! "$project_id" =~ staging ]]; then
                print_warning "Staging environment should use a staging project ID"
            fi
            ;;
        production)
            if [[ "$project_id" =~ staging ]]; then
                print_warning "Production environment should not use staging project ID"
            fi
            ;;
    esac
    
    if [ "$has_errors" = true ]; then
        return 1
    fi
    
    print_success "$environment environment is valid"
    return 0
}

show_env() {
    local environment=${1:-production}
    local env_file=$(get_env_file "$environment")
    
    print_step "$environment environment configuration: $env_file"
    
    if [ ! -f "$env_file" ]; then
        print_warning "Environment file not found: $env_file"
        return 1
    fi
    
    echo ""
    echo -e "${BLUE}🔧 Environment Variables:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    while IFS= read -r line; do
        if [[ $line =~ ^[[:space:]]*# ]] || [[ -z $line ]]; then
            echo "$line"
        elif [[ $line =~ ^([^=]+)=(.*)$ ]]; then
            var_name="${BASH_REMATCH[1]}"
            var_value="${BASH_REMATCH[2]}"
            
            # Mask sensitive values
            if [[ $var_value == *"your_"*"_here" ]]; then
                echo -e "$var_name=${YELLOW}$var_value${NC} ${RED}(NEEDS CONFIGURATION)${NC}"
            elif [[ $var_name == *"API_KEY"* ]] || [[ $var_name == *"APP_ID"* ]]; then
                if [ ${#var_value} -gt 12 ]; then
                    masked_value="${var_value:0:8}...${var_value: -4}"
                else
                    masked_value="$var_value"
                fi
                echo -e "$var_name=${GREEN}$masked_value${NC}"
            else
                echo -e "$var_name=${GREEN}$var_value${NC}"
            fi
        else
            echo "$line"
        fi
    done < "$env_file"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

switch_env() {
    local environment=$1
    local env_file=$(get_env_file "$environment")
    
    if [ ! -f "$env_file" ]; then
        print_error "Environment file not found: $env_file"
        echo "Create it with: ./scripts/env-manager.sh create $environment"
        return 1
    fi
    
    print_step "Switching to $environment environment"
    
    # Backup current .env if it exists
    if [ -f ".env" ]; then
        cp .env ".env.backup.$(date +%Y%m%d_%H%M%S)"
        print_success "Backed up current .env"
    fi
    
    # Copy environment file to .env
    cp "$env_file" .env
    
    print_success "Switched to $environment environment"
    echo ""
    echo -e "${BLUE}📋 Current configuration:${NC}"
    grep "NEXT_PUBLIC_ENV=" .env
    grep "NEXT_PUBLIC_FIREBASE_PROJECT_ID=" .env
    grep "NEXT_PUBLIC_USE_FIREBASE_EMULATOR=" .env
}

list_environments() {
    print_step "Available environments:"
    echo ""
    
    for env in "${ENVIRONMENTS[@]}"; do
        local env_file=$(get_env_file "$env")
        if [ -f "$env_file" ]; then
            echo -e "✅ ${GREEN}$env${NC} ($env_file)"
            
            # Show key info
            if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID=" "$env_file"; then
                local project_id=$(grep "^NEXT_PUBLIC_FIREBASE_PROJECT_ID=" "$env_file" | cut -d'=' -f2)
                echo "   📌 Project: $project_id"
            fi
            
            if grep -q "your_.*_here" "$env_file"; then
                echo -e "   ${YELLOW}⚠️  Needs configuration${NC}"
            fi
        else
            echo -e "❌ ${RED}$env${NC} ($env_file) - Missing"
            echo "   Create with: ./scripts/env-manager.sh create $env"
        fi
        echo ""
    done
}

validate_all() {
    print_step "Validating all environments"
    echo ""
    
    local all_valid=true
    
    for env in "${ENVIRONMENTS[@]}"; do
        local env_file=$(get_env_file "$env")
        if [ -f "$env_file" ]; then
            if validate_env "$env"; then
                echo ""
            else
                all_valid=false
                echo ""
            fi
        else
            print_warning "$env environment not found: $env_file"
            all_valid=false
            echo ""
        fi
    done
    
    if [ "$all_valid" = true ]; then
        print_success "All environments are valid!"
    else
        print_error "Some environments need attention"
        return 1
    fi
}

copy_env() {
    local source_env=$1
    local target_env=$2
    
    local source_file=$(get_env_file "$source_env")
    local target_file=$(get_env_file "$target_env")
    
    if [ ! -f "$source_file" ]; then
        print_error "Source environment file not found: $source_file"
        return 1
    fi
    
    print_step "Copying $source_env to $target_env"
    
    # Backup target if it exists
    if [ -f "$target_file" ]; then
        cp "$target_file" "$target_file.backup.$(date +%Y%m%d_%H%M%S)"
        print_success "Backed up existing $target_file"
    fi
    
    # Copy and update environment-specific values
    cp "$source_file" "$target_file"
    
    # Update NEXT_PUBLIC_ENV
    sed -i.bak "s/^NEXT_PUBLIC_ENV=.*/NEXT_PUBLIC_ENV=$target_env/" "$target_file"
    sed -i.bak "s/^NODE_ENV=.*/NODE_ENV=$target_env/" "$target_file"
    
    # Update build environment
    sed -i.bak "s/^NEXT_PUBLIC_BUILD_ENVIRONMENT=.*/NEXT_PUBLIC_BUILD_ENVIRONMENT=$target_env/" "$target_file"
    
    # Clean up backup files created by sed
    rm -f "$target_file.bak"
    
    print_success "Copied $source_env environment to $target_env"
    print_warning "Remember to update Firebase project ID and other environment-specific values"
}

show_help() {
    echo "🔧 Environment Manager for Firebase Hosting"
    echo ""
    echo "Usage: ./scripts/env-manager.sh <command> [arguments]"
    echo ""
    echo "Commands:"
    echo "  create <env>       Create environment template (staging|production)"
    echo "  validate <env>     Validate environment configuration"
    echo "  show <env>         Show environment configuration (masked)"
    echo "  switch <env>       Switch to environment (copies to .env)"
    echo "  list              List all environments and their status"
    echo "  validate-all      Validate all environments"
    echo "  copy <from> <to>  Copy environment configuration"
    echo ""
    echo "Examples:"
    echo "  ./scripts/env-manager.sh create staging"
    echo "  ./scripts/env-manager.sh validate production"
    echo "  ./scripts/env-manager.sh show staging"
    echo "  ./scripts/env-manager.sh switch production"
    echo "  ./scripts/env-manager.sh copy production staging"
    echo "  ./scripts/env-manager.sh list"
    echo ""
    echo "Environment Files:"
    echo "  staging     → .env.staging"
    echo "  production  → .env.production"
}

# Main command handling
case "${1:-}" in
    create)
        environment=${2:-$DEFAULT_ENV}
        create_env_template "$environment"
        ;;
    validate)
        environment=${2:-$DEFAULT_ENV}
        validate_env "$environment"
        ;;
    show)
        environment=${2:-$DEFAULT_ENV}
        show_env "$environment"
        ;;
    switch)
        environment=${2:-$DEFAULT_ENV}
        switch_env "$environment"
        ;;
    list)
        list_environments
        ;;
    validate-all)
        validate_all
        ;;
    copy)
        if [ -z "$2" ] || [ -z "$3" ]; then
            print_error "Usage: copy <source_env> <target_env>"
            exit 1
        fi
        copy_env "$2" "$3"
        ;;
    --help|-h|help)
        show_help
        ;;
    "")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac
