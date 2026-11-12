FROM node:20-alpine
WORKDIR /app

# Install native runtime dependencies
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci --omit=dev && npm install sequelize-cli && npm cache clean --force

# Copy pre-compiled code and configuration
COPY dist ./dist
COPY config ./config
COPY migrations ./migrations
COPY seeders ./seeders
COPY seed-dummy-data.js ./
COPY menu-seed-data.js ./
COPY sync-menu.js ./
COPY start.sh ./
RUN chmod +x ./start.sh

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["./start.sh"]
