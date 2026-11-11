#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}   ⚡ Building All Projects Locally (Fast Build)      ${NC}"
echo -e "${BLUE}======================================================${NC}"

# 1. Build Backend
echo -e "\n${YELLOW}1/3 Building Backend TypeScript...${NC}"
cd backend && npm run build && cd ..
echo -e "${GREEN}✔ Backend build complete.${NC}"

# 2. Build Frontend Admin Panel
echo -e "\n${YELLOW}2/3 Building Frontend Admin Panel...${NC}"
cd frontend && npm run build && cd ..
echo -e "${GREEN}✔ Frontend build complete.${NC}"

# 3. Build Customer Website (Next.js Standalone)
echo -e "\n${YELLOW}3/3 Building Website Next.js Standalone...${NC}"
cd website && npm run build && cd ..
echo -e "${GREEN}✔ Website build complete.${NC}"

echo -e "\n${BLUE}======================================================${NC}"
echo -e "${GREEN}   🎉 All Builds Completed Successfully in Seconds!  ${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "Now simply push the ready builds to your server:"
echo -e "  1. ${YELLOW}git add -A && git commit -m \"Production build\" && git push${NC}"
echo -e "  2. On your AWS server terminal run:"
echo -e "     ${GREEN}git pull && sudo bash deploy.sh${NC}"
