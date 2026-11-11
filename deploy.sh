#!/usr/bin/env bash

# ==============================================================================
# Single-Command Automated AWS Deployment Script
# ==============================================================================
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}   🚀 Starting Automated AWS Deployment Process       ${NC}"
echo -e "${BLUE}======================================================${NC}"

# 1. Check if Docker is installed, install if missing
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker is not installed. Installing Docker...${NC}"
    if [ -f /etc/debian_version ] || [ -f /etc/lsb-release ]; then
        sudo apt-get update
        sudo apt-get install -y curl ca-certificates
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker "$USER" || true
        rm get-docker.sh
    else
        echo -e "${RED}Please install Docker manually on this OS.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✔ Docker is already installed.${NC}"
fi

# 2. Check if Docker Compose plugin is installed
if ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}Docker Compose plugin is not installed. Installing...${NC}"
    sudo apt-get update && sudo apt-get install -y docker-compose-plugin || true
else
    echo -e "${GREEN}✔ Docker Compose is ready.${NC}"
fi

# 3. Handle .env file (root directory)
if [ ! -f .env ]; then
    if [ -f backend/.env ]; then
        echo -e "${YELLOW}Found existing backend/.env! Copying it to root .env for deployment...${NC}"
        cp backend/.env .env
    else
        echo -e "${YELLOW}Generating production .env file with secure secrets...${NC}"
        
        # Generate random strings
        PG_PASS=$(openssl rand -hex 16 2>/dev/null || date +%s | sha256sum | base64 | head -c 32)
        JWT_ACCESS=$(openssl rand -hex 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 64)
        JWT_REFRESH=$(openssl rand -hex 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 64)
        AES_KEY=$(openssl rand -hex 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 64)
        COOKIE_SEC=$(openssl rand -hex 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 64)

        cat <<EOF > .env
POSTGRES_USER=restaurant_user
POSTGRES_PASSWORD=${PG_PASS}
POSTGRES_DB=restaurant_db

JWT_ACCESS_SECRET=${JWT_ACCESS}
JWT_REFRESH_SECRET=${JWT_REFRESH}
AES_SECRET_KEY=${AES_KEY}
COOKIE_SECRET=${COOKIE_SEC}

FRONTEND_URL=http://localhost
WEBSITE_URL=http://localhost

ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@restaurant.com
ADMIN_PASSWORD=Admin@123456
EOF
        echo -e "${GREEN}✔ Created .env with generated secrets.${NC}"
    fi
else
    echo -e "${GREEN}✔ Root .env file already exists.${NC}"
fi

# 4. Stop any conflicting local processes or old containers if running
echo -e "${BLUE}Building and launching Docker containers...${NC}"
docker compose down || true

# 5. Build and launch all services
docker compose up -d --build

# 6. Wait for database and backend initialization
echo -e "${YELLOW}Waiting for services to initialize...${NC}"
sleep 10

echo -e "\n${BLUE}======================================================${NC}"
echo -e "${GREEN}   🎉 Deployment Successfully Completed!             ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Detect Public IP
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com || curl -s ifconfig.me || echo "your-server-ip")

echo -e "You can now access your application at:"
echo -e "  🌐 Customer Website:   ${GREEN}http://${PUBLIC_IP}/${NC}"
echo -e "  ⚙️  Admin Dashboard:    ${GREEN}http://${PUBLIC_IP}/admin/${NC}"
echo -e "  📡 Backend API Health:  ${GREEN}http://${PUBLIC_IP}/api/health${NC}"
echo -e "\nDefault Admin Credentials:"
echo -e "  Email:    admin@restaurant.com"
echo -e "  Password: Admin@123456"
echo -e "------------------------------------------------------"
echo -e "To view live logs: ${YELLOW}docker compose logs -f${NC}"
echo -e "To stop containers: ${YELLOW}docker compose down${NC}"
