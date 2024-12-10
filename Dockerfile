# Stage 1: Build React app with Node.js
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV REACT_APP_NETWORK="mainnet"
ENV REACT_APP_DAPP_API="https://api.hashbuzz.social"
ENV REACT_APP_MIRROR_NODE_LINK="https://mainnet-public.mirrornode.hedera.com"
ENV REACT_APP_CAMPAIGN_DURATION=60


RUN npm run build


# Stage 2: Serve the build with serve
FROM node:18-alpine as serve

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build /app/build

EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-l", "3000"]