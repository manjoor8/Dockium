# --- Stage 1: Build Frontend ---
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build Backend ---
FROM rust:1.75-slim AS backend-builder
WORKDIR /app
# Install system dependencies
RUN apt-get update && apt-get install -y pkg-config libssl-dev sqlite3 libsqlite3-dev
COPY backend/Cargo.toml backend/Cargo.lock ./
# Pre-build dependencies to cache them
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release
COPY backend/ ./
RUN cargo build --release

# --- Stage 3: Final Production Image ---
FROM debian:bookworm-slim
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y ca-certificates openssl libsqlite3-0 && rm -rf /var/lib/apt/lists/*

# Copy binaries and assets
COPY --from=backend-builder /app/target/release/dockium-backend ./dockium-backend
COPY --from=frontend-builder /app/dist ./public

# Expose API port
EXPOSE 8080

# Environment variables
ENV RUST_LOG=info
ENV DATABASE_URL=sqlite:/data/dockium.db
ENV PUBLIC_DIR=./public

# Start application
CMD ["./dockium-backend"]
