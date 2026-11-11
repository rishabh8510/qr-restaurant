FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Install dependencies required by node-gyp or argon2 if needed
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci --omit=dev && npm install sequelize-cli typescript && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/seeders ./seeders
COPY start.sh ./
RUN chmod +x ./start.sh

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["./start.sh"]
