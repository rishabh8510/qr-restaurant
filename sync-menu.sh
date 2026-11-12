#!/usr/bin/env bash

# ==============================================================================
# One-Command Menu Sync Script for Local & AWS Production
# ==============================================================================
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}   🍽️  Restaurant Menu Synchronization Tool          ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Check if Docker container is currently running
DOCKER_RUNNING=false
if command -v docker &> /dev/null; then
    if docker info &> /dev/null || sudo docker info &> /dev/null 2>/dev/null; then
        COMPOSE_CMD="docker compose"
        if ! docker info &> /dev/null && sudo docker info &> /dev/null 2>/dev/null; then
            COMPOSE_CMD="sudo docker compose"
        fi
        
        if $COMPOSE_CMD ps 2>/dev/null | grep -q "backend"; then
            DOCKER_RUNNING=true
        fi
    fi
fi

if [ "$DOCKER_RUNNING" = true ]; then
    echo -e "${YELLOW}Detected active Docker environment (AWS / Docker mode)...${NC}"
    echo -e "${BLUE}Running menu migration inside backend container...${NC}"
    $COMPOSE_CMD exec -T backend npx sequelize-cli db:migrate
    echo -e "\n${BLUE}Verifying menu sync...${NC}"
    $COMPOSE_CMD exec -T backend node sync-menu.js
    echo -e "\n${GREEN}✔ Docker / AWS Database menu updated successfully!${NC}"
else
    echo -e "${YELLOW}Running in Local Node.js environment...${NC}"
    if [ ! -d "backend" ]; then
        echo -e "${RED}Error: backend folder not found. Run this from project root.${NC}"
        exit 1
    fi

    cd backend
    
    # Check node modules
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing backend dependencies...${NC}"
        npm install
    fi

    echo -e "${BLUE}1. Running database migration (20240101000016-replace-menu-from-image)...${NC}"
    npx sequelize-cli db:migrate

    echo -e "\n${BLUE}2. Running menu synchronization script...${NC}"
    node sync-menu.js

    cd ..
    echo -e "\n${GREEN}✔ Local database menu updated successfully!${NC}"
fi

echo -e "\n${BLUE}======================================================${NC}"
echo -e "${GREEN}   🎉 All Menu Items Synced from Menu Card Image!     ${NC}"
echo -e "${BLUE}======================================================${NC}"
