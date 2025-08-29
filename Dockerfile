# =============================================================================
# HASHBUZZ FRONTEND - MULTI-STAGE DOCKER BUILD
# =============================================================================
# Production-ready React application with optimized build and security

# =============================================================================
# Stage 1: Dependencies Installation
# =============================================================================
FROM node:22-alpine AS deps

# Install security updates and dumb-init for proper signal handling
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies based on lock file
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile --production=false; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "No lock file found" && exit 1; \
  fi

# =============================================================================
# Stage 2: Build Application
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build arguments for environment configuration
ARG VITE_NETWORK=mainnet
ARG VITE_BASE_URL=https://api.hashbuzz.social
ARG VITE_HEDERA_NETWORK_TYPE=mainnet
ARG VITE_ENABLE_ANALYTICS=false
ARG VITE_ENABLE_DEV_TOOLS=false

# Set build environment variables
ENV VITE_NETWORK=$VITE_NETWORK
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_HEDERA_NETWORK_TYPE=$VITE_HEDERA_NETWORK_TYPE
ENV VITE_ENABLE_ANALYTICS=$VITE_ENABLE_ANALYTICS
ENV VITE_ENABLE_DEV_TOOLS=$VITE_ENABLE_DEV_TOOLS
ENV NODE_ENV=production

# Type check and build
# RUN yarn type-check
RUN yarn build

# =============================================================================
# Stage 3: Production Server
# =============================================================================
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S hashbuzz -u 1001 -G nodejs

# Copy built application
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create necessary directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R hashbuzz:nodejs /var/cache/nginx /var/log/nginx /usr/share/nginx/html

# Switch to non-root user
USER hashbuzz

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
# Stage 4: Development Server (Optional)
# =============================================================================
FROM node:22-alpine AS development

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S hashbuzz -u 1001 -G nodejs && \
    chown -R hashbuzz:nodejs /app

USER hashbuzz

# Expose development port
EXPOSE 5173

# Development command
CMD ["dumb-init", "yarn", "dev", "--host", "0.0.0.0"]

CMD ["npx", "serve", "-s", "build", "-l", "3000"]
