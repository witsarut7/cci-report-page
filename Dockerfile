# Base Image
FROM node:20.11.0-alpine AS builder

# Dependency Installation
WORKDIR /app
COPY package.json ./
RUN npm install

# Next.JS Build
COPY . .
RUN npx prisma generate
RUN npm run build

# Start Next.JS Server
FROM node:20.11.0-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma/client  ./node_modules/.prisma/client

EXPOSE 3000

CMD ["npm", "run", "dev"]
