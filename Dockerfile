# =============================================================================
# HASHBUZZ FRONTEND - OPTIMIZED MULTI-STAGE DOCKER BUILD
# =============================================================================
# Production-ready React application with optimized build and security

# =============================================================================
# Stage 1: Dependencies Installation
# =============================================================================
FROM node:20-alpine AS deps

# Install only essential packages, AWS CLI, and clean cache
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init aws-cli jq curl && \
    rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies with optimizations
RUN \
  if [ -f yarn.lock ]; then \
    yarn install --frozen-lockfile --production=false --network-timeout 300000 && \
    yarn cache clean; \
  elif [ -f package-lock.json ]; then \
    npm ci --only=production && \
    npm cache clean --force; \
  else echo "No lock file found" && exit 1; \
  fi

# =============================================================================
# Stage 2: Build Application
# =============================================================================
FROM node:20-alpine AS builder

# Install build dependencies and clean cache
RUN apk add --no-cache python3 make g++ && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy only necessary source files (build context optimization)
COPY package.json vite.config.ts tsconfig.json ./
COPY src ./src
COPY public ./public
COPY index.html ./

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
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Build application with optimizations
RUN yarn build && \
    rm -rf node_modules && \
    rm -rf src

# =============================================================================
# Stage 3: Production Server
# =============================================================================
FROM nginx:1.25-alpine AS production

# Install security updates, AWS CLI, and remove unnecessary packages
RUN apk update && apk upgrade && \
    apk add --no-cache wget aws-cli jq && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S hashbuzz -u 1001 -G nodejs

# Copy built application (only build folder to match vite config)
COPY --from=builder /app/build /usr/share/nginx/html

# Copy scripts for AWS secrets management
COPY scripts/ /app/scripts/
RUN chmod +x /app/scripts/*.sh

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create necessary directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R hashbuzz:nodejs /var/cache/nginx /var/log/nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER hashbuzz

# Expose port
EXPOSE 3000

# Health check with reduced frequency
HEALTHCHECK --interval=60s --timeout=10s --start-period=5s --retries=2 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start with secrets management
CMD ["/app/scripts/start.sh"]

# =============================================================================
# Stage 4: Development Server (Optional)
# =============================================================================
FROM node:20-alpine AS development

# Install dumb-init, AWS CLI for secrets management, and clean cache
RUN apk add --no-cache dumb-init aws-cli jq curl && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Copy scripts for AWS secrets management
COPY scripts/ /app/scripts/
RUN chmod +x /app/scripts/*.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S hashbuzz -u 1001 -G nodejs && \
    chown -R hashbuzz:nodejs /app

USER hashbuzz

# Expose development port (keeping original setup)
EXPOSE 3000

# Development command with secrets management
CMD ["/app/scripts/start.sh"]
