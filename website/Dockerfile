FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies for Linux
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy pre-compiled production build & static assets
COPY .next ./.next
COPY public ./public

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]
