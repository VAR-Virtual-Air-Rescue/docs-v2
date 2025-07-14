# --- Build stage ---
FROM node:24-alpine3.21 AS builder
# Consider using the latest patch version for security updates
RUN apk update && apk upgrade

# Set workdir
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Build VitePress site
RUN npm build

# --- Serve stage ---
FROM nginx:alpine

# Copy built site to nginx public folder
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
