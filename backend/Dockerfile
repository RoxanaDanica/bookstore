# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.17.0
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package files first (for cache)
COPY package*.json ./

# Install deps
RUN npm ci --omit=dev

# Copy project files
COPY . .

# Build frontend / dist folder
# RUN npm run build

# Expose app port
EXPOSE 3300

CMD ["npm", "run", "start"]
