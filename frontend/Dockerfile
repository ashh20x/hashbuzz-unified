# =============================================================================
# HASHBUZZ FRONTEND - SIMPLIFIED DOCKERFILE
# =============================================================================

# =============================================================================
# Development Stage
# =============================================================================
FROM node:20-alpine AS development

# Install minimal tools
RUN apk add --no-cache dumb-init curl git && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies
RUN if [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile --network-timeout 300000; \
    elif [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S hashbuzz -u 1001 -G nodejs && \
    chown -R hashbuzz:nodejs /app

USER hashbuzz
EXPOSE 3000

# Start development server
CMD ["yarn", "dev", "--host", "0.0.0.0"]

# =============================================================================
# Production Build Stage
# =============================================================================
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++ && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile --network-timeout 300000; \
    elif [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# Copy source and build
COPY . .

# Build arguments
ARG VITE_NETWORK="mainnet"
ARG VITE_DAPP_API="https://api.hashbuzz.social"
ARG VITE_API_BASE_URL="https://api.hashbuzz.social"
ARG VITE_MIRROR_NODE_LINK="https://mainnet-public.mirrornode.hedera.com"
ARG VITE_CAMPAIGN_DURATION=60
ARG VITE_PROJECT_ID="7a8f8ab597d5799cf86c7a389a87a001"
ARG VITE_YOUTUBE_VIDEO_URL='https://www.youtube.com/embed/zqpnoHG3JAk?si=PevOSpAtHML7wOQb&controls=0'

# Set environment and build
ENV VITE_NETWORK=$VITE_NETWORK \
  VITE_DAPP_API=$VITE_DAPP_API \
  VITE_API_BASE_URL=$VITE_API_BASE_URL \
  VITE_MIRROR_NODE_LINK=$VITE_MIRROR_NODE_LINK \
  VITE_CAMPAIGN_DURATION=$VITE_CAMPAIGN_DURATION \
  VITE_PROJECT_ID=$VITE_PROJECT_ID \
  VITE_YOUTUBE_VIDEO_URL=$VITE_YOUTUBE_VIDEO_URL \
  NODE_ENV=production


RUN yarn build

# =============================================================================
# Production Stage - Static File Server
# =============================================================================
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init curl && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S hashbuzz -u 1001 -G nodejs && \
    chown -R hashbuzz:nodejs /app

USER hashbuzz
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start static file server
CMD ["serve", "-s", "build", "-l", "3000"]
