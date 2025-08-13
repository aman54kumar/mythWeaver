#!/bin/bash

# Production deployment script for MythWeaver
# This script handles zero-downtime deployment

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/opt/mythweaver"
COMPOSE_FILE="docker-compose.yml"
PROD_COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="/opt/backups/mythweaver"
LOG_FILE="/var/log/mythweaver-deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Pre-deployment checks
pre_deploy_checks() {
    log "Running pre-deployment checks..."
    
    # Check if running as root or with sudo
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root or with sudo"
    fi
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running"
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose &> /dev/null; then
        error "docker-compose is not installed"
    fi
    
    # Check if project directory exists
    if [[ ! -d "$PROJECT_DIR" ]]; then
        error "Project directory $PROJECT_DIR does not exist"
    fi
    
    success "Pre-deployment checks passed"
}

# Backup current deployment
backup_deployment() {
    log "Creating backup of current deployment..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/$TIMESTAMP"
    
    mkdir -p "$BACKUP_PATH"
    
    # Backup database
    if [[ -f "$PROJECT_DIR/backend/data/app.db" ]]; then
        cp "$PROJECT_DIR/backend/data/app.db" "$BACKUP_PATH/"
        log "Database backed up to $BACKUP_PATH/app.db"
    fi
    
    # Backup environment files
    if [[ -f "$PROJECT_DIR/.env" ]]; then
        cp "$PROJECT_DIR/.env" "$BACKUP_PATH/"
    fi
    
    # Keep only last 10 backups
    cd "$BACKUP_DIR"
    ls -1t | tail -n +11 | xargs -d '\n' rm -rf --
    
    success "Backup created at $BACKUP_PATH"
}

# Pull latest code and images
update_code_and_images() {
    log "Updating code and Docker images..."
    
    cd "$PROJECT_DIR"
    
    # Pull latest code
    git fetch origin
    git reset --hard origin/main
    
    # Pull latest Docker images
    docker-compose -f "$COMPOSE_FILE" -f "$PROD_COMPOSE_FILE" pull
    
    success "Code and images updated"
}

# Deploy with zero downtime
deploy() {
    log "Starting zero-downtime deployment..."
    
    cd "$PROJECT_DIR"
    
    # Deploy with rolling update
    docker-compose -f "$COMPOSE_FILE" -f "$PROD_COMPOSE_FILE" up -d --force-recreate --remove-orphans
    
    # Wait for services to be healthy
    log "Waiting for services to become healthy..."
    sleep 30
    
    # Health checks
    local retry_count=0
    local max_retries=12
    
    while [[ $retry_count -lt $max_retries ]]; do
        if curl -f http://localhost:8000/api/v1/health > /dev/null 2>&1 && \
           curl -f http://localhost:3000/health > /dev/null 2>&1; then
            success "All services are healthy"
            break
        fi
        
        retry_count=$((retry_count + 1))
        log "Health check attempt $retry_count/$max_retries failed, retrying in 10s..."
        sleep 10
    done
    
    if [[ $retry_count -eq $max_retries ]]; then
        error "Health checks failed after $max_retries attempts"
    fi
    
    success "Deployment completed successfully"
}

# Cleanup old resources
cleanup() {
    log "Cleaning up old resources..."
    
    # Remove unused Docker images
    docker image prune -f
    
    # Remove unused volumes (be careful with this)
    # docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    success "Cleanup completed"
}

# Rollback function
rollback() {
    log "Rolling back to previous deployment..."
    
    # Get latest backup
    LATEST_BACKUP=$(ls -1t "$BACKUP_DIR" | head -n 1)
    
    if [[ -z "$LATEST_BACKUP" ]]; then
        error "No backup found for rollback"
    fi
    
    log "Rolling back to backup: $LATEST_BACKUP"
    
    cd "$PROJECT_DIR"
    
    # Restore database if exists
    if [[ -f "$BACKUP_DIR/$LATEST_BACKUP/app.db" ]]; then
        cp "$BACKUP_DIR/$LATEST_BACKUP/app.db" "$PROJECT_DIR/backend/data/"
        log "Database restored from backup"
    fi
    
    # Restore environment file if exists
    if [[ -f "$BACKUP_DIR/$LATEST_BACKUP/.env" ]]; then
        cp "$BACKUP_DIR/$LATEST_BACKUP/.env" "$PROJECT_DIR/"
        log "Environment file restored from backup"
    fi
    
    # Restart services
    docker-compose -f "$COMPOSE_FILE" -f "$PROD_COMPOSE_FILE" down
    docker-compose -f "$COMPOSE_FILE" -f "$PROD_COMPOSE_FILE" up -d
    
    success "Rollback completed"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    # Slack notification (if webhook URL is configured)
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
                    curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 MythWeaver Deployment: $status\\n$message\"}" \
            "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 || true
    fi
    
    # Email notification (if configured)
    if [[ -n "${NOTIFICATION_EMAIL:-}" ]] && command -v mail &> /dev/null; then
        echo "$message" | mail -s "MythWeaver Deployment: $status" "$NOTIFICATION_EMAIL" || true
    fi
}

# Main deployment function
main() {
    log "Starting MythWeaver deployment process..."
    
    case "${1:-deploy}" in
        "deploy")
            pre_deploy_checks
            backup_deployment
            update_code_and_images
            deploy
            cleanup
            send_notification "SUCCESS" "Deployment completed successfully at $(date)"
            ;;
        "rollback")
            rollback
            send_notification "ROLLBACK" "Rollback completed at $(date)"
            ;;
        "health")
            if curl -f http://localhost:8000/api/v1/health > /dev/null 2>&1 && \
               curl -f http://localhost:3000/health > /dev/null 2>&1; then
                success "All services are healthy"
                exit 0
            else
                error "Health check failed"
            fi
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|health}"
            echo "  deploy   - Deploy latest version (default)"
            echo "  rollback - Rollback to previous version"
            echo "  health   - Check service health"
            exit 1
            ;;
    esac
}

# Trap errors and send notification
trap 'send_notification "FAILED" "Deployment failed at $(date). Check logs at $LOG_FILE"' ERR

# Run main function
main "$@"
