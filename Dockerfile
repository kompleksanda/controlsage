# Dockerfile for a Next.js application with Genkit

# 1. Base image for dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --frozen-lockfile

# 2. Builder image
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# The Genkit CLI is a dev dependency, but we need it to build the flows.
# Make sure it's installed for the build stage.
RUN npm install genkit-cli

# Set the environment variable for production builds
ENV NODE_ENV=production

# Build the Next.js application
RUN npm run build

# 3. Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Set the default command to start the app
CMD ["npm", "start"]
