# --- Build stage ---
FROM node:24-alpine3.21 AS builder
# Consider using the latest patch version for security updates
RUN apk update && apk upgrade
RUN apk add --no-cache git

# Set workdir
WORKDIR /app

# Copy project files
COPY ./ .

# Install dependencies
RUN npm install

# Build VitePress site
RUN npm run build

# --- Serve stage ---
# Node-Gateway statt nginx: Hub-Login (OAuth) und Sperrprüfung vor der Auslieferung
FROM node:24-alpine3.21

WORKDIR /app
COPY --from=builder /app/.vitepress/dist ./.vitepress/dist
COPY --from=builder /app/server ./server

ENV PORT=80
EXPOSE 80

CMD ["node", "server/gateway.mjs"]
